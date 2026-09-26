import { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
import { toApiError, type ApiError } from "../api/errors";

/** The API calls one admin tab needs. Define it at module level so it keeps the same identity. */
export interface CrudApi<T, D> {
    list: () => Promise<AxiosResponse<T[]>>;
    create: (data: D) => Promise<unknown>;
    update: (id: number, data: D) => Promise<unknown>;
    remove: (id: number) => Promise<unknown>;
}

/**
 * Trims text fields and the strings inside list fields (dropping empty ones) before saving,
 * so "  Backend " is saved as "Backend" and "   " counts as empty (the backend rejects it
 * with a "must not be blank" message instead of storing spaces).
 */
export function trimStrings<D>(data: D): D {
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
    ) as D;
}

/**
 * Loads, saves and deletes items for an admin tab, and keeps track of errors so they
 * can be shown instead of failing silently. A 401 calls onUnauthorized (log out).
 */
export function useCrud<T, D>(api: CrudApi<T, D>, onUnauthorized: () => void) {
    const [items, setItems] = useState<T[]>([]);
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
    const save = async (id: number | null, data: D): Promise<boolean> => {
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
