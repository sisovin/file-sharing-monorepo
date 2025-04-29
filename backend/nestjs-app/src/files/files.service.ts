import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { File } from './entities/file.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFile(file: Express.Multer.File): Promise<File> {
    const newFile = await this.prisma.file.create({
      data: {
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
    return newFile;
  }

  async getFileById(id: string): Promise<File> {
    return this.prisma.file.findUnique({
      where: { id },
    });
  }

  async deleteFile(id: string): Promise<void> {
    await this.prisma.file.delete({
      where: { id },
    });
  }

  async generateShareLink(id: string): Promise<string> {
    const shareLink = uuidv4();
    await this.prisma.file.update({
      where: { id },
      data: { shareLink },
    });
    return shareLink;
  }

  async downloadFileById(id: string): Promise<File> {
    return this.getFileById(id);
  }
}
