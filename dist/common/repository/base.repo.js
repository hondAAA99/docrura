export class baseRepo {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findOne(where, select, options) {
        return await this.repository.findOne({
            ...options,
            where,
            ...(select ? { select } : {}),
        });
    }
    create(data) {
        return this.repository.create({ ...data });
    }
    async save(data) {
        return await this.repository.save(data);
    }
    async update(id, data) {
        return await this.repository.update(id, { ...data });
    }
    async delete(where) {
        return await this.repository.delete(where);
    }
    async find(take) {
        return await this.repository.find(take);
    }
}
//# sourceMappingURL=base.repo.js.map