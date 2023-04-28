import { Repository } from 'typeorm';

export class BaseRepository<T> {
  constructor(private repository: Repository<T>) {}

  async save(entity: T) {
    await this.repository.save(entity);
  }
  async delete(entity: T) {
    await this.repository.remove(entity);
  }
  // async getById(id: string): Promise<T> {
  //   return this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
  // }
}
