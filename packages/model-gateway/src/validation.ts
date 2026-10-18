import type { ModelRequest } from "./contracts/request.js";
import type { GatewayError } from "./contracts/errors.js";

/** 返回第一个校验错误；没有错误时返回 null。 */
export function validateRequest(request: ModelRequest): GatewayError | null {
  if (request.requestId.trim().length === 0) {
    return {
      code: "invalid_request",
      message: "请求标识不能为空。",
    };
  }

  if (request.model.trim().length === 0) {
    return {
      code: "invalid_request",
      message: "模型名称不能为空。",
    };
  }

  if (request.messages.length === 0) {
    return {
      code: "invalid_request",
      message: "消息列表不能为空。",
    };
  }

  return null;
}
