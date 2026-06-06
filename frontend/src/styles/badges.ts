// src/styles/badges.ts

import {
    colorTokens,
    typographyTokens,
    spacingTokens,
    radiusTokens,
    borderTokens,
} from "./tokens";

const badgeBase = [
    typographyTokens.xs,
    typographyTokens.semibold,
    spacingTokens.badgePadding,
    radiusTokens.full,
    borderTokens.base,
].join(" ");

const badgeBaseMd = [
    typographyTokens.xs,
    spacingTokens.badgePaddingMd,
    radiusTokens.sm,
].join(" ");

export const badgeStyles = {
    featured: [
        badgeBase,
        colorTokens.emerald.text,
        colorTokens.emerald.badgeBg,
        colorTokens.emerald.badgeBorder,
    ].join(" "),

    ai: [
        badgeBase,
        colorTokens.purple.text,
        colorTokens.purple.badgeBg,
        colorTokens.purple.badgeBorder,
    ].join(" "),

    self: [
        badgeBase,
        colorTokens.yellow.text,
        colorTokens.yellow.badgeBg,
        colorTokens.yellow.badgeBorder,
    ].join(" "),

    success: [
        badgeBase,
        colorTokens.emerald.text,
        colorTokens.emerald.badgeBg,
        colorTokens.emerald.badgeBorder,
    ].join(" "),

    danger: [
        badgeBase,
        colorTokens.red.text,
        colorTokens.red.badgeBg,
        colorTokens.red.badgeBorder,
    ].join(" "),

    info: [
        badgeBase,
        colorTokens.blue.text,
        colorTokens.blue.badgeBg,
        colorTokens.blue.badgeBorder,
    ].join(" "),

    tech: [
        badgeBaseMd,
        colorTokens.slate.bg,
        colorTokens.slate.text,
    ].join(" "),
};