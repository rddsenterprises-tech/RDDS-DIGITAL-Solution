import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import founderPhoto from "./danish-khan.jpg";
import { supabase, supabaseConfigured } from "./supabase.js";
import RecruiterPortal from "./Recruiter.jsx";
const Admin = lazy(() => import("./Admin.jsx"));

const services = [
  { n: "01", icon: "⌘", title: "Website Development", desc: "Professional, responsive websites tailored to your business goals and customers.", points: ["Business and corporate websites", "Responsive layouts and contact forms"] },
  { n: "02", icon: "▣", title: "E-Commerce Website Development", desc: "Online stores designed to present products clearly and make ordering straightforward.", points: ["Shopify and custom e-commerce", "Product, cart and order workflows"] },
  { n: "03", icon: "⚙", title: "Custom Web Applications", desc: "Purpose-built web applications that streamline processes and support the way your business works.", points: ["Custom dashboards and portals", "Database and API integrations"] },
  { n: "04", icon: "✳", title: "UI/UX Design", desc: "Clear user journeys and intuitive interfaces for websites and web applications.", points: ["Wireframes and page layouts", "User-focused interface design"] },
  { n: "05", icon: "⌕", title: "SEO Services", desc: "Practical search optimisation to help search engines understand and discover your website.", points: ["On-page and technical SEO", "Search Console, sitemap and indexing setup"] },
  { n: "06", icon: "↻", title: "Website Maintenance", desc: "Ongoing website care to keep your site updated, secure and working smoothly.", points: ["Content and routine updates", "Issue checks and performance maintenance"] }
];

const blogPosts = [];

const SITE_URL = "https://rddsdigitalsolution.vercel.app";

function SeoManager() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.replace(/\/$/, "") || "/";
    const pages = {
      "/": {
        title: "RDDS Enterprises | Website Design & Development in Pakistan",
        description: "RDDS Enterprises builds business websites and e-commerce stores in Pakistan and worldwide. Work directly with founder Danish Khan."
      },
      "/recruiter": {
        title: "Recruiter Portal | RDDS Enterprises",
        description: "Recruiter sign in and registration portal for RDDS Enterprises."
      },
      "/about": {
        title: "About RDDS Enterprises | Danish Khan",
        description: "Meet Danish Khan, founder of RDDS Enterprises. Learn about our personal approach to website design, development and digital experiences."
      },
      "/services": {
        title: "Website Development & E-Commerce Services | RDDS Enterprises",
        description: "Explore website development, e-commerce website development, custom web applications, UI/UX design, SEO and website maintenance from RDDS Enterprises."
      },
      "/pricing": {
        title: "Website & E-Commerce Packages | RDDS Enterprises",
        description: "Compare RDDS website development and e-commerce packages in PKR and USD. Choose a plan or request a custom project quote."
      },
      "/projects": {
        title: "Website Portfolio & Projects | RDDS Enterprises",
        description: "Explore RDDS website projects, development capabilities and digital solutions for businesses."
      },
      "/blog": {
        title: "Web Design & Digital Insights | RDDS Enterprises Blog",
        description: "Read practical insights about website development, e-commerce, design and building a stronger online presence."
      },
      "/contact": {
        title: "Contact RDDS Enterprises | Start Your Website Project",
        description: "Contact RDDS Enterprises about a business website, online store or design project. Speak directly with founder Danish Khan."
      }
    };
    const page = pages[path] || (path.startsWith("/blog/") ? {
      title: "Article | RDDS Enterprises",
      description: "Read web development, design and digital business insights from RDDS Enterprises."
    } : {
      title: "Page Not Found | RDDS Enterprises",
      description: "The page you requested could not be found on RDDS Enterprises."
    });
    const canonical = SITE_URL + (path === "/" ? "/" : path);
    const setMeta = (key, value, property = false) => {
      const selector = property ? `meta[property="${key}"]` : `meta[name="${key}"]`;
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(property ? "property" : "name", key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };
    document.title = page.title;
    setMeta("description", page.description);
    setMeta("robots", path === "/admin" ? "noindex,nofollow" : "index,follow");
    setMeta("og:type", "website", true);
    setMeta("og:site_name", "RDDS Enterprises", true);
    setMeta("og:title", page.title, true);
    setMeta("og:description", page.description, true);
    setMeta("og:url", canonical, true);
    const socialImage = new URL(founderPhoto, SITE_URL).href;
    setMeta("og:image", socialImage, true);
    setMeta("og:image:alt", "Danish Khan, founder of RDDS Enterprises", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", page.title);
    setMeta("twitter:description", page.description);
    setMeta("twitter:image", socialImage);
    setMeta("twitter:image:alt", "Danish Khan, founder of RDDS Enterprises");
    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
    let schema = document.getElementById("rdds-organization-schema");
    if (!schema) {
      schema = document.createElement("script");
      schema.id = "rdds-organization-schema";
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfessionalService",
          "@id": SITE_URL + "/#business",
          name: "RDDS Enterprises",
          url: SITE_URL,
          description: "Website development, e-commerce website development, custom web applications, UI/UX design, SEO services and website maintenance.",
          founder: { "@id": SITE_URL + "/#founder" },
          email: "rdds.enterprises@gmail.com",
          telephone: "+923042178799",
          areaServed: { "@type": "Country", name: "Pakistan" },
          serviceType: [
            "Website Development",
            "E-Commerce Website Development",
            "Custom Web Applications",
            "UI/UX Design",
            "SEO Services",
            "Website Maintenance"
          ],
          sameAs: [
            "https://www.facebook.com/RDds1995/",
            "https://www.instagram.com/rdds.enterprises"
          ]
        },
        {
          "@type": "Person",
          "@id": SITE_URL + "/#founder",
          name: "Danish Khan",
          jobTitle: "Founder & Web Developer",
          worksFor: { "@id": SITE_URL + "/#business" }
        },
        {
          "@type": "WebSite",
          "@id": SITE_URL + "/#website",
          url: SITE_URL,
          name: "RDDS Enterprises",
          publisher: { "@id": SITE_URL + "/#business" },
          inLanguage: "en-PK"
        }
      ]
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  return null;
}


function IntroScreen() {
  const [visible, setVisible] = useState(true);
  const [animated, setAnimated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!visible) return;
    const frame = window.requestAnimationFrame(() => setAnimated(true));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeydown = event => {
      if (event.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [visible]);

  const enterSite = audience => {
    setVisible(false);
    if (audience === "recruiter") navigate("/recruiter");
  };

  if (!visible) return null;

  return <section className={`welcome-overlay${animated ? " welcome-animate" : ""}`} role="dialog" aria-modal="true" aria-labelledby="welcome-title">
    <div className="welcome-card">
      <div className="welcome-photo">
        <img src={founderPhoto} alt="Danish Khan, founder and web developer" onError={event => { event.currentTarget.style.display = "none"; }} />
        <span className="welcome-photo-label">Danish Khan · Founder</span>
      </div>
      <div className="welcome-content">
        <span className="welcome-kicker">A personal introduction · RDDS Enterprises</span>
        <h2 id="welcome-title">Hello, I’m Danish.<br /><span>I build for the web.</span></h2>
        <p>I personally design and develop thoughtful websites for businesses. How would you like to explore my work?</p>
        <div className="welcome-actions">
          <button type="button" onClick={() => enterSite("guest")}>Continue as a guest <span aria-hidden="true">→</span></button>
          <button className="welcome-secondary" type="button" onClick={() => enterSite("recruiter")}>I’m a recruiter — view my profile <span aria-hidden="true">→</span></button>
        </div>
        <p className="welcome-note">Personal collaboration. Thoughtful design. Built with care.</p>
      </div>
    </div>
  </section>;
}

const supportedLanguages = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "ur", flag: "🇵🇰", label: "اردو" },
  { code: "ar", flag: "🇸🇦", label: "العربية" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "zh-CN", flag: "🇨🇳", label: "中文" }
];
function LanguageSelector() {
  const getSavedLanguage = () => {
    const entry = document.cookie.split("; ").find(item => item.startsWith("googtrans="));
    return entry ? decodeURIComponent(entry.split("=")[1]).split("/").pop() || "en" : "en";
  };
  const [language, setLanguage] = useState(getSavedLanguage);
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement && document.getElementById("google_translate_element")) {
        new window.google.translate.TranslateElement({ pageLanguage: "en", includedLanguages: "en,ur,ar,fr,de,es,zh-CN", autoDisplay: false }, "google_translate_element");
      }
    };
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) window.googleTranslateElementInit();
  }, []);
  const changeLanguage = event => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    if (nextLanguage === "en") document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    else document.cookie = "googtrans=/en/" + nextLanguage + ";path=/;SameSite=Lax";
    window.location.reload();
  };
  const selected = supportedLanguages.find(item => item.code === language) || supportedLanguages[0];
  return <div className="language-switcher">
    <span className="language-globe" aria-hidden="true">◎</span>
    <select aria-label="Select website language" value={language} onChange={changeLanguage} title="Choose your language">
      {supportedLanguages.map(item => <option value={item.code} key={item.code}>{item.flag}  {item.label}</option>)}
    </select>
    <span className="language-current-flag" aria-hidden="true">{selected.flag}</span>
    <div id="google_translate_element" aria-hidden="true" />
  </div>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <header className="topbar">
    <Link className="brand" to="/" onClick={closeMenu}><span className="brand-mark">R</span><span>RDDS <b>ENTERPRISES</b></span></Link>
    <nav className={menuOpen ? "mobile-open" : ""}>
      <NavLink to="/" end onClick={closeMenu}>Home</NavLink><NavLink to="/about" onClick={closeMenu}>About</NavLink><NavLink to="/services" onClick={closeMenu}>Services</NavLink><NavLink to="/pricing" onClick={closeMenu}>Pricing</NavLink><NavLink to="/projects" onClick={closeMenu}>Projects</NavLink><NavLink to="/blog" onClick={closeMenu}>Blog</NavLink><NavLink className="nav-cta" to="/contact" onClick={closeMenu}>Contact us</NavLink><LanguageSelector />
    </nav>
    <button className="mobile-cta" type="button" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>{menuOpen ? "✕" : "☰"}</button>
  </header>;
}

function Footer() {
  return <footer>
    <Link className="brand" to="/"><span className="brand-mark">R</span><span>RDDS <b>ENTERPRISES</b></span></Link>
    <small>© {new Date().getFullYear()} RDDS Enterprises. All rights reserved.</small>
    <div><a href="https://www.facebook.com/RDds1995/" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.instagram.com/rdds.enterprises" target="_blank" rel="noreferrer">Instagram</a><a href="https://wa.me/923042178799" target="_blank" rel="noreferrer">WhatsApp</a></div>
  </footer>;
}

function PageIntro({ eyebrow, title, children }) {
  return <div className="page-intro"><label>{eyebrow}</label><h1>{title}</h1>{children && <p>{children}</p>}</div>;
}

function Home() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    supabase.from("projects").select("*").eq("published", true).order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => { if (!cancelled) setProjects(data || []); });
    return () => { cancelled = true; };
  }, []);
  return <>
    <section className="hero hero-v2" id="home">
      <div className="stars" /><div className="hero-orbit" aria-hidden="true"><span /><span /><span /></div>
      <div className="hero-v2-grid">
        <div className="hero-copy hero-v2-copy">
          <div className="eyebrow"><i /> INNOVATE <b>·</b> DESIGN <b>·</b> GROW</div>
          <h1>RDDS <em>DIGITAL SOLUTION</em></h1>
          <h2>Premium Websites.<br /><span>Elevate Your Brand.</span></h2>
          <p>Thoughtful digital experiences, designed and built personally by <strong>Danish Khan.</strong></p>
          <div className="hero-actions"><Link className="btn primary" to="/services">Explore Our Services →</Link><Link className="btn secondary" to="/projects">View Our Work ↗</Link></div>
        </div>
        <div className="hero-visual brain-hero-visual" aria-label="Animated holographic artificial intelligence brain"><div className="brain-orbit orbit-one" /><div className="brain-orbit orbit-two" /><div className="brain-halo" /><img className="brain-art" src="/rdds-ai-brain.svg" alt="Glowing blue holographic neural brain" /><div className="brain-caption"><span>INTELLIGENCE</span><strong>POWERED BY IDEAS</strong></div></div>
      </div>
      <div className="hero-v2-services"><div className="mini-section-title"><span />Our Services<span /></div><div className="service-grid hero-service-grid">{services.map(item => <Link className="service-card hero-service-card" to="/services" key={item.n}><div className="card-meta"><b>{item.icon}</b><small>{item.n}</small></div><h3>{item.title}</h3><span className="service-card-arrow">↗</span></Link>)}</div></div>
    </section>
    <section className="founder founder-v2"><div className="founder-inner"><div className="portrait"><img src={founderPhoto} alt="Danish Khan, founder of RDDS Digital Solution" /></div><div className="founder-copy"><label>ABOUT RDDS</label><h2>Your Trusted <em>Digital Partner</em></h2><p>At RDDS Digital Solution, we turn ideas into powerful digital experiences. From professional websites to advanced web applications, every project receives thoughtful planning and personal attention.</p><div className="signature"><strong>Danish Khan</strong><span>Founder · RDDS Digital Solution</span></div><Link className="text-link" to="/about">Discover our story ↗</Link></div></div></section>
    <section className="section work work-v2"><div className="section-head"><label>SELECTED WORK</label><h2>Our <em>Portfolio</em></h2><p>See our latest work and digital experiences.</p></div><div className="work-grid">{projects.map(item => item.website_url ? <a key={item.id} href={item.website_url} target="_blank" rel="noreferrer">{item.thumbnail_url ? <div className="work-thumbnail"><img src={item.thumbnail_url} alt={item.title + " project preview"} loading="lazy" /></div> : <div className="work-art art-one">✦</div>}<small>{item.category || "WEB PROJECT"}</small><h3>{item.title}</h3><p>{item.description}</p></a> : <article key={item.id}><div className="work-art art-one">✦</div><small>{item.category || "WEB PROJECT"}</small><h3>{item.title}</h3><p>{item.description}</p></article>)}{!projects.length && <article><div className="work-art art-one">✦</div><small>RDDS CAPABILITIES</small><h3>Business Websites</h3><p>Purpose-built digital experiences for growing businesses.</p></article>}</div><div className="center-link"><Link className="btn secondary" to="/projects">View More Projects →</Link></div></section>
    <section className="home-cta"><label>LET'S BUILD SOMETHING GREAT</label><h2>Your next idea.<br /><em>Our digital expertise.</em></h2><Link className="btn primary" to="/contact">Get In Touch ↗</Link></section>
  </>;
}

function About() {
  return <main className="inner-page">
    <PageIntro eyebrow="ABOUT RDDS ENTERPRISES" title={<>People, purpose<br /><em>and a personal commitment.</em></>}>A closer look at the person behind RDDS Enterprises and the beliefs that guide the company.</PageIntro>
    <section className="founder about-founder"><div className="founder-inner"><div className="portrait"><img src={founderPhoto} alt="Danish Khan, founder of RDDS Enterprises" /></div><div><label>FOUNDER & WEB DEVELOPER</label><h2>Meet Danish Khan.</h2><p>I'm Danish Khan, the founder of RDDS Enterprises. I started RDDS with a simple belief: businesses deserve digital work that is thoughtfully planned, carefully made and connected to a real purpose.</p><p>My role is hands-on. I stay close to the ideas, decisions and details that shape each engagement, bringing a personal sense of ownership from the first discussion through delivery.</p><div className="signature"><strong>Danish Khan</strong><span>Founder · RDDS Enterprises</span></div></div></div></section>
    <section className="section">
      <div className="section-head"><label>OUR STORY</label><h2>Built on ownership. <em>Guided by purpose.</em></h2><p>RDDS Enterprises is an independent digital company based in Pakistan. Our focus is to help businesses make confident decisions about their digital presence through direct communication, considered execution and a commitment to doing the work properly.</p></div>
      <div className="principle-grid">
        <article><b>OUR MISSION</b><h3>Make technology meaningful</h3><p>To turn business ideas and needs into useful digital outcomes through thoughtful planning, responsible execution and lasting value.</p></article>
        <article><b>OUR VISION</b><h3>Earn trust through our work</h3><p>To build a respected digital company known for integrity, personal accountability and work that makes a genuine difference to the people using it.</p></article>
        <article><b>OUR PROMISE</b><h3>Take ownership</h3><p>To communicate honestly, respect the agreed scope and give every engagement the attention it deserves.</p></article>
      </div>
    </section>
    <section className="section">
      <div className="section-head"><label>WHAT MATTERS TO US</label><h2>Principles that shape <em>every decision.</em></h2></div>
      <div className="principle-grid">
        <article><b>01</b><h3>Integrity</h3><p>Be clear about what is possible, what is included and what a project needs to succeed.</p></article>
        <article><b>02</b><h3>Craft</h3><p>Care about the details, not just the finished screenshot. Quality is found in the whole experience.</p></article>
        <article><b>03</b><h3>Accountability</h3><p>Stay involved, communicate progress and take responsibility for the agreed work.</p></article>
      </div>
    </section>
  </main>;
}

function Services() {
  const details = [
    { n: "01", title: "Website Development", heading: "A professional home for your business", intro: "Create a credible online presence that explains what your business does and gives visitors a clear next step.", includes: ["Business and corporate website structure", "Responsive page layouts for desktop and mobile", "Contact forms and enquiry pathways", "Core technical setup and launch preparation"], outcome: "A clear, responsive website shaped around your business and its customers." },
    { n: "02", title: "E-Commerce Website Development", heading: "An online store built for buying", intro: "Present your products clearly and make it easier for customers to browse, select and place orders.", includes: ["Shopify or custom e-commerce development", "Product categories and product detail pages", "Cart, checkout and order workflows", "Payment and delivery integration support"], outcome: "A structured shopping experience with the essential tools to manage online orders." },
    { n: "03", title: "Custom Web Applications", heading: "Digital tools shaped around your workflow", intro: "Turn a specific business process into a practical browser-based application, rather than forcing your team into a generic tool.", includes: ["Custom dashboards and management portals", "Role-based screens and workflows", "Database design and integration", "API and third-party service connections"], outcome: "A purpose-built application aligned with the way your organisation operates." },
    { n: "04", title: "UI/UX Design", heading: "Interfaces that feel clear and natural", intro: "Plan how people move through a website or application, then shape the interface around their needs and expectations.", includes: ["Information architecture and page planning", "User flows and wireframes", "Visual interface design", "Responsive layout guidance and usability refinement"], outcome: "A considered interface that makes important actions easier to understand and complete." },
    { n: "05", title: "SEO Services", heading: "A stronger technical and on-page foundation", intro: "Help search engines understand your website and make its important pages easier to discover through sound optimisation practices.", includes: ["Page titles, descriptions and heading structure", "Keyword-informed on-page improvements", "Technical checks, sitemap and indexing setup", "Google Search Console review and monitoring"], outcome: "A more search-friendly website foundation. Search positions and traffic are not guaranteed." },
    { n: "06", title: "Website Maintenance", heading: "Ongoing care after launch", intro: "Keep your website current and dependable with agreed updates, routine checks and practical support.", includes: ["Content and image updates", "Routine functionality and issue checks", "Performance and compatibility review", "Backup coordination where hosting supports it"], outcome: "A website that receives ongoing attention instead of being left untouched after launch." }
  ];
  return <main className="inner-page">
    <PageIntro eyebrow="RDDS SERVICES" title={<>Focused expertise.<br /><em>Practical digital outcomes.</em></>}>Explore the six services offered by RDDS Enterprises. Each engagement is scoped around your requirements, priorities and intended outcome.</PageIntro>
    <section className="section services-page">
      <div className="section-head"><label>OUR SERVICE CAPABILITIES</label><h2>What we can <em>help you build.</em></h2><p>Choose a service to match your current need. Related services can be combined when a project calls for a broader solution.</p></div>
      <div className="principle-grid">
        {details.map(item => <article className="service-detail-card" key={item.n}>
          <b>{item.n} · RDDS SERVICE</b><h3>{item.title}</h3><h4>{item.heading}</h4><p>{item.intro}</p>
          <ul>{item.includes.map(point => <li key={point}>✓ <span>{point}</span></li>)}</ul>
          <p className="service-outcome"><strong>Typical outcome:</strong> {item.outcome}</p>
        </article>)}
      </div>
    </section>
    <section className="section services-detail">
      <div className="section-head"><label>HOW AN ENGAGEMENT WORKS</label><h2>From first brief <em>to handover.</em></h2><p>The exact timeline and deliverables are confirmed before work begins.</p></div>
      <div className="principle-grid">
        <article><b>01 · DISCOVERY</b><h3>Understand the requirement</h3><p>We discuss the objective, audience, required functionality, available content, timeline and budget to establish a realistic scope.</p></article>
        <article><b>02 · EXECUTION</b><h3>Plan, design and develop</h3><p>Work follows the agreed scope, with progress shared at key points so feedback can be considered at the right time.</p></article>
        <article><b>03 · HANDOVER</b><h3>Review and prepare for launch</h3><p>We review the agreed deliverables, complete included revision rounds and provide the handover details defined for the project.</p></article>
      </div>
    </section>
    <section className="home-cta"><label>READY TO DISCUSS THE REQUIREMENT?</label><h2>Let's define the<br /><em>right solution.</em></h2><Link className="btn primary" to="/contact">Discuss your project ↗</Link></section>
  </main>;
}

function Pricing() {
  const [packages, setPackages] = useState([]);
  const [currency, setCurrency] = useState("PKR");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabaseConfigured) { setLoading(false); return; }
    let cancelled = false;
    supabase.from("pricing_packages").select("*").eq("published", true).order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setPackages(data);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);
  const websitePackages = packages.filter(item => item.service_type === "website");
  const storePackages = packages.filter(item => item.service_type === "ecommerce");
  const formatPrice = item => currency === "PKR" ? "Rs. " + Number(item.price_pkr).toLocaleString("en-PK") : "$" + Number(item.price_usd).toLocaleString("en-US") + " USD";
  const renderPackages = items => <div className="pricing-grid">{items.map(item => <article className={"pricing-card" + (item.tier === "business" ? " pricing-featured" : "")} key={item.id}>
    {item.tier === "business" && <span className="pricing-popular">MOST POPULAR</span>}
    <div className="pricing-tier">{item.tier.toUpperCase()} PLAN</div><h3>{item.title}</h3><div className="pricing-price">{formatPrice(item)}</div>
    <p className="pricing-delivery">◷ {item.delivery_days}</p>
    <ul>{(Array.isArray(item.features) ? item.features : []).map((feature, index) => <li key={index}><span>✓</span>{feature}</li>)}</ul>
    <Link className="btn primary pricing-cta" to={"/contact?package=" + encodeURIComponent(item.title + " - " + formatPrice(item))}>Choose this package ↗</Link>
  </article>)}</div>;
  return <main className="inner-page">
    <PageIntro eyebrow="RDDS PRICING" title={<>Clear plans. <em>Clear value.</em></>}>Choose a package that matches your business goals. Custom requirements can be quoted separately.</PageIntro>
    <section className="section pricing-section">
      <div className="section-head"><label>TRANSPARENT PACKAGES</label><h2>Choose the right <em>plan.</em></h2><p>Professional website and online store packages for businesses in Pakistan and worldwide.</p></div>
      <div className="pricing-currency" role="group" aria-label="Choose pricing currency"><button type="button" className={currency === "PKR" ? "active" : ""} onClick={() => setCurrency("PKR")}>🇵🇰 PKR</button><button type="button" className={currency === "USD" ? "active" : ""} onClick={() => setCurrency("USD")}>🇺🇸 USD</button></div>
      {loading ? <p className="pricing-loading">Loading packages…</p> : <>
        <div className="pricing-group"><div className="pricing-group-heading"><span>01</span><div><h3>Website Development</h3><p>Professional websites for your business and brand.</p></div></div>{renderPackages(websitePackages)}</div>
        <div className="pricing-group"><div className="pricing-group-heading"><span>02</span><div><h3>E-Commerce Website Development</h3><p>Practical online stores to showcase products and receive orders.</p></div></div>{renderPackages(storePackages)}</div>
        {packages.length === 0 && <p>No published packages are available right now. Please contact us for a quotation.</p>}
      </>}
      <section className="free-demo-offer">
        <div className="free-demo-copy"><span>START WITH CONFIDENCE</span><h2>Try RDDS with a <em>Free Demo.</em></h2><p>Get a complimentary homepage preview for your business before choosing a paid website package. Contact our team to discuss your requirements and request your demo.</p><ul><li>One homepage design preview</li><li>Your business name and visual direction</li><li>Reviewed by the RDDS team</li><li>No payment or purchase obligation</li></ul><small>One free demo per client. Domain, hosting and full website development are not included.</small></div>
        <div className="free-demo-price"><span>COMPLIMENTARY</span><strong>Rs. 0</strong><p>One-time business offer</p><Link className="btn primary" to="/contact?package=Free%20Demo">Request a Free Demo ↗</Link><small>Contact RDDS to get started</small></div>
      </section>
      <div className="pricing-terms"><strong>Project terms</strong><p>50% advance to start and 50% before final handover. Domain, hosting, paid third-party services and payment gateway charges are separate. Extra pages, products and custom integrations are quoted separately. Revisions are limited to each package.</p></div>
    </section>
    <section className="home-cta"><label>HAVE A PROJECT IN MIND?</label><h2>Let's discuss your<br /><em>next step.</em></h2><Link className="btn primary" to="/contact">Get a consultation ↗</Link></section>
  </main>;
}

function Projects() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    supabase.from("projects").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        // Keep one card per project URL/slug so stale or repeated records never render twice.
        const seen = new Set();
        const uniqueItems = (data || []).filter(item => {
          const key = String(item.website_url || item.slug || item.id || "").trim().toLowerCase().replace(/\/$/, "");
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setItems(uniqueItems);
      });
    return () => { cancelled = true; };
  }, []);
  return <main className="inner-page"><PageIntro eyebrow="SELECTED WORK" title={<>Built with <em>purpose.</em></>}>Explore website and digital solutions created for business needs. Our work can include business websites, e-commerce experiences and custom features, with each project shaped around its audience and goals.</PageIntro><section className="work projects-page"><div className="section-head"><label>PROJECT PORTFOLIO</label><h2>Practical solutions. <em>Thoughtful execution.</em></h2><p>Browse the published projects below to see the type of work RDDS delivers. Project details are added as client work is approved for public display.</p></div><div className="work-grid">
    {items.map(item => item.website_url ? <a key={item.id} href={item.website_url} target="_blank" rel="noreferrer">{item.thumbnail_url ? <div className="work-thumbnail"><img src={item.thumbnail_url} alt={item.title + " website screenshot"} loading="lazy" /></div> : <div className="work-art art-one">↗</div>}<small>{item.category || "WEB PROJECT"}</small><h3>{item.title}</h3><p>{item.description}</p></a> : <article key={item.id}>{item.thumbnail_url ? <div className="work-thumbnail"><img src={item.thumbnail_url} alt={item.title + " website screenshot"} loading="lazy" /></div> : <div className="work-art art-one">✦</div>}<small>{item.category || "WEB PROJECT"}</small><h3>{item.title}</h3><p>{item.description}</p></article>)}
    {!items.length && <div className="blog-empty"><span className="blog-icon">✦</span><h3>New projects are being prepared</h3><p>We are preparing approved project previews for this portfolio. If you would like to discuss a website or online store, contact RDDS to talk through your requirements and receive relevant examples.</p><Link className="text-link" to="/contact">Discuss your project ↗</Link></div>}
  </div></section></main>;
}

function Blog() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => { if (!cancelled) setPosts(data || []); });
    return () => { cancelled = true; };
  }, []);
  return <main className="inner-page"><PageIntro eyebrow="RDDS JOURNAL" title={<>Ideas worth <em>sharing.</em></>}>Articles, tips and updates about web development, design, e-commerce and building a stronger online presence.</PageIntro><section className="section blog-page">{posts.length ? <div className="blog-grid">{posts.map(post => <article className="blog-card" key={post.slug}><div className="blog-card-art">RDDS JOURNAL</div><div className="blog-card-body"><small>{post.category}</small><h2>{post.title}</h2><p>{post.description}</p><Link className="text-link" to={"/blog/" + post.slug}>Read article ↗</Link></div></article>)}</div> : <div className="blog-empty"><span className="blog-icon">✦</span><label>THE FIRST CHAPTER STARTS HERE</label><h2>Our blog is getting ready.</h2><p>There are no published articles yet. Soon, you'll find practical guides, website tips, design insights and updates from RDDS Enterprises here.</p><span className="blog-coming">NEW ARTICLES COMING SOON</span></div>}</section></main>;
}

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const faqs = [
    { question: "Why does a small business need a professional website?", answer: "A professional website gives customers a reliable place to understand your business, review your services and contact you. It also gives you more control over your online presence than relying only on social media profiles." },
    { question: "Can a business website help customers find me on Google?", answer: "Yes. A well-structured website with useful, relevant content and sound technical foundations can help search engines understand your business. Rankings and traffic are not guaranteed and depend on competition, relevance and ongoing work." },
    { question: "How much does a business website cost in Pakistan?", answer: "The cost depends on the number of pages, design requirements, content, integrations and custom features. RDDS offers website packages and can provide a project-specific quotation after discussing your requirements." },
    { question: "Can RDDS build an e-commerce website or online store?", answer: "Yes. RDDS provides Shopify and custom e-commerce development. Depending on the agreed scope, a project can include product pages, store setup, payment integration support and order-management features." },
    { question: "Can RDDS work with clients outside Pakistan?", answer: "Yes. RDDS is based in Pakistan and can collaborate remotely with businesses in other markets, including the UAE, Canada, the United Kingdom and the United States. Project communication and delivery arrangements are agreed individually." },
    { question: "What should I prepare before starting a website project?", answer: "Prepare a short description of your business, your main goals, the services or products you want to show, any preferred examples, and the features you need. If you do not have everything ready, RDDS can discuss the requirements with you first." }
  ];

  useEffect(() => {
    if (!supabaseConfigured || !slug) return;
    let cancelled = false;
    supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle()
      .then(({ data }) => { if (!cancelled) setPost(data || null); });
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const canonical = SITE_URL + "/blog/" + post.slug;
    document.title = post.title + " | RDDS Enterprises";
    let description = document.head.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = post.description || post.title;
    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": canonical + "#article",
          mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
          headline: post.title,
          description: post.description || post.title,
          articleSection: post.category || "Website Development",
          inLanguage: "en",
          author: {
            "@type": "Person",
            name: "Danish Khan",
            jobTitle: "Founder & Web Developer",
            url: SITE_URL + "/about"
          },
          publisher: {
            "@type": "Organization",
            name: "RDDS Enterprises",
            url: SITE_URL
          },
          ...(post.created_at ? { datePublished: post.created_at } : {}),
          ...(post.updated_at ? { dateModified: post.updated_at } : {})
        },
        {
          "@type": "FAQPage",
          "@id": canonical + "#faq",
          mainEntity: faqs.map(item => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer }
          }))
        }
      ]
    };
    let schemaScript = document.getElementById("rdds-article-schema");
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "rdds-article-schema";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);
    return () => {
      schemaScript.remove();
    };
  }, [post]);

  if (!post) return <main className="inner-page"><div className="blog-empty"><h2>Article not found</h2><p>This article may have been moved or is not published yet.</p><Link className="text-link" to="/blog">← Back to blog</Link></div></main>;
  return <main className="inner-page"><article className="article-page"><label>{post.category}</label><h1>{post.title}</h1><p>{post.description}</p><div className="article-content" style={{ whiteSpace: "pre-line" }}>{post.content || post.description}</div><section className="article-faq" aria-labelledby="article-faq-title"><h2 id="article-faq-title">Frequently Asked Questions</h2>{faqs.map((item, index) => <details className="article-faq-item" key={index}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section><Link className="text-link" to="/blog">← Back to blog</Link></article></main>;
}

function Contact() {
  const location = useLocation();
  const selectedPackage = new URLSearchParams(location.search).get("package") || "";
  const [submitState, setSubmitState] = useState("");
  const submitContact = async event => {
    event.preventDefault();
    setSubmitState("");
    if (!supabaseConfigured) return setSubmitState("Contact form abhi configured nahi hai. Please WhatsApp ya email se rabta karein.");
    const formElement = event.currentTarget;
    const values = new FormData(formElement);
    const { error } = await supabase.from("contact_messages").insert({
      name: String(values.get("name") || "").trim(),
      email: String(values.get("email") || "").trim(),
      subject: String(values.get("service") || "Website enquiry"),
      message: String(values.get("message") || "").trim()
    });
    if (error) setSubmitState("Message send nahi hua. Please dobara try karein ya WhatsApp karein.");
    else { setSubmitState("Shukriya! Aapka message successfully receive ho gaya."); formElement.reset(); }
  };
  return <main className="inner-page"><PageIntro eyebrow="LET'S TALK" title={<>Have a project<br /><em>in mind?</em></>}>Tell us what you're looking to build. Reach out directly and let's make a plan together.</PageIntro><section className="contact"><div className="contact-inner"><div><label>GET IN TOUCH</label><h2>Let's make it<br />happen.</h2><p>Get in touch about website development, an online store, a custom web application, UI/UX, SEO or website maintenance.</p><a className="contact-line" href="mailto:rdds.enterprises@gmail.com">✉ rdds.enterprises@gmail.com</a><a className="contact-line" href="https://wa.me/923042178799" target="_blank" rel="noreferrer">☏ 03042178799</a></div><form onSubmit={submitContact}><div className="form-row"><label>Your name<input name="name" placeholder="Your name" required /></label><label>Email address<input name="email" type="email" placeholder="name@example.com" required /></label></div><label>Service required<select name="service" defaultValue={selectedPackage || "Website Development"}>{selectedPackage && <option value={selectedPackage}>{selectedPackage}</option>}{services.map(service => <option key={service.n}>{service.title}</option>)}</select></label><label>Project details<textarea name="message" rows="4" placeholder="Tell us about your project..." required /></label><button className="btn primary" type="submit">Send your enquiry ↗</button>{submitState && <p role="status">{submitState}</p>}</form></div></section></main>;
}


function TawkToWidget() {
  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();

    const existing = document.querySelector('script[src*="embed.tawk.to/6afbeff03aac2a3cbe12ec18/1k7k22hgg"]');
    if (existing) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/6afbeff03aac2a3cbe12ec18/1k7k22hgg";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    script.onerror = () => console.error("RDDS Tawk.to widget failed to load. Check the Tawk.to property and domain settings.");
    document.head.appendChild(script);
  }, []);

  return null;
}
function PublicSite() {
  return <div className="site-shell"><SeoManager /><IntroScreen /><Header /><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/recruiter" element={<RecruiterPortal />} /><Route path="/services" element={<Services />} /><Route path="/pricing" element={<Pricing />} /><Route path="/projects" element={<Projects />} /><Route path="/blog" element={<Blog />} /><Route path="/blog/:slug" element={<BlogPost />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<Home />} /></Routes><Footer /><TawkToWidget /></div>;
}

function App() {
  return <BrowserRouter><Routes><Route path="/admin" element={<Suspense fallback={<div className="admin-loading">RDDS Admin load ho raha hai…</div>}><Admin /></Suspense>} /><Route path="*" element={<PublicSite />} /></Routes></BrowserRouter>;
}

export default App;
