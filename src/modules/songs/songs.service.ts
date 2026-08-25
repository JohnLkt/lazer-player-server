import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../storage/database.service';
import { BeatmapSet } from '../storage/models/database.model';
import { mapBeatmapSetToDto } from './song-mapper';
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

    const beatmapSets = realm.objects<BeatmapSet>(BeatmapSet);
    let query = 'DeletePending == false';

    const queryArgs: (string | number | boolean)[] = [];

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

    const filteredSets = beatmapSets.filtered(query, ...queryArgs);

    const start = (page - 1) * size;
    const end = start + size;
    const paginatedSets = filteredSets.slice(start, end);

    const queryEndTime = performance.now();
    this.logger.debug(
      `Query completed. Total matched records in DB: ${filteredSets.length}. Slicing indices: [${start} - ${end}] (Duration: ${queryEndTime - queryStartTime} ms)`,
    );

    return paginatedSets.map(mapBeatmapSetToDto);
  }
}
