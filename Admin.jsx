import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { auth, db, firebaseConfigured } from "./firebase.js";
import "./admin.css";

const sections = [
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "blogPosts", label: "Blog posts" },
  { id: "contactMessages", label: "Messages" }
];

const emptyForm = { title: "", description: "", slug: "", category: "", published: true };

export default function Admin() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
    if (!firebaseConfigured || !auth) {
      setAuthChecked(true);
      return;
    }
    return onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser);
      setIsAdmin(false);
      setAuthChecked(true);
      if (!currentUser) return;
      try {
        const membership = await getDoc(doc(db, "adminUsers", currentUser.uid));
        setIsAdmin(membership.exists());
      } catch {
        setError("Admin permission verify nahi ho saki. Firestore Security Rules check karein.");
      }
    });
  }, []);

  useEffect(() => {
    if (!user || !isAdmin || !db) return;
    let cancelled = false;
    setLoading(true);
    getDocs(collection(db, active))
      .then(snapshot => {
        if (!cancelled) setItems(snapshot.docs.map(item => ({ id: item.id, ...item.data() })));
      })
      .catch(() => {
        if (!cancelled) setError("Data load nahi hua. Firestore Rules aur database check karein.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [active, user, isAdmin]);

  const login = async event => {
    event.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
    } catch {
      setError("Login nahi hua. Email aur password dobara check karein.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    setItems([]);
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
      updatedAt: serverTimestamp()
    };
    if (!payload.title) return setError("Title zaroor likhein.");
    try {
      if (editingId) await updateDoc(doc(db, active, editingId), payload);
      else await addDoc(collection(db, active), { ...payload, createdAt: serverTimestamp() });
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      const snapshot = await getDocs(collection(db, active));
      setItems(snapshot.docs.map(item => ({ id: item.id, ...item.data() })));
    } catch {
      setError("Save nahi hua. Firestore permissions check karein.");
    }
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
    try {
      await deleteDoc(doc(db, active, id));
      setItems(current => current.filter(item => item.id !== id));
    } catch {
      setError("Delete nahi hua. Firestore permissions check karein.");
    }
  };

  if (!firebaseConfigured) return <SetupScreen />;
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

  if (!isAdmin) return <main className="admin-page"><div className="admin-login">
    <div className="admin-kicker">ACCESS RESTRICTED</div><h1>Not authorised.</h1>
    <p>This Firebase account is not on the RDDS administrator allowlist.</p>
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
      {loading ? <div className="admin-empty">Loading records…</div> : items.length === 0 ? <div className="admin-empty"><span>✦</span><h2>No {activeLabel.toLowerCase()} yet</h2><p>{active === "contactMessages" ? "New messages stored in Firestore will appear here." : "Create your first record using the Add new button."}</p></div> :
        <div className="admin-records">{items.map(item => <article className="admin-record" key={item.id}><div><div className="admin-record-meta">{item.category || activeLabel} · {item.published === false ? "Draft" : "Published"}</div><h3>{item.title || item.name || item.subject || "Message"}</h3><p>{item.description || item.message || item.email || "—"}</p></div>{active !== "contactMessages" && <div className="admin-record-actions"><button onClick={() => editItem(item)}>Edit</button><button onClick={() => removeItem(item.id)}>Delete</button></div>}</article>)}</div>}
    </section>
  </main>;
}

function SetupScreen() {
  return <main className="admin-page"><div className="admin-login admin-setup">
    <a className="admin-brand" href="/">R <span>RDDS ENTERPRISES</span></a>
    <div className="admin-kicker">FIREBASE CONNECTION REQUIRED</div><h1>One quick setup.</h1>
    <p>The RDDS admin panel code is ready, but Firebase is not connected yet. Add your Firebase web app settings to the Vercel environment variables to activate secure login.</p>
    <ol><li>Create the Firebase project and Firestore database.</li><li>Enable Authentication → Email/Password.</li><li>Copy the Firebase web app config into the Vercel variables listed in <code>.env.example</code>.</li><li>Publish <code>firestore.rules</code> and add the authorised admin UID to <code>adminUsers</code>.</li></ol>
    <a className="admin-back" href="/">← Back to public website</a>
  </div></main>;
}
