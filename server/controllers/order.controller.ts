import * as express from "express";
import { OrderService } from "../services/order.service";
import { ApiErrorCode } from "../api-error-code.enum";
import { checkUserConnected } from "../middlewares";
import { checkUserAccess } from "../middlewares/role.middleware";
import { validate, ValidationError } from "../utils/validation.utils";
import { OrderStatus } from "../models";

export class OrderController {
  private static instance: OrderController;
  public static getInstance(): OrderController {
    if (OrderController.instance === undefined) {
      OrderController.instance = new OrderController();
    }
    return OrderController.instance;
  }
  private constructor() {}

  async getOrders(req: express.Request, res: express.Response) {
    try {
      const { status } = req.query;
      let orders;

      if (
        status &&
        ["received", "preparing", "ready"].includes(status as string)
      ) {
        orders = await OrderService.getInstance().getOrdersByStatus(
          status as OrderStatus,
        );
      } else {
        orders = await OrderService.getInstance().getOrders();
      }

      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
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

  async getOrderByNumber(req: express.Request, res: express.Response) {
    const orderNumber = parseInt(req.params.orderNumber, 10);
    if (isNaN(orderNumber)) {
      return res.status(400).json({ error: "Invalid order number" });
    }
    const result =
      await OrderService.getInstance().getOrderByNumber(orderNumber);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    res.json(result);
  }

  async getOrdersByStatus(req: express.Request, res: express.Response) {
    const orderStatus = req.params.orderStatus;
    if (!["received", "preparing", "ready"].includes(orderStatus)) {
      return res.status(400).json({ error: "Invalid order status" });
    }
    const orders = await OrderService.getInstance().getOrdersByStatus(
      orderStatus as OrderStatus,
    );
    res.json(orders);
  }
  async createOrder(req: express.Request, res: express.Response) {
    try {
      const data = req.body;
      validate.required(data.customerName, "customerName");
      validate.string(data.customerName, "customerName");
      validate.required(data.customerEmail, "customerEmail");
      validate.string(data.customerEmail, "customerEmail");
      validate.required(data.total, "total");
      validate.number(data.total, "total", { min: 0 });

      if (data.products !== undefined) {
        validate.array(data.products, "products");
      }
      if (data.meals !== undefined) {
        validate.array(data.meals, "meals");
      }

      const result = await OrderService.getInstance().createOrder(data);
      if (result === ApiErrorCode.alreadyExists) {
        return res.status(409).end();
      }
      if (result === ApiErrorCode.invalidParameters) {
        return res.status(400).end();
      }
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }
      console.error(err);
      res.status(500).end();
    }
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

  async updateOrderStatus(req: express.Request, res: express.Response) {
    try {
      const id = req.params.id;
      const { status } = req.body;

      if (!status || !["received", "preparing", "ready"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const result = await OrderService.getInstance().updateOrder(id, {
        status,
      });
      if (result === ApiErrorCode.notFound) {
        return res.status(404).end();
      }
      if (result === ApiErrorCode.invalidParameters) {
        return res.status(400).end();
      }
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  }

  buildRouter(): express.Router {
    const router = express.Router();

    // Public routes (customers)
    router.post("/", this.createOrder.bind(this));
    router.get("/number/:orderNumber", this.getOrderByNumber.bind(this));
    router.get("/status/:orderStatus", this.getOrdersByStatus.bind(this));

    // Protected routes (restaurant staff)
    router.get("/", this.getOrders.bind(this));
    router.get("/:id", this.getOrderById.bind(this));
    router.patch("/:id/status", this.updateOrderStatus.bind(this));
    router.delete(
      "/:id",
      checkUserConnected(),
      checkUserAccess(["order-delete"]),
      this.deleteOrder.bind(this),
    );

    return router;
  }
}
