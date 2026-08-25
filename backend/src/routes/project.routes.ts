import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import {
  createProject,
  listProjects,
  editProject,
  removeProject,
} from "../controllers/project.controller";

const router = Router();

router.use(authenticate, authorize("STUDENT"));

router.post("/", createProject);
router.get("/", listProjects);
router.patch("/:id", editProject);
router.delete("/:id", removeProject);

export default router;
