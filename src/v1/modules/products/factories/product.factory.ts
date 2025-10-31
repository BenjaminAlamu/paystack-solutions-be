import { GetRandomID, slugify } from "@shared/utils/functions.util";
import {
  CreateProductDto,
} from "../dtos/product.dto";
import { IProduct } from "../models/product.model";

class ProductFactory {
  static create(data: CreateProductDto) {
    const product = {} as IProduct;

    product.name = data.name;
    product.slug = `${slugify(data.name).toLowerCase()}-${GetRandomID(6)}`;
    product.description = data.description;
    product.price = data.price;
    product.stockQuantity =1000;
    product.imageUrl = data.imageUrl;
    product.merchantId = data.merchantId;
    return product;
  }

//   static update(data: UpdateProductDto) {
//     const product = {} as Partial<IProduct>;

//     product.name = data.name;
//     product.slug = slugify(data.name).toLowerCase();
//     product.prefix = data.prefix;
//     product.code = data.code;
//     product.premiumRate = data.premiumRate;
//     product.discountRate = data.discountRate;
//     product.isPremiumEditable = data.isPremiumEditable;
//     product.minSumInsured = data.minSumInsured;
//     product.maxSumInsured = data.maxSumInsured;

//     if (data.namingConventionId)
//       product.namingConventionId = data.namingConventionId;
//     if (data.policyDocumentTemplate)
//       product.policyDocumentTemplate = data.policyDocumentTemplate
//         .replace(/\x00/g, "") // Remove null bytes
//         .replace(/\s+/g, " ") // Normalize multiple spaces
//         .trim();
//     if (data.policyDocumentTemplateUrl)
//       product.policyDocumentTemplateUrl = data.policyDocumentTemplateUrl;
//     if (data.policyCertificateTemplate)
//       product.policyCertificateTemplate = data.policyCertificateTemplate
//         .replace(/\x00/g, "") // Remove null bytes
//         .replace(/\s+/g, " ") // Normalize multiple spaces
//         .trim();
//     if (data.policyCertificateUrl)
//       product.policyCertificateUrl = data.policyCertificateUrl;

//     return product;
//   }

//   static updateStatus(status: string) {
//     const product = {} as Partial<IProduct>;

//     product.status = status as ProductStatus;

//     return product;
//   }


}

export default ProductFactory;
