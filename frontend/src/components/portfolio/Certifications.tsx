import type { Certification } from "../../types";
import { layoutStyles, cardStyles, buttonStyles, textStyles } from "../../styles";

interface Props {
    certifications: Certification[];
}

export default function Certifications({ certifications }: Props) {
    return (
        /* SECTION START */
        <section id="certifications" className={layoutStyles.sectionAlt}>
            <div className={layoutStyles.container}>

                {/* SECTION TITLE START */}
                <h2 className={layoutStyles.sectionTitle}>
                    Certifications
                </h2>
                {/* SECTION TITLE END */}

                {/* CERTIFICATIONS GRID START */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* EMPTY STATE START */}
                    {certifications.length === 0 ? (
                        <p className={textStyles.secondary}>No certifications yet.</p>
                    ) : (

                        /* CERTIFICATION CARD START */
                        certifications.map((cert) => (
                            <div
                                key={cert.id}
                                className={cardStyles.cardDark}
                            >
                                {/* CARD HEADER START */}
                                <div className="flex justify-between items-start gap-3 mb-2">

                                    {/* CERT NAME START */}
                                    <h3 className={textStyles.h3}>
                                        {cert.name}
                                    </h3>
                                    {/* CERT NAME END */}

                                    {/* CERT DATE START */}
                                    <span className="text-slate-400 text-xs shrink-0">
                                        {cert.date}
                                    </span>
                                    {/* CERT DATE END */}

                                </div>
                                {/* CARD HEADER END */}

                                {/* ISSUER START */}
                                <p className={`${textStyles.accent} text-sm font-medium mb-3`}>
                                    {cert.issuer}
                                </p>
                                {/* ISSUER END */}

                                {/* CREDENTIAL BUTTON START */}
                                <a
                                    href={cert.credentialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-block ${buttonStyles.sm} ${buttonStyles.secondary}`}
                                >
                                    View Credential
                                </a>
                                {/* CREDENTIAL BUTTON END */}

                            </div>
                            /* CERTIFICATION CARD END */
                        ))
                        /* EMPTY STATE END */
                    )}

                </div>
                {/* CERTIFICATIONS GRID END */}

            </div>
        </section>
        /* SECTION END */
    );
}