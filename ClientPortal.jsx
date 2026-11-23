import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase, supabaseConfigured } from "./supabase.js";
import "./client-portal.css";

const clientPortalEnabled = import.meta.env.VITE_CLIENT_PORTAL_ENABLED === "true";

const blank = { full_name: "", email: "", phone: "", business_name: "", business_category: "", password: "" };

export default function ClientPortal() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState(new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "login");
  const [form, setForm] = useState(blank);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [demo, setDemo] = useState(null);
  const [demoForm, setDemoForm] = useState({ business_name: "", business_category: "", project_details: "" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadClientData = async currentUser => {
    if (!currentUser) { setProfile(null); setDemo(null); return; }
    const [{ data: clientProfile, error: profileError }, { data: request, error: requestError }] = await Promise.all([
      supabase.from("rdds_client_profiles").select("*").eq("id", currentUser.id).maybeSingle(),
      supabase.from("rdds_demo_requests").select("*").eq("client_id", currentUser.id).maybeSingle()
    ]);
    if (profileError || requestError) {
      setError("Account data load nahi ho saka. Please support se rabta karein.");
      return;
    }
    setProfile(clientProfile);
    setDemo(request);
    if (clientProfile) setDemoForm({ business_name: clientProfile.business_name || "", business_category: clientProfile.business_category || "", project_details: "" });
  };

  useEffect(() => {
    if (user) loadClientData(user);
    else { setProfile(null); setDemo(null); }
  }, [user]);

  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));

  const submitAuth = async event => {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      if (!supabaseConfigured) throw new Error("Client portal abhi database se connect nahi hai.");
      if (mode === "signup") {
        const normalizedPhone = form.phone.replace(/[^+0-9]/g, "");
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email.trim().toLowerCase(),
          password: form.password,
          options: { data: {
            full_name: form.full_name.trim(),
            phone: normalizedPhone,
            business_name: form.business_name.trim(),
            business_category: form.business_category.trim()
          } }
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          setUser(data.user);
          setNotice("Account create ho gaya. Ab apna Free Demo request submit karein.");
        } else {
          setNotice("Registration successful. Email inbox mein verification link check karein, phir login karein.");
          setMode("login");
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: form.email.trim().toLowerCase(), password: form.password });
        if (signInError) throw signInError;
        setUser(data.user);
        setNotice("Welcome back. Aapka client dashboard load ho raha hai.");
      }
    } catch (err) {
      const message = String(err?.message || "");
      if (/duplicate key|unique constraint|already exists/i.test(message)) setError("Is email ya phone number se account pehle se registered hai. Login karein.");
      else setError(message || "Request complete nahi hui. Dobara try karein.");
    } finally { setBusy(false); }
  };

  const requestDemo = async event => {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    const payload = {
      client_id: user.id,
      client_name: profile?.full_name || user.user_metadata?.full_name || "",
      client_email: user.email || "",
      client_phone: profile?.phone || user.user_metadata?.phone || "",
      business_name: demoForm.business_name.trim(),
      business_category: demoForm.business_category.trim(),
      project_details: demoForm.project_details.trim()
    };
    const { error: insertError } = await supabase.from("rdds_demo_requests").insert(payload);
    if (insertError) {
      if (insertError.code === "23505") setError("Aap ek Free Demo pehle hi request kar chuke hain. Ek client ko sirf ek demo milta hai.");
      else setError("Demo request submit nahi hui. Please details check karke dobara try karein.");
      await loadClientData(user);
    } else {
      setNotice("Aapki Free Demo request RDDS team ko mil gayi hai. Admin approval ke baad status yahan update hoga.");
      await loadClientData(user);
    }
    setBusy(false);
  };

  const logout = async () => { await supabase.auth.signOut(); setNotice("Aap sign out ho gaye hain."); navigate("/client"); };
  const statusLabel = value => ({
    pending: "Pending admin approval",
    approved: "Approved",
    in_progress: "Demo in progress",
    demo_sent: "Demo ready",
    converted: "Converted to paid project",
    not_interested: "Closed",
    archived: "Archived"
  }[value] || "Pending");

  return <main className="client-portal-page">
    <div className="client-portal-shell">
      <Link className="client-portal-brand" to="/"><span>R</span> RDDS <b>ENTERPRISES</b></Link>
      <div className="client-portal-kicker">RDDS CLIENT SPACE</div>
      {!clientPortalEnabled || !supabaseConfigured ? <section className="client-panel"><h1>Client portal is being prepared.</h1><p>RDDS is setting up its dedicated secure client database. Account registration will open once the Free Demo system is ready.</p><Link className="client-back" to="/pricing">Back to pricing</Link></section> :
      !user ? <section className="client-panel">
        <div className="client-panel-heading"><span>ONE BUSINESS. ONE FREE DEMO.</span><h1>{mode === "signup" ? "Create your client account." : "Welcome back."}</h1><p>{mode === "signup" ? "Register once to request and track your RDDS website demo." : "Sign in to view your Free Demo request and its progress."}</p></div>
        <form onSubmit={submitAuth} className="client-form">
          {mode === "signup" && <>
            <label>Full name<input name="full_name" value={form.full_name} onChange={update} autoComplete="name" required /></label>
            <label>Phone / WhatsApp<input name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" placeholder="+92 300 1234567" required /></label>
            <label>Business name<input name="business_name" value={form.business_name} onChange={update} required /></label>
            <label>Business category<input name="business_category" value={form.business_category} onChange={update} placeholder="e.g. Restaurant, Clothing, Real Estate" required /></label>
          </>}
          <label>Email address<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={update} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength="8" required /></label>
          {error && <p className="client-alert error" role="alert">{error}</p>}
          {notice && <p className="client-alert" role="status">{notice}</p>}
          <button className="client-primary" disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create account & continue" : "Sign in to client portal"}</button>
        </form>
        <p className="client-switch">{mode === "signup" ? "Already registered?" : "New to RDDS?"} <button type="button" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); setNotice(""); }}>{mode === "signup" ? "Sign in" : "Create an account"}</button></p>
        <Link className="client-back" to="/pricing">← Back to pricing</Link>
      </section> : <section className="client-panel">
        <div className="client-dashboard-head"><div><span>YOUR ACCOUNT</span><h1>Hello, {profile?.full_name || user.user_metadata?.full_name || "Client"}.</h1><p>{user.email}</p></div><button className="client-logout" onClick={logout}>Sign out</button></div>
        {error && <p className="client-alert error">{error}</p>}
        {notice && <p className="client-alert">{notice}</p>}
        {demo ? <div className="client-demo-status">
          <span className="client-status-pill">{statusLabel(demo.status)}</span>
          <h2>{demo.business_name || "Your business"} — Free Demo</h2>
          <p>Your one-time Free Demo request was received on {new Date(demo.created_at).toLocaleDateString("en-PK")}.</p>
          {demo.demo_url && <a className="client-primary client-demo-link" href={demo.demo_url} target="_blank" rel="noreferrer">Open your website demo ↗</a>}
          {demo.admin_notes && <p className="client-admin-note">RDDS update: {demo.admin_notes}</p>}
          <small>Each client account can receive one Free Demo request only.</small>
        </div> : <form className="client-form client-demo-form" onSubmit={requestDemo}>
          <div className="client-panel-heading"><span>COMPLIMENTARY WEBSITE PREVIEW</span><h2>Request your Free Demo.</h2><p>Share a few details. Our team will review your request before creating the preview.</p></div>
          <label>Business name<input value={demoForm.business_name} onChange={e => setDemoForm({ ...demoForm, business_name: e.target.value })} required /></label>
          <label>Business category<input value={demoForm.business_category} onChange={e => setDemoForm({ ...demoForm, business_category: e.target.value })} required /></label>
          <label>What would you like your website to do?<textarea rows="4" value={demoForm.project_details} onChange={e => setDemoForm({ ...demoForm, project_details: e.target.value })} placeholder="Tell us about your products, services, style or goals." required /></label>
          <p className="client-once-note">One free homepage preview per verified client. Domain, hosting and full website development are not included.</p>
          <button className="client-primary" disabled={busy}>{busy ? "Submitting…" : "Submit Free Demo request"}</button>
        </form>}
      </section>}
      <p className="client-portal-footer">Personal collaboration. Thoughtful design. Built with care.</p>
    </div>
  </main>;
}
