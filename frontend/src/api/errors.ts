import axios from "axios";

export interface ApiError {
    status?: number;
    message: string;
    /** Field name → message, from the backend's 400 validation errors. */
    fields?: Record<string, string>;
}

/** Turns anything thrown by an axios call into a message that can be shown to the user. */
export function toApiError(err: unknown): ApiError {
    if (!axios.isAxiosError(err)) {
        return { message: "Something went wrong. Please try again." };
    }
    if (!err.response) {
        return { message: "Could not connect to the server. Please try again." };
    }

    const { status, data } = err.response;
    const body = data as { error?: string; fields?: Record<string, string> } | undefined;

    if (status === 401) {
        return { status, message: "Your session has expired. Please log in again." };
    }
    return {
        status,
        message: body?.error ?? `Request failed (${status}).`,
        fields: body?.fields,
    };
}

/** "startDate" → "Start date" */
export function fieldLabel(field: string): string {
    const words = field.replace(/([A-Z])/g, " $1").toLowerCase();
    return words.charAt(0).toUpperCase() + words.slice(1);
}
