export const ConfigPort = Symbol("ConfigPort");

export interface EnvironmentVariables {
  PORT: number;
  DATABASE_URL: string;
  TOKEN_SECRET: string;
}

export interface ConfigPort {
  get port(): number;
  get databaseUrl(): string;
  get tokenSecret(): string;
}
