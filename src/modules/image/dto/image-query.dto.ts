import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ImageQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  width: number = 200;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  height: number = 200;
}

