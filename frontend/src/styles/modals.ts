export const modalStyles = {
    overlay: `
        fixed inset-0
        bg-black/60
        flex items-center justify-center
        z-50 px-4
    `,
    modal: `
        bg-slate-800
        border border-slate-700
        rounded-xl
        w-full max-w-lg
        max-h-[90vh]
        overflow-y-auto
    `,
    modalSm: `
        bg-slate-800
        border border-slate-700
        rounded-xl
        w-full max-w-sm
        p-6
    `,
    header: `
        flex justify-between items-center
        px-6 py-4
        border-b border-slate-700
    `,
    title: `
        text-white font-semibold
    `,
    closeBtn: `
        text-slate-400 hover:text-white
        text-xl
    `,
    body: `
        p-6
        flex flex-col
        gap-4
    `,
    footer: `
        flex gap-3
        mt-2
    `,
}