import { useState } from "react";
import type { Project } from "../../types";
import Section from "../ui/Section";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Tag from "../ui/Tag";
import { ButtonLink } from "../ui/Button";

interface Props {
    projects: Project[];
}

const filters = ["Featured", "All"];

const filterBase = "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200";
const filterClasses = {
    active: `${filterBase} bg-slate-600 text-white`,
    inactive: `${filterBase} border border-slate-600 hover:border-slate-500 text-slate-400 hover:text-white`,
};

export default function Projects({ projects }: Props) {
    const [activeFilter, setActiveFilter] = useState("Featured");

    const filtered = activeFilter === "Featured" ? projects.filter((p) => p.featured) : projects;

    return (
        <Section id="projects" title="Projects" alt>
            <div className="flex gap-2 mb-8 flex-wrap">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={activeFilter === filter ? filterClasses.active : filterClasses.inactive}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.length === 0 ? (
                    <p className="text-slate-500">No projects found.</p>
                ) : (
                    filtered.map((project) => (
                        <Card
                            key={project.id}
                            variant={project.featured ? "featured" : "dark"}
                            className="flex flex-col gap-3 hover:translate-y-[-3px] transition-all duration-200"
                        >
                            <div className="flex justify-between items-center gap-2">
                                <h3 className="text-base font-semibold text-white">
                                    {project.name}
                                </h3>
                                <div className="flex gap-2 shrink-0">
                                    {project.featured && <Badge color="emerald">Featured</Badge>}
                                    {project.category?.trim() && <Badge color="purple">{project.category}</Badge>}
                                </div>
                            </div>

                            <p className="text-sm leading-relaxed text-slate-400 flex-1">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                                {project.techStack.map((tech) => (
                                    <Tag key={tech}>{tech}</Tag>
                                ))}
                            </div>

                            {/* Only show a button when its link is set (empty or null means no button) */}
                            {(project.url?.trim() || project.githubUrl?.trim()) && (
                                <div className="flex gap-2">
                                    {project.url?.trim() && (
                                        <ButtonLink
                                            size="sm"
                                            href={project.url.startsWith('http') ? project.url : `${window.location.origin}${project.url}`}
                                            target={project.url.startsWith('http') ? '_blank' : '_self'}
                                            rel="noopener noreferrer"
                                        >
                                            View Project
                                        </ButtonLink>
                                    )}
                                    {project.githubUrl?.trim() && (
                                        <ButtonLink
                                            variant="secondary"
                                            size="sm"
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            GitHub
                                        </ButtonLink>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>

            <p className="text-slate-500 text-sm mt-6 text-center">
                Showing {filtered.length} of {projects.length} projects
            </p>
        </Section>
    );
}
