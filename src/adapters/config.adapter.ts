import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { ConfigPort, EnvironmentVariables } from "../core/ports/config.port";

/**
 * @todo we need to read env here in order to allow
 *       easy modification of values
 */

@Injectable()
export class ConfigAdapter implements ConfigPort {
  public constructor(private configService: ConfigService<EnvironmentVariables, true>) {}

  get port(): number {
    return this.configService.get("PORT");
  }
}
