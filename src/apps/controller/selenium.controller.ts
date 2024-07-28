import { NextFunction } from "express";
import { SuccessResponse } from "../../core/success.response";
import { RequestCustom } from "../auth/authUtils";
import { autoSelenium } from "../services/selenium/selenium.service";

class SeleniumController {
  public static getSelenium = async (req: RequestCustom, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "autoSelenium",
      metadata: await autoSelenium(),
    }).send(res);
  };
}
export default SeleniumController;
