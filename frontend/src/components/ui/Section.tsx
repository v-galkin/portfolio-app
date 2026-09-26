import type { ReactNode } from "react";

export const containerClass = "max-w-6xl mx-auto px-6";

interface Props {
    id?: string;
    title?: string;
    /** Slightly lighter background, used to alternate sections. */
    alt?: boolean;
    children: ReactNode;
}

/** A full-width page section with a centred container and an optional title. */
export default function Section({ id, title, alt, children }: Props) {
    return (
        <section id={id} className={alt ? "py-20 px-6 bg-slate-800" : "py-20 px-6"}>
            <div className={containerClass}>
                {title && (
                    <h2 className="text-2xl font-bold text-white mb-8 pb-3 border-b border-slate-700">
                        {title}
                    </h2>
                )}
                {children}
            </div>
        </section>
    );
}
