import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import {
    getProjects,
    getExperiences,
    getEducations,
    getCertifications,
    getSkills,
} from "./api/client";
import type {
    Project,
    Experience as ExperienceType,
    Education as EducationType,
    Certification,
    Skill,
} from "./types";
import type { Auth } from "./Admin";

interface Props {
    auth: Auth | null;
    setAuth: (auth: Auth | null) => void;
}

function App({ auth, setAuth }: Props) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [experiences, setExperiences] = useState<ExperienceType[]>([]);
    const [educations, setEducations] = useState<EducationType[]>([]);
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [proj, exp, edu, cert, skill] = await Promise.all([
                    getProjects(),
                    getExperiences(),
                    getEducations(),
                    getCertifications(),
                    getSkills(),
                ]);
                setProjects(proj.data);
                setExperiences(exp.data);
                setEducations(edu.data);
                setCertifications(cert.data);
                setSkills(skill.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // LOADING STATE START
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <p className="text-slate-400 text-lg">Loading...</p>
            </div>
        );
    }
    // LOADING STATE END

    return (
        /* PAGE START */
        <div className="min-h-screen bg-slate-900 text-slate-100">

            {/* NAVBAR START */}
            <Navbar auth={auth} setAuth={setAuth} />
            {/* NAVBAR END */}

            {/* SECTIONS START */}
            <About />
            <Experience experiences={experiences} />
            <Education educations={educations} />
            <Projects projects={projects} />
            <Skills skills={skills} />
            <Certifications certifications={certifications} />
            <Contact />
            {/* SECTIONS END */}

            {/* FOOTER START */}
            <footer className="text-center py-4 text-slate-500 text-sm border-t border-slate-800">
                John Doe © 2026
            </footer>
            {/* FOOTER END */}

        </div>
        /* PAGE END */
    );
}

export default App;