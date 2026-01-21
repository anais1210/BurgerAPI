import * as express from "express";
import { MealService } from "../services";
import { ApiErrorCode } from "../api-error-code.enum";
import { checkUserAccess } from "../middlewares/role.middleware";
import { checkUserConnected } from "../middlewares";
import { MealModel } from "../models";
import { validate, ValidationError } from "../utils/validation.utils";

/**
 * Chaque controlleur aura son propre routeur à construire
 */

export class MealController {
  // -- DESIGN PATTERN SINGLETON
  //Permet d'avoir une seule instance d'une classe au maximum
  private static instance: MealController;

  public static getInstance(): MealController {
    if (MealController.instance === undefined) {
      MealController.instance = new MealController();
    }
    return MealController.instance;
  }

  private constructor() {}
  // -------

  async getAllMeals(req: express.Request, res: express.Response) {
    const result = await MealService.getInstance().getAllMeals();
    if (result === null) {
      return res.status(404).end();
    }

    res.json(result);
  }

  async getMealById(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await MealService.getInstance().getMealById(id);
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    res.json(result);
  }

  async getMealIdByName(req: express.Request, res: express.Response) {
    const name = req.params.name;
    const result = await MealService.getInstance().getMealByName(name);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.json(result);
  }

  async getMealPrices(ids?: string[]): Promise<number> {
    if (!ids || ids.length === 0) return 0;

    // récupérer tous les burgers correspondants
    const Meals = await MealModel.find({ _id: { $in: ids } }).select("price");

    // sommer les prix
    const total = Meals.reduce((sum, b) => sum + (b.price || 0), 0);
    return total;
  }

  async createMeal(req: express.Request, res: express.Response) {
    try {
      const data = req.body;
      validate.required(data.name, "name");
      validate.string(data.name, "name");
      validate.required(data.slots, "slots");
      validate.array(data.slots, "slots", { min: 1 });
      validate.required(data.price, "price");
      validate.number(data.price, "price", { min: 0 });

      const result = await MealService.getInstance().createMeal(data);
      if (result === ApiErrorCode.invalidParameters) {
        return res.status(400).end();
      }
      if (result === ApiErrorCode.alreadyExists) {
        return res.status(409).end();
      }
      res.json(result);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).end();
    }
  }

  async deleteMeal(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await MealService.getInstance().deleteMeal(id);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.status(204).end();
  }

  async updateMeal(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const data = req.body;
    const result = await MealService.getInstance().updateMeal(id, data);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.json(result);
  }

  buildRouter(): express.Router {
    const router = express.Router(); //création d'un nouveau routeur
    // router.get("/", this.searchMeal.bind(this));
    router.get("/:id", this.getMealById.bind(this));
    router.get("/", this.getAllMeals.bind(this));
    router.get("/id/:name", this.getMealIdByName.bind(this));
    router.post("/", this.createMeal.bind(this));
    router.delete(
      "/:id",
      checkUserConnected(),
      checkUserAccess(["meal-delete"]),
      this.deleteMeal.bind(this),
    );
    router.patch(
      "/:id",
      checkUserConnected(),
      checkUserAccess(["meal-update"]),
      this.updateMeal.bind(this),
    );
    return router;
  }
}
