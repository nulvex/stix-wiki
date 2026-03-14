import { relationshipDefinitions } from '@/lib/relationship-definitions';
import { observables, sdos, sros, store } from '@/lib/schema-store';

type JsonRpcId = string | number | null;

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: JsonRpcId;
  method?: string;
  params?: Record<string, unknown>;
};

type JsonRpcSuccess = {
  jsonrpc: '2.0';
  id: JsonRpcId;
  result: unknown;
};

type JsonRpcError = {
  jsonrpc: '2.0';
  id: JsonRpcId;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
};

type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

type SchemaLike = {
  title?: string;
  description?: string;
  properties?: Record<string, { type?: string | string[]; description?: string }>;
  required?: string[];
  allOf?: SchemaLike[];
};

type PropertyDefinition = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

const MCP_PROTOCOL_VERSION = '2024-11-05';

function getCategory(type: string): 'sdo' | 'sro' | 'observable' {
  if (type in sdos) return 'sdo';
  if (type in sros) return 'sro';
  if (type in observables) return 'observable';

  return 'sdo';
}

function getSchema(type: string): SchemaLike {
  return store.get(type) as SchemaLike;
}

function getRequiredProperties(schema: SchemaLike): Set<string> {
  const required = new Set<string>(schema.required ?? []);

  for (const nested of schema.allOf ?? []) {
    for (const prop of getRequiredProperties(nested)) {
      required.add(prop);
    }
  }

  return required;
}

function getProperties(schema: SchemaLike): Record<string, { type?: string | string[]; description?: string }> {
  const properties: Record<string, { type?: string | string[]; description?: string }> = {
    ...(schema.properties ?? {}),
  };

  for (const nested of schema.allOf ?? []) {
    Object.assign(properties, getProperties(nested));
  }

  return properties;
}

function toPropertyDefinitions(type: string): PropertyDefinition[] {
  const schema = getSchema(type);
  const required = getRequiredProperties(schema);
  const properties = getProperties(schema);

  return Object.entries(properties)
    .map(([name, property]) => ({
      name,
      required: required.has(name),
      type: Array.isArray(property.type) ? property.type.join(' | ') : property.type ?? 'unknown',
      description: property.description ?? 'No description provided.',
    }))
    .sort((a, b) => {
      if (a.required !== b.required) return a.required ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

function summarizeType(type: string) {
  const schema = getSchema(type);
  return {
    type,
    title: schema.title ?? type,
    description: schema.description ?? 'No description provided.',
    category: getCategory(type),
  };
}

function getObjectDetail(type: string) {
  const summary = summarizeType(type);
  const relationships = relationshipDefinitions[type] ?? {
    embedded: {},
    common: [],
    forward: [],
    reverse: [],
  };

  return {
    ...summary,
    properties: toPropertyDefinitions(type),
    relationships,
  };
}

function listObjects(query?: string, limit = 20) {
  const normalizedQuery = query?.trim().toLowerCase();
  const all = store.getAllTypes().map(summarizeType);

  const filtered = normalizedQuery
    ? all.filter((entry) => {
        const haystack = `${entry.type}\n${entry.title}\n${entry.description}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : all;

  return filtered.slice(0, Math.max(1, Math.min(limit, 100)));
}

function asMarkdown(type: string): string {
  const detail = getObjectDetail(type);

  const propertyLines = detail.properties.map(
    (property) => `- **${property.name}** (${property.type})${property.required ? ' _(required)_' : ''}: ${property.description}`,
  );

  const forwardLines = detail.relationships.forward.map(
    (relationship) => `- \`${relationship.relationship}\`: ${relationship.description}`,
  );

  const reverseLines = detail.relationships.reverse.map(
    (relationship) => `- \`${relationship.relationship}\`: ${relationship.description}`,
  );

  return [
    `# ${detail.title} (\`${detail.type}\`)`,
    '',
    detail.description,
    '',
    `Category: **${detail.category}**`,
    '',
    '## Properties',
    propertyLines.length > 0 ? propertyLines.join('\n') : '- No properties found.',
    '',
    '## Forward relationships',
    forwardLines.length > 0 ? forwardLines.join('\n') : '- No forward relationships recorded.',
    '',
    '## Reverse relationships',
    reverseLines.length > 0 ? reverseLines.join('\n') : '- No reverse relationships recorded.',
  ].join('\n');
}

function success(id: JsonRpcId, result: unknown): JsonRpcSuccess {
  return {
    jsonrpc: '2.0',
    id,
    result,
  };
}

function error(id: JsonRpcId, code: number, message: string, data?: unknown): JsonRpcError {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      data,
    },
  };
}

export function getMcpEndpointMeta(origin: string) {
  return {
    name: 'stix-wiki-mcp',
    description:
      'MCP endpoint exposing STIX object schemas and relationship guidance so LLMs can quickly understand STIX object types, properties, and links.',
    endpoint: `${origin}/api/mcp`,
    transport: 'http',
  };
}

export async function handleMcpRequest(body: unknown): Promise<JsonRpcResponse | null> {
  if (!body || typeof body !== 'object') {
    return error(null, -32700, 'Invalid JSON body.');
  }

  const request = body as JsonRpcRequest;
  const id = request.id ?? null;

  if (request.jsonrpc !== '2.0' || !request.method) {
    return error(id, -32600, 'Invalid JSON-RPC request.');
  }

  switch (request.method) {
    case 'initialize': {
      return success(id, {
        protocolVersion: MCP_PROTOCOL_VERSION,
        serverInfo: {
          name: 'stix-wiki-mcp',
          version: '0.1.0',
        },
        capabilities: {
          tools: {},
          resources: {},
        },
      });
    }

    case 'notifications/initialized':
      return null;

    case 'tools/list': {
      return success(id, {
        tools: [
          {
            name: 'search_stix_objects',
            description: 'Search STIX object types by name, title, or description.',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Free-text search query.' },
                limit: { type: 'number', description: 'Max number of results (1-100).', default: 20 },
              },
            },
          },
          {
            name: 'get_stix_object',
            description: 'Get detailed STIX object documentation, including properties and relationships.',
            inputSchema: {
              type: 'object',
              properties: {
                type: { type: 'string', description: 'STIX type (e.g. indicator, attack-pattern).' },
              },
              required: ['type'],
            },
          },
          {
            name: 'get_stix_relationships',
            description: 'Get forward, reverse, and common relationship definitions for a STIX type.',
            inputSchema: {
              type: 'object',
              properties: {
                type: { type: 'string', description: 'STIX type (e.g. malware, identity).' },
              },
              required: ['type'],
            },
          },
        ],
      });
    }

    case 'tools/call': {
      const params = request.params ?? {};
      const name = String(params.name ?? '');
      const args = (params.arguments as Record<string, unknown> | undefined) ?? {};

      if (name === 'search_stix_objects') {
        const query = typeof args.query === 'string' ? args.query : undefined;
        const limit = typeof args.limit === 'number' ? args.limit : 20;
        const result = listObjects(query, limit);

        return success(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
          structuredContent: { objects: result },
        });
      }

      if (name === 'get_stix_object') {
        const type = typeof args.type === 'string' ? args.type : '';

        if (!type || !store.has(type)) {
          return error(id, -32602, 'Unknown STIX type.', { type });
        }

        const detail = getObjectDetail(type);

        return success(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(detail, null, 2),
            },
          ],
          structuredContent: detail,
        });
      }

      if (name === 'get_stix_relationships') {
        const type = typeof args.type === 'string' ? args.type : '';

        if (!type || !store.has(type)) {
          return error(id, -32602, 'Unknown STIX type.', { type });
        }

        const relationships = relationshipDefinitions[type] ?? {
          embedded: {},
          common: [],
          forward: [],
          reverse: [],
        };

        return success(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(relationships, null, 2),
            },
          ],
          structuredContent: relationships,
        });
      }

      return error(id, -32601, `Unknown tool: ${name}`);
    }

    case 'resources/list': {
      const resources = store.getAllTypes().map((type) => {
        const summary = summarizeType(type);

        return {
          uri: `stix://object/${summary.type}`,
          name: `${summary.type} (${summary.category})`,
          description: summary.description,
          mimeType: 'text/markdown',
        };
      });

      return success(id, { resources });
    }

    case 'resources/read': {
      const uri = String(request.params?.uri ?? '');
      const match = uri.match(/^stix:\/\/object\/(.+)$/);
      const type = match?.[1];

      if (!type || !store.has(type)) {
        return error(id, -32602, 'Unknown resource URI.', { uri });
      }

      return success(id, {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: asMarkdown(type),
          },
        ],
      });
    }

    default:
      return error(id, -32601, `Method not found: ${request.method}`);
  }
}
