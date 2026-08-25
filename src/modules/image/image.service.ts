import { Injectable, NotFoundException } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { FileService } from 'src/modules/storage/file.service';
import { Readable } from 'stream';
import sharp from 'sharp';

@Injectable()
export class ImageService {
  constructor(private readonly fileService: FileService) {}

  getImage(hash: string): Readable {
    if (!hash || hash.length < 3) {
      throw new NotFoundException('Invalid or missing image file hash.');
    }

    const absoluteFilePath = this.fileService.resolveHashPath(hash);

    if (!existsSync(absoluteFilePath)) {
      throw new NotFoundException(
        `Image asset file not found for hash: ${hash}`,
      );
    }

    return createReadStream(absoluteFilePath);
  }

  getOptimizedImage(
    hash: string,
    widthNum: number,
    heightNum: number,
  ): Readable {
    if (!hash || hash.length < 3) {
      throw new NotFoundException('Invalid or missing image file hash.');
    }

    const absoluteFilePath = this.fileService.resolveHashPath(hash);

    if (!existsSync(absoluteFilePath)) {
      throw new NotFoundException(
        `Image asset file not found for hash: ${hash}`,
      );
    }

    const transformer = sharp(absoluteFilePath).webp({ quality: 80 });
    transformer.resize(widthNum, heightNum, {
      fit: 'cover',
      position: 'center',
    });

    return transformer;
  }
}
