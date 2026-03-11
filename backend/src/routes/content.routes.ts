import { Router } from "express";
import { createContent, getAllContent, getContentById, updateContent, deleteContent } from "../controller/content.controller";
import { verifyJWT } from "../middleware/auth.middleware";
const router = Router();

router.route("/content").post(verifyJWT, createContent);
router.route("/content").get(verifyJWT, getAllContent);
router.route("/content/:id").get(verifyJWT, getContentById);
router.route("/content/:id").put(verifyJWT, updateContent);
router.route("/content/:id").delete(verifyJWT, deleteContent);

export default router;