import { PromoDocument, PromoModel } from "../models/promo.model";
import { FilterQuery, Types } from "mongoose";
import { ApiErrorCode } from "../api-error-code.enum";

export class PromoService {
  private static instance: PromoService;

  private constructor() {}

  public static getInstance(): PromoService {
    if (PromoService.instance === undefined) {
      PromoService.instance = new PromoService();
    }
    return PromoService.instance;
  }

  async getPromoById(id: string): Promise<PromoDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const promo = await PromoModel.findById(id);
    if (promo === null) {
      return ApiErrorCode.notFound;
    }
    return promo;
  }

  async searchPromos(
    search: PromoSearch
  ): Promise<PromoDocument[] | ApiErrorCode> {
    const filter: FilterQuery<PromoDocument> = {};
    if (search.id !== undefined) {
      filter.id = search.id;
    }
    if (search.code !== undefined) {
      filter.code = search.code;
    }
    const query = PromoModel.find(filter);
    if (search.percent !== undefined) {
      filter.percent = {
        $gte: search.percent,
      };
    }
    return query.exec();
  }

  async createPromo(
    create: PromoCreate
  ): Promise<PromoDocument | ApiErrorCode> {
    try {
      const model = new PromoModel(create);
      const promo = await model.save();
      return promo;
    } catch (err) {
      return ApiErrorCode.invalidParameters;
    }
  }
}

export interface PromoCreate {
  readonly id: string;
  readonly code: string;
  readonly percent?: number;
}

export interface PromoSearch {
  readonly id?: string;
  readonly code?: string;
  readonly percent?: number;
}
