export const ConfigPort = Symbol("ConfigPort");

export interface ConfigPort {
  get port(): number;
}
