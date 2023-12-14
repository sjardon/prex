import { FileAccessEntity } from '../../file-access/entities/file-access.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('file')
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name: string;

  @Column({
    default: 'application/octet-stream',
  })
  mimetype: string;

  @Column()
  key: string;

  @OneToMany(() => FileAccessEntity, (fileAccess) => fileAccess.file)
  public fileAccess: FileAccessEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
