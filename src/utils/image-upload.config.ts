import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

/**
 * Configuración de Multer para la subida de avatares
 * Se usa process.env aquí porque esta configuración se importa
 * de forma estática y no tiene acceso al ConfigService inyectado
 */
export const avatarUploadConfig: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const imagesPath = process.env.IMAGES_PATH || '/app/images';
      cb(null, imagesPath);
    },
    filename: (req, file, cb) => {
      // Guardamos temporalmente con timestamp
      // Luego el servicio lo renombrará al nombre deseado
      const tempFilename = `temp_${Date.now()}${extname(file.originalname)}`;
      cb(null, tempFilename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Valida extensiones permitidas
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      return cb(
        new BadRequestException(
          `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`
        ),
        false
      );
    }

    // Valida MIME type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new BadRequestException(
          `Invalid MIME type. Allowed types: ${allowedMimeTypes.join(', ')}`
        ),
        false
      );
    }

    cb(null, true);
  },
};
