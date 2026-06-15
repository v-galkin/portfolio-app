import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './pages/App.tsx'
import Admin from './pages/Admin.tsx'
import Docker from './pages/Docker.tsx'
import Changelog from './pages/Changelog.tsx'
import type { Auth } from './pages/Admin.tsx'

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
    const [auth, setAuth] = useState<Auth | null>(() => {
        const stored = sessionStorage.getItem('auth');
        return stored ? JSON.parse(stored) as Auth : null;
    });

    const handleSetAuth = (newAuth: Auth | null) => {
        if (newAuth) {
            sessionStorage.setItem('auth', JSON.stringify(newAuth));
        } else {
            sessionStorage.removeItem('auth');
        }
        setAuth(newAuth);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App auth={auth} setAuth={handleSetAuth} />} />
                <Route path="/admin" element={<Admin auth={auth} setAuth={handleSetAuth} />} />
                <Route path="/docker" element={<Docker auth={auth} setAuth={handleSetAuth} />} />
                <Route path="/history" element={<Changelog auth={auth} setAuth={handleSetAuth} />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Root />
    </StrictMode>,
)