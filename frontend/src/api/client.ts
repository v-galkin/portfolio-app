import axios from "axios";

/** The one axios instance for the backend. Resources are in resources.ts, auth in auth.ts. */
const client = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default client;
