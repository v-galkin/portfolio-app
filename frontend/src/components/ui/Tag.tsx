import type { ReactNode } from "react";

export default function Tag({ children }: { children: ReactNode }) {
    return <span className="text-xs px-2 py-1 rounded-md bg-slate-700 text-slate-300">{children}</span>;
}
