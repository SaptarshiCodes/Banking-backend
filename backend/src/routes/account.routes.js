import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createAccountController } from "../controllers/account.controller.js";


const router = express.Router();

router.use(protectRoute);

router.post("/", createAccountController);


export default router