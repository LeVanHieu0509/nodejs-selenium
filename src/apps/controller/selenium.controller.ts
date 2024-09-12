import { NextFunction } from "express";
import { SuccessResponse } from "../../core/success.response";
import { RequestCustom } from "../auth/authUtils";
import { postFanPageToGroupFacebook, postToGroupFacebook, TaskData } from "../services/selenium/selenium.service";

class SeleniumController {
  public static postToGroupFacebook = async (req: RequestCustom, res: Response, next: NextFunction) => {
    let body: TaskData = req.body as any;
    new SuccessResponse({
      message: "autoSelenium",
      metadata: await postToGroupFacebook(body),
    }).send(res);
  };

  public static postFanPageToGroupFacebook = async (req: RequestCustom, res: Response, next: NextFunction) => {
    let body: TaskData = req.body as any;
    new SuccessResponse({
      message: "autoSelenium",
      metadata: await postFanPageToGroupFacebook(body),
    }).send(res);
  };
}
export default SeleniumController;
