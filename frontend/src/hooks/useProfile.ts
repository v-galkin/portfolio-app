import { useEffect, useState } from "react";
import { loadProfile } from "../api/profile";
import type { Profile } from "../types";

/** The site profile, or null while loading (or if it couldn't be loaded). */
export function useProfile(): Profile | null {
    const [profile, setProfile] = useState<Profile | null>(null);
    useEffect(() => {
        loadProfile().then(setProfile).catch(() => setProfile(null));
    }, []);
    return profile;
}
