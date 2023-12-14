import { Module } from '@nestjs/common';
import { CloudStorageService } from './services/cloud-storage.service';
import { ConfigModule } from '@nestjs/config';
import { CLOUD_STORAGE_SERVICE } from './services/cloud-storage.interface';

@Module({
  providers: [
    {
      useClass: CloudStorageService,
      provide: CLOUD_STORAGE_SERVICE,
    },
  ],
  exports: [CLOUD_STORAGE_SERVICE],
  imports: [ConfigModule],
})
export class CloudStorageModule {}
