import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useParams } from "react-router-dom";
import founderPhoto from "./danish-khan.jpg";
import Admin from "./Admin.jsx";

const services = [
  { n: "01", icon: "⌘", title: "Custom Web Development", desc: "Fast, responsive websites and custom web applications designed around your business.", points: ["Business websites", "Custom web applications"] },
  { n: "02", icon: "▣", title: "E-Commerce Solutions", desc: "Online stores with clear product journeys, practical management and secure integrations.", points: ["Shopify and custom stores", "Store setup and integrations"] },
  { n: "03", icon: "✳", title: "UI/UX & Graphic Design", desc: "Clean visual identities and intuitive interfaces that make your brand stand out.", points: ["Brand identity and graphics", "Web and mobile UI/UX"] }
];

const blogPosts = [];

function IntroScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2800);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return <div className="intro-screen" role="status" aria-label="Welcome to RDDS Enterprises">
    <div className="intro-glow" />
    <div className="intro-logo">R</div>
    <p className="intro-kicker">WELCOME TO</p>
    <h1>RDDS <span>ENTERPRISES</span></h1>
    <div className="intro-line" />
    <p className="intro-message">I'm <strong>Danish Khan</strong> — Founder & Web Developer</p>
    <p className="intro-sub">Building thoughtful digital experiences for growing businesses.</p>
    <button className="intro-skip" onClick={() => setVisible(false)}>Enter website ↗</button>
  </div>;
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
      <div className="service-grid">{services.map(s => <article className="service-card" key={s.n}><div className="card-meta"><span>{s.n}</span><b>{s.icon}</b></div><h3>{s.title}</h3><p>{s.desc}</p><ul>{s.points.map(p => <li key={p}>✓ <span>{p}</span></li>)}</ul></article>)}</div>
      <div className="center-link"><Link className="btn secondary" to="/services">Explore all services ↗</Link></div>
    </section>
    <section className="founder"><div className="founder-inner"><div className="portrait"><img src={founderPhoto} alt="Danish Khan, founder of RDDS Enterprises" /></div><div><label>MEET THE FOUNDER</label><h2>Work directly with the person who builds your website.</h2><p>I'm Danish Khan, Founder & Web Developer at RDDS Enterprises. I personally manage projects from early planning and design through development and final delivery.</p><div className="signature"><strong>Danish Khan</strong><span>Founder & Web Developer</span></div><Link className="text-link" to="/about">More about me ↗</Link></div></div></section>
    <section className="home-blog section"><div className="section-head"><label>FROM THE BLOG</label><h2>Ideas, insights & <em>updates.</em></h2><p>Helpful thoughts about websites, design and growing your business online.</p></div><div className="blog-empty compact"><span className="blog-icon">✦</span><h3>Articles are coming soon</h3><p>We're preparing useful articles for business owners and creators.</p><Link className="text-link" to="/blog">Visit the blog ↗</Link></div></section>
    <section className="home-cta"><label>READY TO GET STARTED?</label><h2>Let's build something<br /><em>meaningful.</em></h2><Link className="btn primary" to="/contact">Start a conversation ↗</Link></section>
  </>;
}

function About() {
  return <main className="inner-page"><PageIntro eyebrow="ABOUT THE FOUNDER" title={<>A personal approach.<br /><em>From first idea to launch.</em></>}>RDDS Enterprises is founded and personally managed by Danish Khan, with a focus on thoughtful design, practical development and clear communication.</PageIntro><section className="founder about-founder"><div className="founder-inner"><div className="portrait"><img src={founderPhoto} alt="Danish Khan, founder of RDDS Enterprises" /></div><div><label>FOUNDER & WEB DEVELOPER</label><h2>Hi, I'm Danish Khan.</h2><p>I work directly with businesses to plan, design and build modern websites and digital experiences. I believe a good website should look professional, work smoothly on every device and make it easier for customers to connect with a business.</p><p>At RDDS Enterprises, every project receives direct attention throughout the process—from understanding the idea to development, launch and support.</p><div className="signature"><strong>Danish Khan</strong><span>Founder & Web Developer · RDDS Enterprises</span></div></div></div></section><section className="section"><div className="principle-grid"><article><b>01</b><h3>Direct collaboration</h3><p>Work one-to-one with the founder throughout your project.</p></article><article><b>02</b><h3>Responsive by design</h3><p>Useful, beautiful experiences on every screen size.</p></article><article><b>03</b><h3>Clear communication</h3><p>Stay informed and involved from kickoff to launch.</p></article></div></section></main>;
}

function Services() {
  return <main className="inner-page"><PageIntro eyebrow="OUR SERVICES" title={<>Digital made to work <em>for you.</em></>}>Practical digital solutions built around your goals, your customers and your business.</PageIntro><section className="section services-page"><div className="service-grid">{services.map(s => <article className="service-card" key={s.n}><div className="card-meta"><span>{s.n}</span><b>{s.icon}</b></div><h3>{s.title}</h3><p>{s.desc}</p><ul>{s.points.map(p => <li key={p}>✓ <span>{p}</span></li>)}</ul></article>)}</div></section><section className="home-cta"><label>HAVE A PROJECT IN MIND?</label><h2>Let's discuss your<br /><em>next step.</em></h2><Link className="btn primary" to="/contact">Get a consultation ↗</Link></section></main>;
}

function Projects() {
  return <main className="inner-page"><PageIntro eyebrow="SELECTED WORK" title={<>Built with <em>purpose.</em></>}>A selection of web development and visual design work.</PageIntro><section className="work projects-page"><div className="work-grid"><article><div className="work-art art-one">01</div><small>WEB DEVELOPMENT</small><h3>Enterprise Web Dashboard</h3><p>Analytical interfaces for useful business insights and reporting.</p></article><article><div className="work-art art-two">02</div><small>UI/UX & BRANDING</small><h3>Brand Identity & Visuals</h3><p>Brand assets and polished digital interface concepts.</p></article><a href="https://namiraskitchen.vercel.app/" target="_blank" rel="noreferrer"><div className="work-art art-three">03 ↗</div><small>RESTAURANT WEBSITE</small><h3>Namira's Kitchen</h3><p>Explore a restaurant website project.</p></a></div></section></main>;
}

function Blog() {
  return <main className="inner-page"><PageIntro eyebrow="RDDS JOURNAL" title={<>Ideas worth <em>sharing.</em></>}>Articles, tips and updates about web development, design, e-commerce and building a stronger online presence.</PageIntro><section className="section blog-page">{blogPosts.length ? <div className="blog-grid">{blogPosts.map(post => <article className="blog-card" key={post.slug}><div className="blog-card-art">RDDS JOURNAL</div><div className="blog-card-body"><small>{post.category}</small><h2>{post.title}</h2><p>{post.excerpt}</p><Link className="text-link" to={"/blog/" + post.slug}>Read article ↗</Link></div></article>)}</div> : <div className="blog-empty"><span className="blog-icon">✦</span><label>THE FIRST CHAPTER STARTS HERE</label><h2>Our blog is getting ready.</h2><p>There are no published articles yet. Soon, you'll find practical guides, website tips, design insights and updates from RDDS Enterprises here.</p><span className="blog-coming">NEW ARTICLES COMING SOON</span></div>}</section></main>;
}

function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(item => item.slug === slug);
  if (!post) return <main className="inner-page"><div className="blog-empty"><h2>Article not found</h2><p>This article may have been moved or is not published yet.</p><Link className="text-link" to="/blog">← Back to blog</Link></div></main>;
  return <main className="inner-page"><article className="article-page"><label>{post.category}</label><h1>{post.title}</h1><p>{post.excerpt}</p><div className="article-content">{post.content}</div><Link className="text-link" to="/blog">← Back to blog</Link></article></main>;
}

function Contact() {
  return <main className="inner-page"><PageIntro eyebrow="LET'S TALK" title={<>Have a project<br /><em>in mind?</em></>}>Tell us what you're looking to build. Reach out directly and let's make a plan together.</PageIntro><section className="contact"><div className="contact-inner"><div><label>GET IN TOUCH</label><h2>Let's make it<br />happen.</h2><p>Get in touch for a website, online store or design project.</p><a className="contact-line" href="mailto:rdds.enterprises@gmail.com">✉ rdds.enterprises@gmail.com</a><a className="contact-line" href="https://wa.me/923042178799" target="_blank" rel="noreferrer">☏ 03042178799</a></div><form action="https://formsubmit.co/rdds.enterprises@gmail.com" method="POST"><input type="hidden" name="_subject" value="New RDDS Enterprises enquiry" /><input type="hidden" name="_captcha" value="true" /><div className="form-row"><label>Your name<input name="name" placeholder="Your name" required /></label><label>Email address<input name="email" type="email" placeholder="name@example.com" required /></label></div><label>Service required<select name="service"><option>Custom Web Development</option><option>E-Commerce Solutions</option><option>UI/UX & Graphic Design</option></select></label><label>Project details<textarea name="message" rows="4" placeholder="Tell us about your project..." required /></label><button className="btn primary" type="submit">Send your enquiry ↗</button></form></div></section></main>;
}

function PublicSite() {
  return <div className="site-shell"><IntroScreen /><Header /><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/services" element={<Services />} /><Route path="/projects" element={<Projects />} /><Route path="/blog" element={<Blog />} /><Route path="/blog/:slug" element={<BlogPost />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<Home />} /></Routes><Footer /></div>;
}

function App() {
  return <BrowserRouter><Routes><Route path="/admin" element={<Admin />} /><Route path="*" element={<PublicSite />} /></Routes></BrowserRouter>;
}

export default App;
