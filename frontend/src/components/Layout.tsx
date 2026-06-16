import { useLocation, Routes, Route } from 'react-router-dom'
import Navbar from './portfolio/Navbar.tsx'
import App from '../pages/App.tsx'
import Admin from '../pages/Admin.tsx'
import Changelog from '../pages/Changelog.tsx'
import type { Auth } from '../pages/Admin.tsx'

import DockerSentinel from "../pages/retired/DockerSentinel.tsx";

// Routes where the navbar should be hidden
// (Admin manages its own navbar — shows it only when logged in)
const HIDDEN_NAVBAR_ROUTES = ['/admin'];

interface Props {
    auth: Auth | null;
    setAuth: (auth: Auth | null) => void;
}

export default function Layout({ auth, setAuth }: Props) {
    const location = useLocation();
    const hideNavbar = HIDDEN_NAVBAR_ROUTES.includes(location.pathname);

    return (
        <>
            {/* GLOBAL NAVBAR — hidden on routes that manage their own navbar */}
            {!hideNavbar && <Navbar auth={auth} setAuth={setAuth} />}

            <Routes>
                <Route path="/"        element={<App />} />
                <Route path="/admin"   element={<Admin auth={auth} setAuth={setAuth} />} />
                <Route path="/history" element={<Changelog />} />

                {/* RETIRED PROJECTS — navbar inherited automatically */}
                <Route path="/projects/docker-sentinel" element={<DockerSentinel />} />
            </Routes>
        </>
    );
}