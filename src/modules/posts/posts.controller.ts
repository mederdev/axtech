import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../utils/decorators/user.decorator';
import { UserDto } from '../users/dto/user.dto';
import { ListParamsDto } from '../../utils/dto/list-params.dto';
import { AuthGuard } from '@nestjs/passport';
import { AddRtInterceptor } from '../../utils/interceptors/add-rt.interceptor';
import { RateDto } from './dto/rate.dto';
import { PostDto } from './dto/post.dto';
import { MessageDto } from '../../utils/dto/message.dto';

@ApiTags('Posts')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Get posts' })
  @ApiResponse({ status: 200, type: PostDto, isArray: true })
  @Get()
  @UseInterceptors(AddRtInterceptor)
  findAll(@Query() listParams: ListParamsDto) {
    return this.postsService.getAll(listParams);
  }

  @ApiOperation({ summary: 'Get post by id' })
  @ApiResponse({ status: 200, type: PostDto })
  @Get(':id')
  @UseInterceptors(AddRtInterceptor)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getOne(id);
  }

  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 200, type: PostDto })
  @Post()
  create(@User() user: UserDto, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(user, createPostDto);
  }

  @ApiOperation({ summary: 'Rate post by id' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Patch('rate')
  ratePost(@Body() rateDto: RateDto) {
    return this.postsService.ratePost(rateDto);
  }

  @ApiOperation({ summary: 'Delete post by id' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
