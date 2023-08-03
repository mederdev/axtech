import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ReadingTime } from '../helpers/reading-time';

@Injectable()
export class AddRtInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const { user } = context.switchToHttp().getRequest();
    const { speed } = await this.userRepository.findOneBy({ id: user.id });
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => ({
            rt: `${ReadingTime(speed, item.content)} minute`,
            ...item,
          }));
        }
        return {
          ...data,
          rt: `${ReadingTime(speed, data.content)} minute`,
        };
      }),
    );
  }
}
