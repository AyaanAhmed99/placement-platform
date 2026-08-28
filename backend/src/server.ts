import "./config/env";

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import educationRoutes from "./routes/education.routes";
import skillRoutes from "./routes/skill.routes";
import projectRoutes from "./routes/project.routes";
import resumeRoutes from "./routes/resume.routes";
import companyRoutes from "./routes/company.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";
import adminRoutes from "./routes/admin.routes";
import studentRoutes from "./routes/student.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Placement Platform API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
