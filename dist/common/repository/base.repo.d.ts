import { Repository, ObjectLiteral, FindOptionsWhere, DeepPartial, FindManyOptions, FindOneOptions, FindOptionsSelect } from 'typeorm';
export declare abstract class baseRepo<T extends ObjectLiteral> {
    protected readonly repository: Repository<T>;
    constructor(repository: Repository<T>);
    findOne(where: FindOptionsWhere<T> | FindOptionsWhere<T>[], select?: FindOptionsSelect<T>, options?: FindOneOptions<T>): Promise<T | null>;
    create(data: DeepPartial<T>): T;
    save(data: DeepPartial<T>): Promise<DeepPartial<T> & T>;
    update(id: FindOptionsWhere<T>, data: Partial<T>): Promise<import("typeorm").UpdateResult>;
    delete(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<import("typeorm").DeleteResult>;
    find(take: FindManyOptions<T>): Promise<T[]>;
}
