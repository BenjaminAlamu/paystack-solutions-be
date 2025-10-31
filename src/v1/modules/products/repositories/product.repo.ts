import { BaseRepository } from "@shared/repositories/base.repo";
import { IProduct, Product } from "../models/product.model";

class ProductRepository extends BaseRepository<IProduct, Product> {
  constructor() {
    super(Product);
  }

  async findByCode(code: string, relations: string[] = []) {
    const productQuery = Product.query();

    for (const relation of relations) {
      productQuery.withGraphFetched(relation);
    }

    return await productQuery.findOne({ code });
  }

  async findByPrefix(prefix: string, relations: string[] = []) {
    const productQuery = Product.query();

    for (const relation of relations) {
      productQuery.withGraphFetched(relation);
    }

    return await productQuery.findOne({ prefix });
  }

  async countProducts() {
    const totalProducts = (await Product.query()
      .count("* as products")
      .first()) as any;
    return { totalProducts: Number(totalProducts?.products) };
  }

  async validateProductIds(productIds: string[]) {
    const validProducts = await Product.query()
      .select("id")
      .whereIn("id", productIds);

    const validProductIds = validProducts.map((product) => product.id);

    const invalidDatabaseIds = productIds.filter(
      (productId) => !validProductIds.includes(productId)
    );

    return {
      isValid: invalidDatabaseIds.length === 0,
      invalidProductIds: invalidDatabaseIds,
    };
  }

  async getAllWithoutPagination() {
    const products = await Product.query()
      .select("id", "name", "slug", "prefix", "naicomCode", "riskType", "type")
      .withGraphFetched("[classOfBusiness]");

    return products;
  }

  async getRandomProducts(limit = 4, relations: string[] = []) {
    const query = Product.query()
      .orderByRaw("RANDOM()") 
      .limit(limit);

    for (const relation of relations) {
      query.withGraphFetched(relation);
    }

    return await query;
  }
}

export default ProductRepository;
