// src/styles/tables.ts

import {
    colorTokens,
    typographyTokens,
    borderTokens,
    transitionTokens,
} from "./tokens";

export const tableStyles = {
    wrapper: [
        "w-full",
        "overflow-x-auto",
    ].join(" "),

    table: [
        "w-full",
        "text-left",
    ].join(" "),

    thead: [
        borderTokens.bottom,
        colorTokens.slate.border,
    ].join(" "),

    th: [
        typographyTokens.h4,
        colorTokens.slate.muted,
        "pb-3 pr-6",
    ].join(" "),

    tr: [
        borderTokens.bottom,
        colorTokens.slate.border,
        "last:border-0",
        transitionTokens.base,
    ].join(" "),

    td: [
        typographyTokens.body,
        colorTokens.slate.muted,
        "py-3 pr-6",
    ].join(" "),

    rowDivider: [
        "py-2",
        borderTokens.bottom,
        colorTokens.slate.border,
        "last:border-0",
        "flex items-center justify-between",
    ].join(" "),
};