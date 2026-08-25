import {
  Controller,
  Get,
  Param,
  Query,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get(':hash')
  @Header('Cache-Control', 'public, max-age=31536000')
  getImage(@Param('hash') hash: string): StreamableFile {
    const stream = this.imageService.getImage(hash);

    return new StreamableFile(stream, {
      type: 'image/jpeg',
    });
  }

  @Get(':hash/optimized')
  @Header('Cache-Control', 'public, max-age=31536000')
  getOptimizedImage(
    @Param('hash') hash: string,
    @Query('width') width?: string,
    @Query('height') height?: string,
  ): StreamableFile {
    const widthNum = width ? parseInt(width, 10) : 200;
    const heightNum = height ? parseInt(height, 10) : 200;

    const stream = this.imageService.getOptimizedImage(
      hash,
      widthNum,
      heightNum,
    );

    return new StreamableFile(stream, {
      type: 'image/webp',
    });
  }
}
