/**
 * Which home-page section the reader is in, for the navbar highlight:
 * - the last section whose top is above 40% of the viewport
 * - at the bottom of the page, the last section
 * - "" above the first section
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
