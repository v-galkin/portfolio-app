import type { Certification } from "../../types";
import Section from "../ui/Section";
import Card from "../ui/Card";
import { ButtonLink } from "../ui/Button";

interface Props {
    certifications: Certification[];
}

export default function Certifications({ certifications }: Props) {
    return (
        <Section id="certifications" title="Certifications" alt>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {certifications.length === 0 ? (
                    <p className="text-slate-500">No certifications yet.</p>
                ) : (
                    certifications.map((cert) => (
                        <Card key={cert.id} variant="dark">
                            <div className="flex justify-between items-start gap-3 mb-2">
                                <h3 className="text-base font-semibold text-white">
                                    {cert.name}
                                </h3>
                                <span className="text-slate-400 text-xs shrink-0">
                                    {cert.date}
                                </span>
                            </div>
                            <p className="text-emerald-400 text-sm font-medium mb-3">
                                {cert.issuer}
                            </p>
                            <ButtonLink
                                variant="secondary"
                                size="sm"
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                            >
                                View Credential
                            </ButtonLink>
                        </Card>
                    ))
                )}
            </div>
        </Section>
    );
}
