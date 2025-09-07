import { Module } from '@nestjs/common';
import { ConfigServiceIml } from './config-impl.service';

@Module({
  providers: [ConfigServiceIml],
  exports: [ConfigServiceIml],
})
export class EnvironmentVariablesHostModule {}
