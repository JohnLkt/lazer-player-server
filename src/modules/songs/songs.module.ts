import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { StorageModule } from 'src/modules/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
