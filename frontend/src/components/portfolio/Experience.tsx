import type { Experience } from "../../types";
import Section from "../ui/Section";
import Card from "../ui/Card";
import Timeline, { TimelineItem } from "../ui/Timeline";

interface Props {
    experiences: Experience[];
}

export default function Experience({ experiences }: Props) {
    return (
        <Section id="experience" title="Experience" alt>
            <Timeline>
                {experiences.length === 0 ? (
                    <p className="text-slate-500">No experience entries yet.</p>
                ) : (
                    experiences.map((exp) => (
                        <TimelineItem key={exp.id}>
                            <Card variant="dark">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                                    <div>
                                        <h3 className="text-base font-semibold text-white">
                                            {exp.role}
                                        </h3>
                                        <p className="text-emerald-400 text-sm font-medium mt-0.5">
                                            {exp.company}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:items-end gap-1">
                                        <span className="text-slate-400 text-xs">
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                        <span className="text-slate-500 text-xs">
                                            {exp.location}
                                        </span>
                                    </div>
                                </div>
                                <ul className="flex flex-col gap-1.5 list-disc list-inside">
                                    {exp.responsibilities.map((resp, i) => (
                                        <li key={i} className="text-sm leading-relaxed text-slate-400">
                                            {resp}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </TimelineItem>
                    ))
                )}
            </Timeline>
        </Section>
    );
}
