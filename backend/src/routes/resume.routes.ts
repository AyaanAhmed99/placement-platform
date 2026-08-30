import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { uploadResumeFile } from "../middleware/upload.middleware";
import { upload, getMyResume, remove } from "../controllers/resume.controller";

const router = Router();

router.use(authenticate, authorize("STUDENT"));

router.post("/", uploadResumeFile.single("resume"), upload);
router.get("/", getMyResume);
router.delete("/", remove);

export default router;
