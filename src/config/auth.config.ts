import { Logger } from '@nestjs/common';
import * as process from 'process';

export class AuthConfig {
  static getJwtConfig() {
    const { JWT_SECRET } = process.env;

    if (JWT_SECRET) {
      return JWT_SECRET;
    } else {
      Logger.error('CONFIG ERROR (JWT_SECRET): BAD ENVIRONMENT');
      process.exit();
    }
  }

  static getHashSalt() {
    const { HASH_SALT } = process.env;
    if (HASH_SALT) {
      return Number(HASH_SALT);
    } else {
      Logger.error('CONFIG ERROR (HASH_SALT): BAD ENVIRONMENT');
      process.exit();
    }
  }
}
