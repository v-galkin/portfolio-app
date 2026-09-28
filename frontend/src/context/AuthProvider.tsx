import { useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, logout, type Auth } from "../api/auth";
import { AuthContext } from "./authContext";

/**
 * Holds who is logged in:
 * - only the username is kept; the login is an HttpOnly session cookie
 * - asks the server on page load, so a refresh keeps you logged in
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuthState] = useState<Auth | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        getCurrentUser()
            .then((user) => setAuthState(user))
            .catch(() => setAuthState(null))
            .finally(() => setChecked(true));
    }, []);

    const setAuth = (newAuth: Auth | null) => {
        if (!newAuth) {
            // End the server session too; ignore errors
            logout().catch(() => {});
        }
        setAuthState(newAuth);
    };

    // Avoid flashing the login form while the session check is in flight
    if (!checked) return null;

    return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
}
