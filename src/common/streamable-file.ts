import { StreamableFile } from '@nestjs/common';
import type { Readable } from 'stream';

/**
 * Wraps a read stream in a `StreamableFile`.
 */
export function buildStreamableFile(
  stream: Readable,
  options: { type: string; length?: number },
): StreamableFile {
  return new StreamableFile(stream, {
    type: options.type,
    length: options.length,
  });
}
