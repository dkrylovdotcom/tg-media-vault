import {
  ArgumentsHost,
  Catch,
  ConflictException,
  Inject,
  InternalServerErrorException,
  LoggerService,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { BaseExceptionFilter } from '@nestjs/core';

import { PrismaClientValidationError } from '@global-modules/database';
import { DatabaseConflictException } from '@global-modules/database/exceptions/database-conflict.exception';
import { DatabaseNotFoundException } from '@global-modules/database/exceptions/database-not-found.exception';
import { LOGGER } from '@global-modules/logger/consts';

@Catch(PrismaClientValidationError)
export class DatabaseExceptionFilter extends BaseExceptionFilter {
  constructor(
    @Inject(LOGGER)
    private readonly logger: LoggerService,
  ) {
    super();
  }

  private readonly exceptionMap = new WeakMap<
    Type<PrismaClientValidationError>,
    Type<HttpException>
  >([
    [DatabaseConflictException, ConflictException],
    [DatabaseNotFoundException, NotFoundException],
  ]);

  public catch(
    exception: PrismaClientValidationError,
    host: ArgumentsHost,
  ): void {
    // Type cast is necessary because Typescript doesn't satisfy type for
    // class constructor https://github.com/microsoft/TypeScript/issues/3841
    const exceptionType =
      exception.constructor as Type<PrismaClientValidationError>;
    const httpExceptionClass = this.exceptionMap.get(exceptionType);

    this.logger.error(exception);

    if (!httpExceptionClass) {
      super.catch(
        new InternalServerErrorException(
          `Cannot find mapping for ${exceptionType.name} exception`,
        ),
        host,
      );

      return;
    }

    super.catch(
      new httpExceptionClass(exception.message, { cause: exception }),
      host,
    );
  }
}
