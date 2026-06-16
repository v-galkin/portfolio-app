import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout.tsx'
import type { Auth } from './pages/Admin.tsx'

export function Root() {
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
            <Layout auth={auth} setAuth={handleSetAuth} />
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Root />
    </StrictMode>,
)