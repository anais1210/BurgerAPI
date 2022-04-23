import { BurgerProps, OrderDocument, OrderModel, OrderProps } from "../models";
import {Types, FilterQuery} from 'mongoose';
import { ApiErrorCode } from "../api-error-code.enum";

export class OrderService{

    private static instance: OrderService;
    private constructor(){}
    public static getInstance(): OrderService{
        if(OrderService.instance === undefined){
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    async getOrderById(id: string): Promise<OrderDocument | ApiErrorCode> {
        if(!Types.ObjectId.isValid(id)) {
            return null;
        }
        const order = await OrderModel.findById(id);
        if(order === null) {
            return null;
        }
        return order;
    }
    async createOrder(create: OrderCreate):Promise<OrderDocument | ApiErrorCode>{
        try {
        const model = new OrderModel(create);
        const order = await model.save();
        return order;
        } catch(err) {
            return ApiErrorCode.invalidParameters;
        }
    }
    async getOrderByName(number:string): Promise<OrderDocument | ApiErrorCode>{
        if(!Types.ObjectId.isValid(number)) {;
            return ApiErrorCode.invalidParameters;
        };
        const order = await OrderModel.findOne({number});
        if(order === null){;
            return ApiErrorCode.notFound;
        };
        return order;
    };
    async deleteOrder(id: string): Promise<ApiErrorCode> {
        if(!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }
        const order = await OrderModel.findByIdAndDelete(id);
        if(order === null) {
            return ApiErrorCode.notFound;
        }
        return ApiErrorCode.success;
    }
    async updateOrder(id:string, update: OrderUpdate): Promise<OrderDocument | ApiErrorCode> {
        if(!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }
        const burger = await OrderModel.findByIdAndUpdate(id, update, {
            returnDocument: "after"
        });
        if(burger === null) {
            return ApiErrorCode.notFound;
        }
        return burger;
    }
};

export interface OrderCreate{
    readonly foods: string[]
    readonly number: number;
    readonly date: Date;
    readonly price: number;
    readonly status: boolean;
    
}

export interface OrderUpdate{
    readonly foods?: string[]
    readonly number?: number;
    readonly date?: Date;
    readonly price?: number;
    readonly status?: boolean;
}