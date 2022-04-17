import {DrinkDocument, DrinkModel} from "../models";
import {FilterQuery, Types} from "mongoose";
import {ApiErrorCode} from "../api-error-code.enum";

export class DrinkService {

    // Singleton
    private static instance: DrinkService;
    private constructor() {}
    public static getInstance(): DrinkService {
        if(DrinkService.instance === undefined) {
            DrinkService.instance = new DrinkService();
        }
        return DrinkService.instance;
    }

    async getDrinkById(id: string): Promise<DrinkDocument | ApiErrorCode> {
        if(!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }
        const drink = await DrinkModel.findById(id);
        if(drink === null) {
            return ApiErrorCode.notFound;
        }
        return drink;
    }


    async searchDrinks(search: DrinkSearch): Promise<DrinkDocument[] | ApiErrorCode> {
        const filter: FilterQuery<DrinkDocument> = {};
        if (search.name !== undefined) {
            filter.name = {
                $regex: search.name,
                $options: "i"  // case insensitive
            };
        }

        if (search.price !== undefined) {
            filter.price = {
                $gte: search.price
            };
        }

        if (search.availability !== undefined){
            const testBool = search.availability.toString() === 'true' ? false : true;
            filter.availability = {
                $ne: testBool
            };
        }

        const query = DrinkModel.find(filter);
        if(search.limit !== undefined) {
            query.limit(search.limit);
        }

        if(search.offset !== undefined) {
            query.skip(search.offset);
        }

        return query.exec();
    }

    async createDrink(create: DrinkCreate): Promise<DrinkDocument | ApiErrorCode>{
        try {
            const model = new DrinkModel(create);
            const drink = await model.save();
            return drink;
        } catch (err) {
            return ApiErrorCode.invalidParameters;
        }
    }

    async deleteDrink(id: string): Promise<ApiErrorCode> {
        if(!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }
        const drink = await DrinkModel.findByIdAndDelete(id);
        if(drink === null) {
            return ApiErrorCode.notFound;
        }
        return ApiErrorCode.success;
    }

    async updateDrink(id:string, update: DrinkUpdate): Promise<DrinkDocument | ApiErrorCode> {
        if(!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }
        const drink = await DrinkModel.findByIdAndUpdate(id, update, {
            returnDocument: "after"
        });
        if(drink === null) {
            return ApiErrorCode.notFound;
        }
        return drink;
    }
}

export interface DrinkSearch {
    readonly name?: string;
    readonly price?: number;
    readonly availability?: boolean;
    readonly limit?: number;
    readonly offset?: number;

}

export interface DrinkCreate {
    readonly name: string;
    readonly price: number;
    readonly availability: boolean;
}

export interface DrinkUpdate {
    readonly name?: string;
    readonly price?: number;
    readonly availability?: boolean;
}