import React, { useEffect, useRef, useState } from "react";
import "./ronie-chat.css";

const welcome = {
  role: "assistant",
  text: "Assalam-o-Alaikum! 👋 I'm RONIE, RDDS Enterprises' virtual support assistant. I can help you with our services, projects, website process and contact details. How can I help you today?"
};

const quickQuestions = [
  "What services do you offer?",
  "How can I get a website made?",
  "How do I contact RDDS?"
];

export default function RonnieChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy, open]);

  const sendMessage = async (value = input, retry = false) => {
    const message = value.trim();
    if (!message || busy) return;
    const next = retry ? messages : [...messages, { role: "user", text: message }];
    if (!retry) setMessages(next);
    setInput("");
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(1).slice(-12).map(item => ({ role: item.role, text: item.text }))
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "RONIE is temporarily unavailable. Please try again.");
      setMessages(current => [...current, { role: "assistant", text: data.reply }]);
    } catch (err) {
      setError(err.message || "Connection issue. Please try again or contact us on WhatsApp.");
    } finally {
      setBusy(false);
    }
  };

  return <div className="ronie-widget">
    {open && <section className="ronie-window" aria-label="RONIE chat support">
      <header className="ronie-header">
        <div className="ronie-avatar">R</div>
        <div className="ronie-heading"><strong>RONIE <span>AI</span></strong><small>RDDS virtual support · Online assistant</small></div>
        <button className="ronie-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
      </header>
      <div className="ronie-messages" aria-live="polite">
        <div className="ronie-date">RDDS ENTERPRISES SUPPORT</div>
        {messages.map((item, index) => <div className={"ronie-message " + item.role} key={index}>
          {item.role === "assistant" && <span className="ronie-mini-avatar">R</span>}
          <p>{item.text}</p>
        </div>)}
        {busy && <div className="ronie-message assistant"><span className="ronie-mini-avatar">R</span><p className="ronie-typing"><i/><i/><i/></p></div>}
        {error && <div className="ronie-error">{error} <button onClick={() => sendMessage(messages[messages.length - 1]?.text || "", true)}>Retry</button></div>}
        {messages.length === 1 && <div className="ronie-quick">{quickQuestions.map(question => <button key={question} onClick={() => sendMessage(question)}>{question} ↗</button>)}</div>}
        <div ref={endRef}/>
      </div>
      <form className="ronie-compose" onSubmit={event => { event.preventDefault(); sendMessage(); }}>
        <input value={input} onChange={event => setInput(event.target.value)} placeholder="Type your message…" aria-label="Your message" disabled={busy}/>
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send message">➤</button>
      </form>
      <div className="ronie-foot">Powered by AI · For direct help, <a href="https://wa.me/923042178799" target="_blank" rel="noreferrer">WhatsApp us</a></div>
    </section>}
    <button className={"ronie-launcher " + (open ? "is-open" : "")} onClick={() => setOpen(value => !value)} aria-label={open ? "Close RONIE chat" : "Chat with RONIE"}>
      {open ? "×" : <><span className="ronie-launch-icon">✦</span><span className="ronie-launch-label">Chat with RONIE</span></>}
    </button>
  </div>;
}
