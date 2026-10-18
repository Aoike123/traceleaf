import { FakeProvider } from "../providers/fake.js";
import type { ModelRequest } from "../contracts/request.js";
import { ModelGateway } from "../gateway.js";

const provider = new FakeProvider();
const gateway = new ModelGateway(provider);

const request: ModelRequest = {
  requestId: "test-request-001",
  model: "fake-model",
  messages: [
    {
      role: "user",
      content: "请生成一段关于 TypeScript 的介绍文本。",
    },
  ],
  output: {
    kind: "text",
  },
  tools: [
    {
      name: "example-tool",
      description: "这是一个示例工具。",
      inputSchema: {
        type: "object",
        properties: {
          param1: { type: "string" },
          param2: { type: "number" },
        },
      },
    },
  ],
};

const response = await gateway.generate(request);

console.log("Response:", response);
