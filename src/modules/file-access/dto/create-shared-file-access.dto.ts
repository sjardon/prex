import { IsUUID } from 'class-validator';
import { FileAccessType } from '../constants/file-access-type.enum';

export class CreateSharedFileAccessDto {
  @IsUUID()
  userId: string;
}
