// src/components/retired/sentinel/AlertDetectionSection.tsx

import { alertTriggers, exitCodes } from "../../../data/retired/dockerSentinelData";
import { severityBadgeStyles, exitCodeBadge } from "../../../styles/retired/sentinel";
import { layoutStyles, cardStyles, tableStyles, textStyles } from "../../../styles";

export default function AlertDetectionSection() {
    return (
        <section>
            <h2 className={layoutStyles.sectionTitle}>Alert Detection Logic</h2>

            <div className="grid sm:grid-cols-2 gap-4">

                <div className={cardStyles.card}>
                    <h3 className={textStyles.h4}>Triggers</h3>
                    <div className="mt-4 space-y-1">
                        {alertTriggers.map((trigger) => (
                            <div key={trigger.label} className={tableStyles.rowDivider}>
                                <span className={textStyles.body}>{trigger.label}</span>
                                <span className={severityBadgeStyles[trigger.severity]}>{trigger.severity}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={cardStyles.card}>
                    <h3 className={textStyles.h4}>Exit Code Reference</h3>
                    <div className="mt-4 space-y-1">
                        {exitCodes.map((exit) => (
                            <div key={exit.code} className={tableStyles.rowDivider}>
                                <div className="flex items-center gap-3">
                                    <span className={exitCodeBadge}>{exit.code}</span>
                                    <span className={textStyles.body}>{exit.meaning}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}