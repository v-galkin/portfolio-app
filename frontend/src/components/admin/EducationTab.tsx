import type { Education } from "../../types";
import { educationsApi } from "../../api/resources";
import CrudTab from "./CrudTab";

export default function EducationTab({ onUnauthorized }: { onUnauthorized: () => void }) {
    return (
        <CrudTab<Education>
            title="Education"
            itemName="Education"
            api={educationsApi}
            empty={{ institution: "", degree: "", field: "", startDate: "", endDate: "", location: "" }}
            tableMinWidth="min-w-[600px]"
            columns={[
                { header: "Institution", render: (e) => e.institution, primary: true },
                { header: "Degree", render: (e) => <>{e.degree} in {e.field}</> },
                { header: "Period", render: (e) => <>{e.startDate} - {e.endDate}</> },
            ]}
            mobileCard={(e) => (
                <>
                    <div className="flex justify-between items-start gap-2">
                        <p className="text-white text-sm font-medium">{e.institution}</p>
                        <p className="text-slate-400 text-xs shrink-0">{e.startDate} - {e.endDate}</p>
                    </div>
                    <p className="text-slate-400 text-xs">{e.degree} in {e.field}</p>
                    <p className="text-slate-500 text-xs">{e.location}</p>
                </>
            )}
            fields={[
                { type: "text", name: "institution", label: "Institution", required: true },
                { type: "text", name: "degree", label: "Degree", required: true },
                { type: "text", name: "field", label: "Field", required: true },
                {
                    type: "row", fields: [
                        { type: "text", name: "startDate", label: "Start Date" },
                        { type: "text", name: "endDate", label: "End Date" },
                    ],
                },
                { type: "text", name: "location", label: "Location" },
            ]}
            onUnauthorized={onUnauthorized}
        />
    );
}
