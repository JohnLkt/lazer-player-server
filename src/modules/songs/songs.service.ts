import { Injectable } from '@nestjs/common';
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

  getSongsList(options: GetSongsOptions): SongListItemDto[] {
    const { page, size, search } = options;
    const realm = this.databaseService.instance;

    let beatmapSets = realm.objects<BeatmapSet>(BeatmapSet);

    let query = 'DeletePending == false';
    const queryArgs: any[] = [];

    // Filters down nested metadata objects inside osu!lazer schema configurations
    if (search) {
      query += ' AND (Metadata.Title CONTAINS[c] $0 OR Metadata.Artist CONTAINS[c] $0)';
      queryArgs.push(search);
    }

    let filteredSets = beatmapSets.filtered(query, ...queryArgs);

    const start = (page - 1) * size;
    const end = start + size;
    const paginatedSets = filteredSets.slice(start, end);

    return paginatedSets.map((set): SongListItemDto => {

      const beatmap = set.Beatmaps?.[0]?.Metadata;
      const audioFileName = beatmap?.AudioFile;
      const backgroundFileName = beatmap?.BackgroundFile;

      const audioFileUsage = audioFileName
        ? set.Files?.find((f) => f.Filename === audioFileName)
        : null;

      const backgroundFileUsage = backgroundFileName
        ? set.Files?.find((f) => f.Filename === backgroundFileName)
        : null;

      return {
        id: set.ID?.toString() ?? '',
        title: beatmap?.Title ?? 'Unknown Title',
        titleUnicode: beatmap?.TitleUnicode ?? beatmap?.Title ?? 'Unknown Title',
        artist: beatmap?.Artist ?? 'Unknown Artist',
        artistUnicode: beatmap?.ArtistUnicode ?? beatmap?.Artist ?? 'Unknown Artist',
        audioFileHash: audioFileUsage?.File?.Hash ?? null,
        backgroundFileHash: backgroundFileUsage?.File?.Hash ?? null,
        dateAdded: set.DateAdded ? new Date(set.DateAdded) : new Date(),
      };
    });
  }
}
