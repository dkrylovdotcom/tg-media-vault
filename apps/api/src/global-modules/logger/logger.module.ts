import { Global, Logger, Module, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { LOGGER } from './consts';

@Global()
@Module({
  providers: [
    {
      scope: Scope.TRANSIENT,
      provide: LOGGER,
      useFactory: (source: string | object) => {
        const context =
          typeof source === 'string' ? source : source?.constructor?.name;

        return new Logger(context);
      },
      inject: [INQUIRER],
    },
  ],
  exports: [LOGGER],
})
export class LoggerModule {}
