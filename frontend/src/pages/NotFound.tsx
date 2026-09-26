import Section from "../components/ui/Section";
import { ButtonLink } from "../components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Section title="Page not found">
                <p className="text-slate-400 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <ButtonLink variant="secondary" href="/">
                    Back to the main page
                </ButtonLink>
            </Section>
        </div>
    );
}
