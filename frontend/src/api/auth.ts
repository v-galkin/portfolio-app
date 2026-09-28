import client from "./client";

export interface Auth {
    username: string;
}

/**
 * Logs in once:
 * - the backend sets an HttpOnly session cookie
 * - the password is never stored
 */
export const login = (username: string, password: string) =>
    client
        .post<Auth>("/auth/login", null, {
            headers: { Authorization: "Basic " + btoa(`${username}:${password}`) },
        })
        .then((res) => res.data);

/** Who is logged in, to restore the login after a page refresh; null when not logged in. */
export const getCurrentUser = () =>
    client.get<Auth>("/auth/me").then((res) => (res.status === 200 ? res.data : null));

export const logout = () => client.post("/auth/logout");
