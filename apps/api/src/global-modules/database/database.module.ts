import { Global, Module } from '@nestjs/common';

import { Database } from './database';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './database.module-definition';
import { DatabaseModuleConfig } from './interfaces/database-module-config.interface';

@Global()
@Module({
  providers: [
    {
      provide: Database,
      useFactory: (config: DatabaseModuleConfig) =>
        new Database({
          enableLog: config.enableLog,
        }),
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [Database],
})
export class DatabaseModule extends ConfigurableModuleClass {}
