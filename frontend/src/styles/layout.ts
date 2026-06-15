// src/styles/layout.ts

import {
    colorTokens,
    typographyTokens,
    borderTokens,
    spacingTokens,
} from "./tokens";

export const layoutStyles = {
    section: [
        spacingTokens.sectionPaddingY,
        spacingTokens.sectionPaddingX,
    ].join(" "),

    sectionAlt: [
        spacingTokens.sectionPaddingY,
        spacingTokens.sectionPaddingX,
        colorTokens.slate.bg,
    ].join(" "),

    container: "max-w-6xl mx-auto px-6",

    sectionTitle: [
        typographyTokens.h2,
        typographyTokens.bold,
        colorTokens.white.text,
        "mb-8 pb-3",
        borderTokens.bottom,
        colorTokens.slate.border,
    ].join(" "),
};