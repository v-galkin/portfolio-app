import { useEffect, useState } from "react";
import type { ContainerInfo } from "./types";
import type { Auth } from "./Admin";
import {
    getPublicContainers,
    getDashboardContainers,
    getAllContainers,
    startContainer,
    stopContainer,
} from "./api/docker";
import { buttonStyles, textStyles, navbarStyles } from "./styles";
import ContainerTable from "./components/docker/ContainerTable";
import { Link } from 'react-router-dom';

type View = "public" | "dashboard" | "all";

interface Props {
    auth: Auth | null;
    setAuth: (auth: Auth | null) => void;
}

export default function Docker({ auth, setAuth }: Props) {
    const [containers, setContainers] = useState<ContainerInfo[]>([]);
    const [view, setView] = useState<View>("public");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // LOGIN FORM STATE
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [showLogin, setShowLogin] = useState(false);

    // LOAD CONTAINERS
    const load = async (currentView: View, currentAuth: Auth | null) => {
        setLoading(true);
        setError("");
        try {
            let res;
            if (currentView === "public") {
                res = await getPublicContainers();
            } else if (currentView === "dashboard") {
                res = await getDashboardContainers(currentAuth!.username, currentAuth!.password);
            } else {
                res = await getAllContainers(currentAuth!.username, currentAuth!.password);
            }
            setContainers(res.data);
        } catch {
            setError("Failed to load containers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load(view, auth);
    }, [view]);

    // SET CORRECT VIEW WHEN AUTH CHANGES
    useEffect(() => {
        if (auth) {
            setView("dashboard");
            void load("dashboard", auth);
        } else {
            setView("public");
            void load("public", null);
        }
    }, [auth]);

    // LOGIN HANDLER
    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoginError("");
        try {
            const res = await getDashboardContainers(username, password);
            if (res.status === 200) {
                setAuth({ username, password });
                setShowLogin(false);
            }
        } catch {
            setLoginError("Invalid username or password.");
        }
    };

    // START HANDLER
    const handleStart = async (id: string) => {
        if (!auth) return;
        await startContainer(auth.username, auth.password, id);
        void load(view, auth);
    };

    // STOP HANDLER
    const handleStop = async (id: string) => {
        if (!auth) return;
        await stopContainer(auth.username, auth.password, id);
        void load(view, auth);
    };

    return (
        /* PAGE START */
        <div className="min-h-screen bg-slate-900 text-slate-100">

            {/* NAVBAR START */}
            <header className={navbarStyles.navbar}>
                <div className={navbarStyles.container}>

                    {/* LEFT SIDE START */}
                    <div className="flex items-center gap-6">

                        {/* BRAND START */}
                        <h2 className={navbarStyles.brand}>DockerBoard</h2>
                        {/* BRAND END */}

                        {/* VIEW TABS START */}
                        {auth && (
                            <nav className={navbarStyles.nav}>
                                <button
                                    onClick={() => setView("public")}
                                    className={view === "public" ? navbarStyles.linkActive : navbarStyles.link}
                                >
                                    Public
                                </button>
                                <button
                                    onClick={() => setView("dashboard")}
                                    className={view === "dashboard" ? navbarStyles.linkActive : navbarStyles.link}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setView("all")}
                                    className={view === "all" ? navbarStyles.linkActive : navbarStyles.link}
                                >
                                    All Containers
                                </button>
                            </nav>
                        )}
                        {/* VIEW TABS END */}

                    </div>
                    {/* LEFT SIDE END */}

                    {/* RIGHT SIDE START */}
                    <div className="flex items-center gap-3">

                        {/* BACK TO PORTFOLIO LINK START */}
                        <Link to="/" className={navbarStyles.link}>
                            Back to Portfolio
                        </Link>
                        {/* BACK TO PORTFOLIO LINK END */}

                        {/* AUTH BUTTONS START */}
                        {auth ? (
                            <button
                                onClick={() => {
                                    setAuth(null);
                                    setView("public");
                                }}
                                className={buttonStyles.danger}
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowLogin(!showLogin)}
                                className={navbarStyles.linkAccent}
                            >
                                Admin Login
                            </button>
                        )}
                        {/* AUTH BUTTONS END */}

                    </div>
                    {/* RIGHT SIDE END */}

                </div>
            </header>
            {/* NAVBAR END */}

            <main className="p-6 max-w-6xl mx-auto">

                {/* LOGIN FORM START */}
                {!auth && showLogin && (
                    <div className="mb-8 max-w-sm mx-auto bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <h3 className={`${textStyles.h3} mb-4`}>Admin Login</h3>

                        {/* LOGIN ERROR START */}
                        {loginError && (
                            <p className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
                                {loginError}
                            </p>
                        )}
                        {/* LOGIN ERROR END */}

                        <form onSubmit={(e) => { void handleLogin(e); }} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className={textStyles.muted}>Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-slate-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className={textStyles.muted}>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-slate-400"
                                />
                            </div>
                            <button type="submit" className={buttonStyles.primary}>
                                Login
                            </button>
                        </form>
                    </div>
                )}
                {/* LOGIN FORM END */}

                {/* PAGE HEADER START */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className={textStyles.h2}>
                            {view === "public" && "Running Services"}
                            {view === "dashboard" && "Dashboard Containers"}
                            {view === "all" && "All Containers"}
                        </h1>
                        <p className={`${textStyles.muted} text-sm mt-1`}>
                            {containers.length} containers
                        </p>
                    </div>
                    <button onClick={() => void load(view, auth)} className={buttonStyles.secondary}>
                        Refresh
                    </button>
                </div>
                {/* PAGE HEADER END */}

                {/* ERROR STATE START */}
                {error && (
                    <p className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                {/* ERROR STATE END */}

                {/* LOADING STATE START */}
                {loading ? (
                    <p className={textStyles.muted}>Loading containers...</p>
                ) : (
                    /* CONTAINER TABLE START */
                    <ContainerTable
                        containers={containers}
                        isAdmin={!!auth}
                        onStart={handleStart}
                        onStop={handleStop}
                    />
                    /* CONTAINER TABLE END */
                )}
                {/* LOADING STATE END */}

            </main>

        </div>
        /* PAGE END */
    );
}