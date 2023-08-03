import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ListParamsDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }: { value: number }) =>
    value > 0 && value < 100000 ? value : 1,
  )
  page = 1;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }: { value: number }) =>
    value > 0 && value < 100 ? value : 20,
  )
  limit = 10;
  public countOffset(): number {
    return (this.page - 1) * this.limit;
  }
}
