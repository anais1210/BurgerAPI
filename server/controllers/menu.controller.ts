import * as express from "express";
import { MenuService } from "../services";
import { ApiErrorCode } from "../api-error-code.enum";
import { checkUserAccess } from "../middlewares/role.middleware";
import { checkUserConnected } from "../middlewares";
import { MenuModel } from "../models";
import { validate, ValidationError } from "../utils/validation.utils";

/**
 * Chaque controlleur aura son propre routeur à construire
 */

export class MenuController {
  // -- DESIGN PATTERN SINGLETON
  //Permet d'avoir une seule instance d'une classe au maximum
  private static instance: MenuController;

  public static getInstance(): MenuController {
    if (MenuController.instance === undefined) {
      MenuController.instance = new MenuController();
    }
    return MenuController.instance;
  }

  private constructor() {}
  // -------

  async getAllMenus(req: express.Request, res: express.Response) {
    const result = await MenuService.getInstance().getAllMenus();
    if (result === null) {
      return res.status(404).end();
    }

    res.json(result);
  }

  async getMenuById(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await MenuService.getInstance().getMenuById(id);
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    res.json(result);
  }

  async getMenuIdByName(req: express.Request, res: express.Response) {
    const name = req.params.name;
    const result = await MenuService.getInstance().getMenuByName(name);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.json(result);
  }

  async getMenuPrices(ids?: string[]): Promise<number> {
    if (!ids || ids.length === 0) return 0;

    // récupérer tous les burgers correspondants
    const menus = await MenuModel.find({ _id: { $in: ids } }).select("price");

    // sommer les prix
    const total = menus.reduce((sum, b) => sum + (b.price || 0), 0);
    return total;
  }

  async createMenu(req: express.Request, res: express.Response) {
    try {
      const data = req.body;
      validate.required(data.name, "name");
      validate.string(data.name, "name");
      validate.required(data.burger, "burger");
      validate.objectId(data.burger, "burger");
      validate.required(data.price, "price");
      validate.number(data.price, "price", { min: 0 });

      const result = await MenuService.getInstance().createMenu(data);
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

  async deleteMenu(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await MenuService.getInstance().deleteMenu(id);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.status(204).end();
  }

  async updateMenu(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const data = req.body;
    const result = await MenuService.getInstance().updateMenu(id, data);
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
    // router.get("/", this.searchMenu.bind(this));
    router.get("/:id", this.getMenuById.bind(this));
    router.get("/", this.getAllMenus.bind(this));
    router.get("/id/:name", this.getMenuIdByName.bind(this));
    router.post("/", this.createMenu.bind(this));
    router.delete(
      "/:id",
      checkUserConnected(),
      checkUserAccess(["menu-delete"]),
      this.deleteMenu.bind(this)
    );
    router.patch(
      "/:id",
      checkUserConnected(),
      checkUserAccess(["menu-update"]),
      this.updateMenu.bind(this)
    );
    return router;
  }
}
