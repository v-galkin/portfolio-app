import { useLocation, Routes, Route } from 'react-router-dom'
import Navbar from './portfolio/Navbar.tsx'
import App from '../pages/App.tsx'
import Admin from '../pages/Admin.tsx'
import Changelog from '../pages/Changelog.tsx'
import NotFound from '../pages/NotFound.tsx'

// Admin renders its own navbar (only after login), so the global one is hidden there
const HIDDEN_NAVBAR_ROUTES = ['/admin'];

export default function Layout() {
    const location = useLocation();
    const hideNavbar = HIDDEN_NAVBAR_ROUTES.includes(location.pathname);

    return (
        <>
            {!hideNavbar && <Navbar />}

            <Routes>
                <Route path="/"        element={<App />} />
                <Route path="/admin"   element={<Admin />} />
                <Route path="/history" element={<Changelog />} />
                <Route path="*"        element={<NotFound />} />
            </Routes>
        </>
    );
}
