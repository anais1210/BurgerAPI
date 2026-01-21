import {
  SessionDocument,
  SessionModel,
  UserDocument,
  UserProps,
  UserModel,
} from "../models";
import { ApiErrorCode } from "../api-error-code.enum";
import { SecurityUtils } from "../utils";
import { Types } from "mongoose";
import { RoleService } from "./role.service";

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (AuthService.instance === undefined) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async subscribeUser(
    subcribe: UserSubscribe,
  ): Promise<UserDocument | ApiErrorCode> {
    try {
      const role = await RoleService.getInstance().getByName(subcribe.roleName);
      if (!role) {
        return ApiErrorCode.notFound;
      }
      const hashedPassword = await SecurityUtils.hashPassword(
        subcribe.password,
      );
      const model = new UserModel({
        login: subcribe.login,
        password: hashedPassword,
        role,
      });
      const user = await model.save();
      return user;
    } catch (err) {
      return ApiErrorCode.alreadyExists;
    }
  }

  public async logIn(log: UserLogIn): Promise<SessionDocument | ApiErrorCode> {
    const user = await UserModel.findOne({ login: log.login });
    if (user === null) {
      return ApiErrorCode.notFound;
    }

    const { valid, needsMigration } = await SecurityUtils.verifyPassword(
      log.password,
      user.password,
    );
    if (!valid) {
      return ApiErrorCode.invalidCredentials;
    }

    // Migrate SHA256 hash to bcrypt on successful login
    if (needsMigration) {
      user.password = await SecurityUtils.hashPassword(log.password);
      await user.save();
    }

    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + 86_400_000 * 7);
    const model = new SessionModel({
      user: user._id,
      platform: log.platform,
      expirationDate: expirationDate,
    });
    const session = await model.save();
    user.sessions.push(session._id);
    await user.save();
    return session;
  }

  public async getUserByToken(
    token: string,
  ): Promise<UserProps | ApiErrorCode> {
    if (!Types.ObjectId.isValid(token)) {
      return ApiErrorCode.invalidParameters;
    }
    const session = await SessionModel.findOne({
      _id: token,
      expirationDate: {
        $gte: new Date(),
      },
    }).populate({
      path: "user",
      populate: {
        path: "role",
        populate: {
          path: "parent",
        },
      },
    });
    if (session === null) {
      return ApiErrorCode.notFound;
    }
    return session.user as UserProps;
  }
}

export interface UserSubscribe {
  login: string;
  password: string;
  roleName: string;
}
export interface UserLogIn {
  login: string;
  password: string;
  platform?: string;
}
