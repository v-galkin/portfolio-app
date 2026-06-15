export interface Project {
    id: number;
    name: string;
    description: string;
    techStack: string[];
    url: string;
    githubUrl: string;
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
    credentialUrl: string;
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

export interface ContainerInfo {
    id: string;
    shortId: string;
    name: string;
    image: string;
    status: string;
    state: string;
    running: boolean;
}

export interface ContainerStats {
    id: string;
    cpuPercent: number;
    memoryUsage: number;
    memoryLimit: number;
    memoryPercent: number;
    networkIn: number;
    networkOut: number;
    restartCount: number;
    uptime: string;
    ports: string;
}
