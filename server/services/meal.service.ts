import { MealDocument, MealModel, MealSlot } from "../models";
import { Types } from "mongoose";
import { ApiErrorCode } from "../api-error-code.enum";

export class MealService {
  private static instance: MealService;
  private constructor() {}
  public static getInstance(): MealService {
    if (MealService.instance === undefined) {
      MealService.instance = new MealService();
    }
    return MealService.instance;
  }

  async getAllMeals(): Promise<MealDocument[] | null> {
    const meals = await MealModel.find();
    if (meals === null) {
      return null;
    }
    return meals;
  }

  async getMealById(id: string): Promise<MealDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const meal = await MealModel.findById(id);
    if (meal === null) {
      return ApiErrorCode.notFound;
    }
    return meal;
  }

  async createMeal(create: MealCreate): Promise<MealDocument | ApiErrorCode> {
    try {
      const model = new MealModel(create);
      const meal = await model.save();
      return meal;
    } catch (err) {
      return ApiErrorCode.invalidParameters;
    }
  }

  async getMealByName(name: string): Promise<string | ApiErrorCode> {
    const meal = await MealModel.findOne({ name });
    if (meal === null) {
      return ApiErrorCode.notFound;
    }
    return name;
  }

  async deleteMeal(id: string): Promise<ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const meal = await MealModel.findByIdAndDelete(id);
    if (meal === null) {
      return ApiErrorCode.notFound;
    }
    return ApiErrorCode.success;
  }

  async updateMeal(
    id: string,
    update: MealUpdate
  ): Promise<MealDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const meal = await MealModel.findByIdAndUpdate(id, update, {
      returnDocument: "after",
    });
    if (meal === null) {
      return ApiErrorCode.notFound;
    }
    return meal;
  }
}

export interface MealCreate {
  readonly name: string;
  readonly description?: string;
  readonly slots: MealSlot[];
  readonly price: number;
  readonly imageUrl?: string;
}

export interface MealUpdate {
  readonly name?: string;
  readonly description?: string;
  readonly slots?: MealSlot[];
  readonly price?: number;
  readonly imageUrl?: string;
}
