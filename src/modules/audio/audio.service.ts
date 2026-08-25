import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createReadStream, existsSync, statSync, ReadStream } from 'fs';
import { parseByteRange } from '../../common/byte-range';
import { validateHash } from '../../common/validate-hash';
import { FileService } from '../storage/file.service';

export interface AudioStreamMetadata {
  /** First byte of the stream (0 for full responses). */
  start: number;
  /** Last byte of the stream (total - 1 for full responses). */
  end: number;
  total: number;
  /** Whether the stream was a partial (ranged) response. */
  partial: boolean;
}

@Injectable()
export class AudioService {
  constructor(private readonly fileService: FileService) {}

  getAudioStream(
    hash: string,
    rangeHeader?: string,
  ): { stream: ReadStream; metadata: AudioStreamMetadata } {
    const validatedHash = validateHash(hash);

    const absoluteFilePath = this.fileService.resolveHashPath(validatedHash);

    if (!existsSync(absoluteFilePath)) {
      throw new NotFoundException(
        `Audio file asset not found for hash: ${hash}`,
      );
    }

    try {
      const { size } = statSync(absoluteFilePath);

      const range = rangeHeader ? parseByteRange(rangeHeader, size) : null;

      if (range === 'unsatisfiable') {
        throw new HttpException(
          'Requested range not satisfiable.',
          HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE,
        );
      }

      const start = range ? range.start : 0;
      const end = range ? range.end : Math.max(0, size - 1);

      const stream = createReadStream(absoluteFilePath, { start, end });

      return {
        stream,
        metadata: { start, end, total: size, partial: range !== null },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to initialize asset file stream buffer.',
      );
    }
  }
}
