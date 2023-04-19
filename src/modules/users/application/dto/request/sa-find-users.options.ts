import { IsEnum } from 'class-validator';
import { BaseFindOptionsDto } from '../../../../../common/dtos/base-find-options.dto';

export enum BanStatusEnum {
  all = 'all',
  notBanned = 'notBanned',
  banned = 'banned',
}
export class SaFindUsersOptions extends BaseFindOptionsDto {
  readonly searchLoginTerm = '';
  readonly searchEmailTerm = '';

  @IsEnum(BanStatusEnum, { each: true })
  banStatus: BanStatusEnum = BanStatusEnum.all;
}
