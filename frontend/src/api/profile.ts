import client from "./client";
import type { Profile } from "../types";

// Profile cache:
// - one request shared per page load by About, Contact and the footer
// - saving in the admin panel replaces it
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
