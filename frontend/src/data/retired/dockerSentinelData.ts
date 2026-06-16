// src/data/retired/dockerSentinelData.ts

import type {
    TechBadge,
    ArchitectureNode,
    MetricCard,
    Step,
    AlertTrigger,
    ExitCode,
    ComposeService,
} from "../../types/retired/dockerSentinel";

export const techStack: TechBadge[] = [
    { label: "Java 21" },
    { label: "Spring Boot 3.5" },
    { label: "Docker CLI" },
    { label: "n8n" },
    { label: "SMTP / Gmail" },
    { label: "Docker Compose" },
    { label: "Unix Socket" },
    { label: "Jackson" },
];

export const architectureNodes: ArchitectureNode[] = [
    { label: "Docker Daemon",    icon: "🐳", desc: "unix:///var/run/docker.sock" },
    { label: "→",               icon: null,  desc: null },
    { label: "Docker Sentinel", icon: "🛡️", desc: "Spring Boot · port 8081" },
    { label: "→",               icon: null,  desc: null },
    { label: "n8n Webhook",     icon: "⚡", desc: "Workflow automation" },
    { label: "→",               icon: null,  desc: null },
    { label: "Gmail",           icon: "📧", desc: "Plain text alert email" },
];

export const metricCards: MetricCard[] = [
    { label: "Poll Interval",     value: "60s",       variant: "blue"    },
    { label: "Restart Threshold", value: "≥ 3",       variant: "yellow"  },
    { label: "Deduplication",     value: "In-memory", variant: "purple"  },
    { label: "Alert Channel",     value: "Email",     variant: "emerald" },
];

export const steps: Step[] = [
    {
        number: "01",
        title: "Poll Docker Socket",
        description:
            "Every 60 seconds the scheduler calls the Docker daemon via the Unix socket. It inspects every container — including stopped ones — checking status, exit code, and restart count.",
        icon: "🔌",
        variant: "blue",
    },
    {
        number: "02",
        title: "Detect & Classify",
        description:
            "Containers in exited or dead state trigger a CRITICAL alert. Containers exceeding the restart threshold (≥3) trigger a WARNING. Exit codes are resolved to human-readable reasons — 137 maps to OOMKill/SIGKILL.",
        icon: "🔍",
        variant: "yellow",
    },
    {
        number: "03",
        title: "Deduplicate",
        description:
            "An in-memory map tracks alerted containers to prevent email spam. A new alert only fires when a container goes down for the first time, or when its restart count increases — indicating a crash loop is progressing.",
        icon: "🧩",
        variant: "purple",
    },
    {
        number: "04",
        title: "Dispatch via n8n",
        description:
            "The alert payload — including pre-formatted email subject and body — is POSTed to an n8n webhook. n8n routes it to Gmail via SMTP. The email includes container details, exit reason, and actionable recovery steps.",
        icon: "📧",
        variant: "emerald",
    },
];

export const alertTriggers: AlertTrigger[] = [
    { label: "Container status = exited",  severity: "CRITICAL" },
    { label: "Container status = dead",    severity: "CRITICAL" },
    { label: "Restart count ≥ threshold", severity: "WARNING"  },
];

export const exitCodes: ExitCode[] = [
    { code: "0",   meaning: "Clean exit"                  },
    { code: "1",   meaning: "Application error"           },
    { code: "137", meaning: "OOMKilled / SIGKILL"         },
    { code: "139", meaning: "Segmentation fault"          },
    { code: "143", meaning: "Graceful shutdown (SIGTERM)" },
];

export const composeServices: ComposeService[] = [
    { name: "docker-sentinel", desc: "Spring Boot monitoring service · port 8081", status: "Running" },
    { name: "n8n",             desc: "Workflow automation · port 5678",            status: "Running" },
];

export const emailPreview = `============================================================
DOCKER SENTINEL — CONTAINER ALERT
============================================================

Severity:       CRITICAL
Detected At:    2024-03-14 09:41:05 UTC

------------------------------------------------------------
CONTAINER DETAILS
------------------------------------------------------------
Name:           n8n
ID:             a1b2c3d4e5f6
Image:          n8nio/n8n:1.32.2
Status:         EXITED
Exit Code:      137 (OOMKilled or SIGKILL)
Restart Count:  3
Uptime:         2024-03-14T09:38:12Z

------------------------------------------------------------
SUGGESTED ACTION
------------------------------------------------------------
Exit code 137 indicates OOMKill or SIGKILL.
1. Check memory limits: docker inspect n8n
2. Review recent logs: docker logs n8n --tail 50
3. Increase memory allocation if OOMKilled
4. Restart: docker start n8n

============================================================
Docker Sentinel — automated alert
============================================================`;