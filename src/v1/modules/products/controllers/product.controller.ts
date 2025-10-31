import { injectable } from "tsyringe";
import { Request, Response } from "express";
import ProductService from "../services/product.service";
import { SuccessResponse } from "@shared/utils/response.util";
import httpStatus from "http-status";

@injectable()
class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {
 
  }

  async getAll(request: Request, response: Response) {
    const data = await this.productService.getAll(request);

    return response
      .status(httpStatus.OK)
      .send(SuccessResponse("Operation successful", data));
  }

  async getFeaturedProducts(request: Request, response: Response) {
    const data = await this.productService.getFeaturedProducts(request);

    return response
      .status(httpStatus.OK)
      .send(SuccessResponse("Operation successful", data));
  }

  async createProduct(request: Request, response: Response) {
    const data = await this.productService.createProduct({
      ...request.body,
      merchantId: request?.merchant?.id,
    });


    return response
      .status(httpStatus.CREATED)
      .send(SuccessResponse("Product has been created", data));
  }

//   async getProductById(request: Request, response: Response) {
//     const { id } = request.params;

//     const data = await this.productService.getProductById(id);

//     return response
//       .status(httpStatus.OK)
//       .send(SuccessResponse("Operation successful", data));
//   }

//   async updateProductById(request: Request, response: Response) {
//     const { id } = request.params;

//     const data = await this.productService.updateProductById(id, request.body);

//     this.trackAction(
//       AuditTrailModuleType.PRODUCTS,
//       request.user,
//       "Updated product",
//       { request: { body: request.body }, response: data },
//       request
//     );

//     return response
//       .status(httpStatus.OK)
//       .send(SuccessResponse("Operation successful", data));
//   }

//   async validateProductIds(request: Request, response: Response) {
//     const { productIds } = request.body;
//     const data = await this.productService.validateProductIds(productIds);
//     return response
//       .status(httpStatus.OK)
//       .send(SuccessResponse("Operation successful", data));
//   }

//   async getAllUnpaginatedProducts(request: Request, response: Response) {
//     const data =
//       await this.productService.getUnpaginatedProductsAndSaveToRedis();
//     return response
//       .status(httpStatus.OK)
//       .send(SuccessResponse("Operation successful", data));
//   }
}

export default ProductController;
