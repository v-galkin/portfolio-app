import type { HistoryEntry } from "../../types";
import { historyApi } from "../../api/resources";
import CrudTab from "./CrudTab";

const CATEGORIES = ["Infrastructure", "Feature", "Bugfix", "Removal", "Migration", "Other"];

export default function HistoryTab({ onUnauthorized }: { onUnauthorized: () => void }) {
    return (
        <CrudTab<HistoryEntry>
            title="Changelog"
            itemName="Entry"
            api={historyApi}
            empty={{ date: "", title: "", description: "", category: "Infrastructure" }}
            tableMinWidth="min-w-[600px]"
            columns={[
                { header: "Date", render: (h) => h.date },
                { header: "Title", render: (h) => h.title, primary: true },
                { header: "Category", render: (h) => h.category },
            ]}
            mobileCard={(h) => (
                <>
                    <div className="flex justify-between items-start gap-2">
                        <p className="text-white text-sm font-medium">{h.title}</p>
                        <p className="text-slate-400 text-xs shrink-0">{h.date}</p>
                    </div>
                    <p className="text-slate-400 text-xs">{h.category}</p>
                    {h.description && <p className="text-slate-500 text-xs">{h.description}</p>}
                </>
            )}
            fields={[
                { type: "text", name: "date", label: "Date", required: true, placeholder: "2025-06" },
                { type: "text", name: "title", label: "Title", required: true, placeholder: "Initial Deployment" },
                { type: "select", name: "category", label: "Category", options: CATEGORIES.map((c) => ({ value: c, label: c })) },
                { type: "textarea", name: "description", label: "Description (optional)", rows: 3 },
            ]}
            onUnauthorized={onUnauthorized}
        />
    );
}
