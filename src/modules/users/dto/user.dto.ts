import { TokenType } from '../../auth/types/token.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  speed: number;

  @ApiProperty()
  rating: number;

  constructor(data = {}) {
    Object.assign(this, data);
  }
  toJwtUserPayload(tokenType: TokenType) {
    return {
      i: this.id,
      e: this.email,
      type: tokenType,
    };
  }
}
