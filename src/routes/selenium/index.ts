import { authentication } from "../../apps/auth/authUtils";

import SeleniumController from "../../apps/controller/selenium.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/post-to-group-facebook", asyncHandler(SeleniumController.postToGroupFacebook));

router.post("/post-fan-page-to-group-facebook", asyncHandler(SeleniumController.postFanPageToGroupFacebook));
router.post("/post-get-id-group", asyncHandler(SeleniumController.postToGetIdGroup));

export default router;
