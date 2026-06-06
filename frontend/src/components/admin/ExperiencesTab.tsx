import { useEffect, useState } from "react";
import type { Auth } from "../../Admin";
import type { Experience } from "../../types";
import { getExperiences } from "../../api/client";
import { createExperience, updateExperience, deleteExperience } from "../../api/admin";
import { textStyles, buttonStyles, tableStyles, modalStyles, formStyles } from "../../styles";

interface Props { auth: Auth; }

const empty = { company: "", role: "", startDate: "", endDate: "", location: "", responsibilities: [] as string[] };

export default function ExperiencesTab({ auth }: Props) {
    const [items, setItems] = useState<Experience[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Experience | null>(null);
    const [form, setForm] = useState(empty);
    const [respInput, setRespInput] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const load = async () => { const res = await getExperiences(); setItems(res.data); };
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditItem(null); setForm(empty); setRespInput(""); setShowModal(true); };
    const openEdit = (item: Experience) => { setEditItem(item); setForm({ ...item }); setRespInput(item.responsibilities.join("\n")); setShowModal(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...form, responsibilities: respInput.split("\n").map((r) => r.trim()).filter(Boolean) };
        if (editItem) { await updateExperience(auth, editItem.id, data); } else { await createExperience(auth, data); }
        setShowModal(false); load();
    };

    const handleDelete = async () => {
        if (deleteId === null) return;
        await deleteExperience(auth, deleteId); setDeleteId(null); load();
    };

    return (
        <div>
            {/* HEADER START */}
            <div className="flex justify-between items-center mb-6">
                <h2 className={textStyles.h2}>Experiences</h2>
                <button onClick={openAdd} className={buttonStyles.primary}>+ Add Experience</button>
            </div>
            {/* HEADER END */}

            {/* TABLE START */}
            <div className="border border-slate-700 rounded-xl overflow-hidden">
                <table className={tableStyles.table}>
                    <thead className={tableStyles.thead}>
                    <tr>
                        <th className={tableStyles.th}>Role</th>
                        <th className={tableStyles.th}>Company</th>
                        <th className={tableStyles.th}>Period</th>
                        <th className={tableStyles.th}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className={tableStyles.tr}>
                            <td className="px-4 py-3 text-white text-sm">{item.role}</td>
                            <td className={tableStyles.td}>{item.company}</td>
                            <td className={tableStyles.td}>{item.startDate} - {item.endDate}</td>
                            <td className="px-4 py-3 flex gap-2">
                                <button onClick={() => openEdit(item)} className={`${buttonStyles.sm} ${buttonStyles.primary}`}>Edit</button>
                                <button onClick={() => setDeleteId(item.id)} className={`${buttonStyles.sm} ${buttonStyles.danger}`}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* TABLE END */}

            {/* ADD/EDIT MODAL START */}
            {showModal && (
                <div className={modalStyles.overlay}>
                    <div className={modalStyles.modal}>
                        <div className={modalStyles.header}>
                            <h3 className={modalStyles.title}>{editItem ? "Edit Experience" : "Add Experience"}</h3>
                            <button onClick={() => setShowModal(false)} className={modalStyles.closeBtn}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className={modalStyles.body}>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Role</label>
                                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Company</label>
                                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required className={formStyles.input} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className={formStyles.group}>
                                    <label className={formStyles.label}>Start Date</label>
                                    <input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className={formStyles.input} />
                                </div>
                                <div className={formStyles.group}>
                                    <label className={formStyles.label}>End Date</label>
                                    <input value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="Present" className={formStyles.input} />
                                </div>
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Location</label>
                                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Responsibilities (one per line)</label>
                                <textarea value={respInput} onChange={(e) => setRespInput(e.target.value)} rows={5} className={formStyles.textarea} />
                            </div>
                            <div className={modalStyles.footer}>
                                <button type="submit" className={buttonStyles.primary}>{editItem ? "Save Changes" : "Add Experience"}</button>
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
                        <h3 className={`${textStyles.h3} mb-2`}>Delete Experience</h3>
                        <p className={`${textStyles.muted} text-sm mb-6`}>Are you sure? This cannot be undone.</p>
                        <div className={modalStyles.footer}>
                            <button onClick={() => setDeleteId(null)} className={`flex-1 ${buttonStyles.secondary}`}>Cancel</button>
                            <button onClick={handleDelete} className={`flex-1 ${buttonStyles.danger}`}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            {/* DELETE MODAL END */}
        </div>
    );
}