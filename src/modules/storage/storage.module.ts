import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { FileService } from './file.service';
import { StorageConfigService } from '../../config/storage-config.service';

@Module({
  imports: [ConfigModule],
  providers: [StorageConfigService, DatabaseService, FileService],
  exports: [StorageConfigService, DatabaseService, FileService],
})
export class StorageModule {}
