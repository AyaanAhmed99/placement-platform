import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { updateProfile } from "../controllers/student.controller";

const router = Router();
router.patch("/me", authenticate, authorize("STUDENT"), updateProfile);
export default router;
