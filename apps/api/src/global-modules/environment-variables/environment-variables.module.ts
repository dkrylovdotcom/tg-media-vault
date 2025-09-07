import { DynamicModule, Global, Module } from '@nestjs/common';

import { ConfigOptions } from './config.options';
import { ConfigServiceIml } from './config-impl.service';
import { EnvironmentVariablesHostModule } from './environment-variables-host.module';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [EnvironmentVariablesHostModule],
  providers: [
    {
      provide: ConfigService,
      useExisting: ConfigServiceIml,
    },
  ],
  exports: [EnvironmentVariablesHostModule, ConfigService],
})
export class EnvironmentVariablesModule {
  public static forRoot(configOptions?: ConfigOptions): DynamicModule {
    return {
      module: EnvironmentVariablesModule,
      providers: [
        {
          provide: ConfigService,
          useFactory: (
            configService: ConfigServiceIml<Record<string, unknown>>,
          ) => {
            configService.init(configOptions);

            return configService;
          },
          inject: [ConfigServiceIml],
        },
      ],
      exports: [ConfigService],
    };
  }
}
