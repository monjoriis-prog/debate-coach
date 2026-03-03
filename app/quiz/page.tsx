"use client";
import { useState } from "react";

const STYLES = {
  peacekeeper: {
    name: "The Peacekeeper", emoji: "\ud83d\udd4a\ufe0f", color: "#2d6a4f",
    tagline: "You'd rather find common ground than fight for yours.",
    description: "You're the person everyone trusts to stay calm in chaos. You naturally mediate, de-escalate, and find solutions that work for everyone. Your superpower is making people feel heard. Your blind spot? You sometimes compromise on things that actually matter to you \u2014 and people close to you may not know what you really want.",
    strength: "You make people feel safe enough to be honest.",
    growth: "Practice saying 'I hear you, AND here's what I need' \u2014 not just the first half.",
    scenarios: ["Setting boundaries with someone you love", "Asking for what you need without apologizing"],
  },
  avoider: {
    name: "The Avoider", emoji: "\ud83e\udee5", color: "#6c757d",
    tagline: "If I don't bring it up, maybe it'll go away.",
    description: "You hate conflict \u2014 not because you're weak, but because you feel everything deeply and confrontation is overwhelming. You'd rather keep the peace than rock the boat. You're incredibly perceptive and often know exactly what's wrong \u2014 you just don't say it. The problem? What you don't address doesn't disappear. It builds.",
    strength: "You read rooms better than anyone.",
    growth: "The conversation you're avoiding is usually the one that would change everything.",
    scenarios: ["Having the conversation you've been putting off", "Saying no without guilt"],
  },
  challenger: {
    name: "The Challenger", emoji: "\u26a1", color: "#c9184a",
    tagline: "You say what everyone else is thinking.",
    description: "You're direct, honest, and you don't back down from hard conversations. People respect you for it \u2014 and sometimes fear you for it. You believe that honesty is kindness and sugarcoating helps nobody. Your superpower is cutting through noise. Your blind spot? Your delivery sometimes lands harder than you intend, and people shut down before they hear your point.",
    strength: "You have the courage to say what needs to be said.",
    growth: "Practice pausing before responding. Your message is right \u2014 your timing and tone could use softening.",
    scenarios: ["Giving honest feedback without being harsh", "Apologizing when your directness hurt someone"],
  },
  solver: {
    name: "The Problem-Solver", emoji: "\ud83e\udde9", color: "#1b4332",
    tagline: "Every conflict is a puzzle with a solution.",
    description: "You approach disagreements like an engineer \u2014 calm, logical, looking for the fix. You're the one who says 'okay, so what are we actually trying to solve here?' People love this about you in work settings. In personal relationships? Sometimes people don't want a solution \u2014 they want to feel understood first. That's your edge to sharpen.",
    strength: "You turn chaos into clarity.",
    growth: "Before solving, try saying 'that sounds really hard' and stopping there. Sometimes that IS the solution.",
    scenarios: ["Supporting someone who just needs to vent", "Navigating emotional conversations with logic AND empathy"],
  },
  pleaser: {
    name: "The People-Pleaser", emoji: "\ud83e\udea9", color: "#7c5cbf",
    tagline: "You'd set yourself on fire to keep someone else warm.",
    description: "You're generous, empathetic, and deeply attuned to what others need. You adjust yourself to make everyone comfortable \u2014 and you're so good at it that people don't realize you're doing it. The cost? You lose track of your own needs. Resentment builds quietly. And the people who love you have no idea you're drowning because you smile through it.",
    strength: "You make everyone around you feel valued and seen.",
    growth: "Your needs aren't a burden. Practice voicing them before they become resentment.",
    scenarios: ["Telling someone what you actually want", "Letting someone be disappointed in you"],
  },
};

type StyleKey = keyof typeof STYLES;

const QUESTIONS = [
  { scenario: "Your partner makes a plan without asking you first. You're annoyed.", answers: [
    { text: "I bring it up calmly and suggest we check in with each other next time", style: "peacekeeper" as StyleKey },
    { text: "I don't say anything. It's not worth the fight", style: "avoider" as StyleKey },
    { text: "I tell them straight up \u2014 that wasn't okay", style: "challenger" as StyleKey },
    { text: "I figure out a system so this doesn't happen again", style: "solver" as StyleKey },
    { text: "I go along with it even though I'm hurt, because I don't want them to feel bad", style: "pleaser" as StyleKey },
  ]},
  { scenario: "A friend keeps cancelling plans last minute. It's the third time.", answers: [
    { text: "I say 'hey, I value our time \u2014 can we find a day that actually works?'", style: "peacekeeper" as StyleKey },
    { text: "I stop making plans with them and quietly pull away", style: "avoider" as StyleKey },
    { text: "I tell them directly \u2014 'this keeps happening and it's not cool'", style: "challenger" as StyleKey },
    { text: "I suggest shorter, more flexible hangouts instead", style: "solver" as StyleKey },
    { text: "I say 'no worries!' every time even though it bothers me", style: "pleaser" as StyleKey },
  ]},
  { scenario: "Your boss takes credit for your idea in a meeting.", answers: [
    { text: "I talk to them privately and calmly explain what I noticed", style: "peacekeeper" as StyleKey },
    { text: "I let it go. I don't want to make things awkward", style: "avoider" as StyleKey },
    { text: "I speak up in the meeting: 'I'd love to add to that since it came from my research'", style: "challenger" as StyleKey },
    { text: "I document my contributions more carefully going forward", style: "solver" as StyleKey },
    { text: "I feel hurt but tell myself it's fine \u2014 they probably didn't mean it", style: "pleaser" as StyleKey },
  ]},
  { scenario: "You and your sibling disagree about how to handle a family situation.", answers: [
    { text: "I listen to their side and try to find something we both agree on", style: "peacekeeper" as StyleKey },
    { text: "I change the subject. Family stuff is too loaded", style: "avoider" as StyleKey },
    { text: "I tell them what I think is right and why", style: "challenger" as StyleKey },
    { text: "I break down the options and suggest we weigh pros and cons", style: "solver" as StyleKey },
    { text: "I go with their preference to keep the peace, even if I disagree", style: "pleaser" as StyleKey },
  ]},
  { scenario: "Someone keeps crossing a boundary you've hinted at but never stated clearly.", answers: [
    { text: "I finally say it directly but gently: 'I need to be clear about something'", style: "peacekeeper" as StyleKey },
    { text: "I hint harder and hope they figure it out", style: "avoider" as StyleKey },
    { text: "I draw the line firmly: 'This needs to stop. Here's why.'", style: "challenger" as StyleKey },
    { text: "I write down exactly what I want to say and rehearse it", style: "solver" as StyleKey },
    { text: "I keep letting it slide because I'm afraid they'll think I'm difficult", style: "pleaser" as StyleKey },
  ]},
  { scenario: "You're in a group project and one person isn't pulling their weight.", answers: [
    { text: "I check in with them privately \u2014 maybe something's going on", style: "peacekeeper" as StyleKey },
    { text: "I just do their part myself. Easier than confronting them", style: "avoider" as StyleKey },
    { text: "I call it out to the group. Everyone should contribute equally", style: "challenger" as StyleKey },
    { text: "I redistribute tasks so everyone's strengths are better matched", style: "solver" as StyleKey },
    { text: "I pick up the slack and don't mention it, even though I'm exhausted", style: "pleaser" as StyleKey },
  ]},
  { scenario: "You realize you were wrong in an argument with someone you care about.", answers: [
    { text: "I apologize and ask how we can move forward together", style: "peacekeeper" as StyleKey },
    { text: "I feel terrible but can't bring myself to reopen it", style: "avoider" as StyleKey },
    { text: "I own it directly: 'I was wrong. Here's what I should have said.'", style: "challenger" as StyleKey },
    { text: "I analyze what went wrong and come back with a better approach", style: "solver" as StyleKey },
    { text: "I over-apologize and worry they're still upset for days", style: "pleaser" as StyleKey },
  ]},
];

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<StyleKey, number>>({ peacekeeper: 0, avoider: 0, challenger: 0, solver: 0, pleaser: 0 });
  const [result, setResult] = useState<StyleKey | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);

  const pickAnswer = (idx: number, style: StyleKey) => {
    if (animating) return;
    setSelectedAnswer(idx);
    setAnimating(true);
    const ns = { ...scores, [style]: scores[style] + 1 };
    setScores(ns);
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) { setCurrentQ(currentQ + 1); setSelectedAnswer(null); }
      else { setResult(Object.entries(ns).sort((a, b) => b[1] - a[1])[0][0] as StyleKey); }
      setAnimating(false);
    }, 600);
  };

  const shareText = result ? `I'm "${STYLES[result].name}" \u2014 ${STYLES[result].tagline}\n\nTake the free conflict style quiz:\nhttps://debate-coach-seven.vercel.app/quiz` : "";
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: `I'm ${STYLES[result!].name}`, text: shareText, url: "https://debate-coach-seven.vercel.app/quiz" }); } catch {} }
    else { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  const restart = () => { setStarted(false); setCurrentQ(0); setScores({ peacekeeper: 0, avoider: 0, challenger: 0, solver: 0, pleaser: 0 }); setResult(null); setSelectedAnswer(null); };

  // LANDING
  if (!started) return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ animation: "fadeUp 0.8s ease-out" }}>
          
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>FORTE presents</div>
          <h1 style={{ fontSize: "clamp(32px, 7vw, 48px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.5px" }}>What's Your<br />Conflict Style?</h1>
          <p style={{ color: "#52796f", fontSize: "16px", lineHeight: 1.8, margin: "0 0 40px" }}>7 real scenarios. No right answers.<br />Discover how you handle tension {"\u2014"} and what it costs you.</p>
          <button onClick={() => setStarted(true)} style={{ padding: "18px 48px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#40916c"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(45,106,79,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#2d6a4f"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>Take the Quiz {"\u2192"}</button>
          <p style={{ color: "#52796f", fontSize: "12px", marginTop: "24px", fontFamily: "-apple-system, sans-serif" }}>Takes 2 minutes {"\u00b7"} Free {"\u00b7"} Shareable</p>
          <div style={{ marginTop: "16px" }}>
            <a href="/social" style={{ color: "#52796f", fontSize: "14px", fontFamily: "-apple-system, sans-serif", textDecoration: "underline", textUnderlineOffset: "3px" }}>Skip for now</a>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse2{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}`}</style>
    </div>
  );

  // RESULT
  if (result) {
    const st = STYLES[result];
    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ background: "linear-gradient(145deg, #0f2418, #1a3a28)", borderRadius: "24px", padding: "40px 28px", marginBottom: "32px", border: `1.5px solid ${st.color}33`, animation: "resultPop 0.6s cubic-bezier(0.34,1.56,0.64,1)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: `${st.color}08` }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", marginBottom: "20px", fontFamily: "-apple-system, sans-serif" }}>Your conflict style is</div>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>{st.emoji}</div>
              <h2 style={{ fontSize: "32px", fontWeight: "400", color: "#e8f0ec", margin: "0 0 8px", letterSpacing: "-0.5px" }}>{st.name}</h2>
              <p style={{ fontSize: "16px", color: st.color, fontStyle: "italic", margin: "0 0 24px", lineHeight: 1.6 }}>"{st.tagline}"</p>
              <p style={{ fontSize: "14px", color: "#b7c9be", lineHeight: 1.8, margin: "0 0 24px" }}>{st.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "#0a1a1233", borderRadius: "12px", padding: "14px", border: "1px solid #2d6a4f22" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", fontFamily: "-apple-system, sans-serif" }}>Your Strength</div>
                  <div style={{ fontSize: "13px", color: "#b7c9be", lineHeight: 1.6, fontFamily: "-apple-system, sans-serif" }}>{st.strength}</div>
                </div>
                <div style={{ background: "#0a1a1233", borderRadius: "12px", padding: "14px", border: "1px solid #2d6a4f22" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#c9184a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", fontFamily: "-apple-system, sans-serif" }}>Growth Edge</div>
                  <div style={{ fontSize: "13px", color: "#b7c9be", lineHeight: 1.6, fontFamily: "-apple-system, sans-serif" }}>{st.growth}</div>
                </div>
              </div>
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "#52796f", fontFamily: "-apple-system, sans-serif", letterSpacing: "0.15em" }}>FORTE {"\u00b7"} debate-coach-seven.vercel.app</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <button onClick={handleShare} style={{ flex: 1, padding: "14px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>{copied ? "Copied!" : "Share My Result"}</button>
            <button onClick={restart} style={{ padding: "14px 20px", background: "transparent", color: "#52796f", border: "1.5px solid #d8e8e0", borderRadius: "12px", fontSize: "14px", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>Retake</button>
          </div>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "28px 24px", border: "1.5px solid #d8e8e0", textAlign: "center" }}>
            <div style={{ fontSize: "20px", marginBottom: "12px" }}>{"\ud83d\udcaa"}</div>
            <h3 style={{ fontSize: "18px", fontWeight: "400", color: "#1a2e1a", margin: "0 0 8px" }}>Practice Your Growth Edge</h3>
            <p style={{ fontSize: "13px", color: "#84a98c", lineHeight: 1.7, margin: "0 0 20px", fontFamily: "-apple-system, sans-serif" }}>FORTE lets you practice real conversations with AI that reacts to HOW you say it. Build confidence before the moment arrives.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {st.scenarios.map((s: string, i: number) => (
                <div key={i} style={{ fontSize: "13px", color: "#52796f", fontFamily: "-apple-system, sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: st.color }}>{"\u2192"}</span> {s}
                </div>
              ))}
            </div>
            <a href="/social" style={{ display: "block", padding: "16px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", textDecoration: "none", textAlign: "center" }}>Try FORTE Free {"\u2192"}</a>
          </div>
          <div style={{ marginTop: "24px", padding: "20px 0" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#52796f", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Your Full Breakdown</div>
            {Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([key, val]) => {
              const s = STYLES[key as StyleKey]; const pct = Math.round((val / QUESTIONS.length) * 100);
              return (<div key={key} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ fontSize: "13px", color: key === result ? "#1a2e1a" : "#84a98c", fontFamily: "-apple-system, sans-serif", fontWeight: key === result ? "700" : "400" }}>{s.emoji} {s.name}</div>
                  <div style={{ fontSize: "12px", color: "#52796f", fontFamily: "-apple-system, sans-serif" }}>{pct}%</div>
                </div>
                <div style={{ height: "6px", background: "#e0ebe4", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: key === result ? s.color : "#2d6a4f44", borderRadius: "3px", transition: "width 1s ease-out" }} />
                </div>
              </div>);
            })}
          </div>
        </div>
        <style>{`@keyframes resultPop{from{opacity:0;transform:scale(0.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
      </div>
    );
  }

  // QUESTIONS
  const q = QUESTIONS[currentQ];
  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <div style={{ flex: 1, height: "3px", background: "#e0ebe4", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`, background: "#2d6a4f", borderRadius: "2px", transition: "width 0.5s ease-out" }} />
          </div>
          <div style={{ fontSize: "12px", color: "#52796f", fontFamily: "-apple-system, sans-serif" }}>{currentQ + 1} / {QUESTIONS.length}</div>
        </div>
        <div key={currentQ} style={{ animation: "slideIn 0.4s ease-out" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", color: "#52796f", textTransform: "uppercase", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Scenario</div>
          <h2 style={{ fontSize: "clamp(20px, 5vw, 26px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 36px", lineHeight: 1.5 }}>{q.scenario}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {q.answers.map((a, i) => (
              <button key={i} onClick={() => pickAnswer(i, a.style)} disabled={animating}
                style={{ width: "100%", padding: "18px 20px", background: selectedAnswer === i ? "#2d6a4f" : "#fff", border: `1.5px solid ${selectedAnswer === i ? "#2d6a4f" : "#d8e8e0"}`, borderRadius: "14px", color: selectedAnswer === i ? "#fff" : "#1a2e1a", fontSize: "14px", textAlign: "left", cursor: animating ? "default" : "pointer", fontFamily: "-apple-system, sans-serif", lineHeight: 1.6, transition: "all 0.25s", transform: selectedAnswer === i ? "scale(1.02)" : "none" }}
                onMouseEnter={e => { if (!animating && selectedAnswer !== i) { e.currentTarget.style.borderColor = "#2d6a4f"; e.currentTarget.style.background = "#f0f5f0"; } }}
                onMouseLeave={e => { if (!animating && selectedAnswer !== i) { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.background = "#fff"; } }}>
                {a.text}
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}
