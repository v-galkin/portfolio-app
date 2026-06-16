// src/components/retired/sentinel/HeroSection.tsx

import { techStack } from "../../../data/retired/dockerSentinelData";
import { badgeStyles } from "../../../styles";
import { colorTokens, typographyTokens, spacingTokens, radiusTokens } from "../../../styles/tokens";

const techBadge = [
    typographyTokens.xs,
    spacingTokens.badgePaddingMd,
    radiusTokens.sm,
    colorTokens.slate.bg,
    colorTokens.slate.text,
].join(" ");

export default function HeroSection() {
    return (
        <section>
            <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">🛡️</div>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className={[typographyTokens.h1, typographyTokens.bold, colorTokens.white.text].join(" ")}>
                            Docker Sentinel
                        </h1>
                        <span className={badgeStyles.danger}>Retired</span>
                    </div>
                    <p className={[typographyTokens.body, colorTokens.slate.muted, "max-w-2xl"].join(" ")}>
                        Automated container monitoring and alerting service. Polled the Docker
                        daemon every 60 seconds, detected unhealthy containers, and dispatched
                        plain-text email alerts via n8n — with exit code analysis and
                        actionable recovery steps.
                    </p>
                    <a
                        href="https://github.com/yourusername/DockerSentinel"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={[
                            typographyTokens.xs,
                            colorTokens.slate.muted,
                            "hover:text-white transition-colors duration-200 mt-3 inline-flex items-center gap-1",
                        ].join(" ")}
                    >
                        View source on GitHub →
                    </a>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
                {techStack.map((tech) => (
                    <span key={tech.label} className={techBadge}>
                        {tech.label}
                    </span>
                ))}
            </div>
        </section>
    );
}