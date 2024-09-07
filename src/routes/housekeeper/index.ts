import { authentication } from "../../apps/auth/authUtils";
import HouseKeeperController from "../../apps/controller/housekeeper.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/create-housekeeper", authentication, asyncHandler(HouseKeeperController.createHouseKeeper));

export default router;
