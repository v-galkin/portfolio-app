// src/components/retired/sentinel/ArchitectureSection.tsx

import { architectureNodes, metricCards } from "../../../data/retired/dockerSentinelData";
import { metricVariantStyles } from "../../../styles/retired/sentinel";
import { colorTokens, typographyTokens } from "../../../styles/tokens";
import { layoutStyles, cardStyles } from "../../../styles";

export default function ArchitectureSection() {
    return (
        <section>
            <h2 className={layoutStyles.sectionTitle}>Architecture</h2>

            <div className={cardStyles.cardDark + " overflow-x-auto"}>
                <div className="flex items-center gap-2 min-w-max py-2">
                    {architectureNodes.map((node, i) =>
                        node.icon ? (
                            <div key={i} className="flex flex-col items-center gap-1 px-4">
                                <div className="text-2xl">{node.icon}</div>
                                <div className={[typographyTokens.xs, typographyTokens.semibold, colorTokens.white.text, "whitespace-nowrap"].join(" ")}>
                                    {node.label}
                                </div>
                                <div className={[typographyTokens.xs, colorTokens.slate.subtle, "whitespace-nowrap"].join(" ")}>
                                    {node.desc}
                                </div>
                            </div>
                        ) : (
                            <div key={i} className={[colorTokens.slate.subtle, "text-xl font-light px-1"].join(" ")}>
                                →
                            </div>
                        )
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {metricCards.map((metric) => (
                    <div key={metric.label} className={cardStyles.cardDark}>
                        <div className={["text-xl", typographyTokens.bold, metricVariantStyles[metric.variant]].join(" ")}>
                            {metric.value}
                        </div>
                        <div className={[typographyTokens.h4, colorTokens.slate.muted, "mt-1"].join(" ")}>
                            {metric.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}