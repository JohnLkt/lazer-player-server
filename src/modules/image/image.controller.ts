import { Controller, Get, Param, StreamableFile, Header } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get(':hash')
  @Header('Cache-Control', 'public, max-age=31536000')
  getImage(
    @Param('hash') hash: string
  ): StreamableFile {
    const stream = this.imageService.getImage(hash);

    return new StreamableFile(stream, {
      type: 'image/jpeg',
    });
  }
}
