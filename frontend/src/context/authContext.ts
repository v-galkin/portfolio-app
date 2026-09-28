import { createContext } from "react";
import type { Auth } from "../api/auth";

export interface AuthContextValue {
    auth: Auth | null;
    /** Set after login; pass null to log out, which also ends the server session. */
    setAuth: (auth: Auth | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
