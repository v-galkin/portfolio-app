import { useState } from "react";
import type { ContainerInfo, ContainerStats } from "../../types";
import { tableStyles, buttonStyles, badgeStyles, textStyles } from "../../styles";
import { getContainerStats } from "../../api/docker";

interface Props {
    containers: ContainerInfo[];
    isAdmin: boolean;
    onStart: (id: string) => void;
    onStop: (id: string) => void;
}

// FORMAT BYTES TO HUMAN READABLE
function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
}

// PROGRESS BAR COMPONENT
function ProgressBar({ percent }: { percent: number }) {
    const color = percent > 80 ? "bg-red-500" : percent > 60 ? "bg-yellow-500" : "bg-emerald-500";
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                <div
                    className={`${color} h-1.5 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                />
            </div>
            <span className="text-xs text-slate-400 w-12 text-right">
                {percent.toFixed(1)}%
            </span>
        </div>
    );
}

export default function ContainerTable({ containers, isAdmin, onStart, onStop }: Props) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [stats, setStats] = useState<Record<string, ContainerStats>>({});
    const [loadingStats, setLoadingStats] = useState<Record<string, boolean>>({});

    // TOGGLE ROW EXPANSION AND FETCH STATS
    const handleToggle = async (container: ContainerInfo) => {
        if (expandedId === container.id) {
            setExpandedId(null);
            return;
        }
        setExpandedId(container.id);

        // ONLY FETCH STATS FOR RUNNING CONTAINERS
        if (!container.running || stats[container.id]) return;

        setLoadingStats((prev) => ({ ...prev, [container.id]: true }));
        try {
            const res = await getContainerStats(container.id);
            setStats((prev) => ({ ...prev, [container.id]: res.data }));
        } catch {
            console.error("Failed to fetch stats for", container.id);
        } finally {
            setLoadingStats((prev) => ({ ...prev, [container.id]: false }));
        }
    };

    return (
        /* TABLE WRAPPER START */
        <div className={tableStyles.wrapper}>
            <table className={tableStyles.table}>

                {/* TABLE HEAD START */}
                <thead className={tableStyles.thead}>
                <tr>
                    <th className={tableStyles.th}>Name</th>
                    <th className={tableStyles.th}>Image</th>
                    <th className={tableStyles.th}>Short ID</th>
                    <th className={tableStyles.th}>Status</th>
                    <th className={tableStyles.th}>State</th>
                    {/* ACTIONS COLUMN - ADMIN ONLY START */}
                    {isAdmin && (
                        <th className={tableStyles.th}>Actions</th>
                    )}
                    {/* ACTIONS COLUMN - ADMIN ONLY END */}
                </tr>
                </thead>
                {/* TABLE HEAD END */}

                {/* TABLE BODY START */}
                <tbody>

                {/* EMPTY STATE START */}
                {containers.length === 0 ? (
                    <tr>
                        <td colSpan={isAdmin ? 6 : 5} className="px-4 py-8 text-center text-slate-500 text-sm">
                            No containers found.
                        </td>
                    </tr>
                ) : (

                    containers.map((container) => (
                        <>
                            {/* CONTAINER ROW START */}
                            <tr
                                key={container.id}
                                className={`${tableStyles.tr} cursor-pointer`}
                                onClick={() => handleToggle(container)}
                            >
                                {/* NAME CELL START */}
                                <td className={tableStyles.td}>
                                    <div className="flex items-center gap-2 text-white text-sm">
                                            <span className={`text-xs transition-transform duration-200 ${expandedId === container.id ? "rotate-90" : ""}`}>
                                                ▶
                                            </span>
                                        {container.name}
                                    </div>
                                </td>
                                {/* NAME CELL END */}

                                {/* IMAGE CELL START */}
                                <td className={tableStyles.td}>
                                    {container.image}
                                </td>
                                {/* IMAGE CELL END */}

                                {/* SHORT ID CELL START */}
                                <td className="px-4 py-3 font-mono text-xs text-slate-400">
                                    {container.shortId}
                                </td>
                                {/* SHORT ID CELL END */}

                                {/* STATUS CELL START */}
                                <td className={tableStyles.td}>
                                    {container.status}
                                </td>
                                {/* STATUS CELL END */}

                                {/* STATE BADGE CELL START */}
                                <td className={tableStyles.td}>
                                        <span className={container.running ? badgeStyles.success : badgeStyles.danger}>
                                            {container.state}
                                        </span>
                                </td>
                                {/* STATE BADGE CELL END */}

                                {/* ACTIONS CELL - ADMIN ONLY START */}
                                {isAdmin && (
                                    <td
                                        className="px-4 py-3"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {container.running ? (
                                            /* STOP BUTTON START */
                                            <button
                                                onClick={() => onStop(container.id)}
                                                className={`${buttonStyles.sm} ${buttonStyles.danger}`}
                                            >
                                                Stop
                                            </button>
                                            /* STOP BUTTON END */
                                        ) : (
                                            /* START BUTTON START */
                                            <button
                                                onClick={() => onStart(container.id)}
                                                className={`${buttonStyles.sm} bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 rounded-lg font-medium transition-colors duration-200`}
                                            >
                                                Start
                                            </button>
                                            /* START BUTTON END */
                                        )}
                                    </td>
                                )}
                                {/* ACTIONS CELL - ADMIN ONLY END */}

                            </tr>
                            {/* CONTAINER ROW END */}

                            {/* EXPANDED ROW START */}
                            {expandedId === container.id && (
                                <tr key={`${container.id}-stats`} className="bg-slate-800/50">
                                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-4">

                                        {/* STOPPED CONTAINER MESSAGE START */}
                                        {!container.running ? (
                                            <p className={textStyles.muted}>
                                                Container is not running — no stats available.
                                            </p>
                                        ) : loadingStats[container.id] ? (
                                            /* LOADING STATE START */
                                            <p className={textStyles.muted}>Loading stats...</p>
                                            /* LOADING STATE END */
                                        ) : stats[container.id] ? (
                                            /* STATS GRID START */
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                                                {/* CPU STAT START */}
                                                <div>
                                                    <p className={`${textStyles.h4} mb-2`}>CPU Usage</p>
                                                    <ProgressBar percent={stats[container.id].cpuPercent} />
                                                </div>
                                                {/* CPU STAT END */}

                                                {/* MEMORY STAT START */}
                                                <div>
                                                    <p className={`${textStyles.h4} mb-2`}>Memory</p>
                                                    <ProgressBar percent={stats[container.id].memoryPercent} />
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {formatBytes(stats[container.id].memoryUsage)} / {formatBytes(stats[container.id].memoryLimit)}
                                                    </p>
                                                </div>
                                                {/* MEMORY STAT END */}

                                                {/* NETWORK STAT START */}
                                                <div>
                                                    <p className={`${textStyles.h4} mb-2`}>Network</p>
                                                    <p className="text-xs text-slate-400">
                                                        ↓ {formatBytes(stats[container.id].networkIn)}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        ↑ {formatBytes(stats[container.id].networkOut)}
                                                    </p>
                                                </div>
                                                {/* NETWORK STAT END */}

                                                {/* CONTAINER INFO START */}
                                                <div>
                                                    <p className={`${textStyles.h4} mb-2`}>Info</p>
                                                    <p className="text-xs text-slate-400">
                                                        Uptime: {stats[container.id].uptime || "N/A"}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Restarts: {stats[container.id].restartCount}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Ports: {stats[container.id].ports || "None"}
                                                    </p>
                                                </div>
                                                {/* CONTAINER INFO END */}

                                            </div>
                                            /* STATS GRID END */
                                        ) : (
                                            <p className={textStyles.muted}>No stats available.</p>
                                        )}
                                        {/* STOPPED CONTAINER MESSAGE END */}

                                    </td>
                                </tr>
                            )}
                            {/* EXPANDED ROW END */}
                        </>
                    ))
                )}

                </tbody>
                {/* TABLE BODY END */}

            </table>
        </div>
        /* TABLE WRAPPER END */
    );
}