import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfigured } from "./supabase.js";
import "./LiveChat.css";

// A separate auth storage prevents the public chat from reusing the RDDS admin session.
const chatClient = supabaseConfigured ? createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  { auth: { storageKey: "rdds_digital_customer_chat_auth", autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } }
) : null;

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Open a chat to connect with RDDS support.");
  const [loading, setLoading] = useState(false);
  const initPromise = useRef(null);
  const endRef = useRef(null);

  const ensureGuestSession = async () => {
    if (!chatClient) throw new Error("Live chat is not configured yet.");
    if (session) return session;
    if (initPromise.current) return initPromise.current;
    initPromise.current = (async () => {
      const { data: storedData, error: storedError } = await chatClient.auth.getSession();
      if (storedError) throw storedError;
      let active = storedData.session;
      if (!active || !active.user?.is_anonymous) {
        await chatClient.auth.signOut();
        const { data, error } = await chatClient.auth.signInAnonymously();
        if (error) throw error;
        active = data.session;
      }
      if (!active) throw new Error("Could not create a secure guest chat session.");
      setSession(active);
      return active;
    })();
    try { return await initPromise.current; }
    finally { initPromise.current = null; }
  };

  const loadConversation = async active => {
    const { data, error } = await chatClient.from("chat_conversations").select("*")
      .eq("customer_id", active.user.id).eq("status", "open")
      .order("last_message_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    setConversation(data || null);
    setStatus(data ? "We usually reply as soon as possible." : "Send us a message to start a conversation.");
  };

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const active = await ensureGuestSession();
        await loadConversation(active);
      } catch (error) {
        if (alive) setStatus("Chat connection failed: " + error.message + (String(error.message).toLowerCase().includes("anonymous") ? " Enable Anonymous Sign-Ins in RDDS Digital's Supabase Auth settings." : ""));
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [open]);

  useEffect(() => {
    if (!conversation || !session || !chatClient) return;
    let alive = true;
    const load = async () => {
      const { data, error } = await chatClient.from("chat_messages").select("*")
        .eq("conversation_id", conversation.id).order("created_at", { ascending: true });
      if (alive && !error) setMessages(data || []);
      if (alive && error) setStatus("Could not load messages: " + error.message);
    };
    load();
    const channel = chatClient.channel("rdds-digital-customer-" + conversation.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: "conversation_id=eq." + conversation.id }, payload => {
        setMessages(old => old.some(item => item.id === payload.new.id) ? old : [...old, payload.new]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "chat_conversations", filter: "id=eq." + conversation.id }, payload => {
        if (payload.new.status === "closed") {
          setConversation(null);
          setMessages([]);
          setStatus("This conversation was closed. Send a new message to start another chat.");
        }
      }).subscribe();
    return () => { alive = false; chatClient.removeChannel(channel); };
  }, [conversation?.id, session?.user?.id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const send = async event => {
    event?.preventDefault();
    const message = draft.trim();
    if (!message || !chatClient || busy) return;
    setBusy(true);
    try {
      const active = await ensureGuestSession();
      let current = conversation;
      if (!current) {
        const { data, error } = await chatClient.from("chat_conversations").insert({
          customer_id: active.user.id,
          customer_name: "Website visitor",
          last_message: message,
          last_message_at: new Date().toISOString()
        }).select("*").single();
        if (error) throw error;
        current = data;
        setConversation(data);
      } else {
        const { data: stillOpen, error } = await chatClient.from("chat_conversations")
          .update({ last_message: message, last_message_at: new Date().toISOString() })
          .eq("id", current.id).eq("status", "open").select("id").maybeSingle();
        if (error) throw error;
        if (!stillOpen) {
          const { data, error: createError } = await chatClient.from("chat_conversations").insert({
            customer_id: active.user.id,
            customer_name: "Website visitor",
            last_message: message,
            last_message_at: new Date().toISOString()
          }).select("*").single();
          if (createError) throw createError;
          current = data;
          setConversation(data);
        }
      }
      const { error } = await chatClient.from("chat_messages").insert({
        conversation_id: current.id, sender_id: active.user.id, sender_role: "customer", message
      });
      if (error) throw error;
      setDraft("");
      setStatus("Message sent. Our team will reply here live.");
    } catch (error) {
      setStatus("Message could not be sent: " + error.message);
    } finally { setBusy(false); }
  };

  return <div className="rdds-live-chat-root">
    {open && <section className="rdds-live-chat-panel" aria-label="RDDS customer support chat">
      <header className="rdds-live-chat-head">
        <span className="rdds-live-chat-avatar"><span aria-hidden="true">◉</span></span>
        <div><b>RDDS Customer Care</b><small><i /> Live support</small></div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><span aria-hidden="true">×</span></button>
      </header>
      <div className="rdds-live-chat-status">{loading ? "Connecting securely…" : status}</div>
      <div className="rdds-live-chat-messages">
        {messages.length === 0 && <div className="rdds-live-chat-welcome"><span aria-hidden="true">◉</span><b>How can we help?</b><span>Ask about websites, services, pricing or your project.</span></div>}
        {messages.map(item => <div key={item.id} className={"rdds-live-chat-bubble " + (item.sender_role === "customer" ? "mine" : "theirs")}><span>{item.message}</span><small>{new Date(item.created_at).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}</small></div>)}
        <div ref={endRef} />
      </div>
      <form className="rdds-live-chat-compose" onSubmit={send}>
        <input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Type your message…" maxLength={2000} aria-label="Your message" />
        <button type="submit" disabled={!draft.trim() || busy || loading} aria-label="Send message">{busy ? <span className="rdds-chat-spin" aria-hidden="true">◌</span> : <span aria-hidden="true">➤</span>}</button>
      </form>
      <div className="rdds-live-chat-foot">Private conversation · RDDS Enterprises</div>
    </section>}
    <button type="button" className={"rdds-live-chat-launch " + (open ? "is-open" : "")} onClick={() => setOpen(value => !value)} aria-label={open ? "Close support chat" : "Chat with us"}>
      {open ? <span aria-hidden="true">×</span> : <><span aria-hidden="true">◉</span><span>Chat with us</span></>}
    </button>
  </div>;
}
