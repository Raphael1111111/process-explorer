import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

import "@/buzzfree.css";

type NavItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

const navItems: NavItem[] = [
  { label: "Key Notes", href: "https://buzzfree.tech/de/key-notes.html" },
  { label: "Formate", href: "https://buzzfree.tech/de/formate.html" },
  {
    label: "Strategie & Beratung",
    href: "https://buzzfree.tech/de/strategie-beratung.html",
    children: [
      { label: "Strategie", href: "https://buzzfree.tech/de/strategie-beratung/strategie.html" },
      { label: "Beratung", href: "https://buzzfree.tech/de/strategie-beratung/beratung.html" },
    ],
  },
  { label: "About", href: "https://buzzfree.tech/de/about.html" },
  { label: "Kontakt", href: "https://buzzfree.tech/de/kontakt.html" },
];

const serviceCards = [
  {
    title: "Trainings Formate",
    description: "Workshops, Trainings & E-Learning: KI-Kompetenz für Teams und Führungskräfte.",
    href: "https://buzzfree.tech/de/strategie-beratung/strategie.html",
    image: "/buzzfree-assets/jason_goodman_Oalh2MojUuk_unsplash.jpg",
  },
  {
    title: "KI Champions Programm",
    description:
      "Das Multiplikator:innen-Programm für KI-Skills und Kulturwandel in Ihrer Organisation.",
    href: "https://buzzfree.tech/de/strategie-beratung/strategie.html",
    image: "/buzzfree-assets/jason_goodman_vbxyFxlgpjM_unsplash.jpg",
  },
  {
    title: "Strategie & Beratung",
    description: "Von der KI-Vision zur konkreten Umsetzung - strategisch begleitet.",
    href: "https://buzzfree.tech/de/strategie-beratung/strategie.html",
    image: "/buzzfree-assets/redd_francisco_PTRzqc_h1r4_unsplash.jpg",
  },
  {
    title: "Keynotes",
    description: "KI-Transformation auf die Bühne bringen - verständlich, pointiert, wirkungsvoll.",
    href: "https://buzzfree.tech/de/key-notes.html",
    image: "/buzzfree-assets/_YZ_9581LR.jpg",
  },
];

const referenceLogos = [
  { alt: "Akaki", src: "/buzzfree-assets/akaki.png" },
  { alt: "SalzburgerLand", src: "/buzzfree-assets/salzburgerland.png" },
  { alt: "APA Campus", src: "/buzzfree-assets/apacampus.png" },
  { alt: "ARS Akademie", src: "/buzzfree-assets/arsaca.png" },
  { alt: "IMH", src: "/buzzfree-assets/imh.png" },
  { alt: "Land Salzburg", src: "/buzzfree-assets/landsalzburg.png" },
  { alt: "LSZ", src: "/buzzfree-assets/lsz.png" },
  { alt: "Salzburg Research", src: "/buzzfree-assets/sresearch.png" },
  { alt: "TecTrain", src: "/buzzfree-assets/tectrain.png" },
  { alt: "Verbund", src: "/buzzfree-assets/verbund.png" },
  { alt: "WU Executive Academy", src: "/buzzfree-assets/wueaca.png" },
];

const footerLinks = [
  { label: "Datenschutz", href: "https://buzzfree.tech/de/datenschutz.html" },
  { label: "Impressum", href: "https://buzzfree.tech/de/impressum.html" },
];

const Buzzfree = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "BuzzFree Technology";
    window.scrollTo(0, 0);
  }, []);

      return (
    <div className="buzzfree-page">
      <header className="buzzfree-header">
        <div className="buzzfree-container buzzfree-header-inner">
          <a className="buzzfree-logo-link" href="/buzzfree" aria-label="BuzzFree Technology Startseite">
            <img
              className="buzzfree-logo"
              src="/buzzfree-assets/BuzzFreeTechnology.svg"
              alt="BuzzFree Technology"
            />
          </a>

          <button
            type="button"
            className="buzzfree-menu-button"
            aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={mobileMenuOpen}
            aria-controls="buzzfree-mobile-navigation"
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className="buzzfree-nav-desktop" aria-label="Hauptnavigation">
            <ul className="buzzfree-nav-list">
              {navItems.map((item) => (
                <li
                  key={item.label}
                  className={
                    item.children ? "buzzfree-nav-item buzzfree-nav-item-has-children" : "buzzfree-nav-item"
                  }
                >
                  <a className="buzzfree-nav-link" href={item.href}>
                    <span>{item.label}</span>
                    {item.children ? <ChevronDown size={14} className="buzzfree-nav-caret" /> : null}
                  </a>

                  {item.children ? (
                    <ul className="buzzfree-subnav">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <a href={child.href}>{child.label}</a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {mobileMenuOpen ? (
          <div className="buzzfree-container buzzfree-mobile-panel">
            <nav id="buzzfree-mobile-navigation" className="buzzfree-nav-mobile" aria-label="Mobile Hauptnavigation">
              {navItems.map((item) => (
                <div key={item.label} className="buzzfree-mobile-item">
                  <a className="buzzfree-mobile-link" href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </a>

                  {item.children ? (
                    <div className="buzzfree-mobile-subnav">
                      {item.children.map((child) => (
                        <a key={child.label} href={child.href} onClick={() => setMobileMenuOpen(false)}>
                          {child.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
          </div>
        ) : null}
      </header>

      <main>
        <section className="buzzfree-hero" aria-label="BuzzFree Hero">
          <img
            className="buzzfree-hero-image"
            src="/buzzfree-assets/BannerHome.jpg"
            alt="BuzzFree Technology Hero"
          />
        </section>

        <section className="buzzfree-title-section">
          <div className="buzzfree-container">
            <h1 className="buzzfree-page-title">BuzzFree Technology</h1>
          </div>
        </section>

        <section className="buzzfree-section buzzfree-intro-section">
          <div className="buzzfree-container buzzfree-copy-card">
            <h2 className="buzzfree-section-kicker">Technologie ohne Buzz</h2>
            <p>
              <strong>buzzfree.tech -</strong> Ihre Brücke zwischen Innovation, Technlogie und
              Kreativität. Ich begleite Sie durch die komplexe Welt neuer Technologien - ganz ohne
              Buzzwords und leere Phrasen. Stattdessen biete ich Klarheit, Strategie und einen
              Fokus auf das Wesentliche - den Menschen.
            </p>
            <p>
              <strong>Technologischer Wandel beginnt mit Menschen.</strong>
              <br />
              Ich helfe Unternehmen dabei, die Möglichkeiten von KI, Daten und anderen
              Zukunftstechnologien zu verstehen, sinnvoll einzusetzen und in die Unternehmenskultur
              zu integrieren. Mein Ansatz ist praxisnah, kreativ und immer menschenzentriert.
              Gemeinsam gestalten wir den digitalen Change so, dass er greifbar, nachhaltig und
              inspirierend wird.
            </p>
          </div>
        </section>

        <section className="buzzfree-section buzzfree-section-accent">
          <div className="buzzfree-container buzzfree-split-card">
            <div className="buzzfree-split-copy">
              <h2>Kultureller Wandel &amp; Technologieverständnis</h2>
              <p>KI ist kein IT-Projekt. Es ist eine Kulturfrage.</p>
              <p>
                Deshalb beginne ich nicht mit Tools - sondern mit Menschen. Ich helfe
                Organisationen, eine klare Haltung zu KI zu entwickeln, Kompetenzen aufzubauen und
                eine Unternehmenskultur zu schaffen, in der Veränderung gelingt.
              </p>
            </div>

            <div className="buzzfree-split-image-wrap">
              <img
                className="buzzfree-split-image"
                src="/buzzfree-assets/Thomsen_Photography_HR_005.jpg"
                alt="Portrait von Lisa Höllbacher"
              />
            </div>
          </div>
        </section>

        <section className="buzzfree-section">
          <div className="buzzfree-container">
            <div className="buzzfree-section-heading">
              <h2>Service Portfolio</h2>
              <p>
                <strong>KI-Transformation ist kein einmaliges Event.</strong> Deshalb begleite ich
                Organisationen auf mehreren Ebenen: von der ersten Inspiration über gezielten
                Kompetenzaufbau bis hin zu nachhaltigem Kulturwandel und strategischer Verankerung.
                Mal als Speakerin auf der Bühne, mal als Trainerin im Raum, mal als
                Strategieberaterin im Hintergrund.
              </p>
            </div>

            <div className="buzzfree-service-grid">
              {serviceCards.map((card) => {
                const cardContent = (
                  <>
                    <div className="buzzfree-service-image-wrap">
                      <img className="buzzfree-service-image" src={card.image} alt={card.title} />
                    </div>

                    <div className="buzzfree-service-body">
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                      {card.href ? (
                        <span className="buzzfree-service-more">
                          Mehr lesen <ArrowRight size={15} />
                        </span>
                      ) : null}
                    </div>
                  </>
                );

                return card.href ? (
                  <a key={card.title} className="buzzfree-service-card" href={card.href}>
                    {cardContent}
                  </a>
                ) : (
                  <div key={card.title} className="buzzfree-service-card buzzfree-service-card-static">
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="buzzfree-section buzzfree-feature-section">
          <div className="buzzfree-container buzzfree-feature-card">
            <img
              className="buzzfree-feature-image"
              src="/buzzfree-assets/ography_01._oktober_2024_199.jpg"
              alt="Workshop KI Use Case Entwicklung"
            />

            <div className="buzzfree-feature-copy">
              <h2>Workshop KI Use Case Entwicklung</h2>
              <p>
                Wie kann Künstliche Intelligenz gezielt eingesetzt werden, um Ihre Prozesse zu
                verbessern, Innovation voranzutreiben und echten Mehrwert für Ihr Unternehmen zu
                schaffen? In diesem Workshop erarbeiten wir gemeinsam konkrete KI-Use-Cases, die
                auf Ihre spezifischen Herausforderungen und Ziele zugeschnitten sind.
              </p>
              <a
                className="buzzfree-cta"
                href="https://buzzfree.tech/de/workshops.cp/ki-use-case-entwicklung/3"
              >
                Mehr lesen
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="buzzfree-section buzzfree-references-section">
          <div className="buzzfree-container">
            <div className="buzzfree-section-heading buzzfree-section-heading-centered">
              <h2>Referenzen</h2>
            </div>

            <div className="buzzfree-logo-grid" aria-label="Referenzen und Logos">
              {referenceLogos.map((logo) => (
                <div key={logo.alt} className="buzzfree-logo-item">
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="buzzfree-parallax-strip" aria-label="BuzzFree Bildbereich">
          <img
            className="buzzfree-parallax-image"
            src="/buzzfree-assets/IMG_1822_2.jpg"
            alt="Bühnenaufnahme mit Publikum"
          />
        </section>
      </main>

      <footer className="buzzfree-footer">
        <div className="buzzfree-container">
          <div className="buzzfree-footer-top">
            <nav className="buzzfree-footer-links" aria-label="Footer Navigation">
              {navItems.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
              {footerLinks.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>

            <a
              className="buzzfree-social-link"
              href="https://www.linkedin.com/in/lisa-hoellbacher/"
              target="_blank"
              rel="noreferrer"
              aria-label="BuzzFree auf LinkedIn"
            >
              <img src="/buzzfree-assets/linkedin.svg" alt="LinkedIn" />
            </a>
          </div>

          <div className="buzzfree-footer-brand">
            <p>with heart &amp; soul by</p>
            <a href="https://comfortpages.com/" target="_blank" rel="noreferrer">
              <img src="/buzzfree-assets/ComfortPagesLogoWhiteTrans.svg" alt="ComfortPages" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Buzzfree;
