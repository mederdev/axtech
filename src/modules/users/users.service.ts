import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { ListParamsDto } from '../../utils/dto/list-params.dto';
import { UserDto } from './dto/user.dto';
import { PostEntity } from '../posts/entities/post.entity';
import { ToEntity } from '../../utils/helpers/to-entity';
import { LoginDto } from '../auth/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}
  async create(createUserDto: LoginDto) {
    const user = ToEntity(createUserDto, UserEntity);
    return this.userRepository.save(user);
  }
  getAll(listDto: ListParamsDto) {
    return this.userRepository
      .createQueryBuilder()
      .select()
      .limit(listDto.limit)
      .skip(listDto.countOffset())
      .getMany();
  }
  async getOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }
  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
  async getPosts(userId: number, listParams: ListParamsDto) {
    return this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.posts', 'posts')
      .where('users.id = :id', { id: userId })
      .limit(listParams.limit)
      .skip(listParams.countOffset())
      .getMany();
  }

  async checkUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.deleted) {
      throw new BadRequestException('User was deleted');
    }

    return new UserDto({ id: user.id, email: user.email });
  }

  async updateUserRating(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['posts'],
    });
    const totalPosts = user.posts.length;
    const totalRatings = user.posts.reduce((sum, post) => sum + post.rating, 0);
    const userRating = totalPosts > 0 ? totalRatings / totalPosts : 0;

    await this.userRepository.update(
      {
        id,
      },
      {
        rating: userRating > 5 ? 5 : userRating,
      },
    );
  }
}
