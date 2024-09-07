import { createHomeowner } from "./../../apps/services/homeowner/homeowner.service";
import { authentication } from "../../apps/auth/authUtils";
import HomeownerController from "../../apps/controller/homeowner.controller";
import ProductsController from "../../apps/controller/products.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/create-homeowner", authentication, asyncHandler(HomeownerController.createHomeowner));

export default router;
