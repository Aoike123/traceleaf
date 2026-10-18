// 网关对外部提供的错误分类
export type GatewayErrorCode =
  | "invalid_request"
  | "authentication"
  | "rate_limit"
  | "timeout"
  | "network"
  | "unsupported_capability"
  | "provider_error";

// 归一化后调用的错误信息
export interface GatewayError {
  code: GatewayErrorCode;
  message: string;
}
