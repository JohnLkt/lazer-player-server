import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';
import { AudioService } from './audio.service';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get(':hash')
  @Header('Accept-Ranges', 'bytes')
  getAudio(
    @Param('hash') hash: string
  ): StreamableFile {
    const { stream, length } = this.audioService.getAudioStream(hash);

    return new StreamableFile(stream, {
      type: 'audio/mpeg',
      length: length
    });
  }
}
