import { ObjectLiteral } from "@shared/types/object-literal.type";
import { paginate, Pagination } from "@shared/utils/pagination";
import { Model, Transaction } from "objection";

export class BaseRepository<T, M extends Model> {
  private model: typeof Model | any;
  constructor(model: M | any) {
    this.model = model;
  }

  setModel(model: M | any) {
    this.model = model;
  }

  async findById(id: string, relations: string[] = []): Promise<M> {
    const query = this.model.query();

    for (const relation of relations) {
      query.withGraphFetched(relation);
    }

    return await query.findById(id);
  }

  async updateById(id: string, data: Partial<M>, trx?: Transaction): Promise<M> {
    return await this.model.query(trx).patchAndFetchById(id, data).returning("*");
  }

  async updateByIdWithGraphFetch(id: string, data: Partial<M>, relations: string[] = []): Promise<M> {
    const query = this.model.query().patchAndFetchById(id, data);

    for (const relation of relations) {
      query.withGraphFetched(relation);
    }
    return await query;
  }

  async save(data: Partial<T>, transaction?: Transaction): Promise<M> {
    return await this.model.query(transaction).insert(data).returning("*");
  }

  async saveBulk(data: Partial<T[]>, transaction?: Transaction): Promise<M> {
    return await this.model.query(transaction).insert(data).returning("*");
  }

  async getAll(data?: PaginationQuery, relations: string[] = []): Promise<Pagination<M>> {
    const query = this.model.query().orderBy("createdAt", "DESC");

    // for (const relation of relations) {
    //   query.withGraphFetched(relation);
    // }

    if (relations.length) {
      const graph = `[${relations.join(", ")}]`;
      query.withGraphFetched(graph);
    }  

    if (data?.where) {
      query.andWhere(data.where);
    }

    if (data?.search) {
      this.applySearch(query, data.search);
    }

    const response = await paginate<M>(query, {
      size: Number(data?.perPage || 10),
      page: Number(data?.page || 1),
    });

    return response;
  }

  private applySearch(query: any, search: ObjectLiteral) {
    const entries = Object.entries(search);
    if (entries.length === 0) return;

    query.andWhere(function (query) {
      const [firstKey, firstValue] = entries[0];
      if (firstValue) query.whereRaw(`LOWER("${firstKey}") LIKE ?`, [`%${firstValue.toLowerCase()}%`]);

      for (let i = 1; i < entries.length; i++) {
        const [key, value] = entries[i];
        if (value) query.orWhereRaw(`LOWER("${key}") LIKE ?`, [`%${value.toLowerCase()}%`]);
      }
    });
  }

  async getAllWithRelations(relations: string[] = []) {
    const query = this.model.query();

    for (const relation of relations) {
      query.withGraphFetched(relation);
    }

    return await query;
  }

  async deleteById(id: string) {
    return await this.model.query().deleteById(id);
  }

  async findByName(name: string) {
    return await this.model.query().findOne({ name });
  }

  async findOneWhere(filter: ObjectLiteral): Promise<T | undefined> {
    return await this.model.query().where(filter).first();
  }

  async updateWhere(filter: ObjectLiteral, data: Partial<T>, trx?: Transaction): Promise<T | undefined> {
    return await this.model.query(trx).where(filter).update(data);
  }

  async findWhere(filter: ObjectLiteral, relations: string[] = []): Promise<T[]> {
    const query = this.model.query();

    for (const relation of relations) {
      query.withGraphFetched(relation);
    }

    return await query.where(filter);
  }

  async findFirstOccurrence() {
    return await this.model.query().first();
  }

  async bulkUpdate(
    filter: ObjectLiteral,
    data: Partial<T>,
    options?: {
      transaction?: Transaction;
      relations?: string[];
      returnUpdated?: boolean;
    }
  ): Promise<M[] | number> {
    const query = this.model.query(options?.transaction);

    // Apply the filter conditions
    query.where(filter);

    // If relations are specified and returning updated records
    if (options?.relations && options?.returnUpdated) {
      for (const relation of options.relations) {
        query.withGraphFetched(relation);
      }
    }

    if (options?.returnUpdated) {
      // Update and return the modified records
      return await query.patch(data).returning('*');
    } else {
      // Just update and return the count of modified records
      return await query.patch(data);
    }
  }
}
