import { PartialType } from '@nestjs/mapped-types';
import { FileEntity } from './file.entity';

export class DownloableFile extends PartialType(FileEntity) {
  body: Buffer;
}
