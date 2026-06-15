import type { Education } from "../../types";
import { layoutStyles, cardStyles, textStyles } from "../../styles";

interface Props {
    educations: Education[];
}

export default function Education({ educations }: Props) {
    return (
        /* SECTION START */
        <section id="education" className={layoutStyles.section}>
            <div className={layoutStyles.container}>

                {/* SECTION TITLE START */}
                <h2 className={layoutStyles.sectionTitle}>
                    Education
                </h2>
                {/* SECTION TITLE END */}

                {/* EDUCATION GRID START */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* EMPTY STATE START */}
                    {educations.length === 0 ? (
                        <p className={textStyles.secondary}>No education entries yet.</p>
                    ) : (

                        /* EDUCATION CARD START */
                        educations.map((edu) => (
                            <div
                                key={edu.id}
                                className={cardStyles.card}
                            >
                                {/* CARD HEADER START */}
                                <div className="flex justify-between items-start gap-3 mb-2">

                                    {/* INSTITUTION NAME START */}
                                    <h3 className={textStyles.h3}>
                                        {edu.institution}
                                    </h3>
                                    {/* INSTITUTION NAME END */}

                                    {/* DATE START */}
                                    <span className="text-slate-400 text-xs shrink-0">
                                        {edu.startDate} - {edu.endDate}
                                    </span>
                                    {/* DATE END */}

                                </div>
                                {/* CARD HEADER END */}

                                {/* DEGREE START */}
                                <p className="text-slate-300 text-sm mb-1">
                                    {edu.degree} in {edu.field}
                                </p>
                                {/* DEGREE END */}

                                {/* LOCATION START */}
                                <p className={textStyles.secondary}>{edu.location}</p>
                                {/* LOCATION END */}

                            </div>
                            /* EDUCATION CARD END */
                        ))
                        /* EMPTY STATE END */
                    )}

                </div>
                {/* EDUCATION GRID END */}

            </div>
        </section>
        /* SECTION END */
    );
}