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

  async checkUserSubscription(userId: number): Promise<{ plan: string, fileLimit: number }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let fileLimit;
    switch (user.subscriptionPlan) {
      case 'Pro':
        fileLimit = 100;
        break;
      case 'Light':
        fileLimit = 10;
        break;
      default:
        fileLimit = 0;
    }

    return { plan: user.subscriptionPlan, fileLimit };
  }

  async uploadFile(file: Express.Multer.File, userId: number): Promise<File> {
    const { fileLimit } = await this.checkUserSubscription(userId);
    const userFilesCount = await this.prisma.file.count({
      where: { userId },
    });

    if (userFilesCount >= fileLimit) {
      throw new Error('File upload limit reached for your subscription plan');
    }

    const filePath = await this.uploadFileToSupabase(file);

    const newFile = await this.prisma.file.create({
      data: {
        filename: file.originalname,
        path: filePath,
        mimetype: file.mimetype,
        size: file.size,
        userId,
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
