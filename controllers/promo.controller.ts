import * as express from "express";
import { PromoService } from "../services/promo.service";
import { ApiErrorCode } from "../api-error-code.enum";

export class PromoController {
  private static instance: PromoController;

  public static getInstance(): PromoController {
    if (PromoController.instance === undefined) {
      PromoController.instance = new PromoController();
    }
    return PromoController.instance;
  }

  private constructor() {}

  async getPromoById(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await PromoService.getInstance().getPromoById(id);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    } else if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.json(result);
  }

  async searchPromo(req: express.Request, res: express.Response) {
    const percent = req.query.limit
      ? Number.parseInt(req.query.limit as string)
      : 50; // number
    const promos = await PromoService.getInstance().searchPromos({
      id: req.query.type as string,
      code: req.query.type as string,
      percent: percent,
    });
    res.json(promos);
  }

  async createPromo(req: express.Request, res: express.Response) {
    const data = req.body;
    const result = await PromoService.getInstance().createPromo(data);
    res.json(result);
  }

  buildRouter(): express.Router {
    const router = express.Router(); // création d'un nouveau routeur
    router.get("/", this.searchPromo.bind(this));
    router.get("/:id", this.getPromoById.bind(this));
    router.post("/", this.createPromo.bind(this));
    return router;
  }
}
