// Name, bio and profile links now come from the backend (/api/profile), edited in Admin → Profile.

/** Home page sections linked from the navbar; `id` must match the section's id. */
export const NAV_SECTIONS = [
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "certifications", label: "Certifications" },
    { id: "contact", label: "Contact" },
];

/** Project categories as stored by the backend, with their display labels. */
export const PROJECT_CATEGORIES = [
    { value: "self-built", label: "Self Built" },
    { value: "ai-assisted", label: "AI Assisted" },
];
