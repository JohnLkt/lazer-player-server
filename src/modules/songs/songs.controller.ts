import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsQueryDto } from './dto/songs-query.dto';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getSongsList(@Query() query: SongsQueryDto) {
    return this.songsService.getSongsList({
      page: query.page,
      size: query.size,
      search: query.search?.trim(),
    });
  }
}
