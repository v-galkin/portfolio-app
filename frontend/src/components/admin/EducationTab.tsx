import { useEffect, useState } from "react";
import type { Auth } from "../../pages/Admin.tsx";
import type { Education } from "../../types";
import { getEducations } from "../../api/client";
import { createEducation, updateEducation, deleteEducation } from "../../api/admin";
import { textStyles, buttonStyles, tableStyles, modalStyles, formStyles } from "../../styles";

interface Props { auth: Auth; }

const empty = { institution: "", degree: "", field: "", startDate: "", endDate: "", location: "" };

export default function EducationTab({ auth }: Props) {
    const [items, setItems] = useState<Education[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Education | null>(null);
    const [form, setForm] = useState(empty);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const load = async () => { const res = await getEducations(); setItems(res.data); };
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditItem(null); setForm(empty); setShowModal(true); };
    const openEdit = (item: Education) => { setEditItem(item); setForm({ ...item }); setShowModal(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editItem) { await updateEducation(auth, editItem.id, form); } else { await createEducation(auth, form); }
        setShowModal(false); load();
    };

    const handleDelete = async () => {
        if (deleteId === null) return;
        await deleteEducation(auth, deleteId); setDeleteId(null); load();
    };

    return (
        <div>
            {/* HEADER START */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h2 className={textStyles.h2}>Education</h2>
                <button onClick={openAdd} className={buttonStyles.primary}>+ Add Education</button>
            </div>
            {/* HEADER END */}

            {/* MOBILE CARDS START */}
            <div className="flex flex-col gap-3 sm:hidden">
                {items.map((item) => (
                    <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-2">
                            <p className="text-white text-sm font-medium">{item.institution}</p>
                            <p className="text-slate-400 text-xs shrink-0">{item.startDate} - {item.endDate}</p>
                        </div>
                        <p className="text-slate-400 text-xs">{item.degree} in {item.field}</p>
                        <p className="text-slate-500 text-xs">{item.location}</p>
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
                        <th className={tableStyles.th}>Institution</th>
                        <th className={tableStyles.th}>Degree</th>
                        <th className={tableStyles.th}>Period</th>
                        <th className={tableStyles.th}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className={tableStyles.tr}>
                            <td className="px-4 py-3 text-white text-sm">{item.institution}</td>
                            <td className={tableStyles.td}>{item.degree} in {item.field}</td>
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
            {/* DESKTOP TABLE END */}

            {/* ADD/EDIT MODAL START */}
            {showModal && (
                <div className={modalStyles.overlay}>
                    <div className={modalStyles.modal}>
                        <div className={modalStyles.header}>
                            <h3 className={modalStyles.title}>{editItem ? "Edit Education" : "Add Education"}</h3>
                            <button onClick={() => setShowModal(false)} className={modalStyles.closeBtn}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className={modalStyles.body}>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Institution</label>
                                <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} required className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Degree</label>
                                <input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} required className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Field</label>
                                <input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} required className={formStyles.input} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className={formStyles.group}>
                                    <label className={formStyles.label}>Start Date</label>
                                    <input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={formStyles.input} />
                                </div>
                                <div className={formStyles.group}>
                                    <label className={formStyles.label}>End Date</label>
                                    <input value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={formStyles.input} />
                                </div>
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Location</label>
                                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={formStyles.input} />
                            </div>
                            <div className={modalStyles.footer}>
                                <button type="submit" className={buttonStyles.primary}>{editItem ? "Save Changes" : "Add Education"}</button>
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
                        <h3 className={`${textStyles.h3} mb-2`}>Delete Education</h3>
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