import type { ReactNode } from "react";

/** A vertical line with items along it, used by Experience and the Changelog. */
export default function Timeline({ children }: { children: ReactNode }) {
    return <div className="flex flex-col gap-6 pl-6 border-l-2 border-slate-700">{children}</div>;
}

export function TimelineItem({ children }: { children: ReactNode }) {
    return (
        <div className="relative">
            <div className="absolute -left-[31px] top-5 w-3 h-3 rounded-full bg-slate-500 border-2 border-slate-900" />
            {children}
        </div>
    );
}
