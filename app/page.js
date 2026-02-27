"use client";
import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = (topic, userSide) => `You are ARCHON — a razor-sharp AI debate coach and opponent. The user is arguing: "${userSide}" on the topic: "${topic}".

Your job:
1. Argue the OPPOSING side with intelligence and force. Steel-man your position. Don't be easy on them.
2. Challenge their logic, expose weak reasoning, ask pointed follow-up questions.
3. Keep responses concise — 2-3 sentences max per turn. This is a SPOKEN debate so keep it punchy.
4. Use rhetorical techniques: analogies, counter-examples, burden-of-proof challenges.
5. Track logical fallacies they commit.

After exactly 5 user messages, end your response with this EXACT block:

---SCORECARD---
CLARITY: [1-10]
LOGIC: [1-10]
EVIDENCE: [1-10]
PERSUASION: [1-10]
FALLACIES: [comma-separated list or "None detected"]
VERDICT: [2-3 sentence honest assessment]
---END---

Until the 5th message, just debate hard. Keep all responses under 60 words for natural speech.`;

const TOPICS = [
  "Social media does more harm than good",
  "AI will eliminate more jobs than it creates",
  "College education is no longer worth the cost",
  "Remote work is better than office work",
  "Cryptocurrency is a legitimate investment",
  "Video games cause violence",
  "Universal Basic Income should be implemented",
];

const ARCHON_VOICE = { pitch: 0.85, rate: 0.95, volume: 1 };

function speak(text, onEnd) {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = ARCHON_VOICE.pitch;
  utter.rate = ARCHON_VOICE.rate;
  utter.volume = ARCHON_VOICE.volume;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes("Daniel") || v.name.includes("Google UK English Male") || v.name.includes("Male"));
  if (preferred) utter.voice = preferred;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

function parseScorecard(text) {
  const match = text.match(/---SCORECARD---([\s\S]*?)---END---/);
  if (!match) return null;
  const block = match[1];
  const get = (key) => {
    const m = block.match(new RegExp(`${key}:\\s*(.+)`));
    return m ? m[1].trim() : null;
  };
  return {
    clarity: parseInt(get("CLARITY")),
    logic: parseInt(get("LOGIC")),
    evidence: parseInt(get("EVIDENCE")),
    persuasion: parseInt(get("PERSUASION")),
    fallacies: get("FALLACIES"),
    verdict: get("VERDICT"),
    raw: text.replace(/---SCORECARD---[\s\S]*?---END---/, "").trim(),
  };
}

function ScoreBar({ label, score }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#a0a0a0", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color: score >= 7 ? "#4ade80" : score >= 5 ? "#fbbf24" : "#f87171" }}>{score}/10</span>
      </div>
      <div style={{ height: "4px", background: "#1e1e1e", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score * 10}%`, background: score >= 7 ? "#4ade80" : score >= 5 ? "#fbbf24" : "#f87171", borderRadius: "2px", transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

export default function DebateCoach() {
  const [phase, setPhase] = useState("setup");
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [userSide, setUserSide] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [scorecard, setScorecard] = useState(null);
  const [userTurns, setUserTurns] = useState(0);
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {};
    window.speechSynthesis.getVoices();
  }, []);

  const activeTopic = topic === "custom" ? customTopic : topic;

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser doesnt support voice. Try Chrome.");
    window.speechSynthesis.cancel();
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setTranscript(t);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setTranscript("");
  }

  function stopListeningAndSend() {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
    setTimeout(() => {
      if (transcript.trim()) sendMessage(transcript.trim());
    }, 300);
  }

  async function startDebate() {
    if (!activeTopic || !userSide) return;
    setPhase("debate");
    setLoading(true);
    const opening = [{ role: "user", content: `Let's begin. My position is: ${userSide}` }];
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt: SYSTEM_PROMPT(activeTopic, userSide), messages: opening }),
    });
    const data = await res.json();
    const reply = data.content || "Let's debate.";
    setMessages([
      { role: "user", content: `My position: ${userSide}` },
      { role: "assistant", content: reply },
    ]);
    setUserTurns(1);
    setLoading(false);
    setSpeaking(true);
    speak(reply, () => setSpeaking(false));
  }

  async function sendMessage(text) {
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setTranscript("");
    setUserTurns(t => t + 1);
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt: SYSTEM_PROMPT(activeTopic, userSide),
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await res.json();
    const reply = data.content || "...";
    const parsed = parseScorecard(reply);
    if (parsed) {
      setScorecard(parsed);
      setMessages([...newMessages, { role: "assistant", content: parsed.raw || "Debate complete." }]);
      setPhase("done");
      setSpeaking(true);
      speak(parsed.verdict, () => setSpeaking(false));
    } else {
      setMessages([...newMessages, { role: "assistant", content: reply }]);
      setSpeaking(true);
      speak(reply, () => setSpeaking(false));
    }
    setLoading(false);
  }

  const totalScore = scorecard
    ? Math.round((scorecard.clarity + scorecard.logic + scorecard.evidence + scorecard.persuasion) / 4)
    : null;

  if (phase === "setup") {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", color: "#f0f0f0", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: "560px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#555", textTransform: "uppercase", marginBottom: "16px" }}>AI Debate Coach</div>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "900", margin: "0 0 12px", lineHeight: 1, background: "linear-gradient(135deg, #fff 0%, #888 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ARCHON</h1>
            <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>Speak your argument. Get challenged. Improve.</p>
          </div>
          <div style={{ marginBottom: "28px" }}>
            <label style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#666", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>Choose a topic</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {TOPICS.map((t) => (
                <button key={t} onClick={() => setTopic(t)} style={{ background: topic === t ? "#1a1a1a" : "transparent", border: `1px solid ${topic === t ? "#444" : "#222"}`, borderLeft: topic === t ? "3px solid #fff" : "3px solid transparent", color: topic === t ? "#fff" : "#555", padding: "12px 16px", textAlign: "left", cursor: "pointer", fontSize: "13px", fontFamily: "Georgia, serif", borderRadius: "2px" }}>{t}</button>
              ))}
              <button onClick={() => setTopic("custom")} style={{ background: topic === "custom" ? "#1a1a1a" : "transparent", border: `1px solid ${topic === "custom" ? "#444" : "#222"}`, borderLeft: topic === "custom" ? "3px solid #fff" : "3px solid transparent", color: topic === "custom" ? "#fff" : "#555", padding: "12px 16px", textAlign: "left", cursor: "pointer", fontSize: "13px", fontFamily: "Georgia, serif", borderRadius: "2px" }}>✏ Custom topic...</button>
            </div>
            {topic === "custom" && (
              <input placeholder="Enter your debate topic" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} style={{ marginTop: "8px", width: "100%", background: "#111", border: "1px solid #333", color: "#fff", padding: "12px 16px", fontSize: "13px", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box", borderRadius: "2px" }} />
            )}
          </div>
          {activeTopic && (
            <div style={{ marginBottom: "32px" }}>
              <label style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#666", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>Your position</label>
              <textarea placeholder={`State your stance on "${activeTopic}"`} value={userSide} onChange={(e) => setUserSide(e.target.value)} rows={3} style={{ width: "100%", background: "#111", border: "1px solid #333", color: "#fff", padding: "12px 16px", fontSize: "14px", fontFamily: "Georgia, serif", outline: "none", resize: "vertical", boxSizing: "border-box", borderRadius: "2px", lineHeight: 1.6 }} />
            </div>
          )}
          <button onClick={startDebate} disabled={!activeTopic || !userSide.trim()} style={{ width: "100%", padding: "16px", background: activeTopic && userSide.trim() ? "#fff" : "#1a1a1a", color: activeTopic && userSide.trim() ? "#000" : "#333", border: "none", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: activeTopic && userSide.trim() ? "pointer" : "not-allowed", borderRadius: "2px", fontWeight: "700" }}>
            Enter the Arena →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#f0f0f0", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase" }}>ARCHON</div>
          <div style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>{activeTopic}</div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {[1,2,3,4,5].map((i) => (
            <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i <= userTurns ? "#fff" : "#222" }} />
          ))}
          <span style={{ fontSize: "11px", color: "#444", marginLeft: "8px" }}>{Math.max(0, 5 - userTurns)} left</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: m.role === "user" ? "#fff" : "#1a1a1a", border: m.role === "assistant" ? "1px solid #333" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: m.role === "user" ? "#000" : "#666", flexShrink: 0 }}>
              {m.role === "user" ? "YOU" : "AI"}
            </div>
            <div style={{ maxWidth: "75%", padding: "14px 18px", background: m.role === "user" ? "#141414" : "#0e0e0e", border: `1px solid ${m.role === "user" ? "#2a2a2a" : "#1a1a1a"}`, borderRadius: "2px", fontSize: "14px", lineHeight: "1.7", color: m.role === "user" ? "#ccc" : "#e8e8e8" }}>
              {m.content}
            </div>
          </div>
        ))}

        {(loading || speaking) && (
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1a1a1a", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#666" }}>AI</div>
            <div style={{ padding: "14px 18px", background: "#0e0e0e", border: "1px solid #1a1a1a", borderRadius: "2px", display: "flex", gap: "6px", alignItems: "center" }}>
              {[0,1,2].map((i) => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: speaking ? "#fff" : "#444", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
              <span style={{ fontSize: "11px", color: "#555", marginLeft: "8px" }}>{speaking ? "speaking..." : "thinking..."}</span>
            </div>
          </div>
        )}

        {phase === "done" && scorecard && (
          <div style={{ border: "1px solid #2a2a2a", background: "#0a0a0a", padding: "28px", borderRadius: "2px", marginTop: "12px" }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#555", textTransform: "uppercase", marginBottom: "8px" }}>Final Score</div>
              <div style={{ fontSize: "72px", fontWeight: "900", lineHeight: 1, color: totalScore >= 7 ? "#4ade80" : totalScore >= 5 ? "#fbbf24" : "#f87171" }}>{totalScore}</div>
              <div style={{ fontSize: "12px", color: "#444", marginTop: "4px" }}>out of 10</div>
            </div>
            <ScoreBar label="Clarity" score={scorecard.clarity} />
            <ScoreBar label="Logic" score={scorecard.logic} />
            <ScoreBar label="Evidence" score={scorecard.evidence} />
            <ScoreBar label="Persuasion" score={scorecard.persuasion} />
            {scorecard.fallacies && scorecard.fallacies !== "None detected" && (
              <div style={{ marginTop: "20px", padding: "12px 16px", background: "#110000", border: "1px solid #330000", borderRadius: "2px" }}>
                <div style={{ fontSize: "11px", color: "#f87171", textTransform: "uppercase", marginBottom: "6px" }}>Logical Fallacies</div>
                <div style={{ fontSize: "13px", color: "#ff9999" }}>{scorecard.fallacies}</div>
              </div>
            )}
            <div style={{ marginTop: "12px", padding: "16px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "2px" }}>
              <div style={{ fontSize: "11px", color: "#666", textTransform: "uppercase", marginBottom: "8px" }}>Verdict</div>
              <div style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.7 }}>{scorecard.verdict}</div>
            </div>
            <button onClick={() => { setPhase("setup"); setMessages([]); setTopic(""); setUserSide(""); setUserTurns(0); setScorecard(null); window.speechSynthesis.cancel(); }} style={{ width: "100%", marginTop: "20px", padding: "14px", background: "#fff", color: "#000", border: "none", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: "pointer", borderRadius: "2px", fontWeight: "700" }}>
              Debate Again →
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {phase === "debate" && (
        <div style={{ borderTop: "1px solid #1a1a1a", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {transcript && (
            <div style={{ fontSize: "13px", color: "#888", fontStyle: "italic", textAlign: "center", maxWidth: "400px" }}>"{transcript}"</div>
          )}
          <button
            onMouseDown={startListening}
            onMouseUp={stopListeningAndSend}
            onTouchStart={startListening}
            onTouchEnd={stopListeningAndSend}
            disabled={loading || speaking}
            style={{ width: "80px", height: "80px", borderRadius: "50%", background: listening ? "#ff4444" : loading || speaking ? "#222" : "#fff", border: listening ? "4px solid #ff8888" : "4px solid transparent", cursor: loading || speaking ? "not-allowed" : "pointer", fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: listening ? "0 0 0 12px rgba(255,68,68,0.2)" : "none", transition: "all 0.15s" }}
          >
            {listening ? "🎙️" : loading || speaking ? "⏳" : "🎤"}
          </button>
          <div style={{ fontSize: "11px", color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {listening ? "Release to send" : loading ? "Thinking..." : speaking ? "ARCHON is speaking..." : "Hold to speak"}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}