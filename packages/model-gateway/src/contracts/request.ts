// 文本信息
export interface TextMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// 描述一个模型可以使用的工具
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

// 本次请求希望模型采用的输出模式
export type OutputMode =
  | { kind: "text" }
  | {
      kind: "structured";
      name: string;
      schema: Record<string, unknown>;
    };

// 模型提出的一次工具调用
export interface ToolCall {
  callId: string;
  name: string;
  arguments: Record<string, unknown>;
}

// 模型的工具调用信息
export interface ToolCallMessage {
  role: "assistant";
  content?: string;
  toolCalls: ToolCall[];
}

// 工具执行结果信息
export interface ToolResultMessage {
  role: "tool";
  callId: string;
  content: string;
}

export type ModelMessage = TextMessage | ToolCallMessage | ToolResultMessage;

// 一次模型请求的基础信息
export interface ModelRequest {
  requestId: string;
  model: string;
  messages: ModelMessage[];
  tools?: ToolDefinition[];
  output: OutputMode;
}
