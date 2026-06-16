import { useEffect, useState } from "react";
import { layoutStyles, textStyles, cardStyles } from "../styles";
import type { HistoryEntry } from "../types";
import { getHistory } from "../api/client";

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

    useEffect(() => {
        getHistory().then((res) => setEntries(res.data));
    }, []);

    return (
        /* PAGE START */
        <div className="min-h-screen bg-slate-900 text-slate-100">

            {/* SECTION START */}
            <section className={layoutStyles.section}>
                <div className={layoutStyles.container}>

                    {/* TITLE START */}
                    <h2 className={layoutStyles.sectionTitle}>Changelog</h2>
                    {/* TITLE END */}

                    {/* TIMELINE START */}
                    <div className="flex flex-col gap-6 pl-6 border-l-2 border-slate-700">

                        {entries.length === 0 ? (
                            <p className={textStyles.secondary}>No history entries yet.</p>
                        ) : (
                            entries.map((entry) => (
                                <div key={entry.id} className="relative">

                                    {/* TIMELINE MARKER START */}
                                    <div className="absolute -left-[31px] top-5 w-3 h-3 rounded-full bg-slate-500 border-2 border-slate-900" />
                                    {/* TIMELINE MARKER END */}

                                    {/* ENTRY CARD START */}
                                    <div className={cardStyles.cardDark}>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                            <h3 className={textStyles.h3}>{entry.title}</h3>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`text-xs px-2 py-0.5 rounded-md ${categoryColors[entry.category] ?? categoryColors.Other}`}>
                                                    {entry.category}
                                                </span>
                                                <span className={`${textStyles.muted} text-xs`}>{entry.date}</span>
                                            </div>
                                        </div>
                                        {entry.description && (
                                            <p className={`${textStyles.body} mt-1 whitespace-pre-line`}>{entry.description}</p>
                                        )}
                                    </div>
                                    {/* ENTRY CARD END */}

                                </div>
                            ))
                        )}

                    </div>
                    {/* TIMELINE END */}

                </div>
            </section>
            {/* SECTION END */}

            {/* FOOTER START */}
            <footer className="text-center py-4 text-slate-500 text-sm border-t border-slate-800">
                Vitalii Galkin © 2026
            </footer>
            {/* FOOTER END */}

        </div>
        /* PAGE END */
    );
}
