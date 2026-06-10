export class SongListItemDto {
  id!: string;
  title!: string;
  titleUnicode!: string;
  artist!: string;
  artistUnicode!: string;
  audioFileHash!: string | null;
  backgroundFileHash!: string | null;
  dateAdded!: Date;
}