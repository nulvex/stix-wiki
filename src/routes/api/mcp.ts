import { createFileRoute } from '@tanstack/react-router';
import { getMcpEndpointMeta, handleMcpRequest } from '@/lib/mcp-server';

export const Route = createFileRoute('/api/mcp')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;

        return Response.json(getMcpEndpointMeta(origin));
      },
      POST: async ({ request }) => {
        const payload = await request.json();
        const response = await handleMcpRequest(payload);

        if (!response) {
          return new Response(null, { status: 204 });
        }

        return Response.json(response, {
          headers: {
            'Cache-Control': 'no-store',
          },
        });
      },
    },
  },
});
