import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import {
  createSkill,
  listSkills,
  editSkill,
  removeSkill,
} from "../controllers/skill.controller";

const router = Router();

router.use(authenticate, authorize("STUDENT"));

router.post("/", createSkill);
router.get("/", listSkills);
router.patch("/:id", editSkill);
router.delete("/:id", removeSkill);

export default router;
