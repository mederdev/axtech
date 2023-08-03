import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokensDto } from '../../utils/dto/tokens.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: 200, type: TokensDto })
  @Post('signup')
  signIn(@Body() user: LoginDto) {
    return this.authService.sign(user);
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, type: TokensDto })
  @Post('signin')
  login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, type: TokensDto })
  @Post('refresh')
  refresh(@Body() tokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(tokenDto);
  }
}
