import { PartialType } from '@nestjs/mapped-types';
import { CreateFileDto, CreateFileMetadataDto } from './create-file.dto';

export class UpdateFileDto extends CreateFileMetadataDto {}
