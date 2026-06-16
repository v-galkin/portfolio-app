// src/styles/retired/sentinel.ts

import type { StepVariant, MetricVariant, SeverityVariant, ServiceStatus } from "../../types/retired/dockerSentinel";
import {
    colorTokens,
    spacingTokens,
    radiusTokens,
    typographyTokens,
    borderTokens,
    transitionTokens,
} from "../tokens";

export const stepVariantStyles: Record<StepVariant, { color: string; border: string; bg: string }> = {
    blue:    { color: colorTokens.blue.text,    border: colorTokens.blue.border,    bg: colorTokens.blue.bg    },
    yellow:  { color: colorTokens.yellow.text,  border: colorTokens.yellow.border,  bg: colorTokens.yellow.bg  },
    purple:  { color: colorTokens.purple.text,  border: colorTokens.purple.border,  bg: colorTokens.purple.bg  },
    emerald: { color: colorTokens.emerald.text, border: colorTokens.emerald.border, bg: colorTokens.emerald.bg },
};

export const metricVariantStyles: Record<MetricVariant, string> = {
    blue:    colorTokens.blue.text,
    yellow:  colorTokens.yellow.text,
    purple:  colorTokens.purple.text,
    emerald: colorTokens.emerald.text,
};

const badgeBase = [
    typographyTokens.xs,
    typographyTokens.semibold,
    spacingTokens.badgePadding,
    radiusTokens.full,
    borderTokens.base,
].join(" ");

export const severityBadgeStyles: Record<SeverityVariant, string> = {
    CRITICAL: [badgeBase, colorTokens.red.text,    colorTokens.red.badgeBg,    colorTokens.red.badgeBorder   ].join(" "),
    WARNING:  [badgeBase, colorTokens.yellow.text, colorTokens.yellow.badgeBg, colorTokens.yellow.badgeBorder].join(" "),
};

export const serviceStatusStyles: Record<ServiceStatus, string> = {
    Running:    [badgeBase, colorTokens.emerald.text, colorTokens.emerald.badgeBg, colorTokens.emerald.badgeBorder].join(" "),
    Stopped:    [badgeBase, colorTokens.red.text,     colorTokens.red.badgeBg,     colorTokens.red.badgeBorder    ].join(" "),
    Restarting: [badgeBase, colorTokens.blue.text,    colorTokens.blue.badgeBg,    colorTokens.blue.badgeBorder   ].join(" "),
};

export const exitCodeBadge = [
    badgeBase,
    typographyTokens.mono,
    colorTokens.blue.text,
    colorTokens.blue.badgeBg,
    colorTokens.blue.badgeBorder,
].join(" ");

export const emailPreviewStyles = {
    collapsed: "max-h-32",
    expanded:  "max-h-[600px]",
    base: [
        colorTokens.slate.bgDeep,
        radiusTokens.md,
        borderTokens.base,
        colorTokens.slate.border,
        "overflow-hidden",
        transitionTokens.slow,
    ].join(" "),
    pre: [
        typographyTokens.xs,
        colorTokens.slate.muted,
        typographyTokens.mono,
        spacingTokens.cardPadding,
        "leading-relaxed overflow-x-auto whitespace-pre",
    ].join(" "),
};