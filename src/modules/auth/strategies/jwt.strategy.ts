import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig } from '../../../config/auth.config';
import { TokenType } from '../types/token.type';
import { JwtUserPayload } from '../types/jwt-user-payload';
import { UserPayload } from '../types/user-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AuthConfig.getJwtConfig(),
    });
  }

  validate(payload: JwtUserPayload): UserPayload {
    if (payload.type !== TokenType.ACCESS) {
      throw new HttpException('Invalid token type', 403);
    }
    return { id: payload.i, email: payload.e, type: payload.type };
  }
}
