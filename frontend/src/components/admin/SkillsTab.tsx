import type { Skill } from "../../types";
import { skillsApi } from "../../api/resources";
import CrudTab from "./CrudTab";

export default function SkillsTab({ onUnauthorized }: { onUnauthorized: () => void }) {
    return (
        <CrudTab<Skill>
            title="Skills"
            itemName="Skill Category"
            api={skillsApi}
            empty={{ category: "", items: [] }}
            tableMinWidth="min-w-[500px]"
            columns={[
                { header: "Category", render: (s) => s.category, primary: true },
                { header: "Skills", render: (s) => s.items.join(", ") },
            ]}
            mobileCard={(s) => (
                <>
                    <p className="text-white text-sm font-medium">{s.category}</p>
                    <p className="text-slate-400 text-xs">{s.items.join(", ")}</p>
                </>
            )}
            fields={[
                { type: "text", name: "category", label: "Category", required: true, placeholder: "Languages" },
                { type: "list", name: "items", label: "Skills (comma separated)", separator: ",", placeholder: "Java, Python, TypeScript" },
            ]}
            onUnauthorized={onUnauthorized}
        />
    );
}
