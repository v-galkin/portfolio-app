import type { Skill } from "../types";
import { layoutStyles, cardStyles, textStyles } from "../styles";

interface Props {
    skills: Skill[];
}

export default function Skills({ skills }: Props) {
    return (
        /* SECTION START */
        <section id="skills" className={layoutStyles.section}>
            <div className={layoutStyles.container}>

                {/* SECTION TITLE START */}
                <h2 className={layoutStyles.sectionTitle}>
                    Skills
                </h2>
                {/* SECTION TITLE END */}

                {/* SKILLS GRID START */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

                    {/* EMPTY STATE START */}
                    {skills.length === 0 ? (
                        <p className={textStyles.secondary}>No skills entries yet.</p>
                    ) : (

                        /* SKILL CARD START */
                        skills.map((skill) => (
                            <div
                                key={skill.id}
                                className={cardStyles.card}
                            >
                                {/* CATEGORY TITLE START */}
                                <h4 className={`${textStyles.h4} mb-3`}>
                                    {skill.category}
                                </h4>
                                {/* CATEGORY TITLE END */}

                                {/* SKILL TAGS START */}
                                <div className="flex flex-wrap gap-2">
                                    {skill.items.map((item) => (
                                        <span
                                            key={item}
                                            className={textStyles.tag}
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                {/* SKILL TAGS END */}

                            </div>
                            /* SKILL CARD END */
                        ))
                        /* EMPTY STATE END */
                    )}

                </div>
                {/* SKILLS GRID END */}

            </div>
        </section>
        /* SECTION END */
    );
}