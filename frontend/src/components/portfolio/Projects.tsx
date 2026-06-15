import { useState } from "react";
import type { Project } from "../../types";
import { layoutStyles, cardStyles, buttonStyles, badgeStyles, textStyles } from "../../styles";

interface Props {
    projects: Project[];
}

const filters = ["Featured", "AI Assisted", "Self Built", "All"];
const categoryMap: Record<string, string> = {
    "AI Assisted": "ai-assisted",
    "Self Built": "self-built",
};

export default function Projects({ projects }: Props) {
    const [activeFilter, setActiveFilter] = useState("Featured");

    const filtered = projects.filter((p) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Featured") return p.featured;
        return p.category === categoryMap[activeFilter];
    });

    return (
        /* SECTION START */
        <section id="projects" className={layoutStyles.sectionAlt}>
            <div className={layoutStyles.container}>

                {/* SECTION TITLE START */}
                <h2 className={layoutStyles.sectionTitle}>
                    Projects
                </h2>
                {/* SECTION TITLE END */}

                {/* FILTER BUTTONS START */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={
                                activeFilter === filter
                                    ? buttonStyles.filterActive
                                    : buttonStyles.filter
                            }
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                {/* FILTER BUTTONS END */}

                {/* PROJECT CARDS GRID START */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* EMPTY STATE START */}
                    {filtered.length === 0 ? (
                        <p className={textStyles.secondary}>No projects found.</p>
                    ) : (

                        /* PROJECT CARD START */
                        filtered.map((project) => (
                            <div
                                key={project.id}
                                className={`${project.featured ? cardStyles.cardFeatured : cardStyles.cardDark} flex flex-col gap-3 hover:translate-y-[-3px] transition-all duration-200`}
                            >
                                {/* CARD HEADER START */}
                                <div className="flex justify-between items-center gap-2">
                                    <h3 className={textStyles.h3}>
                                        {project.name}
                                    </h3>
                                    <div className="flex gap-2 shrink-0">

                                        {/* FEATURED BADGE START */}
                                        {project.featured && (
                                            <span className={badgeStyles.featured}>
                                                Featured
                                            </span>
                                        )}
                                        {/* FEATURED BADGE END */}

                                        {/* CATEGORY BADGE START */}
                                        <span className={
                                            project.category === "ai-assisted"
                                                ? badgeStyles.ai
                                                : badgeStyles.self
                                        }>
                                            {project.category === "ai-assisted"
                                                ? "AI Assisted"
                                                : "Self Built"}
                                        </span>
                                        {/* CATEGORY BADGE END */}

                                    </div>
                                </div>
                                {/* CARD HEADER END */}

                                {/* DESCRIPTION START */}
                                <p className={`${textStyles.body} flex-1`}>
                                    {project.description}
                                </p>
                                {/* DESCRIPTION END */}

                                {/* TECH STACK TAGS START */}
                                <div className="flex flex-wrap gap-1.5">
                                    {project.techStack.map((tech) => (
                                        <span key={tech} className={textStyles.tag}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                {/* TECH STACK TAGS END */}

                                {/* ACTION BUTTONS START */}
                                <div className="flex gap-2">
                                    <a
                                        href={project.url.startsWith('http') ? project.url : `${window.location.origin}${project.url}`}
                                        target={project.url.startsWith('http') ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                        className={buttonStyles.sm + " " + buttonStyles.primary}
                                    >
                                        View Project
                                    </a>
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={buttonStyles.sm + " " + buttonStyles.secondary}
                                    >
                                        GitHub
                                    </a>
                                </div>
                                {/* ACTION BUTTONS END */}

                            </div>
                            /* PROJECT CARD END */
                        ))
                        /* EMPTY STATE END */
                    )}

                </div>
                {/* PROJECT CARDS GRID END */}

                {/* PROJECT COUNT START */}
                <p className={`${textStyles.secondary} text-sm mt-6 text-center`}>
                    Showing {filtered.length} of {projects.length} projects
                </p>
                {/* PROJECT COUNT END */}

            </div>
        </section>
        /* SECTION END */
    );
}