import { useState, type FormEvent, type ReactNode } from "react";
import { useCrud, type CrudApi } from "../../hooks/useCrud";
import Button from "../ui/Button";
import Modal, { ModalFooter, ConfirmDialog } from "../ui/Modal";
import { Field, Input, Textarea, Select } from "../ui/Form";
import Table, { Tr, Td } from "../ui/Table";
import ErrorBox from "./ErrorBox";

type Key<T> = Extract<keyof Omit<T, "id">, string>;

/** One form control in the add/edit modal. */
export type FieldConfig<T> =
    | { type: "text"; name: Key<T>; label: string; required?: boolean; placeholder?: string }
    | { type: "textarea"; name: Key<T>; label: string; rows: number }
    | { type: "select"; name: Key<T>; label: string; options: { value: string; label: string }[] }
    | { type: "checkbox"; name: Key<T>; label: string }
    /** A string[] edited as text: comma separated in an input, or one per line in a textarea. */
    | { type: "list"; name: Key<T>; label: string; separator: "," | "\n"; rows?: number; placeholder?: string }
    /** Two fields side by side. */
    | { type: "row"; fields: FieldConfig<T>[] };

export interface Column<T> {
    header: string;
    render: (item: T) => ReactNode;
    /** The row's main value (white text). */
    primary?: boolean;
}

interface Props<T extends { id: number }> {
    /** Heading, for example "Certifications". */
    title: string;
    /** Used in "+ Add …", "Edit …" and "Delete …", e.g. "Certification". */
    itemName: string;
    api: CrudApi<T, Omit<T, "id">>;
    /** Values for a new item. */
    empty: Omit<T, "id">;
    columns: Column<T>[];
    /** Minimum table width before it scrolls, e.g. "min-w-[500px]". */
    tableMinWidth: string;
    /** Content of the card shown instead of the table on small screens. */
    mobileCard: (item: T) => ReactNode;
    fields: FieldConfig<T>[];
    onUnauthorized: () => void;
}

type Values = Record<string, unknown>;

const flatten = <T,>(fields: FieldConfig<T>[]): Exclude<FieldConfig<T>, { type: "row" }>[] =>
    fields.flatMap((f) => (f.type === "row" ? flatten(f.fields) : [f]));

/** A complete admin tab: list (mobile cards + desktop table), add/edit modal and delete confirmation. */
export default function CrudTab<T extends { id: number }>({
    title, itemName, api, empty, columns, tableMinWidth, mobileCard, fields, onUnauthorized,
}: Props<T>) {
    const { items, loadError, saveError, deleteError, busy, save, remove, clearErrors } = useCrud(api, onUnauthorized);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<T | null>(null);
    const [values, setValues] = useState<Values>({ ...empty });
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const listFields = flatten(fields).filter((f) => f.type === "list");

    const openAdd = () => {
        clearErrors();
        setEditItem(null);
        setValues({ ...empty, ...Object.fromEntries(listFields.map((f) => [f.name, ""])) });
        setShowModal(true);
    };

    const openEdit = (item: T) => {
        clearErrors();
        setEditItem(item);
        const next: Values = {};
        for (const key of Object.keys(empty)) {
            // Nulls from the API become "" so inputs stay controlled
            next[key] = (item as Record<string, unknown>)[key] ?? (empty as Record<string, unknown>)[key];
        }
        for (const f of listFields) {
            const list = ((item as Record<string, unknown>)[f.name] as string[] | null) ?? [];
            next[f.name] = list.join(f.separator === "," ? ", " : "\n");
        }
        setValues(next);
        setShowModal(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const data: Values = { ...values };
        for (const f of listFields) {
            data[f.name] = String(values[f.name] ?? "").split(f.separator).map((v) => v.trim()).filter(Boolean);
        }
        if (await save(editItem?.id ?? null, data as Omit<T, "id">)) setShowModal(false);
    };

    const handleDelete = async () => {
        if (deleteId === null) return;
        if (await remove(deleteId)) setDeleteId(null);
    };

    const set = (name: string, value: unknown) => setValues((v) => ({ ...v, [name]: value }));

    const renderField = (f: FieldConfig<T>, index: number): ReactNode => {
        switch (f.type) {
            case "row":
                return <div key={index} className="grid grid-cols-2 gap-3">{f.fields.map(renderField)}</div>;
            case "checkbox":
                return (
                    <div key={f.name} className="flex items-center gap-2">
                        <input type="checkbox" id={f.name} checked={Boolean(values[f.name])} onChange={(e) => set(f.name, e.target.checked)} className="w-4 h-4" />
                        <label htmlFor={f.name} className="text-slate-400 text-sm font-medium">{f.label}</label>
                    </div>
                );
            case "select":
                return (
                    <Field key={f.name} label={f.label}>
                        <Select value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)}>
                            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </Select>
                    </Field>
                );
            case "textarea":
                return (
                    <Field key={f.name} label={f.label}>
                        <Textarea value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} rows={f.rows} />
                    </Field>
                );
            case "list":
                return (
                    <Field key={f.name} label={f.label}>
                        {f.rows
                            ? <Textarea value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} rows={f.rows} />
                            : <Input value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} />}
                    </Field>
                );
            case "text":
                return (
                    <Field key={f.name} label={f.label}>
                        <Input value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} required={f.required} placeholder={f.placeholder} />
                    </Field>
                );
        }
    };

    const rowButtons = (item: T) => (
        <>
            <Button size="sm" onClick={() => openEdit(item)}>Edit</Button>
            <Button size="sm" variant="danger" onClick={() => { clearErrors(); setDeleteId(item.id); }}>Delete</Button>
        </>
    );

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <Button onClick={openAdd}>+ Add {itemName}</Button>
            </div>

            {loadError && <div className="mb-6"><ErrorBox error={loadError} /></div>}

            <div className="flex flex-col gap-3 sm:hidden">
                {items.map((item) => (
                    <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-2">
                        {mobileCard(item)}
                        <div className="flex gap-2 mt-1">{rowButtons(item)}</div>
                    </div>
                ))}
            </div>

            <Table headers={[...columns.map((c) => c.header), "Actions"]} minWidth={tableMinWidth}>
                {items.map((item) => (
                    <Tr key={item.id}>
                        {columns.map((c) => (
                            <Td key={c.header} variant={c.primary ? "primary" : "default"}>{c.render(item)}</Td>
                        ))}
                        <Td variant="actions">{rowButtons(item)}</Td>
                    </Tr>
                ))}
            </Table>

            {showModal && (
                <Modal title={`${editItem ? "Edit" : "Add"} ${itemName}`} onClose={() => setShowModal(false)} onSubmit={handleSubmit}>
                    <ErrorBox error={saveError} />
                    {fields.map(renderField)}
                    <ModalFooter>
                        <Button type="submit" disabled={busy}>{editItem ? "Save Changes" : `Add ${itemName}`}</Button>
                    </ModalFooter>
                </Modal>
            )}

            {deleteId !== null && (
                <ConfirmDialog
                    title={`Delete ${itemName}`}
                    message="Are you sure? This cannot be undone."
                    confirmLabel="Delete"
                    onCancel={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                    busy={busy}
                >
                    {deleteError && <div className="mb-4"><ErrorBox error={deleteError} /></div>}
                </ConfirmDialog>
            )}
        </div>
    );
}
