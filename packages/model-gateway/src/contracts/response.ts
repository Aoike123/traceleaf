import type { ToolCall } from "./request.js";
import type { GatewayError } from "./errors.js";

// 网关归一化的模型响应
export type ModelOutput =
  | {
      kind: "text";
      text: string;
    }
  | {
      kind: "structured";
      value: unknown;
    }
  | {
      kind: "tool_calls";
      toolCalls: ToolCall[];
      text?: string;
    }
  | {
      kind: "refusal";
      reason: string;
    }
  | {
      kind: "invalid_output";
      rawText: string;
      reason: string;
    };

// 模型调用的token用量及其确认状态
export type Usage =
  | {
      status: "confirmed";
      inputTokens: number;
      outputTokens: number;
    }
  | {
      status: "estimated";
      inputTokens: number;
      outputTokens: number;
    }
  | {
      status: "unknown";
    };

// 模型停止生成的原因
export type FinishReason =
  | "completed"
  | "tool_calls"
  | "length_limit"
  | "refusal"
  | "unknown";

// 网关收到并归一化后的模型响应。
export interface ModelResponse {
  requestId: string;
  model: string;
  output: ModelOutput;
  usage: Usage;
  finishReason: FinishReason;
}

// 一次网关调用的结果
export type ModelResult =
  | {
      ok: true;
      response: ModelResponse;
    }
  | {
      ok: false;
      requestId: string;
      error: GatewayError;
      usage: Usage;
    };
