import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { StorageConfigService } from '../../config/storage-config.service';

@Injectable()
export class FileService {
  constructor(private storageConfigService: StorageConfigService) {}

  private readonly logger = new Logger(FileService.name);

  resolveHashPath(hash: string): string {
    const filesDir = this.storageConfigService.filesPath;

    // osu!lazer structure: files/firstChar/firstTwoChars/hash
    const firstChar = hash.charAt(0);
    const firstTwoChars = hash.substring(0, 2);

    const resolvedPath = path.join(filesDir, firstChar, firstTwoChars, hash);
    this.logger.debug(`Resolved file path: ${resolvedPath}`);

    return resolvedPath;
  }
}
