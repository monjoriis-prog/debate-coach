"use client";
import { useState, useRef, useEffect } from "react";

const ICONS = {
  romance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  friends: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  work: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
  family: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
};

const SCENARIOS = [
  {
    category: "Dating & Romance",
    iconKey: "romance",
    color: "#f0f7f4",
    accent: "#2d6a4f",
    situations: [
      {
        title: "First meeting at a coffee shop",
        subtitle: "You just sat down across from each other. Hearts racing.",
        prompt: `You are meeting this person for the very first time at a coffee shop. You are warm but a little guarded — you don't know them yet. React naturally: if they are awkward, show mild discomfort. If they are charming and genuine, slowly open up. 

BODY LANGUAGE: Every 2 messages, add a brief italicized body language cue in parentheses that reveals your emotional state. Examples: *(glances at their phone briefly)*, *(leans forward slightly)*, *(plays with hair, looking away)*, *(smiles and maintains eye contact)*. These cues should be realistic and shift based on how well the conversation is going.`,
        ai_role: "someone you just met", voice: { pitch: 1.15, rate: 1.0, preferFemale: true }
      },
      {
        title: "Met at a study group — feelings developing",
        subtitle: "You've seen each other a few times. Something is there.",
        prompt: `You met at a study group and have seen each other 3-4 times. There is a quiet mutual interest but neither of you has acknowledged it. You are friendly but slightly self-conscious around them. React to how they handle the tension — do they acknowledge it or pretend it isn't there?

BODY LANGUAGE: Every 2 messages, add an italicized body language cue in parentheses. Examples: *(holds eye contact a beat too long)*, *(laughs and looks away quickly)*, *(shifts closer without realizing it)*. Make them feel true to the moment.`,
        ai_role: "someone from your study group", voice: { pitch: 1.1, rate: 0.98, preferFemale: true }
      },
      {
        title: "Third date — getting deeper",
        subtitle: "The small talk is over. Time to really connect.",
        prompt: `This is the third date. You are past surface-level small talk and starting to feel real feelings. You are open but also paying attention to whether they go deeper or stay surface-level. Share things about yourself if they create real space for it. Pull back if they seem distracted or uninterested.

BODY LANGUAGE: Every 2 messages, add an italicized body language cue in parentheses showing emotional intimacy level. Examples: *(turns fully toward them)*, *(pauses and looks down thoughtfully)*, *(reaches across and touches their hand briefly)*.`,
        ai_role: "your date", voice: { pitch: 1.1, rate: 0.97, preferFemale: true }
      },
      {
        title: "Asking someone out after meeting twice",
        subtitle: "You like them. Will you find the right moment?",
        prompt: `You have met this person twice before and enjoyed their company. You sense they might like you too but you are not sure. React to how they handle this — are they direct? Do they beat around the bush? If they ask you out clearly and confidently, say yes warmly. If they are hesitant or confusing, be politely unclear.

BODY LANGUAGE: Every 2 messages, add an italicized body language cue in parentheses. Examples: *(smiles and tilts head)*, *(fidgets with cup nervously)*, *(looks directly at them and waits)*.`,
        ai_role: "someone you like", voice: { pitch: 1.12, rate: 1.0, preferFemale: false }
      },
      {
        title: "Recovering from an awkward moment",
        subtitle: "Something weird just happened. Can you save it?",
        prompt: `Something slightly awkward just happened on the date — you said something that landed wrong, or there was an uncomfortable silence. You are a little thrown off. React to how they handle it — do they acknowledge it with humor and grace, or make it worse by over-explaining? Good recovery = you relax and warm up again.

BODY LANGUAGE: Every 2 messages, add an italicized body language cue in parentheses. Examples: *(shifts in seat, glances away)*, *(lets out a small laugh and relaxes shoulders)*, *(looks down at hands)*.`,
        ai_role: "your date", voice: { pitch: 1.1, rate: 0.99, preferFemale: true }
      },
      {
        title: "Reading if they are interested",
        subtitle: "Practice noticing the signals — and responding right.",
        prompt: `You are on a first date. You start fairly neutral — not obviously interested or disinterested. Your interest level will rise or fall based on how engaging and perceptive they are. If they pick up on your signals and respond well, warm up noticeably. If they miss cues or talk about themselves too much, cool off.

BODY LANGUAGE: Every single message, add an italicized body language cue in parentheses. Make them clear signals of interest or disinterest that a perceptive person could read. Examples: *(leans back and glances around the room)*, *(leans in and smiles slowly)*, *(checks phone briefly)*, *(holds eye contact and nods)*.`,
        ai_role: "your date", voice: { pitch: 1.15, rate: 1.0, preferFemale: true }
      },
    ]
  },
  {
    category: "Making Friends",
    iconKey: "friends",
    color: "#f4f7f0",
    accent: "#40916c",
    situations: [
      { title: "Meeting someone at a party", subtitle: "They seem interesting. Make your move.", prompt: `You are at a party and someone approaches you. You are friendly but not overly enthusiastic. Open up if they seem genuine and interesting. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "someone at the party", voice: { pitch: 1.0, rate: 1.05, preferFemale: false } },
      { title: "Joining a group conversation", subtitle: "The group is mid-conversation. Jump in naturally.", prompt: `You are part of a group mid-conversation. Someone is trying to join. Be welcoming but realistic. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "someone in the group", voice: { pitch: 1.1, rate: 1.0, preferFemale: true } },
      { title: "Reconnecting with someone", subtitle: "You lost touch. Time to bridge the gap.", prompt: `You are an old acquaintance who fell out of touch. Be warm but slightly guarded. Open up if they acknowledge the gap genuinely. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "an old friend", voice: { pitch: 1.05, rate: 0.98, preferFemale: false } },
      { title: "Making small talk", subtitle: "Waiting in line. Thirty seconds to connect.", prompt: `You are a friendly stranger in a queue. Keep it natural and light. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "a stranger", voice: { pitch: 1.0, rate: 1.05, preferFemale: true } },
    ]
  },
  {
    category: "Work & Networking",
    iconKey: "work",
    color: "#f0f4f7",
    accent: "#1b4332",
    situations: [
      { title: "Networking at an event", subtitle: "Make a real connection, not a pitch.", prompt: `You are a professional at a networking event. Be polite but slightly guarded. Open up if they are genuine. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "a professional contact", voice: { pitch: 0.9, rate: 0.92, preferFemale: false } },
      { title: "Asking for a raise", subtitle: "Make your case with confidence.", prompt: `You are a busy manager. Start noncommittal. Respond positively to confident evidence-based arguments. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "your manager", voice: { pitch: 0.85, rate: 0.88, preferFemale: false } },
      { title: "Handling a difficult colleague", subtitle: "Address it before it becomes a problem.", prompt: `You have been unintentionally taking credit for shared work. Be defensive at first, soften if they handle it maturely. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "your colleague", voice: { pitch: 1.0, rate: 1.02, preferFemale: true } },
      { title: "Introducing yourself confidently", subtitle: "First impressions at a new job.", prompt: `You are a colleague meeting someone on their first day. Be friendly and professional. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "a colleague", voice: { pitch: 1.05, rate: 1.0, preferFemale: false } },
    ]
  },
  {
    category: "Family Conversations",
    iconKey: "family",
    color: "#f7f4f0",
    accent: "#52796f",
    situations: [
      { title: "Talking to a distant teenager", subtitle: "Get past the one-word answers.", prompt: `You are a 16-year-old who has been distant. Give short answers. Open up slightly if they are genuine and not pushy. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "your teenager", voice: { pitch: 1.3, rate: 1.12, preferFemale: false } },
      { title: "Setting a boundary with a parent", subtitle: "Kind, clear, and firm.", prompt: `You are a well-meaning parent who gives too much advice. Feel slightly hurt if pushed away harshly, but respect kind firmness. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "your parent", voice: { pitch: 0.88, rate: 0.9, preferFemale: false } },
      { title: "Comforting someone upset", subtitle: "Listen first. Fix nothing.", prompt: `You are upset about something today. You want to feel heard, not fixed. React well to empathy and badly to advice. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "a family member", voice: { pitch: 1.1, rate: 0.95, preferFemale: true } },
      { title: "Sharing big news", subtitle: "How will they take it?", prompt: `You are hearing big news for the first time. React realistically — with questions and mild concern, then warmth if handled well. Every 2 messages add an italicized body language cue in parentheses.`, ai_role: "a family member", voice: { pitch: 1.05, rate: 0.98, preferFemale: true } },
    ]
  },
];

const SYSTEM_PROMPT = (situation: string, aiRole: string) => `You are playing the role of ${aiRole} in a social confidence training exercise.

${situation}

Core rules:
1. Stay completely in character. Be realistic — add natural emotion, hesitation, and friction.
2. Keep ALL in-character responses SHORT: 1-3 sentences max. This is spoken conversation.
3. React authentically to the quality of their communication.
4. Include body language cues as instructed — these are critical for the training.
5. Never break character or give coaching during the conversation.

After exactly 6 user messages, give feedback in this EXACT format:

---FEEDBACK---
WARMTH: [1-10]
CLARITY: [1-10]
LISTENING: [1-10]
CONFIDENCE: [1-10]
BODY_LANGUAGE_AWARENESS: [1-10]
BEST_MOMENT: [the single best thing they said or did]
BODY_LANGUAGE_NOTES: [2-3 sentences specifically on how well they read and responded to body language cues]
IMPROVE: [one specific actionable thing to try next time]
VERDICT: [2-3 sentence warm honest coaching summary spoken directly to them]
---END---`;

function speak(text: string, voiceConfig: { pitch: number; rate: number; preferFemale: boolean }, onEnd?: () => void) {
  const clean = text.replace(/\(.*?\)/g, "").replace(/\*/g, "").trim();
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(clean);
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
    bodyLanguage: parseInt(get("BODY_LANGUAGE_AWARENESS") || "0"),
    bestMoment: get("BEST_MOMENT"),
    bodyLanguageNotes: get("BODY_LANGUAGE_NOTES"),
    improve: get("IMPROVE"),
    verdict: get("VERDICT"),
    raw: text.replace(/---FEEDBACK---[\s\S]*?---END---/, "").trim(),
  };
}

function renderMessage(content: string) {
  const parts = content.split(/(\(.*?\)|\*.*?\*)/g);
  return parts.map((part, i) => {
    if ((part.startsWith("(") && part.endsWith(")")) || (part.startsWith("*") && part.endsWith("*"))) {
      const clean = part.replace(/^\(|\)$|^\*|\*$/g, "");
      return <span key={i} style={{ display: "block", marginTop: "8px", fontSize: "12px", color: "#52796f", fontStyle: "italic", fontFamily: "Georgia, serif" }}>— {clean}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

function Icon({ html, size = 24, color = "currentColor" }: { html: string; size?: number; color?: string }) {
  return <span style={{ display: "inline-flex", width: size, height: size, color }} dangerouslySetInnerHTML={{ __html: html }} />;
}

function ScoreBar({ label, score, accent }: { label: string; score: number; accent: string }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "11px", color: "#52796f", fontWeight: "600", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color: score >= 7 ? "#2d6a4f" : score >= 5 ? "#d4a017" : "#c0392b" }}>{score}/10</span>
      </div>
      <div style={{ height: "5px", background: "#e8f0ec", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score * 10}%`, background: accent, borderRadius: "99px", transition: "width 1.4s cubic-bezier(0.16,1,0.3,1)" }} />
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

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { window.speechSynthesis.onvoiceschanged = () => {}; window.speechSynthesis.getVoices(); }, []);

  const accent = selectedCategory?.accent || "#2d6a4f";

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
    setTimeout(() => { if (transcript.trim()) sendMessage(transcript.trim()); }, 400);
  }

  async function startChat(situation: any) {
    setSelectedSituation(situation);
    setPhase("chat");
    setLoading(true);
    setMessages([]);
    setUserTurns(0);
    setFeedback(null);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt: SYSTEM_PROMPT(situation.prompt, situation.ai_role), messages: [{ role: "user", content: "Let's begin." }] }),
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
      setMessages([...newMessages, { role: "assistant", content: parsed.raw || "That was a great conversation." }]);
      setPhase("done");
      setSpeaking(true);
      speak(parsed.verdict || "Well done.", { pitch: 1.0, rate: 0.9, preferFemale: true }, () => setSpeaking(false));
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
    ? Math.round((feedback.warmth + feedback.clarity + feedback.listening + feedback.confidence + feedback.bodyLanguage) / 5)
    : null;

  // HOME
  if (phase === "home") return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "'Georgia', serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "72px 24px 48px" }}>
        <div style={{ marginBottom: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{ width: "3px", height: "40px", background: "#2d6a4f", borderRadius: "2px" }} />
            <h1 style={{ fontSize: "48px", fontWeight: "400", margin: 0, color: "#1a2e1a", letterSpacing: "-1px" }}>FORTE</h1>
          </div>
          <p style={{ color: "#52796f", fontSize: "16px", margin: "0 0 0 17px", lineHeight: 1.7, fontStyle: "italic" }}>
            Practice real conversations.<br />Learn to read people. Build lasting confidence.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {SCENARIOS.map((s) => (
            <button key={s.category}
              onClick={() => { setSelectedCategory(s); setPhase("scenario"); }}
              style={{ background: "#fff", border: "1px solid #d8e8e0", borderRadius: "16px", padding: "28px 24px", textAlign: "left", cursor: "pointer", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.accent; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${s.accent}18`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ color: s.accent, marginBottom: "14px" }}>
                <Icon html={ICONS[s.iconKey as keyof typeof ICONS]} size={28} color={s.accent} />
              </div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#1a2e1a", marginBottom: "4px", fontFamily: "-apple-system, sans-serif" }}>{s.category}</div>
              <div style={{ fontSize: "12px", color: "#84a98c" }}>{s.situations.length} scenarios</div>
            </button>
          ))}
        </div>
        <p style={{ textAlign: "center", color: "#b7c9be", fontSize: "12px", marginTop: "48px", fontFamily: "-apple-system, sans-serif" }}>
          Hold mic to speak · Body language cues appear in italics · 6 turns per session
        </p>
      </div>
    </div>
  );

  // SCENARIO PICKER
  if (phase === "scenario") return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "'Georgia', serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}>
        <button onClick={() => setPhase("home")} style={{ background: "transparent", border: "none", color: "#84a98c", cursor: "pointer", fontSize: "14px", marginBottom: "40px", padding: 0, fontFamily: "-apple-system, sans-serif", display: "flex", alignItems: "center", gap: "6px" }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <Icon html={ICONS[selectedCategory.iconKey as keyof typeof ICONS]} size={24} color={selectedCategory.accent} />
          <h2 style={{ fontSize: "28px", fontWeight: "400", margin: 0, color: "#1a2e1a", letterSpacing: "-0.5px" }}>{selectedCategory.category}</h2>
        </div>
        <p style={{ color: "#84a98c", fontSize: "14px", marginBottom: "32px", fontFamily: "-apple-system, sans-serif" }}>Choose a scenario to practice</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {selectedCategory.situations.map((s: any, i: number) => (
            <button key={i} onClick={() => startChat(s)}
              style={{ background: "#fff", border: "1px solid #d8e8e0", borderRadius: "14px", padding: "22px 24px", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = selectedCategory.accent; e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = `0 4px 20px ${selectedCategory.accent}14`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#1a2e1a", marginBottom: "4px", fontFamily: "-apple-system, sans-serif" }}>{s.title}</div>
              <div style={{ fontSize: "13px", color: "#84a98c", fontStyle: "italic" }}>{s.subtitle}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // CHAT + DONE
  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8f0ec", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", color: "#84a98c", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif" }}>FORTE</div>
          <div style={{ fontSize: "15px", color: "#1a2e1a", marginTop: "2px" }}>{selectedSituation?.title}</div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: i <= userTurns ? accent : "#d8e8e0", transition: "background 0.3s" }} />
          ))}
        </div>
      </div>

      {/* Subtitle bar */}
      <div style={{ background: selectedCategory?.color || "#f0f7f4", borderBottom: "1px solid #e8f0ec", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", color: "#52796f", fontStyle: "italic" }}>Talking to: {selectedSituation?.ai_role}</span>
        <span style={{ fontSize: "12px", color: "#84a98c", fontFamily: "-apple-system, sans-serif" }}>{Math.max(0, 6 - userTurns)} turns left</span>
      </div>

      {/* Body language tip */}
      <div style={{ background: "#eaf4ef", padding: "8px 24px", fontSize: "12px", color: "#2d6a4f", fontFamily: "-apple-system, sans-serif", borderBottom: "1px solid #d8edd6" }}>
        💡 Watch for body language cues in <em>italics</em> — they reveal how the conversation is really going
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {messages.map((m: any, i: number) => (
          <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: m.role === "user" ? accent : "#e8f0ec", border: m.role === "assistant" ? `1px solid #d8e8e0` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0, color: m.role === "user" ? "#fff" : "#52796f", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>
              {m.role === "user" ? "You" : "AI"}
            </div>
            <div style={{ maxWidth: "74%", padding: "14px 18px", background: m.role === "user" ? accent : "#fff", borderRadius: m.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px", fontSize: "14px", lineHeight: "1.7", color: m.role === "user" ? "#fff" : "#1a2e1a", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              {m.role === "assistant" ? renderMessage(m.content) : m.content}
            </div>
          </div>
        ))}

        {(loading || speaking) && (
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#e8f0ec", border: "1px solid #d8e8e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#52796f", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>AI</div>
            <div style={{ padding: "14px 18px", background: "#fff", borderRadius: "4px 18px 18px 18px", display: "flex", gap: "5px", alignItems: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              {[0,1,2].map((i) => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: accent, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
              <span style={{ fontSize: "12px", color: "#84a98c", marginLeft: "8px", fontFamily: "-apple-system, sans-serif" }}>{speaking ? "speaking..." : "thinking..."}</span>
            </div>
          </div>
        )}

        {phase === "done" && feedback && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", marginTop: "8px", border: "1px solid #d8e8e0", boxShadow: "0 4px 24px rgba(45,106,79,0.06)" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.2em", color: "#84a98c", textTransform: "uppercase", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>Session Score</div>
              <div style={{ fontSize: "88px", fontWeight: "400", lineHeight: 1, color: accent }}>{totalScore}</div>
              <div style={{ fontSize: "13px", color: "#84a98c", marginTop: "4px", fontFamily: "-apple-system, sans-serif" }}>out of 10</div>
            </div>
            <ScoreBar label="Warmth" score={feedback.warmth} accent={accent} />
            <ScoreBar label="Clarity" score={feedback.clarity} accent={accent} />
            <ScoreBar label="Listening" score={feedback.listening} accent={accent} />
            <ScoreBar label="Confidence" score={feedback.confidence} accent={accent} />
            <ScoreBar label="Body Language Awareness" score={feedback.bodyLanguage} accent={accent} />

            {feedback.bestMoment && (
              <div style={{ marginTop: "24px", padding: "18px", background: "#f0f7f4", borderRadius: "12px", borderLeft: "3px solid #2d6a4f" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>✦ Best Moment</div>
                <div style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.7, fontStyle: "italic" }}>{feedback.bestMoment}</div>
              </div>
            )}
            {feedback.bodyLanguageNotes && (
              <div style={{ marginTop: "12px", padding: "18px", background: "#f4f7f0", borderRadius: "12px", borderLeft: "3px solid #40916c" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#40916c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>Body Language Reading</div>
                <div style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.7 }}>{feedback.bodyLanguageNotes}</div>
              </div>
            )}
            {feedback.improve && (
              <div style={{ marginTop: "12px", padding: "18px", background: "#faf8f0", borderRadius: "12px", borderLeft: "3px solid #d4a017" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#d4a017", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>Try This Next Time</div>
                <div style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.7 }}>{feedback.improve}</div>
              </div>
            )}
            {feedback.verdict && (
              <div style={{ marginTop: "12px", padding: "18px", background: "#f8faf8", borderRadius: "12px" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>Coach's Note</div>
                <div style={{ fontSize: "15px", color: "#1a2e1a", lineHeight: 1.8, fontStyle: "italic" }}>{feedback.verdict}</div>
              </div>
            )}
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button onClick={() => startChat(selectedSituation)} style={{ flex: 1, padding: "15px", background: accent, color: "#fff", border: "none", fontSize: "14px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600", letterSpacing: "0.02em" }}>Try Again</button>
              <button onClick={reset} style={{ flex: 1, padding: "15px", background: "#f0f7f4", color: "#2d6a4f", border: "1px solid #d8e8e0", fontSize: "14px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>New Scenario</button>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Voice button */}
      {phase === "chat" && (
        <div style={{ background: "#fff", borderTop: "1px solid #e8f0ec", padding: "22px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {transcript && (
            <div style={{ fontSize: "13px", color: "#84a98c", fontStyle: "italic", textAlign: "center", maxWidth: "380px" }}>"{transcript}"</div>
          )}
          <button
            onMouseDown={startListening}
            onMouseUp={stopListeningAndSend}
            onTouchStart={startListening}
            onTouchEnd={stopListeningAndSend}
            disabled={loading || speaking}
            style={{ width: "76px", height: "76px", borderRadius: "50%", background: listening ? "#c0392b" : loading || speaking ? "#e8f0ec" : accent, border: listening ? "4px solid #e8a89e" : `4px solid transparent`, cursor: loading || speaking ? "not-allowed" : "pointer", fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: listening ? "0 0 0 14px rgba(192,57,43,0.12)" : `0 6px 20px ${accent}30`, transition: "all 0.15s" }}
          >
            {listening ? "🎙️" : loading || speaking ? "⏳" : "🎤"}
          </button>
          <div style={{ fontSize: "11px", color: "#84a98c", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>
            {listening ? "Release to send" : loading ? "Thinking..." : speaking ? "Listen carefully..." : "Hold to speak"}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.1); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f8faf8; }
        ::-webkit-scrollbar-thumb { background: #d8e8e0; border-radius: 2px; }
      `}</style>
    </div>
  );
}
