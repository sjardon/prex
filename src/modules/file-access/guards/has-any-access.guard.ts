import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FileAccessEntity } from '../entities/file-access.entity';

@Injectable()
export class HasAnyAccessGuard implements CanActivate {
  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params, user } = context.switchToHttp().getRequest();
    const { fileId } = params;

    if (!fileId || !user.id) {
      return false;
    }

    const fileAccess = await this.dataSource
      .getRepository(FileAccessEntity)
      .findOneBy({ userId: user.id, fileId });

    if (fileAccess) {
      return true;
    }

    return false;
  }
}
