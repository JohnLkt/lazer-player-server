import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import storageConfig from './config/storage.config';
import { StorageModule } from './modules/storage/storage.module';
import { SongsModule } from './modules/songs/songs.module';
import { AudioModule } from './modules/audio/audio.module';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [storageConfig],
    }),
    StorageModule,
    SongsModule,
    AudioModule,
    ImageModule,
  ],
})
export class AppModule {}
