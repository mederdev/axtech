import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { ToEntity } from '../../utils/helpers/to-entity';
import { ListParamsDto } from '../../utils/dto/list-params.dto';
import { RateDto } from './dto/rate.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly userService: UsersService,
  ) {}
  async create(userDto: UserDto, createPostDto: CreatePostDto) {
    const user = await this.userService.getOne(userDto.id);

    const post: PostEntity = ToEntity(createPostDto, PostEntity);
    post.author = user;

    return this.postRepository.save(post);
  }

  async getAll(listParams: ListParamsDto) {
    return this.postRepository
      .createQueryBuilder()
      .limit(listParams.limit)
      .skip(listParams.countOffset())
      .getMany();
  }

  async getOne(id: number) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    return post;
  }

  async ratePost(rateDto: RateDto) {
    const post = await this.postRepository.findOne({
      where: {
        id: rateDto.postId,
      },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    let rating = 0;
    if (post.ratingCount === 0) {
      rating = rateDto.rate;
    } else {
      rating = (post.rating + rateDto.rate) / 2;
    }

    await this.postRepository.update(
      {
        id: rateDto.postId,
      },
      {
        rating: rating,
        ratingCount: post.ratingCount + 1,
      },
    );
    await this.userService.updateUserRating(post.author.id);
    return {
      message: `You successfully rated post with ID:${rateDto.postId}`,
    };
  }

  async remove(id: number) {
    const result = await this.postRepository.delete({
      id,
    });

    return {
      message: result.affected > 0 ? 'Deleted' : 'Something went wrong',
    };
  }
}
