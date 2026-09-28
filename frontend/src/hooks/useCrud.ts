import { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
import { toApiError, type ApiError } from "../api/errors";

/** The API calls one admin tab needs; define it at module level. */
export interface CrudApi<Item, ItemData> {
    list: () => Promise<AxiosResponse<Item[]>>;
    create: (data: ItemData) => Promise<unknown>;
    update: (id: number, data: ItemData) => Promise<unknown>;
    remove: (id: number) => Promise<unknown>;
}

/**
 * Before saving:
 * - trims text fields and list items
 * - drops empty list items
 * - "   " counts as empty, so the backend rejects it as blank
 */
export function trimStrings<Data>(data: Data): Data {
    if (data === null || typeof data !== "object" || Array.isArray(data)) return data;
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            if (typeof value === "string") return [key, value.trim()];
            if (Array.isArray(value)) {
                return [key, value
                    .map((item) => (typeof item === "string" ? item.trim() : item))
                    .filter((item) => item !== "")];
            }
            return [key, value];
        }),
    ) as Data;
}

/**
 * Loads, saves and deletes items for an admin tab:
 * - keeps errors so they can be shown
 * - a 401 calls onUnauthorized to log out
 */
export function useCrud<Item, ItemData>(api: CrudApi<Item, ItemData>, onUnauthorized: () => void) {
    const [items, setItems] = useState<Item[]>([]);
    const [loadError, setLoadError] = useState<ApiError | null>(null);
    const [saveError, setSaveError] = useState<ApiError | null>(null);
    const [deleteError, setDeleteError] = useState<ApiError | null>(null);
    const [busy, setBusy] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        api.list()
            .then((res) => {
                if (!cancelled) {
                    setItems(res.data);
                    setLoadError(null);
                }
            })
            .catch((err) => {
                if (!cancelled) setLoadError(toApiError(err));
            });
        return () => {
            cancelled = true;
        };
    }, [api, reloadKey]);

    const handleError = (err: unknown): ApiError => {
        const error = toApiError(err);
        if (error.status === 401) onUnauthorized();
        return error;
    };

    /** Creates (id === null) or updates an item. Returns true on success. */
    const save = async (id: number | null, data: ItemData): Promise<boolean> => {
        setBusy(true);
        setSaveError(null);
        const trimmed = trimStrings(data);
        try {
            if (id === null) {
                await api.create(trimmed);
            } else {
                await api.update(id, trimmed);
            }
            setReloadKey((k) => k + 1);
            return true;
        } catch (err) {
            setSaveError(handleError(err));
            return false;
        } finally {
            setBusy(false);
        }
    };

    /** Deletes an item. Returns true on success. */
    const remove = async (id: number): Promise<boolean> => {
        setBusy(true);
        setDeleteError(null);
        try {
            await api.remove(id);
            setReloadKey((k) => k + 1);
            return true;
        } catch (err) {
            setDeleteError(handleError(err));
            return false;
        } finally {
            setBusy(false);
        }
    };

    const clearErrors = () => {
        setSaveError(null);
        setDeleteError(null);
    };

    return { items, loadError, saveError, deleteError, busy, save, remove, clearErrors };
}
