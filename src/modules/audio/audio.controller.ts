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
import { buildStreamableFile } from '../../common/streamable-file';

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
    const { stream, metadata } = this.audioService.getAudioStream(hash, range);

    if (metadata.partial) {
      res.status(HttpStatus.PARTIAL_CONTENT);
      res.setHeader(
        'Content-Range',
        `bytes ${metadata.start}-${metadata.end}/${metadata.total}`,
      );
    }

    return buildStreamableFile(stream, {
      type: 'audio/mpeg',
      length: metadata.partial
        ? metadata.end - metadata.start + 1
        : metadata.total,
    });
  }
}
