import { authentication } from "../../apps/auth/authUtils";
import BotTelegramController from "../../apps/controller/bot.controller";

import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/telegram", authentication, asyncHandler(BotTelegramController.getBotTelegram));

export default router;
