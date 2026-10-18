import type { ModelRequest } from "../contracts/request.js";
import type { ModelResult } from "../contracts/response.js";

// 模型服务适配器的统一接口
export interface ModelProvider {
  readonly id: string;

  generate(request: ModelRequest): Promise<ModelResult>;
}
