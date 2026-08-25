import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import {
  createEducation,
  listEducations,
  editEducation,
  removeEducation,
} from "../controllers/education.controller";

const router = Router();

router.use(authenticate, authorize("STUDENT"));

router.post("/", createEducation);
router.get("/", listEducations);
router.patch("/:id", editEducation);
router.delete("/:id", removeEducation);

export default router;
