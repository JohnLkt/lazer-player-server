import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getSongsList(
    @Query('page') page?: string,
    @Query('size') size?: string,
    @Query('search') search?: string,
  ) {
    // Parse query params with fallback defaults
    const pageNum = page ? parseInt(page, 10) : 1;
    const sizeNum = size ? parseInt(size, 10) : 50;

    return this.songsService.getSongsList({
      page: pageNum,
      size: sizeNum,
      search: search?.trim(),
    });
  }
}
