// src/pages/retired/DockerSentinel.tsx

import HeroSection from "../../components/retired/sentinel/HeroSection";
import ArchitectureSection from "../../components/retired/sentinel/ArchitectureSection";
import HowItWorksSection from "../../components/retired/sentinel/HowItWorksSection";
import AlertDetectionSection from "../../components/retired/sentinel/AlertDetectionSection";
import EmailPreviewSection from "../../components/retired/sentinel/EmailPreviewSection";
import { layoutStyles } from "../../styles";

export default function DockerSentinel() {
    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <div className={`${layoutStyles.container} py-20 px-6`}>
                <div className="space-y-20">
                    <HeroSection />
                    <ArchitectureSection />
                    <HowItWorksSection />
                    <AlertDetectionSection />
                    <EmailPreviewSection />
                </div>
            </div>

            {/* FOOTER */}
            <footer className="text-center py-4 text-slate-500 text-sm border-t border-slate-800">
                Vitalii Galkin © 2026
            </footer>
        </div>
    );
}