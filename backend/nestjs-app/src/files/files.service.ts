import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { File } from './entities/file.entity';
import { v4 as uuidv4 } from 'uuid';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class FilesService {
  private supabase: SupabaseClient;

  constructor(private readonly prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async uploadFileToSupabase(file: Express.Multer.File): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from('files')
      .upload(`public/${file.originalname}`, file.buffer, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload file to Supabase: ${error.message}`);
    }

    return data.Key;
  }

  async uploadFile(file: Express.Multer.File): Promise<File> {
    const filePath = await this.uploadFileToSupabase(file);

    const newFile = await this.prisma.file.create({
      data: {
        filename: file.originalname,
        path: filePath,
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
    const file = await this.getFileById(id);
    const { publicURL, error } = this.supabase.storage
      .from('files')
      .getPublicUrl(file.path);

    if (error) {
      throw new Error(`Failed to generate share link: ${error.message}`);
    }

    return publicURL;
  }

  async downloadFileById(id: string): Promise<File> {
    return this.getFileById(id);
  }
}
