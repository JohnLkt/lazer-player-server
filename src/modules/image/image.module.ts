import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { StorageModule } from 'src/modules/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
