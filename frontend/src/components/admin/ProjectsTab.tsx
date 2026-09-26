import type { Project } from "../../types";
import { projectsApi } from "../../api/resources";
import CrudTab from "./CrudTab";
import { PROJECT_CATEGORIES } from "../../constants";

export default function ProjectsTab({ onUnauthorized }: { onUnauthorized: () => void }) {
    return (
        <CrudTab<Project>
            title="Projects"
            itemName="Project"
            api={projectsApi}
            empty={{ name: "", description: "", techStack: [], url: "", githubUrl: "", featured: false, category: "self-built" }}
            tableMinWidth="min-w-[500px]"
            columns={[
                { header: "Name", render: (p) => p.name, primary: true },
                { header: "Category", render: (p) => p.category },
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
                { type: "select", name: "category", label: "Category", options: PROJECT_CATEGORIES },
                { type: "checkbox", name: "featured", label: "Featured" },
            ]}
            onUnauthorized={onUnauthorized}
        />
    );
}
