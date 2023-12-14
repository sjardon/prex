import { FileAccessType } from '../constants/file-access-type.enum';

export class CreateFileAccessDto {
  userId: string;
  fileId: string;
  type?: FileAccessType;
}
