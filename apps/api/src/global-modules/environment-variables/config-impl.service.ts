import { Injectable } from '@nestjs/common';

import type { ConfigOptions } from './config.options';
import type { ConfigService } from './config.service';

type TConfigBase = Partial<Record<string, unknown>>;

@Injectable()
export class ConfigServiceIml<TConfig extends TConfigBase = NodeJS.ProcessEnv>
  implements ConfigService<TConfig>
{
  private config: TConfig;

  public get<TKey extends keyof TConfig>(key: TKey): TConfig[TKey] {
    return this.config[key];
  }

  public init(configOptions?: ConfigOptions<TConfig>): void {
    this.config = configOptions?.process
      ? configOptions.process(this.getVariablesFromProcess())
      : this.getVariablesFromProcess<TConfig>();
  }

  private getVariablesFromProcess<
    TProcessEnv extends Record<string, any> = NodeJS.ProcessEnv,
  >(): TProcessEnv {
    return process.env as TProcessEnv;
  }
}
