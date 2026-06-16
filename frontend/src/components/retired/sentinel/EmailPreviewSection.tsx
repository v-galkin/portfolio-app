// src/components/retired/sentinel/EmailPreviewSection.tsx

import { useState } from "react";
import { emailPreview } from "../../../data/retired/dockerSentinelData";
import { emailPreviewStyles, severityBadgeStyles } from "../../../styles/retired/sentinel";
import { layoutStyles, cardStyles, buttonStyles, textStyles } from "../../../styles";

export default function EmailPreviewSection() {
    const [expanded, setExpanded] = useState(false);

    return (
        <section>
            <h2 className={layoutStyles.sectionTitle}>Alert Email Preview</h2>

            <div className={cardStyles.cardDark}>

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className={textStyles.h3}>
                            [CRITICAL] Container Down: n8n — Exit 137
                        </h3>
                        <p className={`${textStyles.body} mt-1`}>
                            From: docker-sentinel · To: admin@example.com · Plain text
                        </p>
                    </div>
                    <span className={severityBadgeStyles["CRITICAL"]}>CRITICAL</span>
                </div>

                <div className={[emailPreviewStyles.base, expanded ? emailPreviewStyles.expanded : emailPreviewStyles.collapsed].join(" ")}>
                    <pre className={emailPreviewStyles.pre}>{emailPreview}</pre>
                </div>

                <button onClick={() => setExpanded(!expanded)} className={`${buttonStyles.secondary} mt-3`}>
                    {expanded ? "Collapse ↑" : "View full email ↓"}
                </button>

            </div>
        </section>
    );
}