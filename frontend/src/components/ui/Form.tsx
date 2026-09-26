import { cloneElement, useId, type InputHTMLAttributes, type ReactElement, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

const control = "bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-slate-400 transition-colors";

/** A labelled form field. The label is linked to the control, so clicking it focuses the input. */
export function Field({ label, children }: { label: string; children: ReactElement<{ id?: string }> }) {
    const id = useId();
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-slate-400 text-sm font-medium">{label}</label>
            {cloneElement(children, { id })}
        </div>
    );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return <input className={[control, className].filter(Boolean).join(" ")} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea className={`${control} resize-none`} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
    return <select className={control} {...props} />;
}
