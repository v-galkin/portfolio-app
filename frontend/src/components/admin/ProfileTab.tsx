import { useEffect, useState, type FormEvent } from "react";
import type { Profile } from "../../types";
import { loadProfile, saveProfile } from "../../api/profile";
import { toApiError, type ApiError } from "../../api/errors";
import { trimStrings } from "../../hooks/useCrud";
import Button from "../ui/Button";
import { Field, Input, Textarea } from "../ui/Form";
import ErrorBox from "./ErrorBox";

const empty = { name: "", headline: "", bio: "", githubUrl: "", linkedinUrl: "", email: "" };
type Form = typeof empty;

/** The single site profile shown in About, Contact and the footer. */
export default function ProfileTab({ onUnauthorized }: { onUnauthorized: () => void }) {
    const [form, setForm] = useState<Form>(empty);
    const [loaded, setLoaded] = useState(false);
    const [loadError, setLoadError] = useState<ApiError | null>(null);
    const [saveError, setSaveError] = useState<ApiError | null>(null);
    const [saved, setSaved] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        loadProfile()
            .then((p) => {
                // Nulls from the API become "" so inputs stay controlled
                setForm(Object.fromEntries(Object.keys(empty).map((k) => [k, p[k as keyof Profile] ?? ""])) as Form);
                setLoaded(true);
            })
            .catch((err) => setLoadError(toApiError(err)));
    }, []);

    const set = (key: keyof Form, value: string) => {
        setSaved(false);
        setForm((f) => ({ ...f, [key]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setBusy(true);
        setSaveError(null);
        setSaved(false);
        try {
            // Empty optional fields are stored as null, so the site hides them
            const trimmed = trimStrings(form);
            const toSave = Object.fromEntries(
                Object.entries(trimmed).map(([k, v]) => [k, k !== "name" && v === "" ? null : v]),
            ) as unknown as Profile;
            await saveProfile(toSave);
            setForm((f) => trimStrings(f));
            setSaved(true);
        } catch (err) {
            const error = toApiError(err);
            if (error.status === 401) onUnauthorized();
            setSaveError(error);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-white">Profile</h2>
            </div>

            {loadError && <div className="mb-6"><ErrorBox error={loadError} /></div>}

            {loaded && (
                <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-4 max-w-2xl">
                    <p className="text-slate-400 text-sm">
                        Shown in the About and Contact sections and the footer. Empty links are hidden on the site.
                    </p>
                    <ErrorBox error={saveError} />
                    <Field label="Name">
                        <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
                    </Field>
                    <Field label="Headline">
                        <Input value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Engineer transitioning into Software & Automation" />
                    </Field>
                    <Field label="Bio">
                        <Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={5} />
                    </Field>
                    <Field label="GitHub URL">
                        <Input type="url" value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/…" />
                    </Field>
                    <Field label="LinkedIn URL">
                        <Input type="url" value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} placeholder="https://www.linkedin.com/in/…" />
                    </Field>
                    <Field label="Contact email (optional, shown publicly)">
                        <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                    </Field>
                    <div className="flex items-center gap-3 mt-2">
                        <Button type="submit" disabled={busy}>Save Profile</Button>
                        {saved && <p role="status" className="text-emerald-400 text-sm">Profile saved.</p>}
                    </div>
                </form>
            )}
        </div>
    );
}
