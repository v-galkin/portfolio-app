import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProjectsTab from "./components/admin/ProjectsTab";
import ExperiencesTab from "./components/admin/ExperiencesTab";
import EducationTab from "./components/admin/EducationTab";
import SkillsTab from "./components/admin/SkillsTab";
import CertificationsTab from "./components/admin/CertificationsTab";

export interface Auth {
    username: string;
    password: string;
}

interface Props {
    auth: Auth | null;
    setAuth: (auth: Auth | null) => void;
}

const tabs = [
    "Projects",
    "Experiences",
    "Education",
    "Skills",
    "Certifications",
];

export default function Admin({ auth, setAuth }: Props) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("Projects");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("/api/projects", {
                headers: {
                    Authorization: "Basic " + btoa(`${username}:${password}`),
                },
            });
            if (response.ok) {
                setAuth({ username, password });
            } else {
                setError("Invalid username or password.");
            }
        } catch {
            setError("Could not connect to server.");
        }
    };

    // LOGIN FORM START
    if (!auth) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 w-full max-w-sm">

                    {/* LOGIN TITLE START */}
                    <h1 className="text-white text-2xl font-bold mb-2">Admin Login</h1>
                    <p className="text-slate-400 text-sm mb-6">
                        Sign in to manage your portfolio
                    </p>
                    {/* LOGIN TITLE END */}

                    {/* ERROR MESSAGE START */}
                    {error && (
                        <p className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}
                    {/* ERROR MESSAGE END */}

                    {/* LOGIN FORM START */}
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-400 text-sm font-medium">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-slate-400 transition-colors"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-400 text-sm font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-slate-400 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 text-sm font-medium transition-colors duration-200"
                        >
                            Login
                        </button>
                    </form>
                    {/* LOGIN FORM END */}

                </div>
            </div>
        );
    }
    // LOGIN FORM END

    // ADMIN DASHBOARD START
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">

            {/* NAVBAR START */}
            <header className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">

                {/* NAVBAR TITLE START */}
                <h1 className="text-white font-bold text-lg">Admin Panel</h1>
                {/* NAVBAR TITLE END */}

                {/* NAVBAR ACTIONS START */}
                <div className="flex items-center gap-4">

                    {/* LOGGED IN USER START */}
                    <span className="text-slate-400 text-sm">
                        Logged in as <span className="text-white">{auth.username}</span>
                    </span>
                    {/* LOGGED IN USER END */}

                    {/* LOGOUT BUTTON START */}
                    <button
                        onClick={() => {
                            setAuth(null);
                            navigate("/");
                        }}
                        className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/50 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                        Logout
                    </button>
                    {/* LOGOUT BUTTON END */}

                    {/* VIEW SITE LINK START */}
                    <Link
                        to="/"
                        className="px-3 py-1.5 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                        View Site
                    </Link>
                    {/* VIEW SITE LINK END */}

                </div>
                {/* NAVBAR ACTIONS END */}

            </header>
            {/* NAVBAR END */}

            {/* TAB NAVIGATION START */}
            <div className="bg-slate-800 border-b border-slate-700 px-6">
                <nav className="flex gap-1 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                                activeTab === tab
                                    ? "border-white text-white"
                                    : "border-transparent text-slate-400 hover:text-white"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            {/* TAB NAVIGATION END */}

            {/* TAB CONTENT START */}
            <main className="p-6 max-w-6xl mx-auto">
                {activeTab === "Projects" && <ProjectsTab auth={auth} />}
                {activeTab === "Experiences" && <ExperiencesTab auth={auth} />}
                {activeTab === "Education" && <EducationTab auth={auth} />}
                {activeTab === "Skills" && <SkillsTab auth={auth} />}
                {activeTab === "Certifications" && <CertificationsTab auth={auth} />}
            </main>
            {/* TAB CONTENT END */}

        </div>
    );
    // ADMIN DASHBOARD END
}