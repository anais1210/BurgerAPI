import { ProductDocument, ProductModel } from "../models";
import { FilterQuery, Types } from "mongoose";
import { ApiErrorCode } from "../api-error-code.enum";

export class ProductService {
  // Singleton
  private static instance: ProductService;
  private constructor() {}
  public static getInstance(): ProductService {
    if (ProductService.instance === undefined) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async getProductById(id: string): Promise<ProductDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const Product = await ProductModel.findById(id);
    if (Product === null) {
      return ApiErrorCode.notFound;
    }
    return Product;
  }

  async getProductPrices(ids?: string[]): Promise<number> {
    if (!ids || ids.length === 0) return 0;

    // récupérer tous les Products correspondants
    const Products = await ProductModel.find({ _id: { $in: ids } }).select(
      "price",
    );

    // sommer les prix
    const total = Products.reduce((sum, b) => sum + (b.price || 0), 0);
    return total;
  }

  async searchProducts(
    search: ProductSearch,
  ): Promise<ProductDocument[] | ApiErrorCode> {
    const filter: FilterQuery<ProductDocument> = {};
    if (search.name !== undefined) {
      filter.name = {
        $regex: search.name,
        $options: "i", // case insensitive
      };
    }

    if (search.price !== undefined) {
      filter.price = {
        $gte: search.price,
      };
    }

    if (search.availability !== undefined) {
      const testBool = search.availability.toString() === "true" ? false : true;
      filter.availability = {
        $ne: testBool,
      };
    }

    const query = ProductModel.find(filter);
    if (search.limit !== undefined) {
      query.limit(search.limit);
    }

    if (search.offset !== undefined) {
      query.skip(search.offset);
    }

    return query.exec();
  }

  async createProduct(
    create: ProductCreate,
  ): Promise<ProductDocument | ApiErrorCode> {
    try {
      const model = new ProductModel(create);
      const Product = await model.save();
      return Product;
    } catch (err) {
      return ApiErrorCode.invalidParameters;
    }
  }

  async deleteProduct(id: string): Promise<ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const Product = await ProductModel.findByIdAndDelete(id);
    if (Product === null) {
      return ApiErrorCode.notFound;
    }
    return ApiErrorCode.success;
  }

  async updateProduct(
    id: string,
    update: ProductUpdate,
  ): Promise<ProductDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const Product = await ProductModel.findByIdAndUpdate(id, update, {
      returnDocument: "after",
    });
    if (Product === null) {
      return ApiErrorCode.notFound;
    }
    return Product;
  }
}

export interface ProductSearch {
  readonly name?: string;
  readonly price?: number;
  readonly availability?: boolean;
  readonly limit?: number;
  readonly offset?: number;
}

export interface ProductCreate {
  readonly name: string;
  readonly price: number;
  readonly availability: boolean;
}

export interface ProductUpdate {
  readonly name?: string;
  readonly price?: number;
  readonly availability?: boolean;
}
