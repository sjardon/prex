import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFileAccessDto } from '../dto/create-file-access.dto';
import { UpdateFileAccessDto } from '../dto/update-file-access.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileAccessEntity } from '../entities/file-access.entity';
import { Repository } from 'typeorm';
import { FileAccessType } from '../constants/file-access-type.enum';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class FileAccessService {
  constructor(
    @InjectRepository(FileAccessEntity)
    private fileAccessRepository: Repository<FileAccessEntity>,
  ) {}

  async create(
    createFileAccessDto: CreateFileAccessDto,
  ): Promise<FileAccessEntity> {
    const { userId, fileId, type } = createFileAccessDto;

    try {
      const existsFileAccess = await this.fileAccessRepository.findOneBy({
        userId,
        fileId,
      });

      if (existsFileAccess) {
        throw new BadRequestException(
          `Error: file access already exists: fileId [${fileId}] - userId [${userId}]`,
        );
      }

      const toSaveFileAccess = this.fileAccessRepository.create({
        userId,
        fileId,
        type,
      });
      return await this.fileAccessRepository.save(toSaveFileAccess);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error trying to save file access: fileId [${fileId}] - userId [${userId}]`,
        error,
      );
    }
  }

  async remove(
    currentUser: UserEntity,
    fileId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      if (currentUser.id == userId) {
        throw new BadRequestException(
          `You cannot remove your file access: fileId [${fileId}] - userId [${userId}]`,
        );
      }

      const isFileOwner = await this.fileAccessRepository.findOneBy({
        userId,
        fileId,
        type: FileAccessType.OWNER,
      });

      if (isFileOwner) {
        throw new BadRequestException(
          `You cannot remove owner file access: fileId [${fileId}] - userId [${userId}]`,
        );
      }

      await this.fileAccessRepository.delete({
        fileId,
        userId,
      });

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error trying to delete file access: fileId [${fileId}] - userId [${userId}]`,
        error,
      );
    }
  }
}
