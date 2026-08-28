import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import {
  apply,
  mine,
  applicants,
  updateStatus,
} from "../controllers/application.controller";

const router = Router();

router.use(authenticate);

router.post("/", authorize("STUDENT"), apply);
router.get("/mine", authorize("STUDENT"), mine);
router.get("/job/:jobId", authorize("RECRUITER"), applicants);
router.patch("/:id/status", authorize("RECRUITER"), updateStatus);

export default router;
