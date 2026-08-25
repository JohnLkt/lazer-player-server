import { NotFoundException } from '@nestjs/common';

/**
 * Validates a file hash from a URL path parameter.
 *
 * osu!lazer hashes are long strings (typically SHA1/MD5). Reject short or empty
 * values early so downstream file lookups never run on malformed input.
 *
 * @returns the validated hash, or throws a 404 when the value is missing/too short.
 */
export function validateHash(hash: string): string {
  if (!hash || hash.length < 3) {
    throw new NotFoundException('Invalid or missing file hash.');
  }
  return hash;
}
