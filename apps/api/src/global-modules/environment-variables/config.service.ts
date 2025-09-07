export abstract class ConfigService<TConfig = NodeJS.ProcessEnv> {
  public abstract get<TKey extends keyof TConfig>(key: TKey): TConfig[TKey];
}
