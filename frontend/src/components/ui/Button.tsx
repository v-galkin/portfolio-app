import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md";

const base = "px-4 py-2 rounded-lg font-medium transition-colors duration-200";
const sizes: Record<Size, string> = {
    md: "text-sm",
    sm: "text-xs",
};
const variants: Record<Variant, string> = {
    primary: "bg-slate-800 hover:bg-slate-600 text-white",
    secondary: "border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white",
    danger: "bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/50",
};

interface StyleProps {
    variant?: Variant;
    size?: Size;
}

const classes = ({ variant = "primary", size = "md" }: StyleProps, className?: string) =>
    [base, sizes[size], variants[variant], className].filter(Boolean).join(" ");

export default function Button({ variant, size, className, type = "button", ...props }: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button type={type} className={classes({ variant, size }, className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
    return <a className={classes({ variant, size }, className)} {...props} />;
}
