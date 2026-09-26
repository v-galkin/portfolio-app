import type { Experience } from "../../types";
import { experiencesApi } from "../../api/resources";
import CrudTab from "./CrudTab";

export default function ExperiencesTab({ onUnauthorized }: { onUnauthorized: () => void }) {
    return (
        <CrudTab<Experience>
            title="Experiences"
            itemName="Experience"
            api={experiencesApi}
            empty={{ company: "", role: "", startDate: "", endDate: "", location: "", responsibilities: [] }}
            tableMinWidth="min-w-[600px]"
            columns={[
                { header: "Role", render: (x) => x.role, primary: true },
                { header: "Company", render: (x) => x.company },
                { header: "Period", render: (x) => <>{x.startDate} - {x.endDate}</> },
            ]}
            mobileCard={(x) => (
                <>
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <p className="text-white text-sm font-medium">{x.role}</p>
                            <p className="text-slate-400 text-xs">{x.company}</p>
                        </div>
                        <p className="text-slate-400 text-xs shrink-0">{x.startDate} - {x.endDate}</p>
                    </div>
                    <p className="text-slate-500 text-xs">{x.location}</p>
                </>
            )}
            fields={[
                { type: "text", name: "role", label: "Role", required: true },
                { type: "text", name: "company", label: "Company", required: true },
                {
                    type: "row", fields: [
                        { type: "text", name: "startDate", label: "Start Date", required: true },
                        { type: "text", name: "endDate", label: "End Date", placeholder: "Present" },
                    ],
                },
                { type: "text", name: "location", label: "Location" },
                { type: "list", name: "responsibilities", label: "Responsibilities (one per line)", separator: "\n", rows: 5 },
            ]}
            onUnauthorized={onUnauthorized}
        />
    );
}
