import { useEffect, useState } from "react";
import type { Auth } from "../../Admin";
import type { Certification } from "../../types";
import { getCertifications } from "../../api/client";
import { createCertification, updateCertification, deleteCertification } from "../../api/admin";
import { textStyles, buttonStyles, tableStyles, modalStyles, formStyles } from "../../styles";

interface Props { auth: Auth; }

const empty = { name: "", issuer: "", date: "", credentialUrl: "" };

export default function CertificationsTab({ auth }: Props) {
    const [items, setItems] = useState<Certification[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Certification | null>(null);
    const [form, setForm] = useState(empty);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const load = async () => { const res = await getCertifications(); setItems(res.data); };
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditItem(null); setForm(empty); setShowModal(true); };
    const openEdit = (item: Certification) => { setEditItem(item); setForm({ ...item }); setShowModal(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editItem) { await updateCertification(auth, editItem.id, form); } else { await createCertification(auth, form); }
        setShowModal(false); load();
    };

    const handleDelete = async () => {
        if (deleteId === null) return;
        await deleteCertification(auth, deleteId); setDeleteId(null); load();
    };

    return (
        <div>
            {/* HEADER START */}
            <div className="flex justify-between items-center mb-6">
                <h2 className={textStyles.h2}>Certifications</h2>
                <button onClick={openAdd} className={buttonStyles.primary}>+ Add Certification</button>
            </div>
            {/* HEADER END */}

            {/* TABLE START */}
            <div className="border border-slate-700 rounded-xl overflow-hidden">
                <table className={tableStyles.table}>
                    <thead className={tableStyles.thead}>
                    <tr>
                        <th className={tableStyles.th}>Name</th>
                        <th className={tableStyles.th}>Issuer</th>
                        <th className={tableStyles.th}>Date</th>
                        <th className={tableStyles.th}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className={tableStyles.tr}>
                            <td className="px-4 py-3 text-white text-sm">{item.name}</td>
                            <td className={tableStyles.td}>{item.issuer}</td>
                            <td className={tableStyles.td}>{item.date}</td>
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
                            <h3 className={modalStyles.title}>{editItem ? "Edit Certification" : "Add Certification"}</h3>
                            <button onClick={() => setShowModal(false)} className={modalStyles.closeBtn}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className={modalStyles.body}>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Name</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Issuer</label>
                                <input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Date</label>
                                <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Jan 2025" className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Credential URL</label>
                                <input value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} className={formStyles.input} />
                            </div>
                            <div className={modalStyles.footer}>
                                <button type="submit" className={buttonStyles.primary}>{editItem ? "Save Changes" : "Add Certification"}</button>
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
                        <h3 className={`${textStyles.h3} mb-2`}>Delete Certification</h3>
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