import type { ModelRequest } from "./contracts/request.js";
import type { ModelResult } from "./contracts/response.js";
import type { ModelProvider } from "./providers/provider.js";
import { validateRequest } from "./validation.js";

export class ModelGateway {
  private readonly provider: ModelProvider;

  constructor(provider: ModelProvider) {
    this.provider = provider;
  }

  async generate(request: ModelRequest): Promise<ModelResult> {
    const error = validateRequest(request);
    if (error !== null) {
      return {
        ok: false,
        requestId: request.requestId,
        error: error,
        usage: {
          status: "confirmed",
          inputTokens: 0,
          outputTokens: 0,
        },
      };
    }
    return this.provider.generate(request);
  }
}
