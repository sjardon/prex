import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileAccessType } from '../constants/file-access-type.enum';
import { UserEntity } from '../../users/entities/user.entity';
import { FileEntity } from '../../files/entities/file.entity';

@Entity('file_access')
export class FileAccessEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId: string;

  @Column()
  fileId: string;

  @Column({
    type: 'enum',
    enum: FileAccessType,
    default: FileAccessType.SHARE,
  })
  type: FileAccessType;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => FileEntity, (file) => file.fileAccess, {
    onDelete: 'CASCADE',
  })
  file: FileEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
