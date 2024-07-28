import { authentication } from "../../apps/auth/authUtils";

import SeleniumController from "../../apps/controller/selenium.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/selenium", asyncHandler(SeleniumController.getSelenium));

export default router;
