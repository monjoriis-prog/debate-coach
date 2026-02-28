"use client";
import { useState, useRef, useEffect } from "react";

const SCENARIOS = [
  {
    category: "Romantic",
    emoji: "💑",
    situations: [
      { title: "First date", prompt: "You're on a first date at a coffee shop. Be warm but realistic — a little nervous energy, asking questions back.", ai_role: "your date", voice: { pitch: 1.2, rate: 1.0, preferFemale: true } },
      { title: "Resolving an argument", prompt: "You and your partner just argued about household responsibilities. Start defensive, soften if they communicate well.", ai_role: "your partner", voice: { pitch: 1.1, rate: 0.95, preferFemale: true } },
      { title: "Expressing feelings", prompt: "Your partner wants to tell you something. Be receptive but slightly distracted at first.", ai_role: "your partner", voice: { pitch: 1.15, rate: 1.0, preferFemale: true } },
    ]
  },
  {
    category: "Family",
    emoji: "👨‍👩‍👧",
    situations: [
      { title: "Talking to a teenager", prompt: "You are a 16-year-old who has been distant. Give short answers, seem distracted, but open up slightly if they are genuine and not pushy.", ai_role: "your teenager", voice: { pitch: 1.3, rate: 1.15, preferFemale: false } },
      { title: "Setting limits with a parent", prompt: "You are a well-meaning parent who gives too much advice. React with slight hurt if pushed away harshly, but respect firm kindness.", ai_role: "your parent", voice: { pitch: 0.9, rate: 0.9, preferFemale: false } },
      { title: "Comforting a young child", prompt: "You are a 7-year-old upset because a friend was mean. Speak simply, emotionally, and respond to warmth.", ai_role: "your child", voice: { pitch: 1.6, rate: 1.1, preferFemale: true } },
    ]
  },
  {
    category: "Work",
    emoji: "💼",
    situations: [
      { title: "Asking for a raise", prompt: "You are a busy manager. Start noncommittal, ask for justification. Respond positively to confident evidence-based arguments.", ai_role: "your boss", voice: { pitch: 0.8, rate: 0.88, preferFemale: false } },
      { title: "Handling a difficult coworker", prompt: "You have been taking credit for others work without realizing it fully. Be defensive at first but not evil, just oblivious.", ai_role: "your coworker", voice: { pitch: 1.0, rate: 1.05, preferFemale: true } },
      { title: "Networking at an event", prompt: "You are a professional at a networking event. Be friendly but slightly guarded. Open up if they are interesting and genuine.", ai_role: "a professional contact", voice: { pitch: 0.95, rate: 1.0, preferFemale: false } },
    ]
  },
  {
    category: "Social",
    emoji: "🤝",
    situations: [
      { title: "Meeting a new neighbor", prompt: "You are a neighbor meeting someone new. Be friendly and a bit curious. Ask about where they moved from.", ai_role: "your neighbor", voice: { pitch: 1.05, rate: 1.0, preferFemale: true } },
      { title: "Reconnecting with an old friend", prompt: "You are an old friend who felt hurt by the distance. Be warm but slightly guarded. Open up if they acknowledge the gap.", ai_role: "your old friend", voice: { pitch: 1.1, rate: 0.98, preferFemale: false } },
      { title: "Making small talk", prompt: "You are a friendly stranger in a queue. Keep things light, respond to what they say, keep it natural.", ai_role: "a friendly stranger", voice: { pitch: 1.0, rate: 1.05, preferFemale: true } },
    ]
  },
];

const SYSTEM_PROMPT = (situation: string, aiRole: string) => `You are playing the role of ${aiRole} in a social skills training exercise.

The scenario: ${situation}

Rules:
1. Stay completely in character as ${aiRole}. Be realistic and add natural friction and emotion.
2. Keep ALL responses very short: 1-2 sentences only. This is SPOKEN conversation.
3. React authentically. Awkward input gets awkward reactions. Warm input gets warm reactions.
4. Never break character or give advice during the conversation.

After exactly 6 user messages, step out of character and give feedback in this EXACT format:

---FEEDBACK---
WARMTH: [1-10]
CLARITY: [1-10]
LISTENING: [1-10]
CONFIDENCE: [1-10]
BEST_MOMENT: [the best thing they said and why it worked]
IMPROVE: [one specific thing to do differently]
VERDICT: [2-3 sentence overall coaching assessment]
---END---

Keep all in-character responses under 30 words for natural speech.`;

function speak(text: string, voiceConfig: {pitch: number, rate: number, preferFemale: boolean}, onEnd?: () => void) {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = voiceConfig.pitch;
  utter.rate = voiceConfig.rate;
  utter.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  if (voiceConfig.preferFemale) {
    const female = voices.find(v => v.name.includes("Samantha") || v.name.includes("Google UK English Female") || v.name.toLowerCase().includes("female") || v.name.includes("Karen") || v.name.includes("Moira"));
    if (female) utter.voice = female;
  } else {
    const male = voices.find(v => v.name.includes("Daniel") || v.name.includes("Google UK English Male") || v.name.toLowerCase().includes("male") || v.name.includes("Alex"));
    if (male) utter.voice = male;
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

function ScoreBar({ label, score }: { label: string, score: number }) {
  const c = score >= 7 ? "#a78bfa" : score >= 5 ? "#fbbf24" : "#f87171";
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#888", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color: c }}>{score}/10</span>
      </div>
      <div style={{ height: "4px", background: "#1a1a2e", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score * 10}%`, background: c, borderRadius: "2px", transition: "width 1.2s ease" }} />
      </div>
    </div>
  );
}

export default function SocialCoach() {
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

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported. Try Chrome.");
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
      speak(parsed.verdict || "Well done!", { pitch: 1.0, rate: 0.92, preferFemale: false }, () => setSpeaking(false));
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
      <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f0", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#444", textTransform: "uppercase", marginBottom: "16px" }}>Social Skills Trainer</div>
            <h1 style={{ fontSize: "clamp(40px, 7vw, 72px)", fontWeight: "900", margin: "0 0 12px", lineHeight: 1, background: "linear-gradient(135deg, #c084fc 0%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CONNECT</h1>
            <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>Have real voice conversations. Build confidence. Never feel stuck again.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {SCENARIOS.map((s) => (
              <button key={s.category} onClick={() => { setSelectedCategory(s); setPhase("scenario"); }}
                style={{ background: "#0f0f24", border: "1px solid #1e1e3f", color: "#fff", padding: "28px 20px", textAlign: "left", cursor: "pointer", borderRadius: "4px" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#7c3aed")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e1e3f")}>
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>{s.emoji}</div>
                <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>{s.category}</div>
                <div style={{ fontSize: "12px", color: "#555" }}>{s.situations.length} scenarios</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "scenario") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f0", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: "560px", width: "100%" }}>
          <button onClick={() => setPhase("home")} style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: "13px", marginBottom: "32px", padding: 0, fontFamily: "Georgia, serif" }}>← Back</button>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>{selectedCategory.emoji}</div>
          <h2 style={{ fontSize: "28px", fontWeight: "900", margin: "0 0 8px", color: "#fff" }}>{selectedCategory.category}</h2>
          <p style={{ color: "#555", fontSize: "14px", marginBottom: "32px" }}>Choose a scenario to practice</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {selectedCategory.situations.map((s: any, i: number) => (
              <button key={i} onClick={() => startChat(s)}
                style={{ background: "#0f0f24", border: "1px solid #1e1e3f", color: "#fff", padding: "20px 24px", textAlign: "left", cursor: "pointer", borderRadius: "4px" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#7c3aed")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e1e3f")}>
                <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "6px" }}>{s.title}</div>
                <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.5 }}>{s.prompt}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f0", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: "1px solid #1a1a2e", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase" }}>CONNECT</div>
          <div style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>{selectedSituation?.title}</div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i <= userTurns ? "#a78bfa" : "#1e1e3f", transition: "background 0.3s" }} />
          ))}
          <span style={{ fontSize: "11px", color: "#444", marginLeft: "8px" }}>{Math.max(0, 6 - userTurns)} left</span>
        </div>
      </div>

      <div style={{ background: "#0f0f24", borderBottom: "1px solid #1a1a2e", padding: "10px 24px", fontSize: "12px", color: "#555" }}>
        Talking to: <span style={{ color: "#a78bfa" }}>{selectedSituation?.ai_role}</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {messages.map((m: any, i: number) => (
          <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: m.role === "user" ? "#7c3aed" : "#1e1e3f", border: m.role === "assistant" ? "1px solid #2d2d5e" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", flexShrink: 0 }}>
              {m.role === "user" ? "🗣" : "💬"}
            </div>
            <div style={{ maxWidth: "75%", padding: "14px 18px", background: m.role === "user" ? "#130d2e" : "#0d0d20", border: `1px solid ${m.role === "user" ? "#2d1f5e" : "#1a1a2e"}`, borderRadius: "4px", fontSize: "14px", lineHeight: "1.7", color: m.role === "user" ? "#d8b4fe" : "#e8e8f0" }}>
              {m.content}
            </div>
          </div>
        ))}

        {(loading || speaking) && (
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1e1e3f", border: "1px solid #2d2d5e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>💬</div>
            <div style={{ padding: "14px 18px", background: "#0d0d20", border: "1px solid #1a1a2e", borderRadius: "4px", display: "flex", gap: "6px", alignItems: "center" }}>
              {[0,1,2].map((i) => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: speaking ? "#a78bfa" : "#444", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
              <span style={{ fontSize: "11px", color: "#555", marginLeft: "8px" }}>{speaking ? "speaking..." : "thinking..."}</span>
            </div>
          </div>
        )}

        {phase === "done" && feedback && (
          <div style={{ border: "1px solid #2d2d5e", background: "#090918", padding: "28px", borderRadius: "4px", marginTop: "12px" }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#555", textTransform: "uppercase", marginBottom: "8px" }}>Conversation Score</div>
              <div style={{ fontSize: "72px", fontWeight: "900", lineHeight: 1, background: "linear-gradient(135deg, #c084fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{totalScore}</div>
              <div style={{ fontSize: "12px", color: "#444", marginTop: "4px" }}>out of 10</div>
            </div>
            <ScoreBar label="Warmth" score={feedback.warmth} />
            <ScoreBar label="Clarity" score={feedback.clarity} />
            <ScoreBar label="Listening" score={feedback.listening} />
            <ScoreBar label="Confidence" score={feedback.confidence} />
            {feedback.bestMoment && (
              <div style={{ marginTop: "20px", padding: "16px", background: "#0a1a0a", border: "1px solid #1a3a1a", borderRadius: "4px" }}>
                <div style={{ fontSize: "11px", color: "#4ade80", textTransform: "uppercase", marginBottom: "8px" }}>✨ Best Moment</div>
                <div style={{ fontSize: "13px", color: "#86efac", lineHeight: 1.6 }}>{feedback.bestMoment}</div>
              </div>
            )}
            {feedback.improve && (
              <div style={{ marginTop: "12px", padding: "16px", background: "#1a0a00", border: "1px solid #3a1a00", borderRadius: "4px" }}>
                <div style={{ fontSize: "11px", color: "#fb923c", textTransform: "uppercase", marginBottom: "8px" }}>🎯 Work On This</div>
                <div style={{ fontSize: "13px", color: "#fdba74", lineHeight: 1.6 }}>{feedback.improve}</div>
              </div>
            )}
            <div style={{ marginTop: "12px", padding: "16px", background: "#0d0d20", border: "1px solid #1e1e3f", borderRadius: "4px" }}>
              <div style={{ fontSize: "11px", color: "#666", textTransform: "uppercase", marginBottom: "8px" }}>Coach Assessment</div>
              <div style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.7 }}>{feedback.verdict}</div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button onClick={() => startChat(selectedSituation)} style={{ flex: 1, padding: "14px", background: "#7c3aed", color: "#fff", border: "none", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: "pointer", borderRadius: "4px", fontWeight: "700" }}>Try Again</button>
              <button onClick={reset} style={{ flex: 1, padding: "14px", background: "#1e1e3f", color: "#fff", border: "none", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: "pointer", borderRadius: "4px", fontWeight: "700" }}>New Scenario</button>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {phase === "chat" && (
        <div style={{ borderTop: "1px solid #1a1a2e", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {transcript && (
            <div style={{ fontSize: "13px", color: "#888", fontStyle: "italic", textAlign: "center", maxWidth: "400px" }}>"{transcript}"</div>
          )}
          <button
            onMouseDown={startListening}
            onMouseUp={stopListeningAndSend}
            onTouchStart={startListening}
            onTouchEnd={stopListeningAndSend}
            disabled={loading || speaking}
            style={{ width: "80px", height: "80px", borderRadius: "50%", background: listening ? "#7c3aed" : loading || speaking ? "#1e1e3f" : "#a78bfa", border: listening ? "4px solid #c084fc" : "4px solid transparent", cursor: loading || speaking ? "not-allowed" : "pointer", fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: listening ? "0 0 0 16px rgba(167,139,250,0.15)" : "none", transition: "all 0.15s" }}
          >
            {listening ? "🎙️" : loading || speaking ? "⏳" : "🎤"}
          </button>
          <div style={{ fontSize: "11px", color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {listening ? "Release to send" : loading ? "Thinking..." : speaking ? "They are speaking..." : "Hold to speak"}
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
```
