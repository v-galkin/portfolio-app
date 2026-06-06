import axios from "axios";

const client = axios.create({
    baseURL: "/api/docker",
    headers: {
        "Content-Type": "application/json",
    },
});

const authClient = (username: string, password: string) =>
    axios.create({
        baseURL: "/api/docker",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`${username}:${password}`),
        },
    });

// PUBLIC - running + labelled containers
export const getPublicContainers = () =>
    client.get("/public");

// ADMIN - labelled containers only
export const getDashboardContainers = (username: string, password: string) =>
    authClient(username, password).get("/dashboard");

// ADMIN - all containers
export const getAllContainers = (username: string, password: string) =>
    authClient(username, password).get("/all");

// START A CONTAINER
export const startContainer = (username: string, password: string, id: string) =>
    authClient(username, password).post(`/start/${id}`);

// STOP A CONTAINER
export const stopContainer = (username: string, password: string, id: string) =>
    authClient(username, password).post(`/stop/${id}`);

// EXPORT CONTAINER STATS
export const getContainerStats = (id: string) =>
    client.get(`/stats/${id}`);