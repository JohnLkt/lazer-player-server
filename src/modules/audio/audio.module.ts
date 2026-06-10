import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { StorageModule } from 'src/modules/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [AudioController],
  providers: [AudioService],
})
export class AudioModule {}
