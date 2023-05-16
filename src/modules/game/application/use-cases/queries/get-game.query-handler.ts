import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetGameQuery implements IQuery {
  constructor(public readonly gameId: string) {}
}
@QueryHandler(GetGameQuery)
export class GetGameQueryHandler implements IQueryHandler {
  async execute(query: GetGameQuery) {}
}
