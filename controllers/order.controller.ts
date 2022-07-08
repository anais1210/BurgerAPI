import * as express from "express";
import { OrderService } from "../services/order.service";
import { ApiErrorCode } from "../api-error-code.enum";

export class OrderController {
  private static instance: OrderController;
  public static getInstance(): OrderController {
    if (OrderController.instance === undefined) {
      OrderController.instance = new OrderController();
    }
    return OrderController.instance;
  }
  private constructor() {}

  // -----------------------------------------------------------------------

  async searchOrder(req: express.Request, res: express.Response) {
    const limit = req.query.limit
      ? Number.parseInt(req.query.limit as string)
      : 20; // number
    const offset = req.query.offset
      ? Number.parseInt(req.query.offset as string)
      : 0; // number
    const price = req.query.price
      ? Number.parseInt(req.query.price as string)
      : undefined; // number
    const number = req.query.number
      ? Number.parseInt(req.query.price as string)
      : undefined; // number

    const date = req.query.date ? req.query.date.toString() : undefined;

    const status = req.query.status
      ? req.query.availability === "true"
      : undefined;

    const Orders = await OrderService.getInstance().searchOrder({
      foods: req.query.foods as string[],
      number: number,
      price: price,
      date: date,
      status: status,
      limit: limit,
      offset: offset,
    });
    res.json(Orders);
  }

  async getOrderById(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await OrderService.getInstance().getOrderById(id);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    } else if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.json(result);
  }
  async createOrder(req: express.Request, res: express.Response) {
    const result = await OrderService.getInstance().createOrder(req.body.foods);
    if (result === ApiErrorCode.alreadyExists) {
      return res.status(409).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.json();
  }

  async deleteOrder(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await OrderService.getInstance().deleteOrder(id);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    } else if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.status(204).end();
  }

  async updateOrder(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const data = req.body;
    const result = await OrderService.getInstance().updateOrder(id, data);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.json(result);
  }

  buildRouter(): express.Router {
    const router = express.Router(); // création d'un nouveau router
    router.post("/createOrder", express.json(), this.createOrder.bind(this));
    router.get("/:id", this.getOrderById.bind(this));
    router.delete("/:id", this.deleteOrder.bind(this));
    router.patch("/:id", this.updateOrder.bind(this));
    return router;
  }
}
