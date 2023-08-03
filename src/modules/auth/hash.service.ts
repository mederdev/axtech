import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthConfig } from '../../config/auth.config';
@Injectable()
export class HashService {
  async hash(password: string) {
    try {
      return bcrypt.hash(password, AuthConfig.getHashSalt());
    } catch (err) {
      throw new BadRequestException('Password encrypting error!', err.message);
    }
  }

  async compare(hashed: string, password: string) {
    try {
      return bcrypt.compare(password, hashed);
    } catch (err) {
      throw new BadRequestException('Password compare error!', err.message);
    }
  }
}
