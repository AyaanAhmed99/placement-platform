import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import {
  create,
  mine,
  listPublic,
  getOne,
  edit,
  remove,
  pending,
  approve,
} from "../controllers/job.controller";

const router = Router();

router.use(authenticate);

router.post("/", authorize("RECRUITER"), create);
router.get("/mine", authorize("RECRUITER"), mine);
router.patch("/:id", authorize("RECRUITER"), edit);
router.delete("/:id", authorize("RECRUITER"), remove);

router.get("/pending", authorize("ADMIN"), pending);
router.patch("/:id/approve", authorize("ADMIN"), approve);

router.get("/", listPublic);
router.get("/:id", getOne);

export default router;
