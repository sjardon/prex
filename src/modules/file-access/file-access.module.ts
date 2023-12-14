import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileAccessService } from './services/file-access.service';
import { FileAccessController } from './controllers/file-access.controller';
import { FileAccessEntity } from './entities/file-access.entity';

@Module({
  controllers: [FileAccessController],
  providers: [FileAccessService],
  exports: [FileAccessService],
  imports: [TypeOrmModule.forFeature([FileAccessEntity])],
})
export class FileAccessModule {}
