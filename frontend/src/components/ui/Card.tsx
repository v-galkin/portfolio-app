import type { HTMLAttributes } from "react";

type Variant = "default" | "dark" | "featured";

const base = "border rounded-xl p-5 transition-colors duration-200";
const variants: Record<Variant, string> = {
    default: "bg-slate-800 border-slate-700 hover:border-slate-600",
    dark: "bg-slate-900 border-slate-700 hover:border-slate-600",
    featured: "bg-slate-900 border-slate-600 hover:border-slate-500",
};

export default function Card({ variant = "default", className, ...props }: { variant?: Variant } & HTMLAttributes<HTMLDivElement>) {
    return <div className={[base, variants[variant], className].filter(Boolean).join(" ")} {...props} />;
}
