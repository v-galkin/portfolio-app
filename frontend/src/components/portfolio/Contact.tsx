import Section from "../ui/Section";
import Card from "../ui/Card";
import { ButtonLink } from "../ui/Button";
import type { Profile } from "../../types";

/** Contact links from the profile, edited in Admin → Profile; empty ones are hidden. */
export default function Contact({ profile }: { profile: Profile | null }) {
    return (
        <Section id="contact" title="Contact">
            <Card className="p-10 text-center">
                <div className="flex gap-3 justify-center flex-wrap">
                    {profile?.email && (
                        <ButtonLink variant="secondary" href={`mailto:${profile.email}`}>
                            Email
                        </ButtonLink>
                    )}
                    {profile?.linkedinUrl && (
                        <ButtonLink variant="secondary" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                        </ButtonLink>
                    )}
                    {profile?.githubUrl && (
                        <ButtonLink variant="secondary" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                            GitHub
                        </ButtonLink>
                    )}
                </div>
            </Card>
        </Section>
    );
}
