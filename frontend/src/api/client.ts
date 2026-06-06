import axios from "axios";

const client = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getProjects = () => client.get("/projects");
export const getExperiences = () => client.get("/experiences");
export const getEducations = () => client.get("/educations");
export const getCertifications = () => client.get("/certifications");
export const getSkills = () => client.get("/skills");

export default client;
