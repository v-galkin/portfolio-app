import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { navbarStyles, buttonStyles, textStyles } from "../styles";
import type { Auth } from "../Admin";

interface Props {
    auth: Auth | null;
    setAuth: (auth: Auth | null) => void;
}

const navLinks = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Certifications", href: "#certifications" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar({ auth, setAuth }: Props) {
    const [activeSection, setActiveSection] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

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

    return (
        /* NAVBAR START */
        <header className={navbarStyles.navbar}>
            <div className={navbarStyles.container}>

                {/* LEFT SIDE START */}
                <div className="flex items-center gap-6">

                    {/* BRAND START */}
                    <h2 className={navbarStyles.brand}>
                        John Doe
                    </h2>
                    {/* BRAND END */}

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

                    {/* LIVE PROJECTS LINK START */}
                    <Link
                        to="/docker"
                        className={navbarStyles.linkAccent}
                    >
                        Live Projects
                    </Link>
                    {/* LIVE PROJECTS LINK END */}

                    {/* AUTH SECTION START */}
                    {auth ? (
                        <>
                            {/* LOGGED IN USER START */}
                            <span className={`${textStyles.muted} text-sm hidden lg:block`}>
                                {auth.username}
                            </span>
                            {/* LOGGED IN USER END */}

                            {/* ADMIN LINK START */}
                            <Link to="/admin" className={navbarStyles.link}>
                                Admin
                            </Link>
                            {/* ADMIN LINK END */}

                            {/* LOGOUT BUTTON START */}
                            <button
                                onClick={() => setAuth(null)}
                                className={buttonStyles.danger}
                            >
                                Logout
                            </button>
                            {/* LOGOUT BUTTON END */}
                        </>
                    ) : (
                        /* ADMIN LOGIN LINK START */
                        <Link to="/admin" className={navbarStyles.link}>
                            Admin
                        </Link>
                        /* ADMIN LOGIN LINK END */
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