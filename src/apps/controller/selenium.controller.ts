import { NextFunction } from "express";
import { SuccessResponse } from "../../core/success.response";
import { RequestCustom } from "../auth/authUtils";
import {
  postFanPageToGroupFacebook,
  postToGetIdGroup,
  postToGroupFacebook,
  TaskData,
} from "../services/selenium/selenium.service";

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

  public static postToGetIdGroup = async (req: RequestCustom, res: Response, next: NextFunction) => {
    let body: TaskData = req.body as any;
    new SuccessResponse({
      message: "autoSelenium",
      metadata: await postToGetIdGroup(body),
    }).send(res);
  };
}
export default SeleniumController;

// 480676039604546
// cudanopalgardenthuduc
// cudanchungcusaigonintela
// khudancuhanhphuc
// d1mensionzenity
// 405981247432642
// hcm0002
// salevinhomes1
// 2258504740844682
// 469864193182841
