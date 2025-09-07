import { ConfigurableModuleBuilder } from '@nestjs/common';

import { DatabaseModuleConfig } from './interfaces/database-module-config.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<DatabaseModuleConfig>().build();
