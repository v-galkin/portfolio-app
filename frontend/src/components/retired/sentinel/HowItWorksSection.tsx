// src/components/retired/sentinel/HowItWorksSection.tsx

import { steps } from "../../../data/retired/dockerSentinelData";
import { stepVariantStyles } from "../../../styles/retired/sentinel";
import { colorTokens, typographyTokens, spacingTokens, radiusTokens, borderTokens } from "../../../styles/tokens";
import { layoutStyles } from "../../../styles";

export default function HowItWorksSection() {
    return (
        <section>
            <h2 className={layoutStyles.sectionTitle}>How It Works</h2>

            <div className="space-y-4">
                {steps.map((step) => {
                    const variant = stepVariantStyles[step.variant];
                    const cardClasses = [
                        colorTokens.slate.bgDark,
                        borderTokens.base,
                        variant.border,
                        variant.bg,
                        radiusTokens.lg,
                        spacingTokens.cardPadding,
                        "flex gap-5",
                    ].join(" ");

                    return (
                        <div key={step.number} className={cardClasses}>
                            <div className="flex-shrink-0">
                                <div className={["text-3xl font-black leading-none opacity-30", variant.color].join(" ")}>
                                    {step.number}
                                </div>
                                <div className="text-2xl mt-1">{step.icon}</div>
                            </div>
                            <div>
                                <h3 className={[typographyTokens.h3, typographyTokens.semibold, colorTokens.white.text, "mb-1"].join(" ")}>
                                    {step.title}
                                </h3>
                                <p className={[typographyTokens.body, colorTokens.slate.muted].join(" ")}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}