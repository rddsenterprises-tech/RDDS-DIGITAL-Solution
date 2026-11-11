import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, supabaseConfigured } from "./supabase.js";
import "./recruiter.css";

export default function RecruiterPortal() {
  const [mode, setMode] = useState("signup");
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!supabaseConfigured) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !supabaseConfigured) { setProfile(null); return; }
    supabase.from("recruiter_profiles").select("full_name,company_name,phone,purpose,interest_status,created_at")
      .eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data || null));
  }, [user]);

  const submit = async event => {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    const values = new FormData(event.currentTarget);
    const email = String(values.get("email") || "").trim().toLowerCase();
    const password = String(values.get("password") || "");
    try {
      if (mode === "signup") {
        const fullName = String(values.get("full_name") || "").trim();
        const company = String(values.get("company_name") || "").trim();
        const phone = String(values.get("phone") || "").trim();
        const purpose = String(values.get("purpose") || "").trim();
        const { data, error: signUpError } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName, company_name: company, phone, purpose } }
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          setUser(data.user);
          setNotice("Your recruiter account has been created successfully.");
        } else {
          setNotice("Registration received. Please verify your email using the confirmation link we sent. Your details will appear in the RDDS admin panel.");
          setMode("signin");
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        setNotice("You are signed in successfully.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setError(""); setNotice("");
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
    else { setUser(null); setProfile(null); setMode("signin"); }
  };

  if (checking) return <main className="recruiter-page"><div className="recruiter-card">Loading recruiter portal…</div></main>;
  if (!supabaseConfigured) return <main className="recruiter-page"><div className="recruiter-card"><span className="recruiter-kicker">RDDS ENTERPRISES</span><h1>Portal setup required</h1><p>Recruiter registration is temporarily unavailable. Please contact us directly.</p><Link to="/" className="recruiter-back">← Back to website</Link></div></main>;

  return <main className="recruiter-page">
    <section className="recruiter-card">
      <Link to="/" className="recruiter-brand"><span>R</span> RDDS <b>ENTERPRISES</b></Link>
      <span className="recruiter-kicker">RECRUITER ACCESS · RDDS ENTERPRISES</span>
      {user ? <>
        <div className="recruiter-success-mark">✓</div>
        <h1>Welcome{profile?.full_name ? ", " + profile.full_name.split(" ")[0] : " back"}.</h1>
        <p>Your recruiter account is active. Thank you for your interest in RDDS Enterprises.</p>
        <div className="recruiter-profile">
          <div><small>ACCOUNT EMAIL</small><strong>{user.email}</strong></div>
          <div><small>APPLICATION STATUS</small><strong className="pending-status">{profile?.interest_status || "Pending review"}</strong></div>
        </div>
        <button className="recruiter-submit" type="button" onClick={signOut}>Sign out</button>
      </> : <>
        <h1>{mode === "signup" ? "Create your account." : "Welcome back."}</h1>
        <p>{mode === "signup" ? "Register your details so our team can follow up with you." : "Sign in to access your recruiter profile."}</p>
        <div className="recruiter-tabs">
          <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(""); setNotice(""); }}>Sign up</button>
          <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => { setMode("signin"); setError(""); setNotice(""); }}>Sign in</button>
        </div>
        <form onSubmit={submit} className="recruiter-form">
          {mode === "signup" && <>
            <label>Full name<input name="full_name" autoComplete="name" placeholder="Your full name" required /></label>
            <label>Company / organisation<input name="company_name" autoComplete="organization" placeholder="Company name" required /></label>
            <label>Contact number<input name="phone" type="tel" autoComplete="tel" placeholder="+92..." required /></label>
            <label>Reason for visiting<select name="purpose" defaultValue="" required><option value="" disabled>Select your interest</option><option>Recruitment / Hiring</option><option>Professional networking</option><option>Business collaboration</option><option>Website / digital services</option><option>Other</option></select></label>
          </>}
          <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></label>
          <label>Password<input name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength="8" placeholder="At least 8 characters" required /></label>
          {error && <div className="recruiter-alert error" role="alert">{error}</div>}
          {notice && <div className="recruiter-alert success" role="status">{notice}</div>}
          <button className="recruiter-submit" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create recruiter account ↗" : "Sign in securely ↗"}</button>
        </form>
      </>}
      <Link to="/" className="recruiter-back">← Back to RDDS website</Link>
      <small className="recruiter-privacy">Your details are used only for recruiter follow-up and RDDS communication.</small>
    </section>
  </main>;
}
