import Button from "../ui/Button";

interface Props {
    message: string;
    onRetry: () => void;
}

/** Shown to visitors when content couldn't be loaded from the API, instead of empty sections. */
export default function LoadErrorBanner({ message, onRetry }: Props) {
    return (
        <div
            role="alert"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-3"
        >
            <p className="text-red-400 text-sm">{message}</p>
            <Button variant="secondary" size="sm" onClick={onRetry} className="shrink-0">
                Try again
            </Button>
        </div>
    );
}
