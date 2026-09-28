import type { FormEvent, ReactNode } from "react";
import Button from "./Button";

const overlay = "fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4";
const footer = "flex gap-3 mt-2";

interface ModalProps {
    title: string;
    onClose: () => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    /** Form fields, followed by a <ModalFooter>. */
    children: ReactNode;
}

export default function Modal({ title, onClose, onSubmit, children }: ModalProps) {
    return (
        <div className={overlay}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
                    <h3 className="text-white font-semibold">{title}</h3>
                    <button type="button" onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-white text-xl">
                        &times;
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-6 flex flex-col gap-4">
                    {children}
                </form>
            </div>
        </div>
    );
}

export function ModalFooter({ children }: { children: ReactNode }) {
    return <div className={footer}>{children}</div>;
}

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
    busy?: boolean;
    /** Shown between the message and the buttons, e.g. an error. */
    children?: ReactNode;
}

/** A small "Are you sure?" dialog with Cancel and a destructive confirm button. */
export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel, busy, children }: ConfirmDialogProps) {
    return (
        <div className={overlay}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-sm p-6">
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-6">{message}</p>
                {children}
                <div className={footer}>
                    <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
                    <Button variant="danger" onClick={onConfirm} disabled={busy} className="flex-1">{confirmLabel}</Button>
                </div>
            </div>
        </div>
    );
}
