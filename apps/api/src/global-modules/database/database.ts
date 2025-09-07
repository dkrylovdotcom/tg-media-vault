import {
  INestApplicationContext,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { DatabaseConfig } from './interfaces/database-config.interface';

type TransactionClient = any;

@Injectable()
export class Database implements OnModuleInit {
  public client: PrismaClient;

  constructor(config: DatabaseConfig) {
    const options: Prisma.PrismaClientOptions = {};

    if (config.enableLog) {
      options.log = [
        {
          emit: 'stdout',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ];
    }
    this.client = new PrismaClient(options);
  }

  public async onModuleInit(): Promise<void> {
    await this.client.$connect();
  }

  public async transaction(
    transactionQueries: () => Promise<void>,
  ): Promise<void> {
    const { client } = this;
    try {
      await client.$transaction(
        async (transactionClient: TransactionClient) => {
          this.client = transactionClient;
          await transactionQueries();
          this.client = client;
        },
      );
    } catch (e) {
      this.client = client;
      throw e;
    }
  }

  public async enableShutdownHooks(
    app: INestApplicationContext,
  ): Promise<void> {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
