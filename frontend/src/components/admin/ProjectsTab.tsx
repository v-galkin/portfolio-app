import { useEffect, useState } from "react";
import type { Auth } from "../../Admin";
import type { Project } from "../../types";
import { getProjects } from "../../api/client";
import {
    createProject,
    updateProject,
    deleteProject,
} from "../../api/admin";

interface Props {
    auth: Auth;
}

const empty = {
    name: "",
    description: "",
    techStack: [] as string[],
    url: "",
    githubUrl: "",
    featured: false,
    category: "self-built",
};

export default function ProjectsTab({ auth }: Props) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Project | null>(null);
    const [form, setForm] = useState(empty);
    const [techInput, setTechInput] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const load = async () => {
        const res = await getProjects();
        setProjects(res.data);
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => {
        setEditItem(null);
        setForm(empty);
        setTechInput("");
        setShowModal(true);
    };

    const openEdit = (p: Project) => {
        setEditItem(p);
        setForm({ ...p });
        setTechInput(p.techStack.join(", "));
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...form, techStack: techInput.split(",").map((t) => t.trim()).filter(Boolean) };
        if (editItem) {
            await updateProject(auth, editItem.id, data);
        } else {
            await createProject(auth, data);
        }
        setShowModal(false);
        load();
    };

    const handleDelete = async () => {
        if (deleteId === null) return;
        await deleteProject(auth, deleteId);
        setDeleteId(null);
        load();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-bold">Projects</h2>
                <button
                    onClick={openAdd}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    + Add Project
                </button>
            </div>

            {/* TABLE */}
            <div className="border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-800 border-b border-slate-700">
                        <tr>
                            <th className="text-left px-4 py-3 text-slate-400 font-medium">Name</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-medium">Category</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-medium">Featured</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((p) => (
                            <tr key={p.id} className="border-b border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors">
                                <td className="px-4 py-3 text-white">{p.name}</td>
                                <td className="px-4 py-3 text-slate-400">{p.category}</td>
                                <td className="px-4 py-3 text-slate-400">{p.featured ? "Yes" : "No"}</td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(p.id)}
                                        className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/50 rounded-lg text-xs transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD/EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
                            <h3 className="text-white font-semibold">
                                {editItem ? "Edit Project" : "Add Project"}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-xl">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-400 text-sm">Name</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-slate-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-400 text-sm">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-slate-400 resize-none"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-400 text-sm">Tech Stack (comma separated)</label>
                                <input
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    placeholder="Java, Spring Boot, React"
                                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-slate-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-400 text-sm">URL</label>
                                <input
                                    value={form.url}
                                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-slate-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-400 text-sm">GitHub URL</label>
                                <input
                                    value={form.githubUrl}
                                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-slate-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-400 text-sm">Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-slate-400"
                                >
                                    <option value="self-built">Self Built</option>
                                    <option value="ai-assisted">AI Assisted</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={form.featured}
                                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="featured" className="text-slate-400 text-sm">Featured</label>
                            </div>
                            <button
                                type="submit"
                                className="mt-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                            >
                                {editItem ? "Save Changes" : "Add Project"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION */}
            {deleteId !== null && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-white font-semibold mb-2">Delete Project</h3>
                        <p className="text-slate-400 text-sm mb-6">Are you sure? This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg text-sm transition-colors hover:border-slate-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/50 rounded-lg text-sm transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
