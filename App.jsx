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
        description: "RDDS Enterprises creates modern business websites, e-commerce stores and custom web applications. Work directly with Danish Khan for thoughtful design and development."
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
      "/projects": {
        title: "Website Portfolio & Projects | RDDS Enterprises",
        description: "Explore selected website and digital projects by RDDS Enterprises, including business and restaurant website work."
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

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <header className="topbar">
    <Link className="brand" to="/" onClick={closeMenu}><span className="brand-mark">R</span><span>RDDS <b>ENTERPRISES</b></span></Link>
    <nav className={menuOpen ? "mobile-open" : ""}>
      <NavLink to="/" end onClick={closeMenu}>Home</NavLink><NavLink to="/about" onClick={closeMenu}>About</NavLink><NavLink to="/services" onClick={closeMenu}>Services</NavLink><NavLink to="/projects" onClick={closeMenu}>Projects</NavLink><NavLink to="/blog" onClick={closeMenu}>Blog</NavLink><NavLink className="nav-cta" to="/contact" onClick={closeMenu}>Contact us</NavLink>
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
      .then(({ data }) => { if (!cancelled && data?.length) setManagedServices(data.map((item, index) => ({ n: String(index + 1).padStart(2, "0"), icon: "✦", title: item.title, desc: item.description, points: item.category ? [item.category] : [] }))); });
    return () => { cancelled = true; };
  }, []);
  const displayServices = managedServices.length ? managedServices : services;
  return <main className="inner-page"><PageIntro eyebrow="OUR SERVICES" title={<>Digital made to work <em>for you.</em></>}>Practical digital solutions built around your goals, your customers and your business.</PageIntro><section className="section services-page"><div className="service-grid">{displayServices.map(s => <article className="service-card" key={s.n}><div className="card-meta"><span>{s.n}</span><b>{s.icon}</b></div><h3>{s.title}</h3><p>{s.desc}</p><ul>{s.points.map(p => <li key={p}>✓ <span>{p}</span></li>)}</ul></article>)}</div></section><section className="home-cta"><label>HAVE A PROJECT IN MIND?</label><h2>Let's discuss your<br /><em>next step.</em></h2><Link className="btn primary" to="/contact">Get a consultation ↗</Link></section></main>;
}

function Projects() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    supabase.from("projects").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => { if (!cancelled) setItems(data || []); });
    return () => { cancelled = true; };
  }, []);
  return <main className="inner-page"><PageIntro eyebrow="SELECTED WORK" title={<>Built with <em>purpose.</em></>}>A selection of completed work.</PageIntro><section className="work projects-page"><div className="work-grid">
    {items.map(item => item.website_url ? <a key={item.id} href={item.website_url} target="_blank" rel="noreferrer"><div className="work-art art-one">↗</div><small>{item.category || "WEB PROJECT"}</small><h3>{item.title}</h3><p>{item.description}</p></a> : <article key={item.id}><div className="work-art art-one">✦</div><small>{item.category || "WEB PROJECT"}</small><h3>{item.title}</h3><p>{item.description}</p></article>)}
    <a href="https://namiraskitchen.vercel.app/" target="_blank" rel="noreferrer"><div className="work-art art-three">↗</div><small>RESTAURANT WEBSITE</small><h3>Namira's Kitchen</h3><p>Explore a restaurant website project.</p></a>
    <a href="https://motraderspos.vercel.app/demo" target="_blank" rel="noreferrer"><div className="work-art art-two">↗</div><small>BUSINESS POS SYSTEM</small><h3>M.O. Traders POS</h3><p>Explore the point-of-sale demo with sample figures starting at Rs. 0. Demo data stays separate from the live business records.</p></a>
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
  return <main className="inner-page"><PageIntro eyebrow="LET'S TALK" title={<>Have a project<br /><em>in mind?</em></>}>Tell us what you're looking to build. Reach out directly and let's make a plan together.</PageIntro><section className="contact"><div className="contact-inner"><div><label>GET IN TOUCH</label><h2>Let's make it<br />happen.</h2><p>Get in touch for a website, online store or design project.</p><a className="contact-line" href="mailto:rdds.enterprises@gmail.com">✉ rdds.enterprises@gmail.com</a><a className="contact-line" href="https://wa.me/923042178799" target="_blank" rel="noreferrer">☏ 03042178799</a></div><form onSubmit={submitContact}><div className="form-row"><label>Your name<input name="name" placeholder="Your name" required /></label><label>Email address<input name="email" type="email" placeholder="name@example.com" required /></label></div><label>Service required<select name="service"><option>Custom Web Development</option><option>E-Commerce Solutions</option><option>UI/UX & Graphic Design</option></select></label><label>Project details<textarea name="message" rows="4" placeholder="Tell us about your project..." required /></label><button className="btn primary" type="submit">Send your enquiry ↗</button>{submitState && <p role="status">{submitState}</p>}</form></div></section></main>;
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
  return <div className="site-shell"><SeoManager /><IntroScreen /><Header /><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/recruiter" element={<RecruiterPortal />} /><Route path="/services" element={<Services />} /><Route path="/projects" element={<Projects />} /><Route path="/blog" element={<Blog />} /><Route path="/blog/:slug" element={<BlogPost />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<Home />} /></Routes><Footer /><RONIEChat /></div>
}

function App() {
  return <BrowserRouter><Routes><Route path="/admin" element={<Suspense fallback={<div className="admin-loading">RDDS Admin load ho raha hai…</div>}><Admin /></Suspense>} /><Route path="*" element={<PublicSite />} /></Routes></BrowserRouter>;
}

export default App;
