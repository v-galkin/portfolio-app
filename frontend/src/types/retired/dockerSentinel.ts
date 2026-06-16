// src/types/retired/dockerSentinel.ts

export type StepVariant     = "blue" | "yellow" | "purple" | "emerald";
export type SeverityVariant = "CRITICAL" | "WARNING";
export type ServiceStatus   = "Running" | "Stopped" | "Restarting";
export type MetricVariant   = "blue" | "yellow" | "purple" | "emerald";

export interface TechBadge        { label: string; }
export interface ArchitectureNode { label: string; icon: string | null; desc: string | null; }
export interface MetricCard       { label: string; value: string; variant: MetricVariant; }
export interface Step             { number: string; title: string; description: string; icon: string; variant: StepVariant; }
export interface AlertTrigger     { label: string; severity: SeverityVariant; }
export interface ExitCode         { code: string; meaning: string; }
export interface ComposeService   { name: string; desc: string; status: ServiceStatus; }