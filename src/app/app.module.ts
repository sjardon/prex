import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AdaptersModule } from '../adapters/adapters.module';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { FilesModule } from '../modules/files/files.module';
import { FileAccessModule } from '../modules/file-access/file-access.module';

@Module({
  imports: [
    CommonModule,
    AdaptersModule,
    AuthModule,
    UsersModule,
    FilesModule,
    FileAccessModule,
  ],
})
export class AppModule {}
