// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Called when NestJS starts this module
  async onModuleInit() {
    await this.$connect();
  }

  // Called when NestJS shuts down
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Optional: helper to enable transactional use with Nest lifecycle if needed
  // async enableShutdownHooks(app: INestApplication) {
  //   this.$on('beforeExit', async () => {
  //     await app.close();
  //   });
  // }
}
