import type { Skill } from "../../types";
import Section from "../ui/Section";
import Card from "../ui/Card";
import Tag from "../ui/Tag";

interface Props {
    skills: Skill[];
}

export default function Skills({ skills }: Props) {
    return (
        <Section id="skills" title="Skills">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {skills.length === 0 ? (
                    <p className="text-slate-500">No skills entries yet.</p>
                ) : (
                    skills.map((skill) => (
                        <Card key={skill.id}>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                {skill.category}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {skill.items.map((item) => (
                                    <Tag key={item}>{item}</Tag>
                                ))}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </Section>
    );
}
