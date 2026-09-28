import { crudApi } from "./crud";
import type { Certification, Education, Experience, HistoryEntry, Project, Skill } from "../types";

// API calls per resource:
// - one line per backend resource, built with crudApi
// - shared by the public sections and the admin tabs
export const projectsApi = crudApi<Project>("/projects");
export const experiencesApi = crudApi<Experience>("/experiences");
export const educationsApi = crudApi<Education>("/educations");
export const skillsApi = crudApi<Skill>("/skills");
export const certificationsApi = crudApi<Certification>("/certifications");
export const historyApi = crudApi<HistoryEntry>("/history");
