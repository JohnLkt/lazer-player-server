/**
 * Parses a single-range `Range` header against a resource of `size` bytes.
 *
 * @returns `{ start, end }` for a satisfiable range, `'unsatisfiable'` when the
 *   request can never be satisfied (416), and `null` when the header is absent,
 *   malformed, or uses unsupported syntax (serve the full body).
 */
export type ByteRangeResult =
  | { start: number; end: number }
  | 'unsatisfiable'
  | null;

export function parseByteRange(header: string, size: number): ByteRangeResult {
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
