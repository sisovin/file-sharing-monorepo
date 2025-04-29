import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { PrismaModule } from '@nestjs/prisma';

@Module({
  imports: [AuthModule, UsersModule, FilesModule, PrismaModule],
})
export class AppModule {}
