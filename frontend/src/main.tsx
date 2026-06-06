import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Admin from './Admin.tsx'
import Docker from './Docker.tsx'
import type { Auth } from './Admin.tsx'

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
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Root />
    </StrictMode>,
)