import type { Education } from "../../types";
import Section from "../ui/Section";
import Card from "../ui/Card";

interface Props {
    educations: Education[];
}

export default function Education({ educations }: Props) {
    return (
        <Section id="education" title="Education">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {educations.length === 0 ? (
                    <p className="text-slate-500">No education entries yet.</p>
                ) : (
                    educations.map((edu) => (
                        <Card key={edu.id}>
                            <div className="flex justify-between items-start gap-3 mb-2">
                                <h3 className="text-base font-semibold text-white">
                                    {edu.institution}
                                </h3>
                                <span className="text-slate-400 text-xs shrink-0">
                                    {edu.startDate} - {edu.endDate}
                                </span>
                            </div>
                            <p className="text-slate-300 text-sm mb-1">
                                {edu.degree} in {edu.field}
                            </p>
                            <p className="text-slate-500">{edu.location}</p>
                        </Card>
                    ))
                )}
            </div>
        </Section>
    );
}
