import { BeatmapSet } from '../storage/models/database.model';
import { SongListItemDto } from './dto/song-list-item.dto';

export interface NamedFileUsage {
  File?: {
    Hash?: string;
  };
  Filename?: string;
}

export interface BeatmapMetadata {
  Title?: string;
  TitleUnicode?: string;
  Artist?: string;
  ArtistUnicode?: string;
  AudioFile?: string;
  BackgroundFile?: string;
}

/**
 * Maps a raw beatmap set from the osu!lazer Realm schema to a public DTO.
 *
 * The mapping is pure: it performs no I/O, logging, or Realm access, so it can
 * be exercised directly in unit tests.
 */
export function mapBeatmapSetToDto(set: BeatmapSet): SongListItemDto {
  const beatmap = set.Beatmaps?.[0]?.Metadata;

  // Case-insensitive lookups safeguard asset tracking loops
  const files = Array.from(set.Files) as NamedFileUsage[] | undefined;
  const audioFileUsage = beatmap?.AudioFile
    ? findNamedFile(files, beatmap.AudioFile)
    : null;

  const backgroundFileUsage = beatmap?.BackgroundFile
    ? findNamedFile(files, beatmap.BackgroundFile)
    : null;

  return {
    id: set.ID?.toString() ?? '',
    title: beatmap?.Title ?? 'Unknown Title',
    titleUnicode: beatmap?.TitleUnicode ?? beatmap?.Title ?? 'Unknown Title',
    artist: beatmap?.Artist ?? 'Unknown Artist',
    artistUnicode:
      beatmap?.ArtistUnicode ?? beatmap?.Artist ?? 'Unknown Artist',
    audioFileHash: audioFileUsage?.File?.Hash ?? null,
    audioFileName: audioFileUsage?.Filename ?? null,
    backgroundFileHash: backgroundFileUsage?.File?.Hash ?? null,
    backgroundFileName: backgroundFileUsage?.Filename ?? null,
    dateAdded: set.DateAdded ? new Date(set.DateAdded) : new Date(),
  };
}

/**
 * Case-insensitive lookup of a named file usage by filename.
 * Returns the first matching entry, or `undefined` when none match.
 */
export function findNamedFile(
  files: NamedFileUsage[] | undefined,
  target: string,
): NamedFileUsage | undefined {
  if (!files) {
    return undefined;
  }
  return files.find((f) => f.Filename?.toLowerCase() === target.toLowerCase());
}
