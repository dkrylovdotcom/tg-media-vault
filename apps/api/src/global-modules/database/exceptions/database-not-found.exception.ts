import { Prisma } from '@prisma/client/extension';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

export class DatabaseNotFoundException extends PrismaClientValidationError {
  constructor(message: string) {
    super(message, {
      clientVersion: Prisma.prismaVersion.client,
    });
  }
}
