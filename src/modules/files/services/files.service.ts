import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';
import { Repository } from 'typeorm';
import { FileEntity } from '../entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileAccessService } from '../../file-access/services/file-access.service';
import { FileAccessType } from '../../file-access/constants/file-access-type.enum';
import {
  CLOUD_STORAGE_SERVICE,
  ICloudStorageService,
} from '../../../adapters/cloud-storage/services/cloud-storage.interface';
import { DownloableFile } from '../entities/downloable-file.entity';

@Injectable()
export class FilesService {
  constructor(
    @Inject(CLOUD_STORAGE_SERVICE)
    private cloudStorageService: ICloudStorageService,
    private fileAccessService: FileAccessService,
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  async create(
    file: Buffer,
    createFileDto: CreateFileDto,
  ): Promise<FileEntity> {
    const { user, name, mimetype } = createFileDto;
    const key = `${user.email}-${Date.now()}`;
    try {
      //TODO: Wrap within a transaction and rollback if needed;

      await this.cloudStorageService.save(file, key, mimetype);

      const toSaveFile = this.filesRepository.create({ name, key, mimetype });

      const savedFile = await this.filesRepository.save(toSaveFile);

      await this.fileAccessService.create({
        userId: user.id,
        fileId: savedFile.id,
        type: FileAccessType.OWNER,
      });

      return savedFile;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error trying to save file [${name}] by user [${user.email}]`,
        error,
      );
    }
  }

  async findAllByUserId(userId: string): Promise<FileEntity[]> {
    try {
      return await this.filesRepository.find({
        where: {
          fileAccess: {
            userId,
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error trying to list files for user [${userId}]`,
        error,
      );
    }
  }

  async download(id: string): Promise<DownloableFile> {
    try {
      const file = await this.filesRepository.findOneBy({ id });

      if (!file) {
        throw new NotFoundException(`File [${id}] doesnot exists`);
      }

      const body = await this.cloudStorageService.get(file.key);
      return {
        body,
        ...file,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error trying to delete file [${id}]`,
        error,
      );
    }
  }

  async update(id: string, updateFileDto: UpdateFileDto): Promise<FileEntity> {
    try {
      const file = await this.filesRepository.findOneBy({ id });

      if (!file) {
        throw new NotFoundException(`File [${id}] doesnot exists`);
      }

      const { name } = updateFileDto;

      file.name = name;

      return await this.filesRepository.save(file);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error trying to update file [${id}]`,
        error,
      );
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const toDeleteFile = await this.filesRepository.findOneBy({ id });

      if (!toDeleteFile) {
        throw new NotFoundException(`File [${id}] doesnot exists`);
      }

      await this.cloudStorageService.delete(toDeleteFile.key);

      await this.filesRepository.delete({ id });

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error trying to delete file [${id}]`,
        error,
      );
    }
  }
}
