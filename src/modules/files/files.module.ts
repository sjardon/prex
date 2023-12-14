import { Module } from '@nestjs/common';
import { FilesService } from './services/files.service';
import { FilesController } from './controllers/files.controller';
import { CloudStorageModule } from '../../adapters/cloud-storage/cloud-storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FileAccessModule } from '../file-access/file-access.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    CloudStorageModule,
    FileAccessModule,
  ],
})
export class FilesModule {}
