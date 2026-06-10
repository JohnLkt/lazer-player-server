import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/modules/storage/database.service';
import { BeatmapSet } from '../storage/models/database.model';
import { SongListItemDto } from './dto/song-list-item.dto';

interface GetSongsOptions {
  page: number;
  size: number;
  search?: string;
}

@Injectable()
export class SongsService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly logger = new Logger(SongsService.name);

  getSongsList(options: GetSongsOptions): SongListItemDto[] {
    const { page, size, search } = options;

    const realm = this.databaseService.instance;

    const queryStartTime = performance.now();

    let beatmapSets = realm.objects<BeatmapSet>(BeatmapSet);
    let query = 'DeletePending == false';
    const queryArgs: any[] = [];

    // Filters down nested metadata objects inside osu!lazer schema configurations
    if (search) {
      query += ` AND (
        Beatmaps.Metadata.Title CONTAINS[c] $0 OR 
        Beatmaps.Metadata.TitleUnicode CONTAINS[c] $0 OR 
        Beatmaps.Metadata.Artist CONTAINS[c] $0 OR 
        Beatmaps.Metadata.ArtistUnicode CONTAINS[c] $0 OR
        Beatmaps.Metadata.Author.Username CONTAINS[c] $0
      )`;
      queryArgs.push(search);
    }

    let filteredSets = beatmapSets.filtered(query, ...queryArgs);

    const start = (page - 1) * size;
    const end = start + size;
    const paginatedSets = filteredSets.slice(start, end);

    const queryEndTime = performance.now();
    this.logger.debug(`Query completed. Total matched records in DB: ${filteredSets.length}. Slicing indices: [${start} - ${end}] (Duration: ${queryEndTime - queryStartTime} ms)`);

    const mappedResults = paginatedSets.map((set): SongListItemDto => {
      const beatmap = set.Beatmaps?.[0]?.Metadata;
      const audioFileName = beatmap?.AudioFile;
      const backgroundFileName = beatmap?.BackgroundFile;

      // Case-insensitive lookups safeguard asset tracking loops
      const audioFileUsage = audioFileName
        ? set.Files?.find((f) => f.Filename?.toLowerCase() === audioFileName.toLowerCase())
        : null;

      const backgroundFileUsage = backgroundFileName
        ? set.Files?.find((f) => f.Filename?.toLowerCase() === backgroundFileName.toLowerCase())
        : null;

      if (!audioFileUsage && audioFileName) {
        this.logger.warn(`Audio file mapping missing for set ID: ${set.ID?.toString()} (Expected: "${audioFileName}")`);
      }

      return {
        id: set.ID?.toString() ?? '',
        title: beatmap?.Title ?? 'Unknown Title',
        titleUnicode: beatmap?.TitleUnicode ?? beatmap?.Title ?? 'Unknown Title',
        artist: beatmap?.Artist ?? 'Unknown Artist',
        artistUnicode: beatmap?.ArtistUnicode ?? beatmap?.Artist ?? 'Unknown Artist',
        audioFileHash: audioFileUsage?.File?.Hash ?? null,
        audioFileName: audioFileUsage?.Filename ?? null,
        backgroundFileHash: backgroundFileUsage?.File?.Hash ?? null,
        backgroundFileName: backgroundFileUsage?.Filename ?? null,
        dateAdded: set.DateAdded ? new Date(set.DateAdded) : new Date(),
      };
    });

    return mappedResults;
  }
}
