import React, { useEffect, useState } from 'react';

const services = [
  {
    icon: 'fa-code',
    title: 'Custom Web Development',
    description: 'High-performance websites and web apps built with modern technologies like React, Next.js, and Node.js.',
    points: ['Fast, responsive layouts', 'Custom web applications'],
  },
  {
    icon: 'fa-cart-shopping',
    title: 'E-Commerce Solutions',
    description: 'Full e-commerce store development with payment gateway integration and inventory management.',
    points: ['Shopify and custom stores', 'Secure payment gateways'],
  },
  {
    icon: 'fa-palette',
    title: 'UI/UX & Graphic Design',
    description: 'Distinctive brand identity, logos, banners, and modern UI/UX prototypes for web and mobile apps.',
    points: ['Brand identity and logos', 'Modern UI/UX layouts'],
  },
];

const projects = [
  {
    category: 'Web Development',
    title: 'Enterprise Web Dashboard',
    description: 'A custom analytical application for tracking real-time metrics and reporting.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    alt: 'Analytics dashboard on a screen',
  },
  {
    category: 'UI/UX & Branding',
    title: 'Brand Identity & Visuals',
    description: 'Brand guidelines, logo assets, and a polished web interface design prototype.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80',
    alt: 'Colorful design materials',
  },
  {
    category: 'Restaurant Website',
    title: "Namira's Kitchen",
    description: 'Explore the live website created for Namira’s Kitchen.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    alt: 'Fresh meal representing Namira’s Kitchen',
    href: 'https://namiraskitchen.vercel.app/',
  },
];

function Mandala() {
  const dots = Array.from({ length: 48 }, (_, index) => {
    const angle = (index * Math.PI * 2) / 48;
    const x = 500 + Math.cos(angle) * 234;
    const y = 500 + Math.sin(angle) * 234;
    return <circle key={index} cx={x} cy={y} r="8" />;
  });

  return (
    <svg className="mandala" viewBox="0 0 1000 1000" fill="none" aria-hidden="true">
      <circle cx="500" cy="500" r="485" />
      <circle cx="500" cy="500" r="460" />
      <circle cx="500" cy="500" r="430" />
      <circle cx="500" cy="500" r="405" />
      <circle cx="500" cy="500" r="360" />
      <circle cx="500" cy="500" r="335" />
      <circle cx="500" cy="500" r="300" />
      <circle cx="500" cy="500" r="275" />
      <circle cx="500" cy="500" r="235" />
      <circle cx="500" cy="500" r="205" />
      <circle cx="500" cy="500" r="170" />
      <circle cx="500" cy="500" r="145" />
      <circle cx="500" cy="500" r="105" />
      <circle cx="500" cy="500" r="75" />
      {Array.from({ length: 24 }, (_, index) => (
        <g key={index} transform={`rotate(${index * 15} 500 500)`}>
          <path d="M500 327 L518 390 L500 373 L482 390 Z" />
          <path d="M500 205 L526 282 L500 262 L474 282 Z" />
          <path d="M500 55 L535 153 L500 130 L465 153 Z" />
          <path d="M500 405 L512 445 L500 435 L488 445 Z" />
        </g>
      ))}
      {dots}
      <circle className="mandala-center" cx="500" cy="500" r="17" />
    </svg>
  );
}

function Stars() {
  return <div className="stars" aria-hidden="true" />;
}

export default function App() {
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [welcomeAnimated, setWelcomeAnimated] = useState(false);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => setWelcomeAnimated(true));
    const motionTargets = document.querySelectorAll(
      '.hero-copy, .hero-bottom, .section-heading, .service-card, .founder-inner, .principles > div, .project-card, .contact-copy, .contact-form',
    );
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    motionTargets.forEach((target, index) => {
      target.classList.add('motion-reveal');
      target.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
      observer.observe(target);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, []);

  const enterSite = (audience) => {
    setWelcomeOpen(false);
    if (audience === 'recruiter') {
      window.setTimeout(() => {
        document.getElementById('founders')?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  };

  return (
    <div className="site-shell">
      <style>{`
        .welcome-overlay{position:fixed;inset:0;z-index:20;display:grid;place-items:center;padding:28px;background:radial-gradient(ellipse at 78% 18%,rgba(25,86,168,.35),transparent 42%),linear-gradient(135deg,rgba(5,17,40,.98),rgba(7,26,58,.98));opacity:0}
        .welcome-overlay.welcome-animate{animation:welcome-fade-in .7s ease both}
        .welcome-card{width:min(920px,100%);display:grid;grid-template-columns:.9fr 1.1fr;overflow:hidden;border:1px solid rgba(158,194,245,.23);border-radius:24px;background:linear-gradient(145deg,rgba(15,39,79,.96),rgba(8,25,53,.98));box-shadow:0 30px 100px rgba(0,0,0,.45);opacity:0;transform:translateY(18px) scale(.985)}
        .welcome-animate .welcome-card{animation:welcome-rise .8s .12s ease both}
        .welcome-photo{position:relative;min-height:480px;overflow:hidden;background:#0b2045}
        .welcome-photo:before{content:"DK";position:absolute;inset:0;display:grid;place-items:center;color:#8bbcff;font:800 clamp(72px,14vw,140px) 'Roboto Slab',serif;letter-spacing:-.08em;background:radial-gradient(circle at center,rgba(45,105,183,.35),transparent 58%),linear-gradient(145deg,#102e5d,#091b3a)}
        .welcome-photo:after{content:"";position:absolute;inset:45% 0 0;background:linear-gradient(transparent,rgba(5,17,40,.75))}
        .welcome-photo img{width:100%;height:100%;position:absolute;inset:0;object-fit:cover;object-position:center 28%;opacity:.9}
        .welcome-photo-label{position:absolute;z-index:1;left:24px;bottom:23px;color:#e9f3ff;font-size:12px;letter-spacing:.12em;text-transform:uppercase}
        .welcome-content{display:flex;flex-direction:column;justify-content:center;padding:52px 48px}
        .welcome-kicker{color:#8dbfff;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
        .welcome-content h2{margin:17px 0 13px;color:#eff6ff;font-family:'Roboto Slab',serif;font-size:clamp(34px,4vw,47px);line-height:1.16;letter-spacing:-.03em}
        .welcome-content h2 span{color:#8bbcff}
        .welcome-content p{max-width:430px;margin:0;color:#b5c6df;font-size:14px;line-height:1.8}
        .welcome-actions{display:grid;gap:12px;margin-top:30px}
        .welcome-actions button{width:100%;min-height:51px;padding:0 18px;border:1px solid rgba(137,183,244,.48);border-radius:10px;background:linear-gradient(110deg,#0869e8,#0752bc);color:#fff;font:700 13px 'DM Sans',sans-serif;cursor:pointer;transition:transform .2s,background .2s,border-color .2s}
        .welcome-actions button:hover{transform:translateY(-2px);background:#147eff}
        .welcome-actions button.welcome-secondary{background:rgba(4,17,38,.45);color:#dce9fa}
        .welcome-actions button.welcome-secondary:hover{border-color:#75adf4;background:rgba(23,57,105,.65)}
        .welcome-actions button:focus-visible{outline:2px solid #fff;outline-offset:3px}
        .welcome-note{margin-top:20px!important;color:#849ab9!important;font-size:11px!important}
        @keyframes welcome-fade-in{from{opacity:0}to{opacity:1}}
        @keyframes welcome-rise{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
        @media(max-width:650px){.welcome-overlay{padding:18px}.welcome-card{max-width:430px;grid-template-columns:1fr;border-radius:20px}.welcome-photo{min-height:230px;height:34vh;max-height:290px}.welcome-photo img{object-position:center 30%}.welcome-content{padding:29px 25px 30px}.welcome-content h2{font-size:34px;margin:12px 0 9px}.welcome-content p{font-size:13px}.welcome-actions{margin-top:22px;gap:10px}.welcome-actions button{min-height:48px}}
        @media(prefers-reduced-motion:reduce){.welcome-overlay,.welcome-card{animation:none;opacity:1;transform:none}.welcome-actions button{transition:none}}
      `}</style>
      {welcomeOpen && (
        <section className={`welcome-overlay${welcomeAnimated ? ' welcome-animate' : ''}`} role="dialog" aria-modal="true" aria-labelledby="welcome-title">
          <div className="welcome-card">
            <div className="welcome-photo">
              <img src="./danish-khan.jpg" alt="Danish Khan, founder and web developer" onError={event => { event.currentTarget.style.display = 'none'; }} />
              <span className="welcome-photo-label">Danish Khan · Founder</span>
            </div>
            <div className="welcome-content">
              <span className="welcome-kicker">A personal introduction · RDDS Enterprises</span>
              <h2 id="welcome-title">Hello, I’m Danish.<br /><span>I build for the web.</span></h2>
              <p>I personally design and develop thoughtful websites for businesses. How would you like to explore my work?</p>
              <div className="welcome-actions">
                <button type="button" onClick={() => enterSite('guest')}>Continue as a guest <i className="fa-solid fa-arrow-right" /></button>
                <button className="welcome-secondary" type="button" onClick={() => enterSite('recruiter')}>I’m a recruiter — view my profile <i className="fa-solid fa-arrow-right" /></button>
              </div>
              <p className="welcome-note">Personal collaboration. Thoughtful design. Built with care.</p>
            </div>
          </div>
        </section>
      )}
      <section id="home" className="hero">
        <Stars />
        <Mandala />
        <header className="topbar">
          <a className="brand" href="#home" aria-label="RDDS Enterprises home">
            <span className="brand-mark">R</span>
            <span className="brand-name">RDDS <b>ENTERPRISES</b></span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#services">Services</a>
            <a href="#portfolio">Projects</a>
            <a href="#about">About</a>
            <a className="nav-contact" href="#contact">Contact us</a>
          </nav>
          <a className="mobile-contact" href="#contact" aria-label="Contact us"><i className="fa-regular fa-envelope" /></a>
        </header>

        <div className="hero-copy">
          <span className="eyebrow"><span className="status-dot" /> RDDS ENTERPRISES · WEB DESIGN & DEVELOPMENT</span>
          <h1>Premium websites.<br /><span>Elevate your brand.</span></h1>
          <p>Thoughtful digital experiences, designed and built personally by <strong>Danish Khan.</strong></p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">Get a consultation <i className="fa-solid fa-arrow-right" /></a>
            <a className="button button-secondary" href="#portfolio">View projects</a>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="ticker" aria-label="Our commitments">
            <span>Custom-built websites</span><b>✦</b><span>SEO-ready design</span><b>✦</b><span>Responsive by design</span><b>✦</b><span>Direct founder collaboration</span><b>✦</b><span>Clear communication</span>
          </div>
          <div className="benefits">
            <div className="benefit"><i className="fa-solid fa-display" /><div><strong>Modern design</strong><span>Striking interfaces,<br />built for experience</span></div></div>
            <div className="benefit"><i className="fa-solid fa-rocket" /><div><strong>Blazing fast</strong><span>Optimised page speed,<br />built for the web</span></div></div>
            <div className="benefit"><i className="fa-solid fa-shield-halved" /><div><strong>Google SEO ready</strong><span>SEO-friendly structure,<br />built to rank</span></div></div>
            <div className="benefit"><i className="fa-solid fa-award" /><div><strong>Lifetime support</strong><span>Personal support<br />when you need it</span></div></div>
          </div>
        </div>
        <a className="hero-scroll" href="#services" aria-label="Scroll to services"><i className="fa-solid fa-chevron-down" /></a>
      </section>

      <main>
        <section id="services" className="section section-services">
          <div className="section-heading">
            <span className="section-kicker">What we do</span>
            <h2>Digital made to work <span>for you.</span></h2>
            <p>From the first conversation to launch, get a practical, personal approach to creating your next website.</p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <div className="card-topline"><span>0{index + 1}</span><i className={`fa-solid ${service.icon}`} /></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>{service.points.map(point => <li key={point}><i className="fa-solid fa-check" />{point}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section id="founders" className="founder-section">
          <div className="founder-inner">
            <div className="founder-photo-wrap"><img src="./danish-khan.jpg" alt="Danish Khan, founder of RDDS Enterprises" loading="lazy" decoding="async" /></div>
            <div className="founder-copy">
              <span className="section-kicker">A personal approach</span>
              <h2>Work directly with the person who builds your website.</h2>
              <p>RDDS Enterprises is founded and personally managed by Danish Khan. Every project gets direct attention—from early planning and design through development and final delivery.</p>
              <div className="founder-signature"><strong>Danish Khan</strong><span>Founder & Web Developer</span></div>
            </div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="section-heading">
            <span className="section-kicker">About RDDS Enterprises</span>
            <h2>Practical websites,<br /><span>crafted with care.</span></h2>
            <p>We create responsive websites and custom web applications that help businesses build a strong, lasting online presence—with clean code, considered design, and clear communication.</p>
          </div>
          <div className="principles">
            <div><i className="fa-solid fa-user-check" /><h3>Direct collaboration</h3><p>Work one-to-one with the founder throughout your project.</p></div>
            <div><i className="fa-solid fa-mobile-screen-button" /><h3>Responsive by design</h3><p>Useful, beautiful experiences on every screen size.</p></div>
            <div><i className="fa-solid fa-comments" /><h3>Clear communication</h3><p>Stay informed and involved from kickoff to launch.</p></div>
          </div>
        </section>

        <section id="portfolio" className="section portfolio-section">
          <div className="section-heading section-heading-row">
            <div><span className="section-kicker">Selected work</span><h2>Built with purpose.</h2></div>
            <p>A selection of web development and visual design work.</p>
          </div>
          <div className="project-grid">
            {projects.map(project => {
              const content = <>
                <div className="project-image"><img src={project.image} alt={project.alt} loading="lazy" decoding="async" /><span className="project-arrow"><i className="fa-solid fa-arrow-up-right-from-square" /></span></div>
                <div className="project-copy"><span>{project.category}</span><h3>{project.title}</h3><p>{project.description}</p></div>
              </>;
              return project.href
                ? <a className="project-card" key={project.title} href={project.href} target="_blank" rel="noopener noreferrer">{content}</a>
                : <article className="project-card" key={project.title}>{content}</article>;
            })}
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-inner">
            <div className="contact-copy">
              <span className="section-kicker">Let’s talk</span>
              <h2>Have a project<br />in mind?</h2>
              <p>Tell us what you’re looking to build. Reach out directly and let’s make a plan together.</p>
              <a className="contact-line" href="mailto:rdds.enterprises@gmail.com"><i className="fa-regular fa-envelope" /> rdds.enterprises@gmail.com</a>
              <a className="contact-line" href="https://wa.me/923042178799" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp" /> 03042178799</a>
            </div>
            <form name="contact" method="POST" data-netlify="true" className="contact-form">
              <input type="hidden" name="form-name" value="contact" />
              <div className="form-row">
                <label>Your name<input type="text" name="name" placeholder="Your name" required /></label>
                <label>Email address<input type="email" name="email" placeholder="name@example.com" required /></label>
              </div>
              <label>Service required<select name="service" defaultValue="Custom Web Development"><option>Custom Web Development</option><option>E-Commerce Solutions</option><option>UI/UX & Graphic Design</option></select></label>
              <label>Project details<textarea name="message" rows="4" placeholder="Tell us about your project goals and timeline..." required /></label>
              <button className="button button-primary" type="submit">Send your enquiry <i className="fa-solid fa-arrow-right" /></button>
            </form>
          </div>
        </section>
      </main>
      <footer className="footer"><a className="brand" href="#home"><span className="brand-mark">R</span><span className="brand-name">RDDS <b>ENTERPRISES</b></span></a><span>© 2026 RDDS Enterprises. All rights reserved.</span><div className="footer-socials" aria-label="Social media links"><a href="https://www.facebook.com/RDds1995/" target="_blank" rel="noopener noreferrer" aria-label="RDDS Enterprises on Facebook"><i className="fa-brands fa-facebook-f" /></a><a href="https://www.instagram.com/rdds.enterprises" target="_blank" rel="noopener noreferrer" aria-label="RDDS Enterprises on Instagram"><i className="fa-brands fa-instagram" /></a><a className="footer-connect" href="https://wa.me/923042178799" target="_blank" rel="noopener noreferrer">Let’s connect <i className="fa-brands fa-whatsapp" /></a></div></footer>
    </div>
  );
}
