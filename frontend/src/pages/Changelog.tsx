import { useEffect, useState } from "react";
import Section from "../components/ui/Section";
import Card from "../components/ui/Card";
import Timeline, { TimelineItem } from "../components/ui/Timeline";
import Footer from "../components/ui/Footer";
import type { HistoryEntry } from "../types";
import { historyApi } from "../api/resources";
import LoadErrorBanner from "../components/portfolio/LoadErrorBanner.tsx";

const categoryColors: Record<string, string> = {
    Infrastructure: "bg-blue-900/40 text-blue-400 border border-blue-800/50",
    Feature:        "bg-emerald-900/40 text-emerald-400 border border-emerald-800/50",
    Bugfix:         "bg-yellow-900/40 text-yellow-400 border border-yellow-800/50",
    Removal:        "bg-red-900/40 text-red-400 border border-red-800/50",
    Migration:      "bg-purple-900/40 text-purple-400 border border-purple-800/50",
    Other:          "bg-slate-700 text-slate-300 border border-slate-600",
};

export default function Changelog() {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        historyApi.list()
            .then((res) => {
                setEntries(res.data);
                setLoadFailed(false);
            })
            .catch(() => setLoadFailed(true))
            .finally(() => setLoading(false));
    }, [reloadKey]);

    const retry = () => {
        setLoading(true);
        setReloadKey((key) => key + 1);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Section title="Changelog">
                <Timeline>
                    {loading ? (
                        <p className="text-slate-500">Loading...</p>
                    ) : loadFailed ? (
                        <LoadErrorBanner message="The changelog couldn't be loaded. Please check your connection and try again." onRetry={retry} />
                    ) : entries.length === 0 ? (
                        <p className="text-slate-500">No history entries yet.</p>
                    ) : (
                        entries.map((entry) => (
                            <TimelineItem key={entry.id}>
                                <Card variant="dark">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                        <h3 className="text-base font-semibold text-white">{entry.title}</h3>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`text-xs px-2 py-0.5 rounded-md ${categoryColors[entry.category] ?? categoryColors.Other}`}>
                                                {entry.category}
                                            </span>
                                            <span className="text-slate-400 text-xs">{entry.date}</span>
                                        </div>
                                    </div>
                                    {entry.description && (
                                        <p className="text-sm leading-relaxed text-slate-400 mt-1 whitespace-pre-line">{entry.description}</p>
                                    )}
                                </Card>
                            </TimelineItem>
                        ))
                    )}
                </Timeline>
            </Section>
            <Footer />
        </div>
    );
}
