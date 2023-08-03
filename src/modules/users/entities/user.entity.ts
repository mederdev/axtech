import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'int', default: 50 })
  speed: number;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany('PostEntity', 'author')
  posts: PostEntity[];
}
