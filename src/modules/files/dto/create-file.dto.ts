import { IsString } from 'class-validator';
import { UserEntity } from '../../../modules/users/entities/user.entity';

export class CreateFileMetadataDto {
  @IsString()
  name: string;
}

export class CreateFileDto extends CreateFileMetadataDto {
  user: UserEntity;
  mimetype: string;
}
