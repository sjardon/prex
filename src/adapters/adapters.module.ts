import { Module } from '@nestjs/common';
import { CloudStorageModule } from './cloud-storage/cloud-storage.module';

@Module({
  imports: [CloudStorageModule],
})
export class AdaptersModule {}
