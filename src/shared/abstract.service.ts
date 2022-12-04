import { Repository } from 'typeorm';

export abstract class AbstractService {
  protected constructor(protected readonly repository: Repository<any>) {}

  async save(options) {
    return this.repository.save(options);
  }

  async find(options = {}, rOptions?) {
    return this.repository.find({
      where: options,
      relations: rOptions,
    });
  }

  async findOne(options = {}, rOptions?) {
    return this.repository.findOne({
      where: options,
      relations: rOptions,
    });
  }

  async update(id: number, options) {
    return this.repository.update(id, options);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}
