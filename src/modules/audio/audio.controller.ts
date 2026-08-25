import {
  Controller,
  Get,
  Header,
  Headers,
  HttpStatus,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { AudioService } from './audio.service';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get(':hash')
  @Header('Accept-Ranges', 'bytes')
  getAudio(
    @Param('hash') hash: string,
    @Headers('range') range: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const { stream, start, end, total, partial } =
      this.audioService.getAudioStream(hash, range);

    if (partial) {
      res.status(HttpStatus.PARTIAL_CONTENT);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
    }

    return new StreamableFile(stream, {
      type: 'audio/mpeg',
      length: partial ? end - start + 1 : total,
    });
  }
}
