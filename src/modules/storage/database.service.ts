import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { existsSync } from 'fs';
import Realm from 'realm';
import { StorageConfigService } from 'src/config/storage-config.service';
import { realmSchema } from './models/database.model';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private realm!: Realm;

  constructor(private readonly storageConfigService: StorageConfigService) {}

  onModuleInit() {
    const realmPath = this.storageConfigService.realmDbPath;

    if (!existsSync(realmPath)) {
      this.logger.error(`Realm file not found at: ${realmPath}`);
      throw new Error(`Initialization failed: client.realm missing.`);
    }

    this.logger.log(`Using realm file: ${realmPath}`);

    try {
      this.realm = new Realm({
        path: realmPath,
        readOnly: true,
        schema: [...realmSchema],
        schemaVersion: 51,
      });
      this.logger.log('Successfully connected to osu!lazer Realm DB.');
    } catch (err) {
      this.logger.error('Failed to open Realm:', err);
      throw err;
    }
  }

  get instance(): Realm {
    if (!this.realm || this.realm.isClosed) {
      throw new Error(
        'Database error: Realm instance is closed or uninitialized.',
      );
    }
    return this.realm;
  }

  onModuleDestroy() {
    if (this.realm && !this.realm.isClosed) {
      this.realm.close();
      this.logger.log('Realm connection closed cleanly.');
    }
  }
}
