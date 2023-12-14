import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { FileEntity } from '../entities/file.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RemoveOptions, Repository, SaveOptions } from 'typeorm';
import {
  CLOUD_STORAGE_SERVICE,
  ICloudStorageService,
} from '../../../adapters/cloud-storage/services/cloud-storage.interface';
import { FileAccessService } from '../../file-access/services/file-access.service';
import { CreateFileDto } from '../dto/create-file.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateFileAccessDto } from '../../file-access/dto/create-file-access.dto';
import { FileAccessEntity } from '../../file-access/entities/file-access.entity';
import { FileAccessType } from '../../file-access/constants/file-access-type.enum';
import { NotFoundException } from '@nestjs/common';

const filesRepositoryToken = getRepositoryToken(FileEntity);

const fakeFileId = 'd65e528f-43e3-4bb9-83bb-f96b5ba4649a';
const fakeCurrentDate = new Date('2023-01-01');

describe('FilesService', () => {
  let service: FilesService;
  let fakeFiles: FileEntity[] = [];

  let fakeRepository: Repository<FileEntity>; //
  const fakeRepositoryImp = {
    findOneBy: jest.fn(async (filter?) => {
      const { id } = filter;

      if (id) {
        const [filteredFile] = fakeFiles.filter((file) => {
          return file.id === id;
        });

        return filteredFile;
      }

      return undefined;
    }),
    find: jest.fn(),
    create: jest.fn((entity: FileEntity) => {
      return { id: fakeFileId, ...entity };
    }),
    save: jest.fn((entity: FileEntity) => {
      fakeFiles.push(entity);
      return entity;
    }),

    delete: jest.fn(async (filter?) => {
      const { id } = filter;

      if (id) {
        fakeFiles.filter((file) => file.id != id);
      }

      return undefined;
    }),
  };

  let fakeCloudStorage: ICloudStorageService = {
    delete: jest.fn(async (name) => true),
    get: jest.fn(async (name) => Buffer.from('')),
    save: jest.fn(async (file: Buffer, name: string, mimetype: string) => true),
  };

  let fakeFileAccessService: FileAccessService = {
    create: jest.fn(
      async (
        createFileAccessDto: CreateFileAccessDto,
      ): Promise<FileAccessEntity> => new FileAccessEntity(),
    ),
    remove: jest.fn(
      async (
        currentUser: UserEntity,
        fileId: string,
        userId: string,
      ): Promise<boolean> => true,
    ),
  } as unknown as FileAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: filesRepositoryToken,
          useValue: fakeRepositoryImp,
        },
        {
          provide: FileAccessService,
          useValue: fakeFileAccessService,
        },
        {
          provide: CLOUD_STORAGE_SERVICE,
          useValue: fakeCloudStorage,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    fakeRepository = module.get<Repository<FileEntity>>(filesRepositoryToken);
    fakeCloudStorage = module.get<ICloudStorageService>(CLOUD_STORAGE_SERVICE);
    fakeFileAccessService = module.get<FileAccessService>(FileAccessService);
  });

  afterEach(() => {
    fakeFiles = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Should save in cloud storage', async () => {
      jest.spyOn(fakeCloudStorage, 'save');

      const user = new UserEntity();
      user.email = 'test@test.com';

      const file = Buffer.from('');

      const createFileDto: CreateFileDto = {
        user,
        name: 'filename',
        mimetype: 'application/pdf',
      };

      await service.create(file, createFileDto);

      expect(fakeCloudStorage.save).toHaveBeenCalled();
    });

    it('Should save in cloudStorage with {username}-{currentTime} key', async () => {
      jest.useFakeTimers().setSystemTime(fakeCurrentDate);
      jest.spyOn(fakeCloudStorage, 'save');

      const user = new UserEntity();
      user.email = 'test@test.com';

      const file = Buffer.from('');

      const createFileDto: CreateFileDto = {
        user,
        name: 'filename',
        mimetype: 'application/pdf',
      };

      const expectedKey = `${user.email}-${fakeCurrentDate.getTime()}`;

      await service.create(file, createFileDto);

      expect(fakeCloudStorage.save).toHaveBeenCalledWith(
        file,
        expectedKey,
        createFileDto.mimetype,
      );
    });

    it('Should save file in local db', async () => {
      jest.useFakeTimers().setSystemTime(fakeCurrentDate);
      jest.spyOn(fakeRepository, 'save');

      const user = new UserEntity();
      user.email = 'test@test.com';

      const file = Buffer.from('');

      const createFileDto: CreateFileDto = {
        user,
        name: 'filename',
        mimetype: 'application/pdf',
      };
      const key = `${user.email}-${fakeCurrentDate.getTime()}`;

      await service.create(file, createFileDto);

      expect(fakeRepository.save).toHaveBeenCalledWith({
        id: fakeFileId,
        name: createFileDto.name,
        key,
        mimetype: createFileDto.mimetype,
      });
    });

    it('Should create Owner FileAccess', async () => {
      jest.spyOn(fakeFileAccessService, 'create');

      const user = new UserEntity();
      user.email = 'test@test.com';

      const file = Buffer.from('');

      const createFileDto: CreateFileDto = {
        user,
        name: 'filename',
        mimetype: 'application/pdf',
      };

      await service.create(file, createFileDto);

      expect(fakeFileAccessService.create).toHaveBeenCalledWith({
        userId: user.id,
        fileId: fakeFileId,
        type: FileAccessType.OWNER,
      });
    });
  });

  describe('download', () => {
    it('Should throw an error if file does not exists', async () => {
      expect.assertions(1);

      const expectedError = new NotFoundException(
        `File [${fakeFileId}] doesnot exists`,
      );

      try {
        await service.download(fakeFileId);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('update', () => {
    it('Should throw an error if file does not exists', async () => {
      expect.assertions(1);

      const expectedError = new NotFoundException(
        `File [${fakeFileId}] doesnot exists`,
      );

      try {
        await service.update(fakeFileId, { name: 'other-name' });
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('remove', () => {
    it('Should throw an error if file does not exists', async () => {
      expect.assertions(1);

      const expectedError = new NotFoundException(
        `File [${fakeFileId}] doesnot exists`,
      );

      try {
        await service.remove(fakeFileId);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });

    it('Should remove a file from cloud storage', async () => {
      jest.spyOn(fakeCloudStorage, 'delete');

      const name = 'filename';
      const mimetype = 'application/pdf';
      const key = 'some-key';

      await fakeRepository.save({
        id: fakeFileId,
        name,
        key,
        mimetype,
      });

      await service.remove(fakeFileId);

      expect(fakeCloudStorage.delete).toHaveBeenCalledWith(key);
    });
  });
});
