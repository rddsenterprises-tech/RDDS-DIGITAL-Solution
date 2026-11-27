import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase.js";

const dateTime = value => new Date(value).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" });
const activeNow = value => Date.now() - new Date(value).getTime() <= 75000;

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const { data, error: queryError } = await supabase.from("visitor_sessions").select("*").order("last_seen_at", { ascending: false }).limit(250);
    if (queryError) setError(queryError.message);
    else { setError(""); setVisitors(data || []); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); const timer = window.setInterval(load, 10000); return () => window.clearInterval(timer); }, [load]);
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const today = visitors.filter(v => new Date(v.first_seen_at || v.created_at) >= todayStart);
  const active = visitors.filter(v => activeNow(v.last_seen_at));
  const pages = visitors.reduce((acc, v) => { const page = (v.page_url || "/").split("?")[0]; acc[page] = (acc[page] || 0) + 1; return acc; }, {});
  const topPages = Object.entries(pages).sort((a,b) => b[1]-a[1]).slice(0,5);
  return <div className="admin-visitors">
    <div className="admin-visitors-heading"><div><span>REAL-TIME WEBSITE ANALYTICS</span><h2>Live Visitors</h2><p>Visitor activity for RDDS Digital Solution only.</p></div><button className="admin-refresh" onClick={load}>↻ Refresh</button></div>
    {error && <div className="admin-error">{error}</div>}
    <div className="admin-visitor-stats">
      <article><small>Active now</small><strong>{active.length}</strong><span>Seen in the last 75 seconds</span></article>
      <article><small>Today's visitors</small><strong>{today.length}</strong><span>Unique browser sessions</span></article>
      <article><small>Tracked sessions</small><strong>{visitors.length}</strong><span>Most recent 250 sessions</span></article>
    </div>
    <div className="admin-visitor-grid">
      <section className="admin-visitor-panel"><h3>Current visitor activity</h3>{loading ? <p>Loading visitor activity…</p> : active.length ? <div className="admin-visitor-list">{active.map(v=><article key={v.id}><div><b>{v.page_url || "/"}</b><small>{v.device_type || "Unknown device"} · {v.browser_name || "Unknown browser"}</small></div><span>{dateTime(v.last_seen_at)}</span></article>)}</div> : <p>No active visitors right now. Open the public website in another tab to test tracking.</p>}</section>
      <section className="admin-visitor-panel"><h3>Recently viewed pages</h3>{topPages.length ? topPages.map(([page,count])=><div className="admin-page-row" key={page}><span>{page}</span><b>{count}</b></div>) : <p>Page activity will appear here.</p>}</section>
    </div>
    <section className="admin-visitor-panel admin-visitor-history"><h3>Recent visitor sessions</h3>{visitors.length ? <div className="admin-visitor-table-wrap"><table><thead><tr><th>Status</th><th>Page</th><th>Device</th><th>Browser</th><th>First seen</th><th>Last activity</th></tr></thead><tbody>{visitors.map(v=><tr key={v.id}><td><span className={activeNow(v.last_seen_at) ? "visitor-live" : "visitor-away"}>{activeNow(v.last_seen_at) ? "Live" : "Away"}</span></td><td>{v.page_url || "/"}</td><td>{v.device_type || "—"}</td><td>{v.browser_name || "—"}</td><td>{dateTime(v.first_seen_at || v.created_at)}</td><td>{dateTime(v.last_seen_at)}</td></tr>)}</tbody></table></div> : <p>No visitor sessions recorded yet.</p>}</section>
    <p className="admin-visitor-note">Location and personal identity are not collected. Visitor sessions use anonymous IDs and update while the page is open.</p>
  </div>;
}
