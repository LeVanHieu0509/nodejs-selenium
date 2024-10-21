import { authentication } from "../../apps/auth/authUtils";
import BotTelegramController from "../../apps/controller/bot.controller";

import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/homeowner", asyncHandler(BotTelegramController.getBotTelegramHomeowner));
router.post("/housekeeper", asyncHandler(BotTelegramController.getBotTelegramHousekeeper));

export default router;
