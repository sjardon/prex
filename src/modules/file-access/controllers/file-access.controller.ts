import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileAccessService } from '../services/file-access.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { HasAnyAccessGuard } from '../guards/has-any-access.guard';
import { CreateSharedFileAccessDto } from '../dto/create-shared-file-access.dto';
import { User } from '../../users/decorators/user.decorator';
import { UserEntity } from '../../users/entities/user.entity';
import { FileAccessType } from '../constants/file-access-type.enum';

@Controller('file-access/files/:fileId')
export class FileAccessController {
  constructor(private readonly fileAccessService: FileAccessService) {}

  @UseGuards(JwtAuthGuard, HasAnyAccessGuard)
  @Post()
  async createShared(
    @Param('fileId') fileId: string,
    @Body() createSharedFileAccessDto: CreateSharedFileAccessDto,
  ) {
    const { userId } = createSharedFileAccessDto;
    return await this.fileAccessService.create({
      fileId,
      userId,
      type: FileAccessType.SHARE,
    });
  }

  @UseGuards(JwtAuthGuard, HasAnyAccessGuard)
  @Delete('/users/:userId')
  async remove(
    @User() currentUser: UserEntity,
    @Param('fileId') fileId: string,
    @Param('userId') userId: string,
  ) {
    return await this.fileAccessService.remove(currentUser, fileId, userId);
  }
}
