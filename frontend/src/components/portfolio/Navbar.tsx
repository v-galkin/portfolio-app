import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { NAV_SECTIONS } from "../../constants";
import { findActiveSection } from "./activeSection";

const navbarStyles = {
    navbar: "sticky top-0 z-50 bg-slate-800 border-b border-slate-700",
    container: "max-w-6xl mx-auto px-6 py-3 flex items-center justify-between",
    brand: "text-white font-bold text-lg whitespace-nowrap",
    nav: "hidden lg:flex items-center gap-1",
    link: "px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200",
    linkActive: "px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-600 text-white",
    mobileMenu: "lg:hidden border-t border-slate-700 px-6 py-3 flex flex-col gap-1",
    mobileLink: "px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200",
    icon: "lg:hidden text-slate-400 hover:text-white transition-colors duration-200",
};

export default function Navbar() {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [activeSection, setActiveSection] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const onHome = pathname === "/";

    // Highlight the section being read. A scroll listener (rather than observing elements on
    // mount) also works for sections that appear later, after the home page has loaded its data.
    useEffect(() => {
        if (!onHome) return;
        const update = () => {
            const sections = NAV_SECTIONS
                .map(({ id }) => document.getElementById(id))
                .filter((el): el is HTMLElement => el !== null)
                .map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }));
            // Only a page that can scroll has a "bottom" (a short page, e.g. while loading, doesn't)
            const pageHeight = document.documentElement.scrollHeight;
            const atBottom = pageHeight > window.innerHeight && window.innerHeight + window.scrollY >= pageHeight - 2;
            setActiveSection(findActiveSection(sections, window.innerHeight, atBottom));
        };
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [onHome]);

    // Close the user dropdown when clicking outside it
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const sectionClass = (id: string, inactive: string) =>
        onHome && activeSection === id ? navbarStyles.linkActive : inactive;

    return (
        <header className={navbarStyles.navbar}>
            <div className={navbarStyles.container}>
                <div className="flex items-center gap-6">
                    <Link to="/" className={navbarStyles.brand}>
                        Main Page
                    </Link>
                    <nav className={navbarStyles.nav}>
                        {/* "/#id" works from other pages too: the home page scrolls to the hash once loaded */}
                        {NAV_SECTIONS.map(({ id, label }) => (
                            <a key={id} href={`/#${id}`} className={sectionClass(id, navbarStyles.link)}>
                                {label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <NavLink
                        to="/history"
                        className={({ isActive }) => `hidden lg:block ${isActive ? navbarStyles.linkActive : navbarStyles.link}`}
                    >
                        History
                    </NavLink>
                    {auth ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-haspopup="menu"
                                aria-expanded={dropdownOpen}
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
                    ) : (
                        <Link to="/admin" className={navbarStyles.link}>
                            Login
                        </Link>
                    )}

                    <button
                        className={navbarStyles.icon}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {menuOpen && (
                <nav className={navbarStyles.mobileMenu}>
                    {NAV_SECTIONS.map(({ id, label }) => (
                        <a key={id} href={`/#${id}`} onClick={() => setMenuOpen(false)} className={sectionClass(id, navbarStyles.mobileLink)}>
                            {label}
                        </a>
                    ))}
                    <NavLink
                        to="/history"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) => (isActive ? navbarStyles.linkActive : navbarStyles.mobileLink)}
                    >
                        History
                    </NavLink>
                </nav>
            )}
        </header>
    );
}
