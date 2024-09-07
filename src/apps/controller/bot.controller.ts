import { NextFunction } from "express";

import { SuccessResponse } from "../../core/success.response";
import { getBotTelegramHomeowner, getBotTelegramHousekeeper } from "../services/bot/bot.service";

class BotTelegramController {
  public static getBotTelegramHomeowner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new SuccessResponse({
        message: "getBotTelegram",
        statusCode: 200,
        metadata: await getBotTelegramHomeowner(req.body as any),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  public static getBotTelegramHousekeeper = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new SuccessResponse({
        message: "getBotTelegram",
        statusCode: 200,
        metadata: await getBotTelegramHousekeeper(req.body as any),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

export default BotTelegramController;
