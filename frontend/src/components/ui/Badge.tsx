import type { ReactNode } from "react";

type Color = "emerald" | "purple" | "yellow";

const base = "text-xs font-semibold px-2 py-0.5 rounded-full border";
const colors: Record<Color, string> = {
    emerald: "text-emerald-400 bg-emerald-900/30 border-emerald-800/50",
    purple: "text-purple-400 bg-purple-900/30 border-purple-800/50",
    yellow: "text-yellow-400 bg-yellow-900/30 border-yellow-800/50",
};

export default function Badge({ color, children }: { color: Color; children: ReactNode }) {
    return <span className={`${base} ${colors[color]}`}>{children}</span>;
}
