import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(500)
  content: string;
}
