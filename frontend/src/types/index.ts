export interface Project {
    id: number;
    name: string;
    description: string;
    techStack: string[];
    url: string | null;
    githubUrl: string | null;
    featured: boolean;
    category: string;
}

export interface Experience {
    id: number;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    location: string;
    responsibilities: string[];
}

export interface Education {
    id: number;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    location: string;
}

export interface Certification {
    id: number;
    name: string;
    issuer: string;
    date: string;
    credentialUrl: string | null;
}

export interface Skill {
    id: number;
    category: string;
    items: string[];
}

export interface HistoryEntry {
    id: number;
    date: string;
    title: string;
    description: string;
    category: string;
}

export interface Profile {
    name: string;
    headline: string | null;
    bio: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    email: string | null;
}
