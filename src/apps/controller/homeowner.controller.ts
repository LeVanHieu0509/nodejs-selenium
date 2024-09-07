import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../../core/success.response";
import { createHomeowner } from "../services/homeowner/homeowner.service";

class HomeownerController {
  public static createHomeowner = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Create Product!",
      metadata: await createHomeowner(req.body),
    }).send(res);
  };
}

export default HomeownerController;
