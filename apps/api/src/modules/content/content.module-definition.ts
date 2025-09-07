import { ConfigurableModuleBuilder } from '@nestjs/common';

import { ContentModuleConfig } from './interfaces/content-module-config.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ContentModuleConfig>().build();
