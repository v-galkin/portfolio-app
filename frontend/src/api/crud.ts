import client from "./client";
import type { CrudApi } from "../hooks/useCrud";

/** Typed list/create/update/delete calls for one REST resource, e.g. crudApi<Skill>("/skills"). */
export function crudApi<Item extends { id: number }>(path: string): CrudApi<Item, Omit<Item, "id">> {
    return {
        list: () => client.get<Item[]>(path),
        create: (data) => client.post<Item>(path, data),
        update: (id, data) => client.put<Item>(`${path}/${id}`, data),
        remove: (id) => client.delete(`${path}/${id}`),
    };
}
