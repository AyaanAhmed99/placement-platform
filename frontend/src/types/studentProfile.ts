export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  cgpa: number | null;
  startYear: number;
  endYear: number | null;
}

export interface Skill {
  id: string;
  name: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  projectUrl: string | null;
  githubUrl: string | null;
}

export interface Resume {
  fileUrl: string;
  fileName: string;
}
