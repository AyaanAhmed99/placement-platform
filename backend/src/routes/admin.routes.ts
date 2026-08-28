import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { stats } from "../controllers/admin.controller";

const router = Router();

router.use(authenticate, authorize("ADMIN"));
router.get("/stats", stats);

export default router;
