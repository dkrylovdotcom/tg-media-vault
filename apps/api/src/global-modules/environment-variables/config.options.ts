export interface ConfigOptions<TConfig = Record<string, unknown>> {
  process?: (config: NodeJS.ProcessEnv) => TConfig;
}
