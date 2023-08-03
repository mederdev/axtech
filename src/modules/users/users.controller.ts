import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ListParamsDto } from '../../utils/dto/list-params.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ status: 200, type: UserDto })
  @Get()
  findAll(@Query() listParams: ListParamsDto) {
    return this.usersService.getAll(listParams);
  }

  @ApiOperation({ summary: 'Get user posts' })
  @ApiResponse({ status: 200, type: UserDto })
  @Get('posts/:id')
  getUserPosts(
    @Param('id', ParseIntPipe) id: number,
    @Query() listParams: ListParamsDto,
  ) {
    return this.usersService.getPosts(id, listParams);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: UserDto })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getOne(id);
  }
}
