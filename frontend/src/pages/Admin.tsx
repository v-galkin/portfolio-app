import { useState, type FormEvent } from "react";
import Navbar from "../components/portfolio/Navbar.tsx";
import ProjectsTab from "../components/admin/ProjectsTab.tsx";
import ExperiencesTab from "../components/admin/ExperiencesTab.tsx";
import EducationTab from "../components/admin/EducationTab.tsx";
import SkillsTab from "../components/admin/SkillsTab.tsx";
import CertificationsTab from "../components/admin/CertificationsTab.tsx";
import HistoryTab from "../components/admin/HistoryTab.tsx";
import ProfileTab from "../components/admin/ProfileTab.tsx";
import { Field, Input } from "../components/ui/Form";
import { login } from "../api/auth";
import { toApiError } from "../api/errors";
import { useAuth } from "../context/useAuth";

const tabs = {
    Profile: ProfileTab,
    Projects: ProjectsTab,
    Experiences: ExperiencesTab,
    Education: EducationTab,
    Skills: SkillsTab,
    Certifications: CertificationsTab,
    History: HistoryTab,
};
type TabName = keyof typeof tabs;

export default function Admin() {
    const { auth, setAuth } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<TabName>("Profile");

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const user = await login(username, password);
            setPassword("");
            setAuth(user);
        } catch (err) {
            const apiError = toApiError(err);
            // 401 = wrong credentials; 429 = blocked after too many attempts
            setError(apiError.status === 401 ? "Invalid username or password." : apiError.message);
        }
    };

    if (!auth) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 w-full max-w-sm">
                    <h1 className="text-white text-2xl font-bold mb-2">Admin Login</h1>
                    <p className="text-slate-400 text-sm mb-6">
                        Sign in to manage your portfolio
                    </p>

                    {error && (
                        <p role="alert" className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <Field label="Username">
                            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
                        </Field>
                        <Field label="Password">
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                        </Field>
                        <button
                            type="submit"
                            className="mt-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 text-sm font-medium transition-colors duration-200"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const ActiveTab = tabs[activeTab];

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Navbar />

            <div className="bg-slate-800 border-b border-slate-700">
                <nav className="flex gap-1 overflow-x-auto max-w-6xl mx-auto px-6">
                    {(Object.keys(tabs) as TabName[]).map((tab) => (
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

            <main className="py-6 max-w-6xl mx-auto">
                <ActiveTab onUnauthorized={() => setAuth(null)} />
            </main>
        </div>
    );
}
