// src/styles/tokens.ts

// ── Raw design tokens — single source of truth ────────────────────────────────
// All Tailwind strings live here. Every other style file references these tokens.

export const colorTokens = {
    blue: {
        text:   "text-blue-400",
        border: "border-blue-800/40",
        bg:     "bg-blue-900/10",
        badgeBg: "bg-blue-900/30",
        badgeBorder: "border-blue-800/50",
    },
    yellow: {
        text:   "text-yellow-400",
        border: "border-yellow-800/40",
        bg:     "bg-yellow-900/10",
        badgeBg: "bg-yellow-900/30",
        badgeBorder: "border-yellow-800/50",
    },
    purple: {
        text:   "text-purple-400",
        border: "border-purple-800/40",
        bg:     "bg-purple-900/10",
        badgeBg: "bg-purple-900/30",
        badgeBorder: "border-purple-800/50",
    },
    emerald: {
        text:   "text-emerald-400",
        border: "border-emerald-800/40",
        bg:     "bg-emerald-900/10",
        badgeBg: "bg-emerald-900/30",
        badgeBorder: "border-emerald-800/50",
    },
    red: {
        text:   "text-red-400",
        border: "border-red-800/40",
        bg:     "bg-red-900/10",
        badgeBg: "bg-red-900/30",
        badgeBorder: "border-red-800/50",
    },
    slate: {
        text:   "text-slate-300",
        border: "border-slate-700",
        bg:     "bg-slate-800",
        bgDark: "bg-slate-900",
        bgDeep: "bg-slate-950",
        muted:  "text-slate-400",
        subtle: "text-slate-500",
    },
    white: {
        text: "text-white",
    },
} as const;

export const spacingTokens = {
    badgePadding:  "px-2 py-0.5",
    badgePaddingMd: "px-2 py-1",
    cardPadding:   "p-5",
    sectionPaddingY: "py-20",
    sectionPaddingX: "px-6",
} as const;

export const radiusTokens = {
    sm:   "rounded-md",
    md:   "rounded-lg",
    lg:   "rounded-xl",
    full: "rounded-full",
} as const;

export const typographyTokens = {
    h1:      "text-4xl font-bold",
    h2:      "text-2xl font-bold",
    h3:      "text-base font-semibold",
    h4:      "text-xs font-semibold uppercase tracking-wider",
    body:    "text-sm leading-relaxed",
    xs:      "text-xs",
    mono:    "font-mono",
    semibold: "font-semibold",
    bold:    "font-bold",
} as const;

export const transitionTokens = {
    base:   "transition-colors duration-200",
    slow:   "transition-all duration-300",
} as const;

export const borderTokens = {
    base:   "border",
    bottom: "border-b",
    top:    "border-t",
    divider: "border-t border-slate-700/50",
} as const;