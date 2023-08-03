import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokensDto } from '../../utils/dto/tokens.dto';
import { TokenType } from './types/token.type';
import { UserDto } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { HashService } from './hash.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtUserPayload } from './types/jwt-user-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException('User with same email not found!');
    }

    const isEqual = await this.hashService.compare(
      user.password,
      loginDto.password,
    );

    if (!isEqual) {
      throw new BadRequestException('Incorrect password!');
    }

    const userPayload = new UserDto({ id: user.id, email: loginDto.email });
    return this.createTokens(userPayload);
  }
  async sign(loginDto: LoginDto) {
    let user = await this.userService.findByEmail(loginDto.email);

    if (user) {
      throw new BadRequestException('User already exist with same email!');
    }

    loginDto.password = await this.hashService.hash(loginDto.password);
    user = await this.userService.create(loginDto);

    const newUser = new UserDto();
    newUser.id = user.id;
    newUser.email = loginDto.email;

    return this.createTokens(newUser);
  }

  async refreshTokens(tokens: RefreshTokenDto): Promise<TokensDto> {
    const refreshTokenPayload = this.jwtService.decode(
      tokens.refreshToken,
    ) as JwtUserPayload;

    if (!refreshTokenPayload) {
      throw new BadRequestException('Invalid token');
    }

    if (refreshTokenPayload.type !== TokenType.REFRESH) {
      throw new BadRequestException('Invalid refresh token type');
    }
    const user = await this.userService.checkUser(refreshTokenPayload.i);
    return this.createTokens(user);
  }

  createTokens(userDto: UserDto): TokensDto {
    const accessToken = this.jwtService.sign(
      userDto.toJwtUserPayload(TokenType.ACCESS),
      { expiresIn: '2d' },
    );
    const refreshToken = this.jwtService.sign(
      userDto.toJwtUserPayload(TokenType.REFRESH),
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }
}
