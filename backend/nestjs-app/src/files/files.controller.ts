import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file);
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.filesService.getFileById(id);
    const { data, error } = await this.filesService.supabase.storage
      .from('files')
      .download(file.path);

    if (error) {
      throw new Error(`Failed to download file from Supabase: ${error.message}`);
    }

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });

    res.send(data);
  }

  @Get('share/:id')
  async shareFile(@Param('id') id: string) {
    return this.filesService.generateShareLink(id);
  }
}
