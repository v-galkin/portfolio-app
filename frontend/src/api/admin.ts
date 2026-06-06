import axios from "axios";
import type { Project, Experience, Education, Skill, Certification } from "../types";

const adminClient = (username: string, password: string) =>
    axios.create({
        baseURL: "/api",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`${username}:${password}`),
        },
    });

// PROJECTS
export const createProject = (auth: { username: string; password: string }, data: Omit<Project, "id">) =>
    adminClient(auth.username, auth.password).post("/projects", data);

export const updateProject = (auth: { username: string; password: string }, id: number, data: Omit<Project, "id">) =>
    adminClient(auth.username, auth.password).put(`/projects/${id}`, data);

export const deleteProject = (auth: { username: string; password: string }, id: number) =>
    adminClient(auth.username, auth.password).delete(`/projects/${id}`);

// EXPERIENCES
export const createExperience = (auth: { username: string; password: string }, data: Omit<Experience, "id">) =>
    adminClient(auth.username, auth.password).post("/experiences", data);

export const updateExperience = (auth: { username: string; password: string }, id: number, data: Omit<Experience, "id">) =>
    adminClient(auth.username, auth.password).put(`/experiences/${id}`, data);

export const deleteExperience = (auth: { username: string; password: string }, id: number) =>
    adminClient(auth.username, auth.password).delete(`/experiences/${id}`);

// EDUCATION
export const createEducation = (auth: { username: string; password: string }, data: Omit<Education, "id">) =>
    adminClient(auth.username, auth.password).post("/educations", data);

export const updateEducation = (auth: { username: string; password: string }, id: number, data: Omit<Education, "id">) =>
    adminClient(auth.username, auth.password).put(`/educations/${id}`, data);

export const deleteEducation = (auth: { username: string; password: string }, id: number) =>
    adminClient(auth.username, auth.password).delete(`/educations/${id}`);

// SKILLS
export const createSkill = (auth: { username: string; password: string }, data: Omit<Skill, "id">) =>
    adminClient(auth.username, auth.password).post("/skills", data);

export const updateSkill = (auth: { username: string; password: string }, id: number, data: Omit<Skill, "id">) =>
    adminClient(auth.username, auth.password).put(`/skills/${id}`, data);

export const deleteSkill = (auth: { username: string; password: string }, id: number) =>
    adminClient(auth.username, auth.password).delete(`/skills/${id}`);

// CERTIFICATIONS
export const createCertification = (auth: { username: string; password: string }, data: Omit<Certification, "id">) =>
    adminClient(auth.username, auth.password).post("/certifications", data);

export const updateCertification = (auth: { username: string; password: string }, id: number, data: Omit<Certification, "id">) =>
    adminClient(auth.username, auth.password).put(`/certifications/${id}`, data);

export const deleteCertification = (auth: { username: string; password: string }, id: number) =>
    adminClient(auth.username, auth.password).delete(`/certifications/${id}`);