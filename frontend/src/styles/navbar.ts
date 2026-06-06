export const navbarStyles = {
    navbar: `
        sticky top-0 z-50
        bg-slate-800
        border-b border-slate-700
    `,
    container: `
        max-w-6xl mx-auto
        px-6 py-3
        flex items-center justify-between
    `,
    brand: `
        text-white font-bold text-lg
        whitespace-nowrap
    `,
    nav: `
        hidden lg:flex
        items-center gap-1
    `,
    link: `
        px-3 py-1.5
        rounded-lg
        text-sm font-medium
        text-slate-400 hover:text-white
        hover:bg-slate-700
        transition-colors duration-200
    `,
    linkActive: `
        px-3 py-1.5
        rounded-lg
        text-sm font-medium
        bg-slate-600 text-white
    `,
    linkAccent: `
        px-3 py-1.5
        rounded-lg
        text-sm font-semibold
        text-emerald-400 hover:text-emerald-300
        hover:bg-slate-700
        transition-colors duration-200
    `,
    mobileMenu: `
        lg:hidden
        border-t border-slate-700
        px-6 py-3
        flex flex-col gap-1
    `,
    mobileLink: `
        px-3 py-2
        rounded-lg
        text-sm font-medium
        text-slate-400 hover:text-white
        hover:bg-slate-700
        transition-colors duration-200
    `,
    icon: `
    lg:hidden
    text-slate-400 hover:text-white
    transition-colors duration-200
`,
}