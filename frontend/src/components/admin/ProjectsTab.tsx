import { useEffect, useState } from "react";
import type { Auth } from "../../pages/Admin.tsx";
import type { Project } from "../../types";
import { getProjects } from "../../api/client";
import { createProject, updateProject, deleteProject } from "../../api/admin";
import { textStyles, buttonStyles, tableStyles, modalStyles, formStyles } from "../../styles";

interface Props { auth: Auth; }

const empty = { name: "", description: "", techStack: [] as string[], url: "", githubUrl: "", featured: false, category: "self-built" };

export default function ProjectsTab({ auth }: Props) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Project | null>(null);
    const [form, setForm] = useState(empty);
    const [techInput, setTechInput] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const load = async () => { const res = await getProjects(); setProjects(res.data); };
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditItem(null); setForm(empty); setTechInput(""); setShowModal(true); };
    const openEdit = (p: Project) => { setEditItem(p); setForm({ ...p }); setTechInput(p.techStack.join(", ")); setShowModal(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...form, techStack: techInput.split(",").map((t) => t.trim()).filter(Boolean) };
        if (editItem) { await updateProject(auth, editItem.id, data); } else { await createProject(auth, data); }
        setShowModal(false); load();
    };

    const handleDelete = async () => {
        if (deleteId === null) return;
        await deleteProject(auth, deleteId); setDeleteId(null); load();
    };

    return (
        <div>
            {/* HEADER START */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h2 className={textStyles.h2}>Projects</h2>
                <button onClick={openAdd} className={buttonStyles.primary}>+ Add Project</button>
            </div>
            {/* HEADER END */}

            {/* MOBILE CARDS START */}
            <div className="flex flex-col gap-3 sm:hidden">
                {projects.map((p) => (
                    <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-2">
                            <p className="text-white text-sm font-medium">{p.name}</p>
                            {p.featured && <span className="text-xs text-emerald-400 shrink-0">Featured</span>}
                        </div>
                        <p className="text-slate-400 text-xs">{p.category}</p>
                        <div className="flex gap-2 mt-1">
                            <button onClick={() => openEdit(p)} className={`${buttonStyles.sm} ${buttonStyles.primary}`}>Edit</button>
                            <button onClick={() => setDeleteId(p.id)} className={`${buttonStyles.sm} ${buttonStyles.danger}`}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {/* MOBILE CARDS END */}

            {/* DESKTOP TABLE START */}
            <div className="hidden sm:block border border-slate-700 rounded-xl overflow-hidden">
                <table className={`${tableStyles.table} min-w-[500px]`}>
                    <thead className={tableStyles.thead}>
                    <tr>
                        <th className={tableStyles.th}>Name</th>
                        <th className={tableStyles.th}>Category</th>
                        <th className={tableStyles.th}>Featured</th>
                        <th className={tableStyles.th}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((p) => (
                        <tr key={p.id} className={tableStyles.tr}>
                            <td className="px-4 py-3 text-white text-sm">{p.name}</td>
                            <td className={tableStyles.td}>{p.category}</td>
                            <td className={tableStyles.td}>{p.featured ? "Yes" : "No"}</td>
                            <td className="px-4 py-3 flex gap-2">
                                <button onClick={() => openEdit(p)} className={`${buttonStyles.sm} ${buttonStyles.primary}`}>Edit</button>
                                <button onClick={() => setDeleteId(p.id)} className={`${buttonStyles.sm} ${buttonStyles.danger}`}>Delete</button>
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
                            <h3 className={modalStyles.title}>{editItem ? "Edit Project" : "Add Project"}</h3>
                            <button onClick={() => setShowModal(false)} className={modalStyles.closeBtn}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className={modalStyles.body}>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Name</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={formStyles.textarea} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Tech Stack (comma separated)</label>
                                <input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Java, Spring Boot, React" className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>URL</label>
                                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>GitHub URL</label>
                                <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className={formStyles.input} />
                            </div>
                            <div className={formStyles.group}>
                                <label className={formStyles.label}>Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={formStyles.input}>
                                    <option value="self-built">Self Built</option>
                                    <option value="ai-assisted">AI Assisted</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                                <label htmlFor="featured" className={formStyles.label}>Featured</label>
                            </div>
                            <div className={modalStyles.footer}>
                                <button type="submit" className={buttonStyles.primary}>{editItem ? "Save Changes" : "Add Project"}</button>
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
                        <h3 className={`${textStyles.h3} mb-2`}>Delete Project</h3>
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