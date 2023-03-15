import type { ConfigPort } from "../core/ports/config.port";

/**
 * @todo we need to read env here in order to allow
 *       easy modification of values
 */

export class ConfigAdapter implements ConfigPort {
  get port(): number {
    return 3000;
  }
}
