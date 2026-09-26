import client from "./client";
import type { Profile } from "../types";

// The profile rarely changes and is needed by several components (About, Contact, footer),
// so one request is shared per page load. Saving in the admin panel replaces it.
let cached: Promise<Profile> | null = null;

export function loadProfile(): Promise<Profile> {
    cached ??= client.get<Profile>("/profile").then((res) => res.data);
    cached.catch(() => { cached = null; }); // let a later call retry after a failure
    return cached;
}

export async function saveProfile(profile: Profile): Promise<Profile> {
    const saved = (await client.put<Profile>("/profile", profile)).data;
    cached = Promise.resolve(saved);
    return saved;
}
