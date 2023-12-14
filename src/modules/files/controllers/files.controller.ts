import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  StreamableFile,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { FilesService } from '../services/files.service';
import { UpdateFileDto } from '../dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserEntity } from '../../users/entities/user.entity';
import { User } from '../../users/decorators/user.decorator';
import { HasOwnerAccessGuard } from '../../file-access/guards/has-owner-access.guard';
import { HasAnyAccessGuard } from '../../file-access/guards/has-any-access.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const { user, body: createUserMetadataDto } = req;

    if (!createUserMetadataDto.name) {
      createUserMetadataDto.name = file.originalname;
    }

    return await this.filesService.create(file.buffer, {
      user,
      mimetype: file.mimetype,
      ...createUserMetadataDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@User() user: UserEntity) {
    const { id: userId } = user;
    return await this.filesService.findAllByUserId(userId);
  }

  @UseGuards(JwtAuthGuard, HasAnyAccessGuard)
  @Get(':fileId')
  async download(
    @Param('fileId') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const file = await this.filesService.download(id);

    res.set('Content-Disposition', `attachment; filename="${file.name}"`);
    res.set('Content-Type', file.mimetype);

    return new StreamableFile(file.body);
  }

  @UseGuards(JwtAuthGuard, HasAnyAccessGuard)
  @Patch(':fileId')
  update(@Param('fileId') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(id, updateFileDto);
  }

  @UseGuards(JwtAuthGuard, HasOwnerAccessGuard)
  @Delete(':fileId')
  remove(@Param('fileId') id: string) {
    return this.filesService.remove(id);
  }
}
