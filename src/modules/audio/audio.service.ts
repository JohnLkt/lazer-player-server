import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createReadStream, existsSync, statSync, ReadStream } from 'fs';
import { FileService } from 'src/modules/storage/file.service';

export interface AudioStreamResult {
  stream: ReadStream;
  /** First byte of the stream (0 for full responses). */
  start: number;
  /** Last byte of the stream (total - 1 for full responses). */
  end: number;
  total: number;
  partial: boolean;
}

interface ByteRange {
  start: number;
  end: number;
}

@Injectable()
export class AudioService {
  constructor(private readonly fileService: FileService) {}

  getAudioStream(hash: string, rangeHeader?: string): AudioStreamResult {
    if (!hash || hash.length < 3) {
      throw new NotFoundException('Invalid or missing file hash.');
    }

    const absoluteFilePath = this.fileService.resolveHashPath(hash);

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

      return { stream, start, end, total: size, partial: range !== null };
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

/**
 * Parses a single-range `Range` header against a resource of `size` bytes.
 * Returns `{ start, end }` for a satisfiable range, `'unsatisfiable'` when
 * the request can never be satisfied (416), and `null` when the header is
 * absent, malformed, or uses unsupported syntax (serve the full body).
 */
function parseByteRange(
  header: string,
  size: number,
): ByteRange | 'unsatisfiable' | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;

  const [, rawStart, rawEnd] = match;
  if (rawStart === '' && rawEnd === '') return null;

  let start: number;
  let end: number;

  if (rawStart === '') {
    // Suffix form: bytes=-N (the final N bytes).
    const suffixLength = Number(rawEnd);
    if (suffixLength <= 0 || size === 0) return 'unsatisfiable';
    start = Math.max(0, size - suffixLength);
    end = size - 1;
  } else {
    start = Number(rawStart);
    end = rawEnd === '' ? size - 1 : Math.min(Number(rawEnd), size - 1);
  }

  if (start >= size) return 'unsatisfiable';
  if (start > end) return null;

  return { start, end };
}
