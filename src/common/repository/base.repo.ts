import {
  Repository,
  ObjectLiteral,
  FindOptionsWhere,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsSelect,
} from 'typeorm';

export abstract class baseRepo<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async findOne(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    select?: FindOptionsSelect<T>,
    options?: FindOneOptions<T>,
  ) {
    return await this.repository.findOne({
      ...options,
      where,
      ...(select ? { select } : {}),
    });
  }

  create(data: DeepPartial<T>) {
    return this.repository.create({ ...data });
  }

  async save(data: DeepPartial<T>) {
    return await this.repository.save(data);
  }
  async update(id: FindOptionsWhere<T>, data: Partial<T>) {
    return await this.repository.update(id, { ...data });
  }

  async delete(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
    return await this.repository.delete(where);
  }

  async find(take: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(take);
  }
}
