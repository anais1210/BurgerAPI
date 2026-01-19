import { Request, Response, Router } from "express";
import { AuthService } from "../services";
import { ApiErrorCode } from "../api-error-code.enum";
import { SessionProps } from "../models";
import { checkUserConnected } from "../middlewares/auth.middleware";
import { validate, ValidationError } from "../utils/validation.utils";

export class AuthController {
  private static instance: AuthController;

  private constructor() {}

  public static getInstance(): AuthController {
    if (AuthController.instance === undefined) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  async subscribe(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      validate.required(data.login, "login");
      validate.string(data.login, "login", { min: 3, max: 50 });
      validate.required(data.password, "password");
      validate.string(data.password, "password", { min: 6 });
      validate.required(data.firstname, "firstname");
      validate.string(data.firstname, "firstname");
      validate.required(data.lastname, "lastname");
      validate.string(data.lastname, "lastname");

      const result = await AuthService.getInstance().subscribeUser({
        firstname: data.firstname,
        lastname: data.lastname,
        login: data.login,
        password: data.password,
        roleName: data.roleName,
      });
      if (result === ApiErrorCode.alreadyExists) {
        res.status(409).end();
        return;
      }
      if (result === ApiErrorCode.notFound) {
        res.status(404).end();
        return;
      }
      res.json(result);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(500).end();
    }
  }

  async logIn(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      validate.required(data.login, "login");
      validate.string(data.login, "login");
      validate.required(data.password, "password");
      validate.string(data.password, "password");

      const session = await AuthService.getInstance().logIn({
        login: data.login,
        password: data.password,
        platform: req.headers["user-agent"],
      });
      if (session === ApiErrorCode.notFound) {
        res.status(404).end();
        return;
      }
      if (session === ApiErrorCode.invalidCredentials) {
        res.status(401).end();
        return;
      }
      res.json({
        token: (session as SessionProps)._id,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(500).end();
    }
  }
  async meController(req: Request, res: Response): Promise<void> {
    res.json({ user: req.user });
  }

  buildRouter(): Router {
    const router = Router();
    router.post("/subscribe", this.subscribe.bind(this));
    router.post("/login", this.logIn.bind(this));
    router.get("/me", checkUserConnected(), this.meController.bind(this));

    return router;
  }
}
