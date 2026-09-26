import { fieldLabel, type ApiError } from "../../api/errors";

/** Shows an API error, including per-field validation messages. Renders nothing when there's no error. */
export default function ErrorBox({ error }: { error: ApiError | null }) {
    if (!error) return null;

    const fields = Object.entries(error.fields ?? {});

    return (
        <div role="alert" className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
            <p>{error.message}</p>
            {fields.length > 0 && (
                <ul className="list-disc list-inside mt-1">
                    {fields.map(([field, message]) => (
                        <li key={field}>{fieldLabel(field)} {message}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
