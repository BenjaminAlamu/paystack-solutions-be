import {  injectable } from "tsyringe";
import { Request } from "express";
import ProductRepository from "../repositories/product.repo";
import {
  CreateProductDto,
} from "../dtos/product.dto";
import ProductFactory from "../factories/product.factory";
import { Product } from "../models/product.model";
import NotFoundError from "@shared/error/not-found.error";

@injectable()
class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
  ) {}

  async getAll(req: Request) {
    const { search = "", page = 1, perPage = 20 } = req.query;

    return await this.productRepo.getAll(
      {
        search: { name: search },
        page: page as number,
        perPage: perPage as number,
      },
      ["merchant(selectMerchantFields)"]
    );
  }

  async getFeaturedProducts(req: Request) {
    return await this.productRepo.getRandomProducts(
      4,
      ["merchant(selectMerchantFields)"]
    );
  }


 async createProduct(data: CreateProductDto) {
    const product = ProductFactory.create(data);

    return await this.productRepo.save(product);
  }

   async verifyProduct(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);

    if (!product) throw new NotFoundError("Product not found.");

    return product;
  }
}

export default ProductService;
