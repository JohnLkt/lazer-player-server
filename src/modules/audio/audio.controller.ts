import { Controller, Get, Param, Response, StreamableFile, HttpStatus } from '@nestjs/common';
import { AudioService } from './audio.service';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get(':hash')
  getAudioTrack(
    @Param('hash') hash: string,
    @Response({ passthrough: true }) res,
  ): StreamableFile {
    const { stream, length } = this.audioService.getAudioStream(hash);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': length,
      'Accept-Ranges': 'bytes',
    });

    return new StreamableFile(stream);
  }
}
