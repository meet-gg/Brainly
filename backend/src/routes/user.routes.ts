import { Router } from "express";
import { login, signUp, toggleShare, getSharedContent, refreshAccessToken } from "../controller/user.controller";
import { verifyJWT } from "../middleware/auth.middleware";
const router = Router();

router.route("/auth/signup").post(signUp);
router.route("/auth/login").post(login);
router.route("/auth/refresh").post(refreshAccessToken);
router.route("/share/toggle").post(verifyJWT, toggleShare);
router.route("/share/:shareId").get(getSharedContent);

export default router;