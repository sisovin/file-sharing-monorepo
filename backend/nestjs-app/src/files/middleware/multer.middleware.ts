import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class MulterMiddleware implements NestMiddleware {
  private multer;

  constructor() {
    this.multer = multer({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.multer.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  }
}
