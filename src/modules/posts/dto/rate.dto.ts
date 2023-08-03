import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max } from 'class-validator';

export class RateDto {
  @ApiProperty()
  @IsNumber()
  postId: number;

  @ApiProperty()
  @IsNumber()
  @Max(5)
  rate: number;
}
