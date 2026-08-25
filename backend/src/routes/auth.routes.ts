import { Router } from "express";
import { register } from "../controllers/auth.controller";
import { login } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { refresh } from "../controllers/auth.controller";
import { authorize } from "../middleware/authorize.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, (req, res) => {
  res.json({ success: true, data: req.user });
});

router.post("/refresh", refresh);

router.get("/admin-only", authenticate, authorize("ADMIN"), (req, res) => {
  res.json({ success: true, message: "Welcome, admin", user: req.user });
});

router.get(
  "/recruiter-or-admin",
  authenticate,
  authorize("RECRUITER", "ADMIN"),
  (req, res) => {
    res.json({ success: true, message: "Welcome", user: req.user });
  },
);

export default router;
