// src/styles/buttons.ts

import {
    colorTokens,
    typographyTokens,
    radiusTokens,
    borderTokens,
    transitionTokens,
} from "./tokens";

const buttonBase = [
    typographyTokens.xs,
    radiusTokens.md,
    transitionTokens.base,
].join(" ");

export const buttonStyles = {
    primary: [
        "px-4 py-2",
        colorTokens.slate.bg,
        "hover:bg-slate-600",
        colorTokens.white.text,
        radiusTokens.md,
        "text-sm font-medium",
        transitionTokens.base,
    ].join(" "),

    secondary: [
        "px-4 py-2",
        borderTokens.base,
        "border-slate-600 hover:border-slate-500",
        colorTokens.slate.text,
        "hover:text-white",
        radiusTokens.md,
        "text-sm font-medium",
        transitionTokens.base,
    ].join(" "),

    danger: [
        "px-4 py-2",
        colorTokens.red.badgeBg,
        "hover:bg-red-900/50",
        colorTokens.red.text,
        borderTokens.base,
        colorTokens.red.badgeBorder,
        radiusTokens.md,
        "text-sm font-medium",
        transitionTokens.base,
    ].join(" "),

    sm: [
        "px-3 py-1.5",
        buttonBase,
        "font-medium",
    ].join(" "),

    icon: [
        colorTokens.slate.muted,
        "hover:text-white",
        transitionTokens.base,
    ].join(" "),

    filter: [
        "px-4 py-1.5",
        borderTokens.base,
        "border-slate-600 hover:border-slate-500",
        colorTokens.slate.muted,
        "hover:text-white",
        radiusTokens.md,
        "text-sm font-medium",
        transitionTokens.base,
    ].join(" "),

    filterActive: [
        "px-4 py-1.5",
        "bg-slate-600",
        colorTokens.white.text,
        radiusTokens.md,
        "text-sm font-medium",
        transitionTokens.base,
    ].join(" "),
};