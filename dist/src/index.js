#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { MAPS_TOOLS } from "./tool/index.js";
import { switchApi } from "./server/index.js";
// Server 开始
const server = new Server({
    name: "mcp-server/payslip-web",
    version: "0.0.1",
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: MAPS_TOOLS,
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        return await switchApi(request);
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});
async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Baidu Map MCP Server running on stdio");
}
runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
