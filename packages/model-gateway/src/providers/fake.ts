import type { ModelRequest } from "../contracts/request.js";
import type { ModelResult } from "../contracts/response.js";
import type { ModelProvider } from "./provider.js";

export class FakeProvider implements ModelProvider {
  readonly id = "fake";

  async generate(request: ModelRequest): Promise<ModelResult> {
    if (request.output.kind !== "text" || (request.tools?.length ?? 0) > 0) {
      return {
        ok: false,
        requestId: request.requestId,
        error: {
          code: "unsupported_capability",
          message: "当前 FakeProvider 仅支持不带工具的文本请求。",
        },
        usage: {
          status: "confirmed",
          inputTokens: 0,
          outputTokens: 0,
        },
      };
    }

    return {
      ok: true,
      response: {
        requestId: request.requestId,
        model: request.model,
        output: {
          kind: "text",
          text: "这是 FakeProvider 返回的模拟回答。",
        },
        usage: {
          status: "confirmed",
          inputTokens: 0,
          outputTokens: 0,
        },
        finishReason: "completed",
      },
    };
  }
}
