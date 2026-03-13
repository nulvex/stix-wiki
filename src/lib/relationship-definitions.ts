interface RelationshipDefinition {
  source: string | string[];
  relationship: string;
  target: string | string[];
  description: string;
}

interface RelationshipDefinitions {
  [key: string]: {
    embedded: {
      [key: string]: {
        type: string;
        description: string;
      };
    };
    common: string[];
    forward: RelationshipDefinition[];
    reverse: RelationshipDefinition[];
  };
}

interface RawRelationship {
  source: string;
  type: string;
  target: string[];
}

const COMMON_RELATIONSHIPS = ['duplicate-of', 'derived-from', 'related-to'];

const EMBEDDED_RELATIONSHIPS: Record<string, Record<string, { type: string; description: string }>> = {
  'attack-pattern': {
    created_by_ref: {
      type: 'identity',
      description: 'The ID of the Source object that describes who created this object.',
    },
    object_marking_refs: {
      type: 'marking-definition',
      description: 'The list of marking-definition objects to be applied to this object.',
    },
  },
};

const rawRelationships: RawRelationship[] = [
  { source: 'attack-pattern', type: 'delivers', target: ['malware'] },
  { source: 'attack-pattern', type: 'targets', target: ['identity', 'location', 'vulnerability'] },
  { source: 'attack-pattern', type: 'uses', target: ['malware', 'tool'] },

  { source: 'campaign', type: 'attributed-to', target: ['intrusion-set', 'threat-actor'] },
  { source: 'campaign', type: 'compromises', target: ['infrastructure'] },
  { source: 'campaign', type: 'originates-from', target: ['location'] },
  { source: 'campaign', type: 'targets', target: ['identity', 'location', 'vulnerability'] },
  { source: 'campaign', type: 'uses', target: ['attack-pattern', 'infrastructure', 'malware', 'tool'] },

  { source: 'course-of-action', type: 'investigates', target: ['indicator'] },
  { source: 'course-of-action', type: 'mitigates', target: ['attack-pattern', 'indicator', 'malware', 'tool', 'vulnerability'] },

  { source: 'identity', type: 'located-at', target: ['location'] },

  { source: 'indicator', type: 'indicates', target: ['attack-pattern', 'campaign', 'infrastructure', 'intrusion-set', 'malware', 'threat-actor', 'tool'] },
  { source: 'indicator', type: 'based-on', target: ['observed-data'] },

  { source: 'infrastructure', type: 'communicates-with', target: ['infrastructure', 'ipv4-addr', 'ipv6-addr', 'domain-name', 'url'] },
  { source: 'infrastructure', type: 'consists-of', target: ['infrastructure', 'observed-data', '<All STIX Cyber-observable Objects>'] },
  { source: 'infrastructure', type: 'controls', target: ['infrastructure', 'malware'] },
  { source: 'infrastructure', type: 'delivers', target: ['malware'] },
  { source: 'infrastructure', type: 'has', target: ['vulnerability'] },
  { source: 'infrastructure', type: 'hosts', target: ['tool', 'malware'] },
  { source: 'infrastructure', type: 'located-at', target: ['location'] },
  { source: 'infrastructure', type: 'uses', target: ['infrastructure'] },

  { source: 'intrusion-set', type: 'attributed-to', target: ['threat-actor'] },
  { source: 'intrusion-set', type: 'compromises', target: ['infrastructure'] },
  { source: 'intrusion-set', type: 'hosts', target: ['infrastructure'] },
  { source: 'intrusion-set', type: 'owns', target: ['infrastructure'] },
  { source: 'intrusion-set', type: 'originates-from', target: ['location'] },
  { source: 'intrusion-set', type: 'targets', target: ['identity', 'location', 'vulnerability'] },
  { source: 'intrusion-set', type: 'uses', target: ['attack-pattern', 'infrastructure', 'malware', 'tool'] },

  { source: 'malware', type: 'authored-by', target: ['threat-actor', 'intrusion-set'] },
  { source: 'malware', type: 'beacons-to', target: ['infrastructure'] },
  { source: 'malware', type: 'exfiltrate-to', target: ['infrastructure'] },
  { source: 'malware', type: 'communicates-with', target: ['ipv4-addr', 'ipv6-addr', 'domain-name', 'url'] },
  { source: 'malware', type: 'controls', target: ['malware'] },
  { source: 'malware', type: 'downloads', target: ['malware', 'tool', 'file'] },
  { source: 'malware', type: 'drops', target: ['malware', 'tool', 'file'] },
  { source: 'malware', type: 'exploits', target: ['vulnerability'] },
  { source: 'malware', type: 'originates-from', target: ['location'] },
  { source: 'malware', type: 'targets', target: ['identity', 'infrastructure', 'location', 'vulnerability'] },
  { source: 'malware', type: 'uses', target: ['attack-pattern', 'infrastructure', 'malware', 'tool'] },
  { source: 'malware', type: 'variant-of', target: ['malware'] },

  { source: 'malware-analysis', type: 'characterizes', target: ['malware'] },
  { source: 'malware-analysis', type: 'analysis-of', target: ['malware'] },
  { source: 'malware-analysis', type: 'static-analysis-of', target: ['malware'] },
  { source: 'malware-analysis', type: 'dynamic-analysis-of', target: ['malware'] },

  { source: 'threat-actor', type: 'attributed-to', target: ['identity'] },
  { source: 'threat-actor', type: 'compromises', target: ['infrastructure'] },
  { source: 'threat-actor', type: 'hosts', target: ['infrastructure'] },
  { source: 'threat-actor', type: 'owns', target: ['infrastructure'] },
  { source: 'threat-actor', type: 'impersonates', target: ['identity'] },
  { source: 'threat-actor', type: 'located-at', target: ['location'] },
  { source: 'threat-actor', type: 'targets', target: ['identity', 'location', 'vulnerability'] },
  { source: 'threat-actor', type: 'uses', target: ['attack-pattern', 'infrastructure', 'malware', 'tool'] },

  { source: 'tool', type: 'delivers', target: ['malware'] },
  { source: 'tool', type: 'drops', target: ['malware'] },
  { source: 'tool', type: 'has', target: ['vulnerability'] },
  { source: 'tool', type: 'targets', target: ['identity', 'infrastructure', 'location', 'vulnerability'] },
];

function formatTargets(target: string[]): string {
  if (target.length === 1) {
    return `\`${target[0]}\``;
  }

  const formattedTargets = target.map((entry) => `\`${entry}\``);
  return formattedTargets.join(', ');
}

function makeForwardDescription(relationship: RawRelationship): string {
  return `STIX relationship \`${relationship.type}\` from \`${relationship.source}\` to ${formatTargets(relationship.target)}.`;
}

const relationshipDefinitionsByType = rawRelationships.reduce<RelationshipDefinitions>((acc, relationship) => {
  const existing = acc[relationship.source] ?? {
    embedded: EMBEDDED_RELATIONSHIPS[relationship.source] ?? {},
    common: COMMON_RELATIONSHIPS,
    forward: [],
    reverse: [],
  };

  existing.forward.push({
    source: relationship.source,
    relationship: relationship.type,
    target: relationship.target,
    description: makeForwardDescription(relationship),
  });

  acc[relationship.source] = existing;
  return acc;
}, {});

const reverseRelationshipMap = new Map<string, { relationship: string; target: string; sources: string[] }>();

rawRelationships.forEach(({ source, type, target }) => {
  target.forEach((targetType) => {
    const key = `${targetType}::${type}`;
    const existing = reverseRelationshipMap.get(key);

    if (existing) {
      if (!existing.sources.includes(source)) {
        existing.sources.push(source);
      }
      return;
    }

    reverseRelationshipMap.set(key, {
      relationship: type,
      target: targetType,
      sources: [source],
    });
  });
});

for (const [objectType, definition] of Object.entries(relationshipDefinitionsByType)) {
  definition.reverse = Array.from(reverseRelationshipMap.entries())
    .filter(([key]) => key.startsWith(`${objectType}::`))
    .map(([, value]) => ({
      source: value.sources.length === 1 ? value.sources[0] : value.sources,
      relationship: value.relationship,
      target: value.target,
      description: `See forward relationship for definition.`,
    }));
}

for (const targetType of new Set(rawRelationships.flatMap((relationship) => relationship.target))) {
  if (!relationshipDefinitionsByType[targetType]) {
    relationshipDefinitionsByType[targetType] = {
      embedded: EMBEDDED_RELATIONSHIPS[targetType] ?? {},
      common: COMMON_RELATIONSHIPS,
      forward: [],
      reverse: [],
    };
  }

  relationshipDefinitionsByType[targetType].reverse = Array.from(reverseRelationshipMap.entries())
    .filter(([key]) => key.startsWith(`${targetType}::`))
    .map(([, value]) => ({
      source: value.sources.length === 1 ? value.sources[0] : value.sources,
      relationship: value.relationship,
      target: value.target,
      description: 'See forward relationship for definition.',
    }));
}

export const relationshipDefinitions: RelationshipDefinitions = relationshipDefinitionsByType;
