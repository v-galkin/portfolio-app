import { layoutStyles, buttonStyles, textStyles } from "../../styles";

export default function About() {
    return (
        /* SECTION START */
        <section id="about" className={layoutStyles.section}>
            <div className={layoutStyles.container}>
                <div className="flex flex-col gap-6">
                    <div>
                        {/* NAME START */}
                        <h1 className={`${textStyles.h1} mb-2`}>
                            Vitalii Galkin
                        </h1>
                        {/* NAME END */}
                        {/* TITLE START */}
                        <h3 className="text-xl text-slate-400 font-normal mb-4">
                            Engineer transitioning into Software & Automation
                        </h3>
                        {/* TITLE END */}
                        {/* BIO START */}
                        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mb-6">
                            Engineer transitioning into software and automation, with a background
                            in real-world control systems and hands-on experience building ML pipelines,
                            containerised APIs, and workflow automations. Currently completing a
                            Bachelor of Computer Science at the University of London. Based in Auckland, NZ.
                        </p>
                        {/* BIO END */}
                        {/* ACTION BUTTONS START */}
                        <div className="flex gap-3 flex-wrap">
                            {/* GITHUB BUTTON START */}
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={buttonStyles.secondary}
                            >
                                GitHub
                            </a>
                            {/* GITHUB BUTTON END */}
                            {/* LINKEDIN BUTTON START */}
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={buttonStyles.secondary}
                            >
                                LinkedIn
                            </a>
                            {/* LINKEDIN BUTTON END */}
                        </div>
                        {/* ACTION BUTTONS END */}
                    </div>
                </div>
            </div>
        </section>
        /* SECTION END */
    );
}