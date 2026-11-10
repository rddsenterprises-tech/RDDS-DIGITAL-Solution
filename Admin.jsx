import React, { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigured } from "./supabase.js";
import "./admin.css";

const sections = [
  { id: "overview", label: "Overview", icon: "▦" },
  { id: "services", table: "services", label: "Services", icon: "◇" },
  { id: "projects", table: "projects", label: "Projects", icon: "▧" },
  { id: "blogPosts", table: "blog_posts", label: "Blog posts", icon: "▤" },
  { id: "contactMessages", table: "contact_messages", label: "Messages", icon: "✉" }
];
const emptyForm = { title: "", description: "", slug: "", category: "", website_url: "", content: "", published: true };
const dateLabel = value => value ? new Date(value).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [membershipChecked, setMembershipChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [active, setActive] = useState("overview");
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ services: 0, projects: 0, blogPosts: 0, messages: 0, unread: 0, published: 0, drafts: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageFilter, setMessageFilter] = useState("all");

  useEffect(() => {
    if (!supabaseConfigured) { setAuthChecked(true); return; }
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) setError("Session load nahi hua. Dobara sign in karein.");
      setUser(data?.session?.user ?? null);
      setAuthChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null); setIsAdmin(false); setMembershipChecked(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsAdmin(false); setMembershipChecked(false);
    if (!user) { setMembershipChecked(true); return; }
    supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle()
      .then(({ data, error: membershipError }) => {
        if (cancelled) return;
        if (membershipError) setError("Admin permission verify nahi hui. Supabase setup check karein.");
        setIsAdmin(Boolean(data)); setMembershipChecked(true);
      });
    return () => { cancelled = true; };
  }, [user]);

  const loadOverview = async () => {
    const [s, p, b, m, mc, uc] = await Promise.all([
      supabase.from("services").select("id,published"),
      supabase.from("projects").select("id,published"),
      supabase.from("blog_posts").select("id,published"),
      supabase.from("contact_messages").select("id,status,name,email,subject,message,created_at").order("created_at", { ascending: false }).limit(6),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new")
    ]);
    if (s.error || p.error || b.error || m.error || mc.error || uc.error) { setError("Dashboard data load nahi hua. Supabase permissions check karein."); return; }
    const content = [...(s.data || []), ...(p.data || []), ...(b.data || [])];
    setStats({
      services: s.data?.length || 0, projects: p.data?.length || 0, blogPosts: b.data?.length || 0,
      messages: mc.count || 0, unread: uc.count || 0,
      published: content.filter(x => x.published !== false).length,
      drafts: content.filter(x => x.published === false).length
    });
    setRecentMessages(m.data || []);
  };

  useEffect(() => {
    if (user && isAdmin) loadOverview();
  }, [user, isAdmin]);

  useEffect(() => {
    if (!user || !isAdmin || active === "overview") return;
    let cancelled = false;
    const section = sections.find(item => item.id === active);
    if (!section?.table) return;
    setLoading(true); setError("");
    supabase.from(section.table).select("*").order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError) setError("Records load nahi huay. Supabase table permissions check karein.");
        else setItems(data || []);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [active, user, isAdmin]);

  const login = async event => {
    event.preventDefault(); setError("");
    const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (loginError) setError("Login nahi hua. Email aur password dobara check karein.");
    else setPassword("");
  };
  const logout = async () => {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) setError("Sign out nahi ho saka. Dobara koshish karein.");
    setIsAdmin(false); setItems([]);
  };
  const loadItems = async () => {
    const section = sections.find(item => item.id === active);
    const { data, error: queryError } = await supabase.from(section.table).select("*").order("created_at", { ascending: false });
    if (queryError) setError("Records refresh nahi huay.");
    else setItems(data || []);
    await loadOverview();
  };
  const saveItem = async event => {
    event.preventDefault(); setError("");
    const payload = {
      title: form.title.trim(), description: form.description.trim(), slug: form.slug.trim(),
      category: form.category.trim(), published: Boolean(form.published), updated_at: new Date().toISOString(),
      ...(active === "projects" ? { website_url: form.website_url.trim() } : {}),
      ...(active === "blogPosts" ? { content: form.content.trim() } : {})
    };
    if (!payload.title) return setError("Title zaroor likhein.");
    const section = sections.find(item => item.id === active);
    const result = editingId ? await supabase.from(section.table).update(payload).eq("id", editingId) : await supabase.from(section.table).insert(payload);
    if (result.error) return setError("Save nahi hua. Supabase admin permission check karein.");
    setForm(emptyForm); setEditingId(null); setShowForm(false); await loadItems();
  };
  const editItem = item => {
    setEditingId(item.id);
    setForm({ title: item.title || "", description: item.description || "", slug: item.slug || "", category: item.category || "", website_url: item.website_url || "", content: item.content || "", published: item.published !== false });
    setShowForm(true);
  };
  const removeItem = async id => {
    if (!window.confirm("Kya aap is record ko delete karna chahte hain?")) return;
    const section = sections.find(item => item.id === active);
    const { error: deleteError } = await supabase.from(section.table).delete().eq("id", id);
    if (deleteError) return setError("Delete nahi hua. Supabase admin permission check karein.");
    setItems(current => current.filter(item => item.id !== id)); await loadOverview();
  };
  const updateMessageStatus = async (id, status) => {
    const { error: updateError } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (updateError) return setError("Message status update nahi hua.");
    await loadItems();
  };

  if (!supabaseConfigured) return <SetupScreen />;
  if (!authChecked) return <div className="admin-loading">RDDS Admin load ho raha hai…</div>;
  if (!user) return <main className="admin-page"><div className="admin-login">
    <a className="admin-brand" href="/">R <span>RDDS ENTERPRISES</span></a><div className="admin-kicker">SECURE WORKSPACE</div>
    <h1>Welcome back.</h1><p>Sign in to manage your RDDS website content.</p>
    <form onSubmit={login}><label>Email address<input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com" /></label>
    <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" /></label>
    {error && <div className="admin-error">{error}</div>}<button className="admin-primary" type="submit">Sign in securely ↗</button></form>
    <a className="admin-back" href="/">← Back to public website</a></div></main>;
  if (!membershipChecked) return <div className="admin-loading">Admin permission verify ho rahi hai…</div>;
  if (!isAdmin) return <main className="admin-page"><div className="admin-login"><div className="admin-kicker">ACCESS RESTRICTED</div><h1>Not authorised.</h1><p>This account is not on the RDDS administrator allowlist.</p>{error && <div className="admin-error">{error}</div>}<button className="admin-primary" onClick={logout}>Sign out</button><a className="admin-back" href="/">← Back to public website</a></div></main>;

  const activeLabel = sections.find(section => section.id === active)?.label || "Overview";
  const visibleItems = items.filter(item => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term || [item.title, item.name, item.subject, item.description, item.message, item.email, item.category, item.slug].some(value => String(value || "").toLowerCase().includes(term));
    const matchesStatus = active !== "contactMessages" || messageFilter === "all" || (item.status || "new") === messageFilter;
    return matchesSearch && matchesStatus;
  });
  return <main className="admin-dashboard">
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/"><span className="admin-brand-mark">R</span><span>RDDS <b>ENTERPRISES</b><small>MANAGEMENT STUDIO</small></span></a>
      <div className="admin-side-label">WORKSPACE</div>
      {sections.map(section => <button key={section.id} className={active === section.id ? "active" : ""} onClick={() => { setActive(section.id); setShowForm(false); setError(""); }}><span className="admin-nav-icon">{section.icon}</span>{section.label}{section.id === "contactMessages" && stats.unread > 0 && <i className="admin-nav-count">{stats.unread}</i>}</button>)}
      <div className="admin-sidebar-bottom"><a className="admin-public-link" href="/">↗ View live website</a><div className="admin-profile"><span className="admin-avatar">A</span><span><strong>Administrator</strong><small>Secure access</small></span></div><button className="admin-logout" onClick={logout}>↪ Sign out</button></div>
    </aside>
    <section className="admin-main">
      <header className="admin-top"><div><span className="admin-breadcrumb">RDDS / WORKSPACE / {activeLabel.toUpperCase()}</span><h1>{activeLabel}</h1><p>{active === "overview" ? "Your website at a glance. Manage content and stay on top of enquiries." : "Manage and update your website content."}</p></div><div className="admin-top-actions"><span className="admin-status"><i /> System connected</span><button className="admin-refresh" onClick={() => active === "overview" ? loadOverview() : loadItems()}>↻ Refresh</button></div></header>
      {error && <div className="admin-error admin-notice">{error}</div>}
      {active === "overview" ? <div className="admin-overview">
        <div className="admin-welcome"><div><span>YOUR BUSINESS OVERVIEW</span><h2>Welcome to your workspace.</h2><p>Here’s what’s happening across your website today.</p></div><div className="admin-welcome-mark">R</div></div>
        <div className="admin-stat-grid">
          <StatCard label="Services" value={stats.services} icon="◇" note="Total service entries" />
          <StatCard label="Projects" value={stats.projects} icon="▧" note="Portfolio entries" />
          <StatCard label="Blog posts" value={stats.blogPosts} icon="▤" note="Articles in your journal" />
          <StatCard label="Messages" value={stats.messages} icon="✉" note={stats.unread + " new enquiries"} accent />
        </div>
        <div className="admin-insight-grid">
          <section className="admin-panel"><div className="admin-panel-head"><div><span>CONTENT STATUS</span><h3>Publishing overview</h3></div><span className="admin-panel-icon">◷</span></div><div className="admin-publish-numbers"><div><strong>{stats.published}</strong><span>Published</span></div><div><strong>{stats.drafts}</strong><span>Drafts</span></div></div><div className="admin-progress"><span style={{ width: (stats.published + stats.drafts ? stats.published / (stats.published + stats.drafts) * 100 : 0) + "%" }} /></div><p className="admin-muted">Content entries across services, projects and blog.</p></section>
          <section className="admin-panel"><div className="admin-panel-head"><div><span>QUICK ACTIONS</span><h3>Manage your website</h3></div><span className="admin-panel-icon">✦</span></div><div className="admin-quick-actions"><button onClick={() => { setActive("services"); setShowForm(true); setForm(emptyForm); }}>＋ <span><b>Add a service</b><small>Create a new service listing</small></span></button><button onClick={() => { setActive("projects"); setShowForm(true); setForm(emptyForm); }}>＋ <span><b>Add a project</b><small>Showcase your latest work</small></span></button><button onClick={() => { setActive("blogPosts"); setShowForm(true); setForm(emptyForm); }}>＋ <span><b>Write a blog post</b><small>Publish an article or update</small></span></button></div></section>
        </div>
        <section className="admin-panel admin-recent"><div className="admin-panel-head"><div><span>INBOX</span><h3>Recent enquiries</h3></div><button className="admin-text-button" onClick={() => setActive("contactMessages")}>View all messages ↗</button></div>
          {recentMessages.length ? <div className="admin-message-list">{recentMessages.slice(0,5).map(message => <div className="admin-message-row" key={message.id}><span className="admin-message-avatar">{(message.name || "M").slice(0,1).toUpperCase()}</span><div className="admin-message-info"><strong>{message.name || "Website visitor"}</strong><small>{message.subject || message.email || "New enquiry"} · {dateLabel(message.created_at)}</small></div><span className={"admin-message-status " + (message.status || "new")}>{message.status || "new"}</span></div>)}</div> : <div className="admin-no-data">No enquiries received yet. New website contact messages will appear here.</div>}
        </section>
      </div> : <>
        <div className="admin-toolbar"><p>{active === "contactMessages" ? "Review and manage customer enquiries." : "Create, update and publish your website content."}</p>{active !== "contactMessages" && <button className="admin-primary" onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(v => !v); }}>＋ Add new</button>}</div>
        <div className="admin-list-tools"><label className="admin-search"><span>⌕</span><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={active === "contactMessages" ? "Search name, email or message..." : "Search title, category or description..."} /></label>{active === "contactMessages" && <select aria-label="Filter messages by status" value={messageFilter} onChange={e => setMessageFilter(e.target.value)}><option value="all">All statuses</option><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option></select>}<span className="admin-result-count">{visibleItems.length} of {items.length} records</span></div>
        {showForm && active !== "contactMessages" && <form className="admin-editor" onSubmit={saveItem}><h2>{editingId ? "Edit record" : "Create new record"}</h2>
          <label>Title<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></label><label>Description<textarea rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
          {active === "projects" && <label>Project website URL<input type="url" value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })} placeholder="https://example.com" /></label>}
          {active === "blogPosts" && <label>Article content<textarea rows="8" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your article..." /></label>}
          <div className="admin-form-row"><label>Slug<input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="my-first-post" /></label><label>Category<input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Web development" /></label></div>
          <label className="admin-check"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> Publish on website</label><div className="admin-actions"><button className="admin-primary" type="submit">Save changes</button><button type="button" className="admin-cancel" onClick={() => setShowForm(false)}>Cancel</button></div>
        </form>}
        {loading ? <div className="admin-empty">Loading records…</div> : items.length === 0 ? <div className="admin-empty"><span>✦</span><h2>No {activeLabel.toLowerCase()} yet</h2><p>{active === "contactMessages" ? "New messages submitted through your website will appear here." : "Create your first record using the Add new button."}</p></div> : visibleItems.length === 0 ? <div className="admin-empty"><span>⌕</span><h2>No matching records</h2><p>Search term ya status filter change karke dobara try karein.</p></div> :
          <div className="admin-records">{visibleItems.map(item => <article className="admin-record" key={item.id}><div className="admin-record-content"><div className="admin-record-meta">{item.category || activeLabel} · {active === "contactMessages" ? (item.status || "new") : item.published === false ? "Draft" : "Published"}</div><h3>{item.title || item.name || item.subject || "Message"}</h3><p>{item.description || item.message || item.email || "—"}</p>{active === "contactMessages" && <small className="admin-record-date">{item.email} · {dateLabel(item.created_at)}</small>}</div>
            {active === "contactMessages" ? <div className="admin-record-actions"><select aria-label="Message status" value={item.status || "new"} onChange={e => updateMessageStatus(item.id, e.target.value)}><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option></select></div> : <div className="admin-record-actions"><button onClick={() => editItem(item)}>Edit</button><button onClick={() => removeItem(item.id)}>Delete</button></div>}</article>)}</div>}
      </>}
    </section>
  </main>;
}

function StatCard({ label, value, icon, note, accent }) {
  return <article className={"admin-stat-card" + (accent ? " accent" : "")}><div className="admin-stat-top"><span>{label}</span><i>{icon}</i></div><strong>{value}</strong><small>{note}</small></article>;
}
function SetupScreen() {
  return <main className="admin-page"><div className="admin-login admin-setup"><a className="admin-brand" href="/">R <span>RDDS ENTERPRISES</span></a><div className="admin-kicker">SUPABASE CONNECTION REQUIRED</div><h1>One quick setup.</h1><p>Supabase project connection is missing. Add the two public Supabase settings from your project to the Vercel environment variables listed in <code>.env.example</code>.</p><ol><li>Open Supabase Dashboard → Authentication → Users and create the administrator with Email/Password.</li><li>Copy that user's UUID from the Users list.</li><li>Run the admin allowlist SQL shown in <code>supabase/ADMIN_SETUP.md</code>.</li><li>Redeploy the website after adding the Vercel environment variables.</li></ol><a className="admin-back" href="/">← Back to public website</a></div></main>;
}
