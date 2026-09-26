/**
 * Which home-page section the reader is in, for highlighting the navbar link.
 * It's the last section whose top has scrolled above 40% of the viewport; at the very
 * bottom of the page it's the last section (short sections like Contact may never reach
 * that line). Returns "" above the first section.
 */
export function findActiveSection(
    sections: { id: string; top: number }[],
    viewportHeight: number,
    atBottom: boolean,
): string {
    if (sections.length === 0) return "";
    if (atBottom) return sections[sections.length - 1].id;
    const line = viewportHeight * 0.4;
    let active = "";
    for (const section of sections) {
        if (section.top <= line) active = section.id;
    }
    return active;
}
