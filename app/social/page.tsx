"use client";
import { useState, useRef, useEffect } from "react";

const SCENARIOS = [
  {
    category: "Dating & Romance",
    emoji: "💛",
    color: "#fff7ed",
    accent: "#f97316",
    situations: [
      { title: "First date at a café", prompt: "You are on a first date. You are warm and curious but a little nervous. Ask questions back. React naturally to what they say — if they are awkward, be a little awkward too. If they are charming, open up more.", ai_role: "your date", voice: { pitch: 1.2, rate: 1.0, preferFemale: true } },
      { title: "Asking someone out", prompt: "You are someone the user has met a few times and likes. You are friendly but not sure if you are interested yet. React to how confident and genuine they are.", ai_role: "the person you like", voice: { pitch: 1.15, rate: 1.0, preferFemale: true } },
      { title: "Recovering from awkward silence", prompt: "You are on a date and there was just an awkward silence. You are slightly uncomfortable but open to them saving the moment if they handle it well.", ai_role: "your date", voice: { pitch: 1.1, rate: 0.98, preferFemale: true } },
      { title: "Keeping conversation flowing", prompt: "You are chatting with someone attractive. You respond to what they say but do not make it too easy — make them work a little to keep things interesting.", ai_role: "someone you just met", voice: { pitch: 1.05, rate: 1.02, preferFemale: false } },
    ]
  },
  {
    category: "Making Friends",
    emoji: "🤝",
    color: "#f0fdf4",
    accent: "#22c55e",
    situations: [
      { title: "Meeting someone at a party", prompt: "You are at a party and someone approaches you. You are friendly but not overly enthusiastic. Open up if they seem genuine and interesting.", ai_role: "someone at the party", voice: { pitch: 1.0, rate: 1.05, preferFemale: false } },
      { title: "Joining a new group", prompt: "You are part of a group and someone new is trying to join the conversation. Be welcoming but realistic — do not make it too easy at first.", ai_role: "someone in the group", voice: { pitch: 1.1, rate: 1.0, preferFemale: true } },
      { title: "Reconnecting with someone", prompt: "You are an old acquaintance who fell out of touch. Be warm but slightly guarded. Open up if they acknowledge the gap genuinely.", ai_role: "an old acquaintance", voice: { pitch: 1.05, rate: 0.98, preferFemale: false } },
      { title: "Making small talk", prompt: "You are a friendly stranger waiting in line. Keep it light and natural. Respond to what they say and keep the energy casual.", ai_role: "a friendly stranger", voice: { pitch: 1.0, rate: 1.05, preferFemale: true } },
    ]
  },
  {
    category: "Work & Networking",
    emoji: "💼",
    color: "#eff6ff",
    accent: "#3b82f6",
    situations: [
      { title: "Networking at an event", prompt: "You are a professional at a networking event. Be polite but slightly guarded. Open up if they are interesting and not just pitching themselves.", ai_role: "a professional contact", voice: { pitch: 0.9, rate: 0.92, preferFemale: false } },
      { title: "Asking for a raise", prompt: "You are a busy manager. Start noncommittal and ask for justification. Respond positively to confident evidence-based arguments. React negatively to vague requests.", ai_role: "your manager", voice: { pitch: 0.85, rate: 0.88, preferFemale: false } },
      { title: "Handling a difficult colleague", prompt: "You have been unintentionally taking credit for shared work. Be defensive at first but not hostile — you are oblivious not mean. Soften if they handle it maturely.", ai_role: "your colleague", voice: { pitch: 1.0, rate: 1.02, preferFemale: true } },
      { title: "Introducing yourself confidently", prompt: "You are meeting someone new at work on their first day. Be friendly and professional. See how well they introduce themselves and respond naturally.", ai_role: "a colleague", voice: { pitch: 1.05, rate: 1.0, preferFemale: false } },
    ]
  },
  {
    category: "Family Conversations",
    emoji: "🏡",
    color: "#fdf4ff",
    accent: "#a855f7",
    situations: [
      { title: "Talking to a distant teenager", prompt: "You are a 16-year-old who has been distant lately. Give short answers and seem distracted. Open up slightly if they are genuine and not pushy or preachy.", ai_role: "your teenager", voice: { pitch: 1.3, rate: 1.12, preferFemale: false } },
      { title: "Setting boundaries with a parent", prompt: "You are a well-meaning parent who gives too much advice. Feel slightly hurt if pushed away harshly, but respect firm and kind boundaries.", ai_role: "your parent", voice: { pitch: 0.88, rate: 0.9, preferFemale: false } },
      { title: "Comforting someone upset", prompt: "You are upset about something that happened today. You want to feel heard, not fixed. React well to empathy and badly to unsolicited advice.", ai_role: "a family member", voice: { pitch: 1.1, rate: 0.95, preferFemale: true } },
      { title: "Sharing big news", prompt: "You are a family member hearing big news for the first time. React realistically — with questions, mild concern, and then warmth if handled well.", ai_role: "a family member", voice: { pitch: 1.05, rate: 0.98, preferFemale: true } },
    ]
  },
];

const SYSTEM_PROMPT = (situation: string, aiRole: string) => `You are playing the role of ${aiRole} in a social confidence training exercise.

Scenario: ${situation}

Rules:
1. Stay completely in character as ${aiRole}. Be realistic — add natural emotion and friction.
2. Keep ALL responses very short: 1-2 sentences only. This is a spoken conversation.
3. React authentically. Awkward input gets awkward reactions. Warm genuine input gets warm reactions.
4. Never break character or give coaching advice during the conversation.

After exactly 6 user messages, step out of character and give feedback in this EXACT format:

---FEEDBACK---
WARMTH: [1-10]
CLARITY: [1-10]
LISTENING: [1-10]
CONFIDENCE: [1-10]
BEST_MOMENT: [the single best thing they said or did and why it worked]
IMPROVE: [one specific, actionable thing to do differently next time]
VERDICT: [2-3 sentence warm and honest coaching assessment spoken directly to them]
---END---

Keep all in-character responses under 30 words.`;

function speak(text: string, voiceConfig: { pitch: number; rate: number; preferFemale: boolean }, onEnd?: () => void) {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = voiceConfig.pitch;
  utter.rate = voiceConfig.rate;
  utter.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  if (voiceConfig.preferFemale) {
    const v = voices.find(v => v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Moira") || v.name.includes("Google UK English Female"));
    if (v) utter.voice = v;
  } else {
    const v = voices.find(v => v.name.includes("Daniel") || v.name.includes("Alex") || v.name.includes("Google UK English Male"));
    if (v) utter.voice = v;
  }
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

function parseFeedback(text: string) {
  const match = text.match(/---FEEDBACK---([\s\S]*?)---END---/);
  if (!match) return null;
  const block = match[1];
  const get = (key: string) => {
    const m = block.match(new RegExp(`${key}:\\s*(.+)`));
    return m ? m[1].trim() : null;
  };
  return {
    warmth: parseInt(get("WARMTH") || "0"),
    clarity: parseInt(get("CLARITY") || "0"),
    listening: parseInt(get("LISTENING") || "0"),
    confidence: parseInt(get("CONFIDENCE") || "0"),
    bestMoment: get("BEST_MOMENT"),
    improve: get("IMPROVE"),
    verdict: get("VERDICT"),
    raw: text.replace(/---FEEDBACK---[\s\S]*?---END---/, "").trim(),
  };
}

function ScoreBar({ label, score, accent }: { label: string; score: number; accent: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color: score >= 7 ? "#22c55e" : score >= 5 ? "#f97316" : "#ef4444" }}>{score}/10</span>
      </div>
      <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score * 10}%`, background: accent, borderRadius: "99px", transition: "width 1.2s ease" }} />
      </div>
    </div>
  );
}

export default function Forte() {
  const [phase, setPhase] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSituation, setSelectedSituation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [userTurns, setUserTurns] = useState(0);
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {};
    window.speechSynthesis.getVoices();
  }, []);

  const accent = selectedCategory?.accent || "#f97316";

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported. Please use Chrome.");
    window.speechSynthesis.cancel();
    setSpeaking(false);
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join("");
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
    }, 400);
  }

  async function startChat(situation: any) {
    setSelectedSituation(situation);
    setPhase("chat");
    setLoading(true);
    setMessages([]);
    setUserTurns(0);
    setFeedback(null);
    const opening = [{ role: "user", content: "Let's begin the scenario." }];
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt: SYSTEM_PROMPT(situation.prompt, situation.ai_role), messages: opening }),
    });
    const data = await res.json();
    const reply = data.content || "Hey there.";
    setMessages([{ role: "assistant", content: reply }]);
    setLoading(false);
    setSpeaking(true);
    speak(reply, situation.voice, () => setSpeaking(false));
  }

  async function sendMessage(text: string) {
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setTranscript("");
    setUserTurns((t: number) => t + 1);
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt: SYSTEM_PROMPT(selectedSituation.prompt, selectedSituation.ai_role),
        messages: newMessages.map((m: any) => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await res.json();
    const reply = data.content || "...";
    const parsed = parseFeedback(reply);
    if (parsed) {
      setFeedback(parsed);
      setMessages([...newMessages, { role: "assistant", content: parsed.raw || "Great conversation!" }]);
      setPhase("done");
      setSpeaking(true);
      speak(parsed.verdict || "Well done!", { pitch: 1.0, rate: 0.9, preferFemale: true }, () => setSpeaking(false));
    } else {
      setMessages([...newMessages, { role: "assistant", content: reply }]);
      setSpeaking(true);
      speak(reply, selectedSituation.voice, () => setSpeaking(false));
    }
    setLoading(false);
  }

  function reset() {
    setPhase("home");
    setSelectedCategory(null);
    setSelectedSituation(null);
    setMessages([]);
    setFeedback(null);
    setUserTurns(0);
    setTranscript("");
    window.speechSynthesis.cancel();
  }

  const totalScore = feedback
    ? Math.round((feedback.warmth + feedback.clarity + feedback.listening + feedback.confidence) / 4)
    : null;

  if (phase === "home") {
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "60px 24px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "72px", height: "72px", background: "#fff", borderRadius: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", marginBottom: "24px", fontSize: "32px" }}>🎯</div>
            <h1 style={{ fontSize: "42px", fontWeight: "800", margin: "0 0 8px", color: "#0f172a", letterSpacing: "-1px" }}>FORTE</h1>
            <p style={{ color: "#64748b", fontSize: "16px", margin: 0, lineHeight: 1.6 }}>Practice real conversations.<br />Build genuine confidence.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {SCENARIOS.map((s) => (
              <button key={s.category} onClick={() => { setSelectedCategory(s); setPhase("scenario"); }}
                style={{ background: s.color, border: "1.5px solid transparent", borderRadius: "16px", padding: "24px 20px", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.border = `1.5px solid ${s.accent}`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.border = "1.5px solid transparent"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{s.emoji}</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>{s.category}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>{s.situations.length} scenarios</div>
              </button>
            ))}
          </div>
          <p style={{ textAlign: "center", color: "#cbd5e1", fontSize: "12px", marginTop: "40px" }}>Hold the mic button to speak · Release to send</p>
        </div>
      </div>
    );
  }

  if (phase === "scenario") {
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px" }}>
          <button onClick={() => setPhase("home")} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px", marginBottom: "32px", padding: 0 }}>← Back</button>
          <div style={{ marginBottom: "32px" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>{selectedCategory.emoji}</div>
            <h2 style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 6px", color: "#0f172a", letterSpacing: "-0.5px" }}>{selectedCategory.category}</h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Pick a scenario to practice</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {selectedCategory.situations.map((s: any, i: number) => (
              <button key={i} onClick={() => startChat(s)}
                style={{ background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: "14px", padding: "20px 22px", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = selectedCategory.accent; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>{s.title}</div>
                <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>{s.prompt.split(".")[0]}.</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase" }}>FORTE</div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", marginTop: "2px" }}>{selectedSituation?.title}</div>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i <= userTurns ? accent : "#e2e8f0", transition: "background 0.3s" }} />
          ))}
        </div>
      </div>

      <div style={{ background: selectedCategory?.color || "#fff7ed", padding: "10px 24px", fontSize: "13px", color: "#64748b", borderBottom: "1px solid #f1f5f9" }}>
        Talking to: <span style={{ fontWeight: "600", color: accent }}>{selectedSituation?.ai_role}</span>
        <span style={{ color: "#cbd5e1", marginLeft: "12px" }}>{Math.max(0, 6 - userTurns)} turns left</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map((m: any, i: number) => (
          <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: "10px", alignItems: "flex-end" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: m.role === "user" ? accent : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
              {m.role === "user" ? "🗣" : "💬"}
            </div>
            <div style={{ maxWidth: "72%", padding: "12px 16px", background: m.role === "user" ? accent : "#fff", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: "14px", lineHeight: "1.6", color: m.role === "user" ? "#fff" : "#0f172a", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {m.content}
            </div>
          </div>
        ))}

        {(loading || speaking) && (
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>💬</div>
            <div style={{ padding: "12px 16px", background: "#fff", borderRadius: "18px 18px 18px 4px", display: "flex", gap: "5px", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {[0,1,2].map((i) => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: accent, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s`, opacity: 0.6 }} />)}
            </div>
          </div>
        )}

        {phase === "done" && feedback && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginTop: "8px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px" }}>Your Score</div>
              <div style={{ fontSize: "80px", fontWeight: "900", lineHeight: 1, color: accent }}>{totalScore}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>out of 10</div>
            </div>
            <ScoreBar label="Warmth" score={feedback.warmth} accent={accent} />
            <ScoreBar label="Clarity" score={feedback.clarity} accent={accent} />
            <ScoreBar label="Listening" score={feedback.listening} accent={accent} />
            <ScoreBar label="Confidence" score={feedback.confidence} accent={accent} />
            {feedback.bestMoment && (
              <div style={{ marginTop: "20px", padding: "16px", background: "#f0fdf4", borderRadius: "12px", borderLeft: "4px solid #22c55e" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#22c55e", textTransform: "uppercase", marginBottom: "6px" }}>✨ Best Moment</div>
                <div style={{ fontSize: "14px", color: "#166534", lineHeight: 1.6 }}>{feedback.bestMoment}</div>
              </div>
            )}
            {feedback.improve && (
              <div style={{ marginTop: "10px", padding: "16px", background: "#fff7ed", borderRadius: "12px", borderLeft: "4px solid #f97316" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#f97316", textTransform: "uppercase", marginBottom: "6px" }}>🎯 Try This Next Time</div>
                <div style={{ fontSize: "14px", color: "#9a3412", lineHeight: 1.6 }}>{feedback.improve}</div>
              </div>
            )}
            {feedback.verdict && (
              <div style={{ marginTop: "10px", padding: "16px", background: "#f8fafc", borderRadius: "12px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Coach Says</div>
                <div style={{ fontSize: "14px", color: "#334155", lineHeight: 1.7 }}>{feedback.verdict}</div>
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => startChat(selectedSituation)} style={{ flex: 1, padding: "14px", background: accent, color: "#fff", border: "none", fontSize: "14px", fontWeight: "700", borderRadius: "12px", cursor: "pointer" }}>Try Again</button>
              <button onClick={reset} style={{ flex: 1, padding: "14px", background: "#f1f5f9", color: "#334155", border: "none", fontSize: "14px", fontWeight: "700", borderRadius: "12px", cursor: "pointer" }}>New Scenario</button>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {phase === "chat" && (
        <div style={{ background: "#fff", borderTop: "1px solid #f1f5f9", padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {transcript && (
            <div style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic", textAlign: "center", maxWidth: "360px" }}>"{transcript}"</div>
          )}
          <button
            onMouseDown={startListening}
            onMouseUp={stopListeningAndSend}
            onTouchStart={startListening}
            onTouchEnd={stopListeningAndSend}
            disabled={loading || speaking}
            style={{ width: "72px", height: "72px", borderRadius: "50%", background: listening ? "#ef4444" : loading || speaking ? "#e2e8f0" : accent, border: listening ? "4px solid #fca5a5" : "4px solid transparent", cursor: loading || speaking ? "not-allowed" : "pointer", fontSize: "26px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: listening ? "0 0 0 12px rgba(239,68,68,0.15)" : `0 4px 16px ${accent}40`, transition: "all 0.15s" }}
          >
            {listening ? "🎙️" : loading || speaking ? "⏳" : "🎤"}
          </button>
          <div style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: "600" }}>
            {listening ? "Release to send" : loading ? "Thinking..." : speaking ? "Listen..." : "Hold to speak"}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
      `}</style>
    </div>
  );
}
