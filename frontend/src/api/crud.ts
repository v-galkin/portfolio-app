import client from "./client";
import type { CrudApi } from "../hooks/useCrud";

/**
 * Typed list/create/update/delete calls for one REST resource, e.g. crudApi<Skill>("/skills").
 * Admin writes are authorized by the session cookie, which the browser sends automatically.
 */
export function crudApi<T extends { id: number }>(path: string): CrudApi<T, Omit<T, "id">> {
    return {
        list: () => client.get<T[]>(path),
        create: (data) => client.post<T>(path, data),
        update: (id, data) => client.put<T>(`${path}/${id}`, data),
        remove: (id) => client.delete(`${path}/${id}`),
    };
}
