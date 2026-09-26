import type { Certification } from "../../types";
import { certificationsApi } from "../../api/resources";
import CrudTab from "./CrudTab";

export default function CertificationsTab({ onUnauthorized }: { onUnauthorized: () => void }) {
    return (
        <CrudTab<Certification>
            title="Certifications"
            itemName="Certification"
            api={certificationsApi}
            empty={{ name: "", issuer: "", date: "", credentialUrl: "" }}
            tableMinWidth="min-w-[500px]"
            columns={[
                { header: "Name", render: (c) => c.name, primary: true },
                { header: "Issuer", render: (c) => c.issuer },
                { header: "Date", render: (c) => c.date },
            ]}
            mobileCard={(c) => (
                <>
                    <div className="flex justify-between items-start gap-2">
                        <p className="text-white text-sm font-medium">{c.name}</p>
                        <p className="text-slate-400 text-xs shrink-0">{c.date}</p>
                    </div>
                    <p className="text-slate-400 text-xs">{c.issuer}</p>
                </>
            )}
            fields={[
                { type: "text", name: "name", label: "Name", required: true },
                { type: "text", name: "issuer", label: "Issuer", required: true },
                { type: "text", name: "date", label: "Date", placeholder: "Jan 2025" },
                { type: "text", name: "credentialUrl", label: "Credential URL" },
            ]}
            onUnauthorized={onUnauthorized}
        />
    );
}
