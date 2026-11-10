import React, { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "./supabase.js";
import "./admin.css";

const sections = [
  { id: "services", table: "services", label: "Services" },
  { id: "projects", table: "projects", label: "Projects" },
  { id: "blogPosts", table: "blog_posts", label: "Blog posts" },
  { id: "contactMessages", table: "contact_messages", label: "Messages" }
];
const emptyForm = { title: "", description: "", slug: "", category: "", published: true };

export default function Admin() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [membershipChecked, setMembershipChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [active, setActive] = useState("services");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured) {
      setAuthChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) setError("Session load nahi hua. Dobara sign in karein.");
      setUser(data?.session?.user ?? null);
      setAuthChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(false);
      setMembershipChecked(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsAdmin(false);
    setMembershipChecked(false);
    if (!user) {
      setMembershipChecked(true);
      return;
    }
    supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle()
      .then(({ data, error: membershipError }) => {
        if (cancelled) return;
        if (membershipError) setError("Admin permission verify nahi hui. Supabase RLS aur admin_users setup check karein.");
        setIsAdmin(Boolean(data));
        setMembershipChecked(true);
      });
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    let cancelled = false;
    const section = sections.find(item => item.id === active);
    if (!section) return;
    setLoading(true);
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
    event.preventDefault();
    setError("");
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (loginError) setError("Login nahi hua. Email aur password dobara check karein.");
    else setPassword("");
  };

  const logout = async () => {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) setError("Sign out nahi ho saka. Dobara koshish karein.");
    setIsAdmin(false);
    setItems([]);
  };

  const loadItems = async () => {
    const section = sections.find(item => item.id === active);
    const { data, error: queryError } = await supabase.from(section.table).select("*").order("created_at", { ascending: false });
    if (queryError) setError("Records refresh nahi huay.");
    else setItems(data || []);
  };

  const saveItem = async event => {
    event.preventDefault();
    setError("");
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      slug: form.slug.trim(),
      category: form.category.trim(),
      published: Boolean(form.published),
      updated_at: new Date().toISOString()
    };
    if (!payload.title) return setError("Title zaroor likhein.");
    const section = sections.find(item => item.id === active);
    const result = editingId
      ? await supabase.from(section.table).update(payload).eq("id", editingId)
      : await supabase.from(section.table).insert(payload);
    if (result.error) return setError("Save nahi hua. Supabase admin permission check karein.");
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    await loadItems();
  };

  const editItem = item => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      slug: item.slug || "",
      category: item.category || "",
      published: item.published !== false
    });
    setShowForm(true);
  };

  const removeItem = async id => {
    if (!window.confirm("Kya aap is record ko delete karna chahte hain?")) return;
    const section = sections.find(item => item.id === active);
    const { error: deleteError } = await supabase.from(section.table).delete().eq("id", id);
    if (deleteError) return setError("Delete nahi hua. Supabase admin permission check karein.");
    setItems(current => current.filter(item => item.id !== id));
  };

  if (!supabaseConfigured) return <SetupScreen />;
  if (!authChecked) return <div className="admin-loading">RDDS Admin load ho raha hai…</div>;

  if (!user) return <main className="admin-page"><div className="admin-login">
    <a className="admin-brand" href="/">R <span>RDDS ENTERPRISES</span></a>
    <div className="admin-kicker">PRIVATE ADMIN AREA</div>
    <h1>Welcome back.</h1>
    <p>Sign in with your authorised RDDS administrator account.</p>
    <form onSubmit={login}>
      <label>Email address<input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com" /></label>
      <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" /></label>
      {error && <div className="admin-error">{error}</div>}
      <button className="admin-primary" type="submit">Sign in securely ↗</button>
    </form>
    <a className="admin-back" href="/">← Back to public website</a>
  </div></main>;

  if (!membershipChecked) return <div className="admin-loading">Admin permission verify ho rahi hai…</div>;
  if (!isAdmin) return <main className="admin-page"><div className="admin-login">
    <div className="admin-kicker">ACCESS RESTRICTED</div><h1>Not authorised.</h1>
    <p>This Supabase account is not on the RDDS administrator allowlist.</p>
    {error && <div className="admin-error">{error}</div>}
    <button className="admin-primary" onClick={logout}>Sign out</button>
    <a className="admin-back" href="/">← Back to public website</a>
  </div></main>;

  const activeLabel = sections.find(section => section.id === active)?.label || "Admin";
  return <main className="admin-dashboard">
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/">R <span>RDDS ENTERPRISES</span></a>
      <div className="admin-side-label">WORKSPACE</div>
      {sections.map(section => <button key={section.id} className={active === section.id ? "active" : ""} onClick={() => { setActive(section.id); setShowForm(false); setError(""); }}>{section.label}</button>)}
      <a className="admin-public-link" href="/">↗ View website</a>
      <button className="admin-logout" onClick={logout}>Sign out</button>
    </aside>
    <section className="admin-main">
      <header className="admin-top"><div><span>RDDS / ADMIN</span><h1>{activeLabel}</h1></div><div className="admin-user">{user.email}</div></header>
      {error && <div className="admin-error admin-notice">{error}</div>}
      <div className="admin-toolbar"><p>Manage your RDDS {activeLabel.toLowerCase()}.</p>{active !== "contactMessages" && <button className="admin-primary" onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(v => !v); }}>+ Add new</button>}</div>
      {showForm && active !== "contactMessages" && <form className="admin-editor" onSubmit={saveItem}>
        <h2>{editingId ? "Edit record" : "Create new record"}</h2>
        <label>Title<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></label>
        <label>Description<textarea rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        <div className="admin-form-row"><label>Slug<input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="my-first-post" /></label><label>Category<input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Web development" /></label></div>
        <label className="admin-check"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> Published (visible to public read rules)</label>
        <div className="admin-actions"><button className="admin-primary" type="submit">Save changes</button><button type="button" className="admin-cancel" onClick={() => setShowForm(false)}>Cancel</button></div>
      </form>}
      {loading ? <div className="admin-empty">Loading records…</div> : items.length === 0 ? <div className="admin-empty"><span>✦</span><h2>No {activeLabel.toLowerCase()} yet</h2><p>{active === "contactMessages" ? "New messages stored in Supabase will appear here." : "Create your first record using the Add new button."}</p></div> :
        <div className="admin-records">{items.map(item => <article className="admin-record" key={item.id}><div><div className="admin-record-meta">{item.category || activeLabel} · {item.published === false ? "Draft" : (item.status || "Published")}</div><h3>{item.title || item.name || item.subject || "Message"}</h3><p>{item.description || item.message || item.email || "—"}</p></div>{active !== "contactMessages" && <div className="admin-record-actions"><button onClick={() => editItem(item)}>Edit</button><button onClick={() => removeItem(item.id)}>Delete</button></div>}</article>)}</div>}
    </section>
  </main>;
}

function SetupScreen() {
  return <main className="admin-page"><div className="admin-login admin-setup">
    <a className="admin-brand" href="/">R <span>RDDS ENTERPRISES</span></a>
    <div className="admin-kicker">SUPABASE CONNECTION REQUIRED</div><h1>One quick setup.</h1>
    <p>Supabase project connection is missing. Add the two public Supabase settings from your project to the Vercel environment variables listed in <code>.env.example</code>.</p>
    <ol><li>Open Supabase Dashboard → Authentication → Users and create the administrator with Email/Password.</li><li>Copy that user's UUID from the Users list.</li><li>Run the admin allowlist SQL shown in <code>supabase/ADMIN_SETUP.md</code>.</li><li>Redeploy the website after adding the Vercel environment variables.</li></ol>
    <a className="admin-back" href="/">← Back to public website</a>
  </div></main>;
}
