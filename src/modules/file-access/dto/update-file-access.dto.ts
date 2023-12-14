import { PartialType } from '@nestjs/mapped-types';
import { CreateFileAccessDto } from './create-file-access.dto';

export class UpdateFileAccessDto extends PartialType(CreateFileAccessDto) {}
