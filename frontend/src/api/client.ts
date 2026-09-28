import axios from "axios";

/** The one axios instance for the backend. */
const client = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default client;
