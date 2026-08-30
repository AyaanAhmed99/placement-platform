import { useState, useEffect, FormEvent } from "react";
import api from "../api/axios";
import type {
  Education,
  Skill,
  Project,
  Resume,
} from "../types/studentProfile";
import Navbar from "../components/Navbar";

const BRANCHES = [
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
  "CHEMICAL",
  "OTHER",
];

export default function StudentProfile() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="font-display text-2xl font-semibold text-navy">
          My Profile
        </h1>{" "}
        <BacklogsSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <ResumeSection />
      </div>
    </div>
  );
}

function BacklogsSection() {
  const [backlogs, setBacklogs] = useState("0");
  const [saved, setSaved] = useState(false);

  async function save() {
    await api.patch("/students/me", { backlogs: Number(backlogs) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy">
      <h2 className="font-display text-lg font-semibold text-navy mb-3">
        Backlogs
      </h2>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min="0"
          value={backlogs}
          onChange={(e) => setBacklogs(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-24"
        />
        <button
          onClick={save}
          className="bg-navy text-white px-4 py-2 rounded hover:bg-navy-dark"
        >
          Save
        </button>
        {saved && <span className="text-green-600 text-sm">Saved ✓</span>}
      </div>
    </div>
  );
}

function EducationSection() {
  const [items, setItems] = useState<Education[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "CSE",
    cgpa: "",
    startYear: "",
    endYear: "",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const res = await api.get<{ data: Education[] }>("/education");
    setItems(res.data.data);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await api.post("/education", {
      institution: form.institution,
      degree: form.degree,
      fieldOfStudy: form.fieldOfStudy,
      cgpa: form.cgpa ? Number(form.cgpa) : undefined,
      startYear: Number(form.startYear),
      endYear: form.endYear ? Number(form.endYear) : undefined,
    });
    setShowForm(false);
    setForm({
      institution: "",
      degree: "",
      fieldOfStudy: "CSE",
      cgpa: "",
      startYear: "",
      endYear: "",
    });
    fetchAll();
  }

  async function remove(id: string) {
    await api.delete(`/education/${id}`);
    fetchAll();
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold text-navy">
          Education
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-gold text-navy-dark font-medium px-3 py-1.5 rounded hover:bg-gold-light"
        >
          {showForm ? "Cancel" : "Add"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 mb-4 border-b border-slate-100 pb-4"
        >
          <input
            placeholder="Institution"
            required
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <input
            placeholder="Degree (e.g. B.Tech)"
            required
            value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <select
            value={form.fieldOfStudy}
            onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          >
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder="CGPA"
              value={form.cgpa}
              onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
              className="border border-slate-300 rounded px-3 py-2"
            />
            <input
              placeholder="Start year"
              required
              value={form.startYear}
              onChange={(e) => setForm({ ...form, startYear: e.target.value })}
              className="border border-slate-300 rounded px-3 py-2"
            />
            <input
              placeholder="End year"
              value={form.endYear}
              onChange={(e) => setForm({ ...form, endYear: e.target.value })}
              className="border border-slate-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-navy text-white px-4 py-2 rounded hover:bg-navy-dark"
          >
            Save
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-slate-500 text-sm">No education added yet.</p>
        )}
        {items.map((ed) => (
          <div
            key={ed.id}
            className="flex items-center justify-between border-b border-slate-100 pb-2"
          >
            <div>
              <p className="text-sm font-medium text-slate-700">
                {ed.degree} - {ed.institution}
              </p>
              <p className="text-xs text-slate-400">
                {ed.fieldOfStudy} · CGPA {ed.cgpa ?? "N/A"} · {ed.startYear}-
                {ed.endYear ?? "present"}
              </p>
            </div>
            <button
              onClick={() => remove(ed.id)}
              className="text-xs text-brick hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection() {
  const [items, setItems] = useState<Skill[]>([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">(
    "INTERMEDIATE",
  );

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const res = await api.get<{ data: Skill[] }>("/skills");
    setItems(res.data.data);
  }

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post("/skills", { name, level });
    setName("");
    fetchAll();
  }

  async function remove(id: string) {
    await api.delete(`/skills/${id}`);
    fetchAll();
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy">
      <h2 className="font-display text-lg font-semibold text-navy mb-3">
        Skills
      </h2>
      <form onSubmit={add} className="flex gap-2 mb-4">
        <input
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-slate-300 rounded px-3 py-2"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as any)}
          className="border border-slate-300 rounded px-3 py-2"
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <button
          type="submit"
          className="bg-gold text-navy-dark font-medium px-4 py-2 rounded hover:bg-gold-light"
        >
          Add
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {items.map((s) => (
          <span
            key={s.id}
            className="text-sm bg-gold-light text-navy-dark px-3 py-1 rounded-full flex items-center gap-2"
          >
            {s.name}{" "}
            <span className="text-xs text-slate-400">
              ({s.level.toLowerCase()})
            </span>
            <button
              onClick={() => remove(s.id)}
              className="text-brick hover:text-red-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [items, setItems] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    projectUrl: "",
    githubUrl: "",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const res = await api.get<{ data: Project[] }>("/projects");
    setItems(res.data.data);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/projects", {
        title: form.title,
        description: form.description,
        techStack: form.techStack
          ? form.techStack.split(",").map((s) => s.trim())
          : undefined,
        projectUrl: form.projectUrl || undefined,
        githubUrl: form.githubUrl || undefined,
      });
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        techStack: "",
        projectUrl: "",
        githubUrl: "",
      });
      fetchAll();
    } catch (err: any) {
      setError(
        err.response?.data?.errors?.[0]?.message ??
          "Failed to save project. Check your URL fields are valid links.",
      );
    }
  }

  async function remove(id: string) {
    await api.delete(`/projects/${id}`);
    fetchAll();
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold text-navy">
          Projects
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-gold text-navy-dark font-medium px-3 py-1.5 rounded hover:bg-gold-light"
        >
          {showForm ? "Cancel" : "Add"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 mb-4 border-b border-slate-100 pb-4"
        >
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <input
            placeholder="Project title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <textarea
            placeholder="Description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <input
            placeholder="Tech stack (comma separated)"
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <input
            placeholder="GitHub URL"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-navy text-white px-4 py-2 rounded hover:bg-navy-dark"
          >
            Save
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-slate-500 text-sm">No projects added yet.</p>
        )}
        {items.map((p) => (
          <div
            key={p.id}
            className="flex items-start justify-between border-b border-slate-100 pb-2"
          >
            <div>
              <p className="text-sm font-medium text-slate-700">{p.title}</p>
              <p className="text-xs text-slate-400">{p.techStack.join(", ")}</p>
            </div>
            <button
              onClick={() => remove(p.id)}
              className="text-xs text-brick hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumeSection() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  async function fetchResume() {
    try {
      const res = await api.get<{ data: Resume }>("/resume");
      setResume(res.data.data);
    } catch {
      setResume(null);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);
    try {
      await api.post("/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchResume();
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    const previousResume = resume;
    setResume(null); // update UI immediately, don't wait for the network

    try {
      await api.delete("/resume");
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setResume(previousResume);
        alert("Failed to remove resume. Please try again.");
      }
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy">
      <h2 className="font-display text-lg font-semibold text-navy mb-3">
        Resume
      </h2>
      {resume && (
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => window.open(resume.fileUrl, "_blank")}
            className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-navy file:text-white file:cursor-pointer hover:file:bg-navy-dark"
          >
            {resume.fileName}
          </button>
          <button
            onClick={handleRemove}
            className="text-brick hover:underline text-xs"
          >
            Remove
          </button>
        </div>
      )}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        disabled={uploading}
        className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-navy file:text-white file:cursor-pointer hover:file:bg-blue-700"
      />
      {uploading && <p className="text-xs text-slate-400 mt-1">Uploading...</p>}
    </div>
  );
}
