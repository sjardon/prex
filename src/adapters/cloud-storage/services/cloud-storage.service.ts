import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ICloudStorageService } from './cloud-storage.interface';

@Injectable()
export class CloudStorageService implements ICloudStorageService {
  private client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const config = {
      region: configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: configService.get<string>('aws.credentials.accessKeyId'),
        secretAccessKey: configService.get<string>(
          'aws.credentials.secretAccessKey',
        ),
      },
    };

    this.client = new S3Client(config);
  }

  async save(file: Buffer, name: string, mimetype: string) {
    const Bucket = this.configService.get<string>('aws.s3.bucket');

    const command = new PutObjectCommand({
      Bucket,
      Body: file,
      Key: name,
      ContentType: mimetype,
    });

    try {
      await this.client.send(command);
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error trying to save file [${name}]`,
        error,
      );
    }
  }

  async delete(name: string) {
    try {
      const Bucket = this.configService.get<string>('aws.s3.bucket');
      const command = new DeleteObjectCommand({ Bucket, Key: name });

      await this.client.send(command);
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error trying to delete file [${name}]`,
        error,
      );
    }
  }

  async get(name: string): Promise<Buffer> {
    const Bucket = this.configService.get<string>('aws.s3.bucket');
    const command = new GetObjectCommand({ Bucket, Key: name });

    try {
      const { Body } = await this.client.send(command);

      return Buffer.from(await Body.transformToByteArray());
    } catch (error) {
      throw new InternalServerErrorException(
        `Error trying to get file [${name}]`,
        error,
      );
    }
  }
}
