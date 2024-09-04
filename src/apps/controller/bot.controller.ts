import { NextFunction } from "express";

import { SuccessResponse } from "../../core/success.response";
import { getBotTelegramService } from "../services/bot/bot.service";

class BotTelegramController {
  constructor(parameters) {}
  public static getBotTelegram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new SuccessResponse({
        message: "getBotTelegram",
        statusCode: 200,
        metadata: await getBotTelegramService(req),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

export default BotTelegramController;
