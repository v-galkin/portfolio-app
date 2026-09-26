import Section from "../ui/Section";
import { ButtonLink } from "../ui/Button";
import type { Profile } from "../../types";

/** Name, headline, bio and profile links; edited in Admin → Profile. */
export default function About({ profile }: { profile: Profile | null }) {
    return (
        <Section id="about">
            {profile && (
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            {profile.name}
                        </h1>
                        {profile.headline && (
                            <h3 className="text-xl text-slate-400 font-normal mb-4">
                                {profile.headline}
                            </h3>
                        )}
                        {profile.bio && (
                            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mb-6">
                                {profile.bio}
                            </p>
                        )}
                        <div className="flex gap-3 flex-wrap">
                            {profile.githubUrl && (
                                <ButtonLink variant="secondary" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                                    GitHub
                                </ButtonLink>
                            )}
                            {profile.linkedinUrl && (
                                <ButtonLink variant="secondary" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                    LinkedIn
                                </ButtonLink>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Section>
    );
}
