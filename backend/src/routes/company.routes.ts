import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import {
  create,
  mine,
  listAll,
  approve,
} from "../controllers/company.controller";

const router = Router();

router.use(authenticate);

router.post("/", authorize("RECRUITER"), create);
router.get("/mine", authorize("RECRUITER"), mine);
router.get("/", authorize("ADMIN"), listAll);
router.patch("/:id/approve", authorize("ADMIN"), approve);

export default router;
