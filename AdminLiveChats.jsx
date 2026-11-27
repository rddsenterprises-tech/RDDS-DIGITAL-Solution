import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase.js";

const stamp = value => value ? new Date(value).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" }) : "—";

export default function AdminLiveChats({ user }) {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  const loadConversations = useCallback(async () => {
    setLoading(true); setError("");
    const { data, error: queryError } = await supabase.from("chat_conversations").select("*")
      .order("last_message_at", { ascending: false }).limit(200);
    if (queryError) setError(queryError.message);
    else setConversations(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadConversations();
    const channel = supabase.channel("rdds-digital-admin-inbox")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_conversations" }, loadConversations)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, loadConversations)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadConversations]);

  useEffect(() => {
    if (!selected) return;
    let alive = true;
    const load = async () => {
      const { data, error: queryError } = await supabase.from("chat_messages").select("*")
        .eq("conversation_id", selected.id).order("created_at", { ascending: true });
      if (!alive) return;
      if (queryError) setError(queryError.message);
      else setMessages(data || []);
    };
    load();
    const channel = supabase.channel("rdds-digital-admin-thread-" + selected.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: "conversation_id=eq." + selected.id }, payload => {
        setMessages(old => old.some(item => item.id === payload.new.id) ? old : [...old, payload.new]);
        loadConversations();
      }).subscribe();
    return () => { alive = false; supabase.removeChannel(channel); };
  }, [selected?.id, loadConversations]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const reply = async event => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || !selected || !user?.id || sending || selected.status === "closed") return;
    setSending(true); setError("");
    const { error: insertError } = await supabase.from("chat_messages").insert({
      conversation_id: selected.id, sender_id: user.id, sender_role: "admin", message
    });
    if (insertError) setError(insertError.message);
    else {
      await supabase.from("chat_conversations").update({ last_message: message, last_message_at: new Date().toISOString() }).eq("id", selected.id);
      setDraft("");
      await loadConversations();
    }
    setSending(false);
  };

  const closeChat = async () => {
    if (!selected) return;
    const { error: updateError } = await supabase.from("chat_conversations").update({ status: "closed" }).eq("id", selected.id);
    if (updateError) { setError(updateError.message); return; }
    setSelected(null); setMessages([]); await loadConversations();
  };

  return <div className="rdds-admin-live-chats">
    <div className="admin-toolbar"><p>Reply to website visitors in real time. New conversations appear automatically.</p><button className="admin-primary" onClick={loadConversations}>↻ Refresh chats</button></div>
    {error && <div className="admin-error admin-notice">{error}</div>}
    <div className="rdds-chat-admin-layout">
      <aside className="rdds-chat-inbox">
        <div className="rdds-chat-inbox-head"><div><b>Conversations</b><small>{conversations.length} total</small></div><span>◉</span></div>
        {loading && conversations.length === 0 ? <p className="rdds-chat-empty">Loading conversations…</p> :
          conversations.length === 0 ? <div className="rdds-chat-empty"><b>No customer messages yet</b><span>New chats from the RDDS website will appear here.</span></div> :
          conversations.map(item => <button key={item.id} className={"rdds-chat-conversation " + (selected?.id === item.id ? "active" : "")} onClick={() => { setSelected(item); setMessages([]); }}>
            <span className="rdds-chat-person">◉</span><span className="rdds-chat-conversation-copy"><b>{item.customer_name || "Website visitor"}</b><small>{item.last_message || "New conversation"}</small><em>{stamp(item.last_message_at)}</em></span><span className={"rdds-chat-state " + (item.status === "open" ? "open" : "closed")}>{item.status === "open" ? "●" : "✓"}</span>
          </button>)}
      </aside>
      <section className="rdds-chat-thread">
        {!selected ? <div className="rdds-chat-thread-empty"><b>Select a conversation</b><span>Choose a visitor from the inbox to view messages and reply.</span></div> : <>
          <header className="rdds-chat-thread-head"><div><b>{selected.customer_name || "Website visitor"}</b><small>Guest visitor · Started {stamp(selected.created_at)}</small></div><button className="admin-refresh" onClick={closeChat} disabled={selected.status === "closed"}>{selected.status === "closed" ? "Closed" : "Close chat"}</button></header>
          <div className="rdds-chat-thread-messages">{messages.map(item => <article key={item.id} className={"rdds-chat-admin-message " + (item.sender_role === "admin" ? "from-admin" : "from-customer")}><span>{item.message}</span><small>{item.sender_role === "admin" ? "You" : "Customer"} · {stamp(item.created_at)}</small></article>)}<div ref={endRef} /></div>
          <form className="rdds-chat-admin-compose" onSubmit={reply}><input value={draft} onChange={event => setDraft(event.target.value)} placeholder={selected.status === "closed" ? "This conversation is closed" : "Write a reply…"} maxLength={2000} disabled={selected.status === "closed"} /><button className="admin-primary" disabled={!draft.trim() || sending || selected.status === "closed"}>{sending ? "Sending…" : "↗ Reply"}</button></form>
        </>}
      </section>
    </div>
  </div>;
}
