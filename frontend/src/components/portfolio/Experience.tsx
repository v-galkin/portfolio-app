import type { Experience } from "../../types";
import { layoutStyles, cardStyles, textStyles } from "../../styles";

interface Props {
    experiences: Experience[];
}

export default function Experience({ experiences }: Props) {
    return (
        /* SECTION START */
        <section id="experience" className={layoutStyles.sectionAlt}>
            <div className={layoutStyles.container}>

                {/* SECTION TITLE START */}
                <h2 className={layoutStyles.sectionTitle}>
                    Experience
                </h2>
                {/* SECTION TITLE END */}

                {/* TIMELINE START */}
                <div className="flex flex-col gap-6 pl-6 border-l-2 border-slate-700">

                    {/* EMPTY STATE START */}
                    {experiences.length === 0 ? (
                        <p className={textStyles.secondary}>No experience entries yet.</p>
                    ) : (

                        /* EXPERIENCE ITEM START */
                        experiences.map((exp) => (
                            <div key={exp.id} className="relative">

                                {/* TIMELINE MARKER START */}
                                <div className="absolute -left-[31px] top-5 w-3 h-3 rounded-full bg-slate-500 border-2 border-slate-900" />
                                {/* TIMELINE MARKER END */}

                                {/* EXPERIENCE CARD START */}
                                <div className={cardStyles.cardDark}>

                                    {/* CARD HEADER START */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">

                                        {/* ROLE AND COMPANY START */}
                                        <div>
                                            <h3 className={textStyles.h3}>
                                                {exp.role}
                                            </h3>
                                            <p className={`${textStyles.accent} text-sm font-medium mt-0.5`}>
                                                {exp.company}
                                            </p>
                                        </div>
                                        {/* ROLE AND COMPANY END */}

                                        {/* DATE AND LOCATION START */}
                                        <div className="flex flex-col sm:items-end gap-1">
                                            <span className={`${textStyles.muted} text-xs`}>
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                            <span className={`${textStyles.secondary} text-xs`}>
                                                {exp.location}
                                            </span>
                                        </div>
                                        {/* DATE AND LOCATION END */}

                                    </div>
                                    {/* CARD HEADER END */}

                                    {/* RESPONSIBILITIES START */}
                                    <ul className="flex flex-col gap-1.5 list-disc list-inside">
                                        {exp.responsibilities.map((resp, i) => (
                                            <li key={i} className={`${textStyles.body}`}>
                                                {resp}
                                            </li>
                                        ))}
                                    </ul>
                                    {/* RESPONSIBILITIES END */}

                                </div>
                                {/* EXPERIENCE CARD END */}

                            </div>
                            /* EXPERIENCE ITEM END */
                        ))
                        /* EMPTY STATE END */
                    )}

                </div>
                {/* TIMELINE END */}

            </div>
        </section>
        /* SECTION END */
    );
}