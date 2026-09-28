import type { ReactNode } from "react";

interface TableProps {
    headers: string[];
    /** Minimum table width before it scrolls, e.g. "min-w-[500px]". */
    minWidth: string;
    children: ReactNode;
}

/** The admin list table, shown from the `sm` breakpoint up; mobile uses cards. */
export default function Table({ headers, minWidth, children }: TableProps) {
    return (
        <div className="hidden sm:block border border-slate-700 rounded-xl overflow-hidden">
            <table className={`w-full text-left ${minWidth}`}>
                <thead className="border-b border-slate-700">
                <tr>
                    {headers.map((header) => (
                        <th key={header} className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-4 py-4">
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

export function Tr({ children }: { children: ReactNode }) {
    return <tr className="border-b border-slate-700 last:border-0 transition-colors duration-200">{children}</tr>;
}

type CellVariant = "default" | "primary" | "actions";

const cellClasses: Record<CellVariant, string> = {
    default: "text-sm leading-relaxed text-slate-400 px-4 py-4",
    /** The row's main value, e.g. the name. */
    primary: "px-4 py-3 text-white text-sm",
    actions: "px-4 py-3 flex gap-2",
};

export function Td({ variant = "default", children }: { variant?: CellVariant; children: ReactNode }) {
    return <td className={cellClasses[variant]}>{children}</td>;
}
