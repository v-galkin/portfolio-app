import { useEffect, useState } from "react";
import About from "../components/portfolio/About.tsx";
import Experience from "../components/portfolio/Experience.tsx";
import Education from "../components/portfolio/Education.tsx";
import Projects from "../components/portfolio/Projects.tsx";
import Skills from "../components/portfolio/Skills.tsx";
import Certifications from "../components/portfolio/Certifications.tsx";
import Contact from "../components/portfolio/Contact.tsx";
import LoadErrorBanner from "../components/portfolio/LoadErrorBanner.tsx";
import { containerClass } from "../components/ui/Section";
import Footer from "../components/ui/Footer";
import { certificationsApi, educationsApi, experiencesApi, projectsApi, skillsApi } from "../api/resources";
import { loadProfile } from "../api/profile";
import type {
    Profile,
    Project,
    Experience as ExperienceType,
    Education as EducationType,
    Certification,
    Skill,
} from "../types";

function App() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [experiences, setExperiences] = useState<ExperienceType[]>([]);
    const [educations, setEducations] = useState<EducationType[]>([]);
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const fetchAll = async () => {
            // Load each section independently: one failing request shouldn't empty the whole page
            const [proj, exp, edu, cert, skill, prof] = await Promise.allSettled([
                projectsApi.list(),
                experiencesApi.list(),
                educationsApi.list(),
                certificationsApi.list(),
                skillsApi.list(),
                loadProfile(),
            ]);
            if (proj.status === "fulfilled") setProjects(proj.value.data);
            if (exp.status === "fulfilled") setExperiences(exp.value.data);
            if (edu.status === "fulfilled") setEducations(edu.value.data);
            if (cert.status === "fulfilled") setCertifications(cert.value.data);
            if (skill.status === "fulfilled") setSkills(skill.value.data);
            if (prof.status === "fulfilled") setProfile(prof.value);
            setLoadFailed([proj, exp, edu, cert, skill, prof].some((result) => result.status === "rejected"));
            setLoading(false);
        };
        fetchAll();
    }, [reloadKey]);

    // Links like "/#projects" (from the navbar on another page) arrive before the sections
    // exist, so the browser can't scroll to them itself; do it once the data has loaded.
    useEffect(() => {
        if (!loading && window.location.hash) {
            document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
        }
    }, [loading]);

    const retry = () => {
        setLoading(true);
        setReloadKey((key) => key + 1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <p className="text-slate-400 text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">

            {loadFailed && (
                <div className={`${containerClass} pt-6`}>
                    <LoadErrorBanner
                        message="Some of the portfolio couldn't be loaded. Please check your connection and try again."
                        onRetry={retry}
                    />
                </div>
            )}

            <About profile={profile} />
            <Experience experiences={experiences} />
            <Education educations={educations} />
            <Projects projects={projects} />
            <Skills skills={skills} />
            <Certifications certifications={certifications} />
            <Contact profile={profile} />

            <Footer />

        </div>
    );
}

export default App;