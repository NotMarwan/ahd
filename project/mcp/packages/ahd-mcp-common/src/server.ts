import { z } from 'zod';
import type { ZodRawShape } from 'zod';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { debugLog } from './debug.js';

export type ToolArgs<S extends ZodRawShape> = { [K in keyof S]: z.infer<S[K]> };

export interface ToolDef<S extends ZodRawShape = ZodRawShape> {
  name: string;
  description: string;
  schema: S;
  handler: (args: ToolArgs<S>) => unknown | Promise<unknown>;
}

/** Identity helper: anchors generic inference so `handler`'s argument type is derived from `schema`. */
export function defineTool<S extends ZodRawShape>(def: ToolDef<S>): ToolDef<S> {
  return def;
}

interface CallToolRequestLike {
  params: { name: string; arguments?: Record<string, unknown> };
}

function okResult(value: unknown): CallToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] };
}

function errorResult(message: string): CallToolResult {
  return { content: [{ type: 'text', text: JSON.stringify({ error: message }) }], isError: true };
}

export function buildListToolsHandler(tools: ToolDef<any>[]) {
  return async () => ({
    tools: tools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: z.toJSONSchema(z.object(t.schema)),
    })),
  });
}

export function buildCallToolHandler(tools: ToolDef<any>[]) {
  const byName = new Map(tools.map((t) => [t.name, t] as const));

  return async (request: CallToolRequestLike): Promise<CallToolResult> => {
    const { name, arguments: rawArgs = {} } = request.params;

    const tool = byName.get(name);
    if (!tool) {
      const available = [...byName.keys()].join(', ');
      return errorResult(`Unknown tool: '${name}'. Available tools: ${available}`);
    }

    const parsed = z.object(tool.schema).safeParse(rawArgs);
    if (!parsed.success) {
      const details = parsed.error.issues
        .map((issue) => `${issue.path.join('.') || '(root)'} — ${issue.message}`)
        .join('; ');
      return errorResult(`Invalid input for tool '${name}': ${details}`);
    }

    try {
      const result = await tool.handler(parsed.data as ToolArgs<ZodRawShape>);
      return okResult(result);
    } catch (e) {
      let message = e instanceof Error ? e.message : String(e);
      if (e && typeof e === 'object' && (e as { code?: unknown }).code === 'ENOENT') {
        message += ' (file not found — check PROJECT_ROOT resolution / that the file exists)';
      }
      return errorResult(message);
    }
  };
}

export async function runMcpServer(info: { name: string; version: string }, tools: ToolDef<any>[]): Promise<void> {
  const server = new Server({ name: info.name, version: info.version }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, buildListToolsHandler(tools));
  server.setRequestHandler(CallToolRequestSchema, buildCallToolHandler(tools));

  debugLog(info.name, `starting with ${tools.length} tools: ${tools.map((t) => t.name).join(', ')}`);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  debugLog(info.name, 'connected to stdio transport');
}
