import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import founderPhoto from "./danish-khan.jpg";
import { supabase, supabaseConfigured } from "./supabase.js";
import RecruiterPortal from "./Recruiter.jsx";
const Admin = lazy(() => import("./Admin.jsx"));

const services = [
  { n: "01", icon: "⌘", title: "Custom Web Development", desc: "Fast, responsive websites and custom web applications designed around your business.", points: ["Business websites", "Custom web applications"] },
  { n: "02", icon: "▣", title: "E-Commerce Solutions", desc: "Online stores with clear product journeys, practical management and secure integrations.", points: ["Shopify and custom stores", "Store setup and integrations"] },
  { n: "03", icon: "✳", title: "UI/UX & Graphic Design", desc: "Clean visual identities and intuitive interfaces that make your brand stand out.", points: ["Brand identity and graphics", "Web and mobile UI/UX"] }
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
        description: "Explore custom website development, e-commerce solutions, UI/UX design and graphic design services from RDDS Enterprises."
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
          description: "Website design, custom web development, e-commerce solutions and UI/UX design.",
          founder: { "@id": SITE_URL + "/#founder" },
          email: "rdds.enterprises@gmail.com",
          telephone: "+923042178799",
          areaServed: { "@type": "Country", name: "Pakistan" },
          serviceType: [
            "Custom Web Development",
            "Business Website Design",
            "E-Commerce Website Development",
            "UI/UX Design",
            "Graphic Design"
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
  const [managedServices, setManagedServices] = useState([]);
  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    supabase.from("services").select("*").eq("published", true).order("created_at", { ascending: true })
      .then(({ data }) => { if (!cancelled && data?.length) setManagedServices(data.map((item, index) => ({ n: String(index + 1).padStart(2, "0"), icon: "✦", title: item.title, desc: item.description, points: item.category ? [item.category] : [] }))); });
    return () => { cancelled = true; };
  }, []);
  const displayServices = managedServices.length ? managedServices : services;
  const [managedPosts, setManagedPosts] = useState([]);
  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false }).limit(2)
      .then(({ data }) => { if (!cancelled) setManagedPosts(data || []); });
    return () => { cancelled = true; };
  }, []);
  return <>
    <section className="hero" id="home">
      <div className="stars" /><div className="hero-orbit" aria-hidden="true"><span /><span /><span /></div>
      <div className="hero-copy">
        <div className="eyebrow"><i /> RDDS ENTERPRISES · WEB DESIGN & DEVELOPMENT</div>
        <h1>Premium websites.<br /><em>Elevate your brand.</em></h1>
        <p>Thoughtful digital experiences, designed and built personally by <strong>Danish Khan.</strong></p>
        <div className="hero-actions"><Link className="btn primary" to="/contact">Get a consultation <span>↗</span></Link><Link className="btn secondary" to="/projects">View projects</Link></div>
      </div>
      <div className="hero-foot">
        <div className="ticker"><span>Custom-built websites</span><b>✦</b><span>SEO-ready design</span><b>✦</b><span>Responsive by design</span><b>✦</b><span>Direct founder collaboration</span></div>
        <div className="benefits"><div><strong>◫ Modern design</strong><small>Designed for experience</small></div><div><strong>↗ Blazing fast</strong><small>Optimised for the web</small></div><div><strong>◇ SEO ready</strong><small>Built with best practices</small></div><div><strong>✧ Personal support</strong><small>Direct communication</small></div></div>
      </div>
    </section>
    <section className="section">
      <div className="section-head"><label>WHAT WE DO</label><h2>Digital made to work <em>for you.</em></h2><p>From the first conversation to launch, get a practical, personal approach to creating your next website.</p></div>
      <div className="service-grid">{displayServices.map(s => <article className="service-card" key={s.n}><div className="card-meta"><span>{s.n}</span><b>{s.icon}</b></div><h3>{s.title}</h3><p>{s.desc}</p><ul>{s.points.map(p => <li key={p}>✓ <span>{p}</span></li>)}</ul></article>)}</div>
      <div className="center-link"><Link className="btn secondary" to="/services">Explore all services ↗</Link></div>
    </section>
    <section className="founder"><div className="founder-inner"><div className="portrait"><img src={founderPhoto} alt="Danish Khan, founder of RDDS Enterprises" /></div><div><label>MEET THE FOUNDER</label><h2>Work directly with the person who builds your website.</h2><p>I'm Danish Khan, Founder & Web Developer at RDDS Enterprises. I personally manage projects from early planning and design through development and final delivery.</p><div className="signature"><strong>Danish Khan</strong><span>Founder & Web Developer</span></div><Link className="text-link" to="/about">More about me ↗</Link></div></div></section>
    <section className="home-blog section"><div className="section-head"><label>FROM THE BLOG</label><h2>Ideas, insights & <em>updates.</em></h2><p>Helpful thoughts about websites, design and growing your business online.</p></div>{managedPosts.length ? <div className="blog-grid">{managedPosts.map(post => <article className="blog-card" key={post.id}><div className="blog-card-body"><small>{post.category}</small><h3>{post.title}</h3><p>{post.description}</p><Link className="text-link" to={"/blog/" + post.slug}>Read article ↗</Link></div></article>)}</div> : <div className="blog-empty compact"><span className="blog-icon">✦</span><h3>Articles are coming soon</h3><p>We're preparing useful articles for business owners and creators.</p><Link className="text-link" to="/blog">Visit the blog ↗</Link></div>}</section>
    <section className="home-cta"><label>READY TO GET STARTED?</label><h2>Let's build something<br /><em>meaningful.</em></h2><Link className="btn primary" to="/contact">Start a conversation ↗</Link></section>
  </>;
}

function About() {
  return <main className="inner-page"><PageIntro eyebrow="ABOUT THE FOUNDER" title={<>A personal approach.<br /><em>From first idea to launch.</em></>}>RDDS Enterprises is founded and personally managed by Danish Khan, with a focus on thoughtful design, practical development and clear communication.</PageIntro><section className="founder about-founder"><div className="founder-inner"><div className="portrait"><img src={founderPhoto} alt="Danish Khan, founder of RDDS Enterprises" /></div><div><label>FOUNDER & WEB DEVELOPER</label><h2>Hi, I'm Danish Khan.</h2><p>I work directly with businesses to plan, design and build modern websites and digital experiences. I believe a good website should look professional, work smoothly on every device and make it easier for customers to connect with a business.</p><p>At RDDS Enterprises, every project receives direct attention throughout the process—from understanding the idea to development, launch and support.</p><div className="signature"><strong>Danish Khan</strong><span>Founder & Web Developer · RDDS Enterprises</span></div></div></div></section><section className="section"><div className="principle-grid"><article><b>01</b><h3>Direct collaboration</h3><p>Work one-to-one with the founder throughout your project.</p></article><article><b>02</b><h3>Responsive by design</h3><p>Useful, beautiful experiences on every screen size.</p></article><article><b>03</b><h3>Clear communication</h3><p>Stay informed and involved from kickoff to launch.</p></article></div></section></main>;
}

function Services() {
  const [managedServices, setManagedServices] = useState([]);
  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    supabase.from("services").select("*").eq("published", true).order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!cancelled && data?.length) setManagedServices(data.map((item, index) => ({ n: String(index + 1).padStart(2, "0"), icon: "✦", title: item.title, desc: item.description, points: item.category ? [item.category] : [] })));
      });
    return () => { cancelled = true; };
  }, []);
  const displayServices = managedServices.length ? managedServices : services;
  return <main className="inner-page">
    <PageIntro eyebrow="OUR SERVICES" title={<>Digital made to work <em>for you.</em></>}>Practical digital solutions built around your goals, your customers and your business.</PageIntro>
    <section className="section services-page"><div className="section-head"><label>HOW WE CAN HELP</label><h2>Services built around <em>your goals.</em></h2><p>Choose focused support for a new business website, an online store or a more polished digital identity. Every project starts with understanding your requirements.</p></div><div className="service-grid">{displayServices.map(s => <article className="service-card" key={s.n}><div className="card-meta"><span>{s.n}</span><b>{s.icon}</b></div><h3>{s.title}</h3><p>{s.desc}</p><ul>{s.points.map(p => <li key={p}>✓ <span>{p}</span></li>)}</ul></article>)}</div></section>
    <section className="home-cta"><label>HAVE A PROJECT IN MIND?</label><h2>Let's discuss your<br /><em>next step.</em></h2><Link className="btn primary" to="/contact">Get a consultation ↗</Link></section>
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
    {items.map(item => item.website_url ? <a key={item.id} href={item.website_url} target="_blank" rel="noreferrer"><div className="work-art art-one">↗</div><small>{item.category || "WEB PROJECT"}</small><h3>{item.title}</h3><p>{item.description}</p></a> : <article key={item.id}><div className="work-art art-one">✦</div><small>{item.category || "WEB PROJECT"}</small><h3>{item.title}</h3><p>{item.description}</p></article>)}
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
  useEffect(() => {
    if (!supabaseConfigured || !slug) return;
    let cancelled = false;
    supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle()
      .then(({ data }) => { if (!cancelled) setPost(data || null); });
    return () => { cancelled = true; };
  }, [slug]);
  if (!post) return <main className="inner-page"><div className="blog-empty"><h2>Article not found</h2><p>This article may have been moved or is not published yet.</p><Link className="text-link" to="/blog">← Back to blog</Link></div></main>;
  return <main className="inner-page"><article className="article-page"><label>{post.category}</label><h1>{post.title}</h1><p>{post.description}</p><div className="article-content">{post.content || post.description}</div><Link className="text-link" to="/blog">← Back to blog</Link></article></main>;
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
  return <main className="inner-page"><PageIntro eyebrow="LET'S TALK" title={<>Have a project<br /><em>in mind?</em></>}>Tell us what you're looking to build. Reach out directly and let's make a plan together.</PageIntro><section className="contact"><div className="contact-inner"><div><label>GET IN TOUCH</label><h2>Let's make it<br />happen.</h2><p>Get in touch for a website, online store or design project.</p><a className="contact-line" href="mailto:rdds.enterprises@gmail.com">✉ rdds.enterprises@gmail.com</a><a className="contact-line" href="https://wa.me/923042178799" target="_blank" rel="noreferrer">☏ 03042178799</a></div><form onSubmit={submitContact}><div className="form-row"><label>Your name<input name="name" placeholder="Your name" required /></label><label>Email address<input name="email" type="email" placeholder="name@example.com" required /></label></div><label>Service required<select name="service" defaultValue={selectedPackage || "Website Development"}>{selectedPackage && <option value={selectedPackage}>{selectedPackage}</option>}<option>Website Development</option><option>E-Commerce Website Development</option></select></label><label>Project details<textarea name="message" rows="4" placeholder="Tell us about your project..." required /></label><button className="btn primary" type="submit">Send your enquiry ↗</button>{submitState && <p role="status">{submitState}</p>}</form></div></section></main>;
}


function RONIEChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "Assalam-o-Alaikum! Main RONIE hoon — RDDS Enterprises ka AI assistant. Main aapke business aur project ko samajh kar website, online store ya design ke liye behtareen raasta suggest kar sakta hoon. Aap kya plan kar rahe hain?" }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const sendMessage = async (event) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || sending) return;
    const next = [...messages, { role: "user", text: message }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12).map(item => ({ role: item.role === "assistant" ? "model" : "user", parts: [{ text: item.text }] })) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Chat service is temporarily unavailable.");
      setMessages(current => [...current, { role: "assistant", text: data.reply }]);
    } catch (error) {
      setMessages(current => [...current, { role: "assistant", text: error.message || "Maazrat, abhi jawab nahi mil saka. Aap WhatsApp par rabta kar sakte hain: 03042178799." }]);
    } finally {
      setSending(false);
    }
  };
  return <div className="ronie-widget">
    {open && <section className="ronie-panel" aria-label="RONIE AI chat">
      <header className="ronie-header"><div className="ronie-avatar">R</div><div><strong>RONIE AI</strong><small>RDDS Enterprises · AI Assistant</small></div><button type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button></header>
      <div className="ronie-messages" aria-live="polite">{messages.map((item, index) => <div className={"ronie-message " + item.role} key={index}>{item.text}</div>)}{sending && <div className="ronie-message assistant">RONIE soch raha hai…</div>}</div>
      <form className="ronie-form" onSubmit={sendMessage}><input value={input} onChange={event => setInput(event.target.value)} placeholder="Apna sawal likhein..." aria-label="Message" /><button type="submit" disabled={sending || !input.trim()} aria-label="Send message">➤</button></form>
      <a className="ronie-whatsapp" href="https://wa.me/923042178799" target="_blank" rel="noreferrer">WhatsApp par human support ↗</a>
    </section>}
    <button className="ronie-launcher" type="button" onClick={() => setOpen(value => !value)} aria-label={open ? "Close RONIE chat" : "Open RONIE AI chat"}>{open ? "×" : <><span>✦</span><small>Chat with RONIE</small></>}</button>
  </div>;
}

function PublicSite() {
  return <div className="site-shell"><SeoManager /><IntroScreen /><Header /><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/recruiter" element={<RecruiterPortal />} /><Route path="/services" element={<Services />} /><Route path="/pricing" element={<Pricing />} /><Route path="/projects" element={<Projects />} /><Route path="/blog" element={<Blog />} /><Route path="/blog/:slug" element={<BlogPost />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<Home />} /></Routes><Footer /><RONIEChat /></div>
}

function App() {
  return <BrowserRouter><Routes><Route path="/admin" element={<Suspense fallback={<div className="admin-loading">RDDS Admin load ho raha hai…</div>}><Admin /></Suspense>} /><Route path="*" element={<PublicSite />} /></Routes></BrowserRouter>;
}

export default App;
