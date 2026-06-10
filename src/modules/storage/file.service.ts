import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { StorageConfigService } from 'src/config/storage-config.service';

@Injectable()
export class FileService {
  constructor(private storageConfigService: StorageConfigService) {}

  resolveHashPath(hash: string): string {
    const filesDir = this.storageConfigService.filesPath;
    
    // osu!lazer structure: files/first_char/first_two_chars/full_hash
    const firstChar = hash.charAt(0);
    const firstTwoChars = hash.substring(0, 2);

    return path.join(filesDir, firstChar, firstTwoChars, hash);
  }
}