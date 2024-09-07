import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../../core/success.response";
import { createHousekeeper } from "../services/housekeeper/housekeeper";

class HouseKeeperController {
  public static createHouseKeeper = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Create Product!",
      metadata: await createHousekeeper(req.body),
    }).send(res);
  };
}

export default HouseKeeperController;
