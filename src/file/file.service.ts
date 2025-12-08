import { Injectable } from '@nestjs/common';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

@Injectable()
export class FileService {
  private readonly uploadPath = './public/uploads';


  async uploadImage(file: Express.Multer.File) {
    // Aquí podrías agregar lógica adicional para manejar la imagen subida,
    // como guardarla en una base de datos, procesarla, etc.
    // console.log(file)
    // use uuid 
    const uniqueSuffix = Date.now();
    const ext = extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    const filePath = join(this.uploadPath, filename);

    writeFileSync(filePath, file.buffer);

    return {
      url: `/uploads/${filename}`,
    };
  }

  getFileUrl(filename: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:4030';
    return `${baseUrl}/file/image/${filename}`;
  }
}