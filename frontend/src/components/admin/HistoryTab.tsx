import { useEffect, useState } from "react";
import type { Auth } from "../../pages/Admin.tsx";
import type { HistoryEntry } from "../../types";
import { getHistory } from "../../api/client";
import { createHistoryEntry, updateHistoryEntry, deleteHistoryEntry } from "../../api/admin";
import { textStyles, buttonStyles, tableStyles, modalStyles, formStyles } from "../../styles";

interface Props { auth: Auth; }

const CATEGORIES = ["Infrastructure", "Feature", "Bugfix", "Removal", "Migration", "Other"];
const empty = { date: "", title: "", description: "", category: "Infrastructure" };

export default function HistoryTab({ auth }: Props) {
    const [items, setItems] = useState<HistoryEntry[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<HistoryEntry | null>(null);
    const [form, setForm] = useState(empty);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const load = () => {
        getHistory().then((res) => setItems(res.data));
    };

    useEffect(() => {
        load();
    }, []);

    const openAdd = () => { setEditItem(null); setForm(empty); setShowModal(true); };
    const openEdit = (item: HistoryEntry) => { setEditItem(item); setForm({ ...item }); setShowModal(true); };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editItem) {
            await updateHistoryEntry(auth, editItem.id, form);
        } else {
            await createHistoryEntry(auth, form);
        }
        setShowModal(false);
        load();
    };

    const handleDelete = async () => {
        if (deleteId === null) return;
        await deleteHistoryEntry(auth, deleteId);
        setDeleteId(null);
        load();
    };

    return (
        <div>
            {/* HEADER START */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h2 className={textStyles.h2}>Changelog</h2>
                <button onClick={openAdd} className={buttonStyles.primary}>+ Add Entry</button>
            </div>
            {/* HEADER END */}

            {/* MOBILE CARDS START */}
            <div className="flex flex-col gap-3 sm:hidden">
                {items.map((item) => (
                    <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-2">
                            <p className="text-white text-sm font-medium">{item.title}</p>
                            <p className="text-slate-400 text-xs shrink-0">{item.date}</p>
                        </div>
                        <p className="text-slate-400 text-xs">{item.category}</p>
                        {item.description && <p className="text-slate-500 text-xs">{item.description}</p>}
                        <div className="flex gap-2 mt-1">
                            <button onClick={() => openEdit(item)} className={`${buttonStyles.sm} ${buttonStyles.primary}`}>Edit</button>
                            <button onClick={() => setDeleteId(item.id)} className={`${buttonStyles.sm} ${buttonStyles.danger}`}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {/* MOBILE CARDS END */}

            {/* DESKTOP TABLE START */}
            <div className="hidden sm:block border border-slate-700 rounded-xl overflow-hidden">
                <table className={`${tableStyles.table} min-w-[600px]`}>
                    <thead className={tableStyles.thead}>
                    <tr>
                        <th className={tableStyles.th}>Date</th>
                        <th className={tableStyles.th}>Title</th>
                        <th className={tableStyles.th}>Category</th>
                        <th className={tableStyles.th}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className={tableStyles.tr}>
                            <td className={tableStyles.td}>{item.date}</td>
                            <td className="px-4 py-3 text-white text-sm">{item.title}</td>
                            <td className={tableStyles.td}>{item.category}</td>
                            <td className="px-4 py-3 flex gap-2">
                                <button onClick={() => openEdit(item)} className={`${buttonStyles.sm} ${buttonStyles.primary}`}>Edit</button>
                                <button onClick={() => setDeleteId(item.id)} className={`${buttonStyles.sm} ${buttonStyles.danger}`}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* DESKTOP TABLE END */}

            {/* ADD/EDIT MODAL START */}
            {showModal && (
                <div className={modalStyles.overlay}>
                    <div className={modalStyles.modal}>
                        <div className={modalStyles.header}>
                            <h3 className={modalStyles.title}>{editItem ? "Edit Entry" : "Add Entry"}</h3>
                            <button onClick={() => setShowModal(false)} className={modalStyles.closeBtn}>&times;</button>
                        </div>
                        <form onSubmit={(e) => { void handleSubmit(e); }} className={modalStyles.body}>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Date</label>
                                <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required placeholder="2025-06" className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Title</label>
                                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Initial Deployment" className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={formStyles.input}>
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Description (optional)</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={formStyles.textarea} />
                            </div>
                            <div className={modalStyles.footer}>
                                <button type="submit" className={buttonStyles.primary}>{editItem ? "Save Changes" : "Add Entry"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ADD/EDIT MODAL END */}

            {/* DELETE MODAL START */}
            {deleteId !== null && (
                <div className={modalStyles.overlay}>
                    <div className={modalStyles.modalSm}>
                        <h3 className={`${textStyles.h3} mb-2`}>Delete Entry</h3>
                        <p className={`${textStyles.muted} text-sm mb-6`}>Are you sure? This cannot be undone.</p>
                        <div className={modalStyles.footer}>
                            <button onClick={() => setDeleteId(null)} className={`flex-1 ${buttonStyles.secondary}`}>Cancel</button>
                            <button onClick={() => { void handleDelete(); }} className={`flex-1 ${buttonStyles.danger}`}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            {/* DELETE MODAL END */}
        </div>
    );
}