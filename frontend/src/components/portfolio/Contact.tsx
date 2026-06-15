import { layoutStyles, cardStyles, buttonStyles } from "../../styles";

export default function Contact() {
    return (
        /* SECTION START */
        <section id="contact" className={layoutStyles.section}>
            <div className={layoutStyles.container}>

                {/* SECTION TITLE START */}
                <h2 className={layoutStyles.sectionTitle}>
                    Contact
                </h2>
                {/* SECTION TITLE END */}

                {/* CONTACT CARD START */}
                <div className={`${cardStyles.card} p-10 text-center`}>
                    {/* CONTACT BUTTONS START */}
                    <div className="flex gap-3 justify-center flex-wrap">

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

                    </div>
                    {/* CONTACT BUTTONS END */}

                </div>
                {/* CONTACT CARD END */}

            </div>
        </section>
        /* SECTION END */
    );
}