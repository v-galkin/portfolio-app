import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { navbarStyles } from "../../styles";
import type { Auth } from "../../pages/Admin.tsx";

interface Props {
    auth: Auth | null;
    setAuth: (auth: Auth | null) => void;
}

const navLinks: { label: string; href: string }[] = [];

export default function Navbar({ auth, setAuth }: Props) {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sections = document.querySelectorAll("section[id]");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-40% 0px -55% 0px" }
        );
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    // CLOSE DROPDOWN ON OUTSIDE CLICK
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        /* NAVBAR START */
        <header className={navbarStyles.navbar}>
            <div className={navbarStyles.container}>

                {/* LEFT SIDE START */}
                <div className="flex items-center gap-6">

                    {/* MAIN PAGE LINK START */}
                    <Link to="/" className={navbarStyles.brand}>
                        Main Page
                    </Link>
                    {/* MAIN PAGE LINK END */}

                    {/* HISTORY PAGE LINK START */}
                    <Link to="/history" className={navbarStyles.brand}>
                        History
                    </Link>
                    {/* MAIN PAGE LINK END */}

                    {/* DESKTOP NAV START */}
                    <nav className={navbarStyles.nav}>
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={
                                    activeSection === link.href.replace("#", "")
                                        ? navbarStyles.linkActive
                                        : navbarStyles.link
                                }
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    {/* DESKTOP NAV END */}

                </div>
                {/* LEFT SIDE END */}

                {/* RIGHT SIDE START */}
                <div className="flex items-center gap-3">

                    {/* AUTH SECTION START */}
                    {auth ? (
                        /* ADMIN DROPDOWN START */
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={navbarStyles.link}
                            >
                                {auth.username} ▾
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                                    <Link
                                        to="/admin"
                                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-t-lg"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Admin Panel
                                    </Link>
                                    <button
                                        onClick={() => { setAuth(null); setDropdownOpen(false); navigate("/"); }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-b-lg"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                        /* ADMIN DROPDOWN END */
                    ) : (
                        /* LOGIN LINK START */
                        <Link to="/admin" className={navbarStyles.link}>
                            Login
                        </Link>
                        /* LOGIN LINK END */
                    )}
                    {/* AUTH SECTION END */}

                    {/* MOBILE HAMBURGER BUTTON START */}
                    <button
                        className={navbarStyles.icon}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                    {/* MOBILE HAMBURGER BUTTON END */}

                </div>
                {/* RIGHT SIDE END */}

            </div>

            {/* MOBILE MENU START */}
            {menuOpen && (
                <nav className={navbarStyles.mobileMenu}>
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={
                                activeSection === link.href.replace("#", "")
                                    ? navbarStyles.linkActive
                                    : navbarStyles.mobileLink
                            }
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            )}
            {/* MOBILE MENU END */}

        </header>
        /* NAVBAR END */
    );
}