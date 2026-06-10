// src/modules/audio/audio.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { createReadStream, existsSync, statSync } from 'fs';
import { FileService } from 'src/modules/storage/file.service'; // Adjust path based on your layout

@Injectable()
export class AudioService {
  constructor(private readonly fileService: FileService) {}

  /**
   * Resolves the physical path via FileService and initializes an audio file stream.
   */
  getAudioStream(hash: string): { stream: any; length: number } {
    if (!hash || hash.length < 3) {
      throw new NotFoundException('Invalid or missing file hash.');
    }

    const absoluteFilePath = this.fileService.resolveHashPath(hash);

    if (!existsSync(absoluteFilePath)) {
      throw new NotFoundException(`Audio file asset not found for hash: ${hash}`);
    }

    try {
      // Fetch the size on disk for high-performance chunked media streaming headers
      const { size } = statSync(absoluteFilePath);
      const stream = createReadStream(absoluteFilePath);

      return { stream, length: size };
    } catch (err) {
      throw new InternalServerErrorException('Failed to initialize asset file stream buffer.');
    }
  }
}
