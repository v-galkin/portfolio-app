// src/styles/cards.ts

import {
    colorTokens,
    spacingTokens,
    radiusTokens,
    borderTokens,
    transitionTokens,
} from "./tokens";

export const cardStyles = {
    card: [
        colorTokens.slate.bg,
        borderTokens.base,
        colorTokens.slate.border,
        radiusTokens.lg,
        spacingTokens.cardPadding,
        "hover:border-slate-600",
        transitionTokens.base,
    ].join(" "),

    cardFeatured: [
        colorTokens.slate.bgDark,
        borderTokens.base,
        "border-slate-600",
        radiusTokens.lg,
        spacingTokens.cardPadding,
        "hover:border-slate-500",
        transitionTokens.base,
    ].join(" "),

    cardDark: [
        colorTokens.slate.bgDark,
        borderTokens.base,
        colorTokens.slate.border,
        radiusTokens.lg,
        spacingTokens.cardPadding,
        "hover:border-slate-600",
        transitionTokens.base,
    ].join(" "),
};