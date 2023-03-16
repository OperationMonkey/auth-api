export const ConfigPort = Symbol("ConfigPort");

export interface EnvironmentVariables {
  PORT: number;
}

export interface ConfigPort {
  get port(): number;
}
