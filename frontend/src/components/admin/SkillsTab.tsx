import { useEffect, useState } from "react";
import type { Auth } from "../../Admin";
import type { Skill } from "../../types";
import { getSkills } from "../../api/client";
import { createSkill, updateSkill, deleteSkill } from "../../api/admin";
import { textStyles, buttonStyles, tableStyles, modalStyles, formStyles } from "../../styles";

interface Props { auth: Auth; }

const empty = { category: "", items: [] as string[] };

export default function SkillsTab({ auth }: Props) {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Skill | null>(null);
    const [form, setForm] = useState(empty);
    const [itemsInput, setItemsInput] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const load = async () => { const res = await getSkills(); setSkills(res.data); };
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditItem(null); setForm(empty); setItemsInput(""); setShowModal(true); };
    const openEdit = (item: Skill) => { setEditItem(item); setForm({ ...item }); setItemsInput(item.items.join(", ")); setShowModal(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...form, items: itemsInput.split(",").map((i) => i.trim()).filter(Boolean) };
        if (editItem) { await updateSkill(auth, editItem.id, data); } else { await createSkill(auth, data); }
        setShowModal(false); load();
    };

    const handleDelete = async () => {
        if (deleteId === null) return;
        await deleteSkill(auth, deleteId); setDeleteId(null); load();
    };

    return (
        <div>
            {/* HEADER START */}
            <div className="flex justify-between items-center mb-6">
                <h2 className={textStyles.h2}>Skills</h2>
                <button onClick={openAdd} className={buttonStyles.primary}>+ Add Skill Category</button>
            </div>
            {/* HEADER END */}

            {/* TABLE START */}
            <div className="border border-slate-700 rounded-xl overflow-hidden">
                <table className={tableStyles.table}>
                    <thead className={tableStyles.thead}>
                    <tr>
                        <th className={tableStyles.th}>Category</th>
                        <th className={tableStyles.th}>Skills</th>
                        <th className={tableStyles.th}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {skills.map((skill) => (
                        <tr key={skill.id} className={tableStyles.tr}>
                            <td className="px-4 py-3 text-white text-sm">{skill.category}</td>
                            <td className={tableStyles.td}>{skill.items.join(", ")}</td>
                            <td className="px-4 py-3 flex gap-2">
                                <button onClick={() => openEdit(skill)} className={`${buttonStyles.sm} ${buttonStyles.primary}`}>Edit</button>
                                <button onClick={() => setDeleteId(skill.id)} className={`${buttonStyles.sm} ${buttonStyles.danger}`}>Delete</button>
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
                            <h3 className={modalStyles.title}>{editItem ? "Edit Skill Category" : "Add Skill Category"}</h3>
                            <button onClick={() => setShowModal(false)} className={modalStyles.closeBtn}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className={modalStyles.body}>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Category</label>
                                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required placeholder="Languages" className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Skills (comma separated)</label>
                                <input value={itemsInput} onChange={(e) => setItemsInput(e.target.value)} placeholder="Java, Python, TypeScript" className={formStyles.input} />
                            </div>
                            <div className={modalStyles.footer}>
                                <button type="submit" className={buttonStyles.primary}>{editItem ? "Save Changes" : "Add Skill Category"}</button>
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
                        <h3 className={`${textStyles.h3} mb-2`}>Delete Skill Category</h3>
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