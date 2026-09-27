import type { Project } from "../../types";
import { projectsApi } from "../../api/resources";
import CrudTab from "./CrudTab";

export default function ProjectsTab({ onUnauthorized }: { onUnauthorized: () => void }) {
    return (
        <CrudTab<Project>
            title="Projects"
            itemName="Project"
            api={projectsApi}
            empty={{ name: "", description: "", techStack: [], url: "", githubUrl: "", featured: false, category: "" }}
            tableMinWidth="min-w-[500px]"
            columns={[
                { header: "Name", render: (p) => p.name, primary: true },
                { header: "Label", render: (p) => p.category },
                { header: "Featured", render: (p) => (p.featured ? "Yes" : "No") },
            ]}
            mobileCard={(p) => (
                <>
                    <div className="flex justify-between items-start gap-2">
                        <p className="text-white text-sm font-medium">{p.name}</p>
                        {p.featured && <span className="text-xs text-emerald-400 shrink-0">Featured</span>}
                    </div>
                    <p className="text-slate-400 text-xs">{p.category}</p>
                </>
            )}
            fields={[
                { type: "text", name: "name", label: "Name", required: true },
                { type: "textarea", name: "description", label: "Description", rows: 3 },
                { type: "list", name: "techStack", label: "Tech Stack (comma separated)", separator: ",", placeholder: "Java, Spring Boot, React" },
                { type: "text", name: "url", label: "URL" },
                { type: "text", name: "githubUrl", label: "GitHub URL" },
                { type: "text", name: "category", label: "Label (optional)", placeholder: "University Final Project" },
                { type: "checkbox", name: "featured", label: "Featured" },
            ]}
            onUnauthorized={onUnauthorized}
        />
    );
}
