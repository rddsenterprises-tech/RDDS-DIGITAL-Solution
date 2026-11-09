import React from "react";
import founderPhoto from "./danish-khan.jpg";

const services = [
  { n: "01", icon: "⌘", title: "Custom Web Development", desc: "Fast, responsive websites and custom web applications designed around your business.", points: ["Business websites", "Custom web applications"] },
  { n: "02", icon: "▣", title: "E-Commerce Solutions", desc: "Online stores with clear product journeys, practical management and secure integrations.", points: ["Shopify and custom stores", "Store setup and integrations"] },
  { n: "03", icon: "✳", title: "UI/UX & Graphic Design", desc: "Clean visual identities and intuitive interfaces that make your brand stand out.", points: ["Brand identity and graphics", "Web and mobile UI/UX"] }
];

function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home"><span className="brand-mark">R</span><span>RDDS <b>ENTERPRISES</b></span></a>
        <nav><a href="#services">Services</a><a href="#work">Projects</a><a href="#about">About</a><a className="nav-cta" href="#contact">Contact us</a></nav>
        <a className="mobile-cta" href="#contact" aria-label="Contact">✉</a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="stars" />
          <div className="hero-orbit" aria-hidden="true"><span /><span /><span /></div>
          <div className="hero-copy">
            <div className="eyebrow"><i /> RDDS ENTERPRISES · WEB DESIGN & DEVELOPMENT</div>
            <h1>Premium websites.<br /><em>Elevate your brand.</em></h1>
            <p>Thoughtful digital experiences, designed and built personally by <strong>Danish Khan.</strong></p>
            <div className="hero-actions"><a className="btn primary" href="#contact">Get a consultation <span>↗</span></a><a className="btn secondary" href="#work">View projects</a></div>
          </div>
          <div className="hero-foot">
            <div className="ticker"><span>Custom-built websites</span><b>✦</b><span>SEO-ready design</span><b>✦</b><span>Responsive by design</span><b>✦</b><span>Direct founder collaboration</span></div>
            <div className="benefits"><div><strong>◫ Modern design</strong><small>Designed for experience</small></div><div><strong>↗ Blazing fast</strong><small>Optimised for the web</small></div><div><strong>◇ SEO ready</strong><small>Built with best practices</small></div><div><strong>✧ Personal support</strong><small>Direct communication</small></div></div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-head"><label>WHAT WE DO</label><h2>Digital made to work <em>for you.</em></h2><p>From the first conversation to launch, get a practical, personal approach to creating your next website.</p></div>
          <div className="service-grid">{services.map(s => <article className="service-card" key={s.n}><div className="card-meta"><span>{s.n}</span><b>{s.icon}</b></div><h3>{s.title}</h3><p>{s.desc}</p><ul>{s.points.map(p => <li key={p}>✓ <span>{p}</span></li>)}</ul></article>)}</div>
        </section>

        <section className="founder" id="about">
          <div className="founder-inner">
            <div className="portrait"><img src={founderPhoto} alt="Danish Khan, founder of RDDS Enterprises" /></div>
            <div><label>A PERSONAL APPROACH</label><h2>Work directly with the person who builds your website.</h2><p>RDDS Enterprises is founded and personally managed by Danish Khan. Every project gets direct attention—from early planning and design through development and final delivery.</p><div className="signature"><strong>Danish Khan</strong><span>Founder & Web Developer</span></div></div>
          </div>
        </section>

        <section className="section principles">
          <div className="section-head"><label>ABOUT RDDS ENTERPRISES</label><h2>Practical websites,<br /><em>crafted with care.</em></h2><p>We create responsive websites and custom web applications that help businesses build a strong, lasting online presence.</p></div>
          <div className="principle-grid"><article><b>01</b><h3>Direct collaboration</h3><p>Work one-to-one with the founder throughout your project.</p></article><article><b>02</b><h3>Responsive by design</h3><p>Useful, beautiful experiences on every screen size.</p></article><article><b>03</b><h3>Clear communication</h3><p>Stay informed and involved from kickoff to launch.</p></article></div>
        </section>

        <section className="work" id="work"><div className="section-head"><label>SELECTED WORK</label><h2>Built with <em>purpose.</em></h2><p>A selection of web development and visual design work.</p></div><div className="work-grid">
          <article><div className="work-art art-one">01</div><small>WEB DEVELOPMENT</small><h3>Enterprise Web Dashboard</h3><p>Analytical interfaces for useful business insights and reporting.</p></article>
          <article><div className="work-art art-two">02</div><small>UI/UX & BRANDING</small><h3>Brand Identity & Visuals</h3><p>Brand assets and polished digital interface concepts.</p></article>
          <a href="https://namiras-kitchen-app.vercel.app/" target="_blank" rel="noreferrer"><div className="work-art art-three">03 ↗</div><small>RESTAURANT WEBSITE</small><h3>Namira's Kitchen</h3><p>Explore a restaurant website project.</p></a>
        </div></section>

        <section className="contact" id="contact"><div className="contact-inner"><div><label>LET'S TALK</label><h2>Have a project<br />in mind?</h2><p>Tell us what you're looking to build. Reach out directly and let's make a plan together.</p><a className="contact-line" href="mailto:rdds.enterprises@gmail.com">✉ rdds.enterprises@gmail.com</a><a className="contact-line" href="https://wa.me/923042178799" target="_blank" rel="noreferrer">☏ 03042178799</a></div>
          <form action="https://formsubmit.co/rdds.enterprises@gmail.com" method="POST"><input type="hidden" name="_subject" value="New RDDS Enterprises enquiry" /><input type="hidden" name="_captcha" value="true" /><div className="form-row"><label>Your name<input name="name" placeholder="Your name" required /></label><label>Email address<input name="email" type="email" placeholder="name@example.com" required /></label></div><label>Service required<select name="service"><option>Custom Web Development</option><option>E-Commerce Solutions</option><option>UI/UX & Graphic Design</option></select></label><label>Project details<textarea name="message" rows="4" placeholder="Tell us about your project..." required /></label><button className="btn primary" type="submit">Send your enquiry ↗</button></form>
        </div></section>
      </main>
      <footer><a className="brand" href="#home"><span className="brand-mark">R</span><span>RDDS <b>ENTERPRISES</b></span></a><small>© {new Date().getFullYear()} RDDS Enterprises. All rights reserved.</small><div><a href="https://www.facebook.com/RDds1995/" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.instagram.com/rdds.enterprises" target="_blank" rel="noreferrer">Instagram</a><a href="https://wa.me/923042178799" target="_blank" rel="noreferrer">WhatsApp</a></div></footer>
    </div>
  );
}

export default App;
