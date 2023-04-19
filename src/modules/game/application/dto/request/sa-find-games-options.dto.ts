import { BaseFindOptionsDto } from '../../../../../common/dtos/base-find-options.dto';
import { IsEnum } from 'class-validator';

enum PublishedStatuses {
  all = 'all',
  published = 'published',
  notPublished = 'notPublished',
}
export class SaFindGamesOptionsDto extends BaseFindOptionsDto {
  bodySearchTerm = '';

  @IsEnum(PublishedStatuses, { each: true })
  publishedStatus: PublishedStatuses = PublishedStatuses.all;
}
