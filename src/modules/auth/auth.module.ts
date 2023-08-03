import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfig } from '../../config/auth.config';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HashService } from './hash.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { PostEntity } from '../posts/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PostEntity]),
    PassportModule,
    JwtModule.register({
      secret: AuthConfig.getJwtConfig(),
    }),
  ],
  providers: [AuthService, UsersService, HashService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
