import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageConfigService {
  constructor(private configService: ConfigService) {}

  get realmDbPath(): string {
    return this.configService.get<string>('storage.realmDbPath')!;
  }

  get filesPath(): string {
    return this.configService.get<string>('storage.filesPath')!;
  }
}
