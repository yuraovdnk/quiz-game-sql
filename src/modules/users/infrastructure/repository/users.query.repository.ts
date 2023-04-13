import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entity/user.entity';
import { Repository } from 'typeorm';
import { SortFieldUserModel } from '../../application/types/user.types';
import { SaQueryParamsDto } from '../../../../common/dtos/sa-query-params.dto';
import { PageDto } from '../../../../common/utils/PageDto';
import { UserViewModel } from '../../application/dto/response/user-view.model';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectRepository(User) private userEntity: Repository<User>) {}

  async findById(userId: string): Promise<UserViewModel> {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select([
        'user.email',
        'user.login',
        'user.id',
        'user.createdAt',
        'banInfo',
      ])
      .leftJoin('user.banInfo', 'banInfo')
      .where('user.id = :userId', { userId })
      .getOne();
    return new UserViewModel(user);
  }

  async findAll(queryParams: SaQueryParamsDto) {
    const [users, totalCount] = await this.userEntity
      .createQueryBuilder('user')
      .select([
        'user.email',
        'user.login',
        'user.id',
        'user.createdAt',
        'banInfo',
      ])
      .where(
        `((:ban = 'all') or
               (:ban = 'banned' and "banInfo"."isBanned" is not null) or
               (:ban = 'notBanned' and "banInfo"."isBanned" is null)) and
               (user.login ilike :loginTerm or user.email ilike :emailTerm)`,
        {
          ban: queryParams.banStatus,
          loginTerm: `%${queryParams.searchLoginTerm}%`,
          emailTerm: `%${queryParams.searchEmailTerm}%`,
        },
      )
      .leftJoin('user.banInfo', 'banInfo')
      .orderBy(
        `user.${queryParams.sortByField(SortFieldUserModel)}`,
        queryParams.order,
      )
      .limit(queryParams.pageSize)
      .offset(queryParams.skip)
      .getManyAndCount();
    const mapped = users.map((i) => new UserViewModel(i));
    return new PageDto(mapped, queryParams, totalCount);
  }
  async getInfoByUserId(userId: string) {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select([
        'user.email as "email"',
        'user.login as "login"',
        'user.id as "userId"',
      ])
      .where('user.id = :userId', { userId })
      .getRawOne();
    return user;
  }
}
