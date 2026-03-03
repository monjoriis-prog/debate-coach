"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type StyleKey = "peacekeeper" | "avoider" | "challenger" | "solver" | "pleaser";

const STYLES: Record<StyleKey, any> = {
  peacekeeper: {
    name: "The Peacekeeper", emoji: "\ud83d\udd4a\ufe0f", color: "#2d6a4f",
    tagline: "You\u2019d rather find common ground than fight for yours.",
    description: "You\u2019re the person everyone trusts to stay calm in chaos. You naturally mediate, de-escalate, and find solutions that work for everyone. Your superpower is making people feel heard. Your blind spot? You sometimes compromise on things that actually matter to you \u2014 and people close to you may not know what you really want.",
    strength: "You make people feel safe enough to be honest.",
    growth: "Practice saying \u2018I hear you, AND here\u2019s what I need\u2019 \u2014 not just the first half.",
    scenarios: ["Setting boundaries with someone you love", "Asking for what you need without apologizing"]
  },
  avoider: {
    name: "The Avoider", emoji: "\ud83e\udee5", color: "#6c757d",
    tagline: "If I don\u2019t bring it up, maybe it\u2019ll go away.",
    description: "You hate confrontation \u2014 not because you\u2019re weak, but because you feel everything deeply. You\u2019re incredibly perceptive and often know exactly what\u2019s wrong \u2014 you just don\u2019t say it. What you don\u2019t address doesn\u2019t disappear. It builds.",
    strength: "You read rooms better than anyone.",
    growth: "The conversation you\u2019re avoiding is usually the one that would change everything.",
    scenarios: ["Having the conversation you\u2019ve been putting off", "Saying no without guilt"]
  },
  challenger: {
    name: "The Challenger", emoji: "\u26a1", color: "#c9184a",
    tagline: "You say what everyone else is thinking.",
    description: "You\u2019re direct, honest, and you don\u2019t back down. People respect you for it \u2014 and sometimes fear you for it. Your superpower is cutting through noise. Your blind spot? Your delivery sometimes lands harder than you intend.",
    strength: "You have the courage to say what needs to be said.",
    growth: "Practice pausing before responding. Your message is right \u2014 your timing and tone could use softening.",
    scenarios: ["Giving honest feedback without being harsh", "Apologizing when your directness hurt someone"]
  },
  solver: {
    name: "The Problem-Solver", emoji: "\ud83e\udde9", color: "#1b4332",
    tagline: "Every disagreement is a puzzle with a solution.",
    description: "You approach disagreements like an engineer \u2014 calm, logical, looking for the fix. People love this about you at work. In personal relationships? Sometimes people don\u2019t want a solution \u2014 they want to feel understood first.",
    strength: "You turn chaos into clarity.",
    growth: "Before solving, try saying \u2018that sounds really hard\u2019 and stopping there.",
    scenarios: ["Supporting someone who just needs to vent", "Navigating emotional conversations with logic AND empathy"]
  },
  pleaser: {
    name: "The People-Pleaser", emoji: "\ud83e\udea9", color: "#7c5cbf",
    tagline: "You\u2019d set yourself on fire to keep someone else warm.",
    description: "You\u2019re generous, empathetic, and deeply attuned to what others need. You adjust yourself to make everyone comfortable. The cost? You lose track of your own needs. Resentment builds quietly.",
    strength: "You make everyone around you feel valued and seen.",
    growth: "Your needs aren\u2019t a burden. Practice voicing them before they become resentment.",
    scenarios: ["Telling someone what you actually want", "Letting someone be disappointed in you"]
  },
};

const COMPAT: Record<string, { dynamic: string; strength: string; watchFor: string; practice: string }> = {
  "peacekeeper+peacekeeper": { dynamic: "Two Peacekeepers create a warm, harmonious space \u2014 but nobody advocates for themselves. You both sense what the other needs, yet neither says what THEY need.", strength: "Deep mutual empathy and almost effortless harmony.", watchFor: "Important things go unsaid because you\u2019re both waiting for the other to bring it up.", practice: "Take turns going first: \u2018Here\u2019s something I haven\u2019t said yet.\u2019" },
  "peacekeeper+avoider": { dynamic: "You both value peace \u2014 but in different ways. The Peacekeeper smooths things over; the Avoider pretends nothing happened. The surface stays calm while things pile up underneath.", strength: "Neither of you escalates. You give each other a lot of grace.", watchFor: "You can go months without addressing something real. That\u2019s not peace \u2014 it\u2019s avoidance with good manners.", practice: "Schedule a monthly check-in: \u2018What\u2019s one thing we haven\u2019t talked about?\u2019" },
  "peacekeeper+challenger": { dynamic: "This is one of the most common \u2014 and powerful \u2014 pairings. The Challenger says what needs saying; the Peacekeeper softens how it lands. When it works, you balance each other beautifully.", strength: "You cover each other\u2019s blind spots. One brings honesty, the other brings care.", watchFor: "The Challenger can steamroll the Peacekeeper, who won\u2019t push back until resentment explodes.", practice: "Challengers: ask before you push. Peacekeepers: speak up before you\u2019re full." },
  "peacekeeper+solver": { dynamic: "A natural partnership. The Peacekeeper brings emotional intelligence; the Solver brings structure. Together you can navigate almost anything \u2014 IF you let both strengths lead.", strength: "Empathy meets clarity. You resolve things thoroughly when you\u2019re aligned.", watchFor: "The Solver may rush to fix before the Peacekeeper has fully processed. Slow down.", practice: "Solver goes second. Let feelings land before solutions arrive." },
  "peacekeeper+pleaser": { dynamic: "You\u2019re both generous and attentive to others. The problem? Nobody\u2019s steering. You can spend years being \u2018fine\u2019 while both quietly abandoning your own needs.", strength: "You genuinely care about each other\u2019s comfort and happiness.", watchFor: "Who\u2019s taking care of the person who\u2019s always taking care of everyone else? Both of you need to receive, not just give.", practice: "Ask each other: \u2018What do YOU actually want?\u2019 \u2014 and don\u2019t accept \u2018I don\u2019t mind.\u2019" },
  "avoider+avoider": { dynamic: "Two Avoiders means a LOT of unspoken elephants. You\u2019re both perceptive enough to sense the tension \u2014 and skilled enough to dance around it indefinitely.", strength: "You never blow up. You give each other space and patience.", watchFor: "Unaddressed issues don\u2019t dissolve. They calcify. You might wake up distant and not know why.", practice: "Use a code word for \u2018I need to say something hard.\u2019 Make it safe to break the pattern." },
  "avoider+challenger": { dynamic: "The classic tension pairing. One person chases the conversation; the other runs from it. The Challenger feels stonewalled; the Avoider feels attacked. It\u2019s a loop.", strength: "You actually need each other. The Challenger pulls important things into the open. The Avoider slows things down before they escalate.", watchFor: "The chase-retreat cycle. Challengers: soften your approach. Avoiders: small honesty now prevents big explosions later.", practice: "Avoiders: send a text when speaking feels too hard. Challengers: let the text be enough sometimes." },
  "avoider+solver": { dynamic: "The Solver wants to fix it NOW. The Avoider isn\u2019t ready to even name it yet. This creates a frustrating loop where one pushes solutions and the other withdraws further.", strength: "When timing works, this is powerful. The Solver creates structure; the Avoider brings emotional depth once they feel safe.", watchFor: "The Solver may interpret avoidance as not caring. The Avoider may feel the Solver is cold. Neither is true.", practice: "Solvers: ask \u2018Do you want to talk about this now or later?\u2019 and respect the answer." },
  "avoider+pleaser": { dynamic: "Two people who struggle to say what they need. The Avoider withdraws; the Pleaser over-gives to compensate. Nobody\u2019s needs get met directly.", strength: "Incredible sensitivity to each other. You both notice everything.", watchFor: "Silent resentment on both sides. The Pleaser burns out; the Avoider shuts down.", practice: "Write down one need each week and swap papers. Easier than saying it." },
  "challenger+challenger": { dynamic: "Two Challengers means sparks \u2014 in every sense. Your honesty with each other is rare and beautiful. Your arguments can also be intense and exhausting.", strength: "Nothing festers. You respect each other\u2019s directness. Issues get addressed fast.", watchFor: "Winning matters more than connecting. You can wound each other deeply when you both refuse to back down.", practice: "Before responding, ask: \u2018Am I trying to be right, or trying to be close?\u2019" },
  "challenger+solver": { dynamic: "Both of you are direct, but differently. The Challenger leads with conviction; the Solver leads with logic. You can be an incredible team \u2014 or lock horns over approach.", strength: "You get things done. No one avoids issues, and solutions come fast.", watchFor: "The Challenger may see the Solver as cold. The Solver may see the Challenger as emotional. Both have a point.", practice: "Name the goal before the method. You probably agree on WHAT \u2014 it\u2019s the HOW that clashes." },
  "challenger+pleaser": { dynamic: "The Challenger dominates; the Pleaser accommodates. Short-term this feels easy \u2014 one leads, one follows. Long-term the Pleaser drowns and the Challenger has no idea why.", strength: "The Challenger\u2019s honesty can actually liberate the Pleaser to be more real. The Pleaser\u2019s warmth can soften the Challenger.", watchFor: "The power imbalance. If the Pleaser can\u2019t say \u2018no,\u2019 the relationship isn\u2019t balanced \u2014 it\u2019s managed.", practice: "Challengers: ask what they want, then wait. Pleasers: practice one \u2018no\u2019 a week." },
  "solver+solver": { dynamic: "Two Solvers are efficient and fair. You approach issues like a team solving a problem. Just don\u2019t forget that relationships aren\u2019t problems to solve.", strength: "You rarely get stuck. When something\u2019s off, you analyze it, discuss it, and move forward.", watchFor: "Emotional needs getting filed under \u2018irrational.\u2019 Sometimes people need to feel, not fix.", practice: "Once a week, share something with NO solution attached. Just: \u2018This is how I feel.\u2019" },
  "solver+pleaser": { dynamic: "The Solver fixes; the Pleaser agrees. On the surface this runs smoothly. Underneath, the Pleaser\u2019s real feelings never enter the equation.", strength: "The Solver creates structure the Pleaser finds comforting. The Pleaser creates warmth the Solver needs.", watchFor: "The Solver decides everything because the Pleaser always says yes. That\u2019s not agreement \u2014 it\u2019s surrender.", practice: "Solvers: stop asking yes/no. Ask \u2018What would YOUR ideal look like?\u2019 Pleasers: answer honestly." },
  "pleaser+pleaser": { dynamic: "Two Pleasers create a relationship full of kindness and zero honesty about needs. You\u2019re both silently hoping the other will guess what you want.", strength: "Genuine care for each other. You\u2019re both deeply generous and loving.", watchFor: "Both of you are drowning and smiling. Resentment builds because nobody asks for what they need.", practice: "Take turns completing: \u2018Something I need but haven\u2019t asked for is...\u2019" },
};

const QUESTIONS = [
  { scenario: "Your partner makes a plan without asking you. You\u2019re annoyed.", answers: [
    { text: "Bring it up calmly and suggest checking in next time", style: "peacekeeper" as StyleKey },
    { text: "Don\u2019t say anything. Not worth the fight", style: "avoider" as StyleKey },
    { text: "Tell them straight up \u2014 that wasn\u2019t okay", style: "challenger" as StyleKey },
    { text: "Figure out a system so it doesn\u2019t happen again", style: "solver" as StyleKey },
    { text: "Go along with it so they don\u2019t feel bad", style: "pleaser" as StyleKey },
  ]},
  { scenario: "A friend keeps cancelling last minute. Third time.", answers: [
    { text: "\u2018I value our time \u2014 can we find a day that works?\u2019", style: "peacekeeper" as StyleKey },
    { text: "Stop making plans and quietly pull away", style: "avoider" as StyleKey },
    { text: "Tell them directly \u2014 this isn\u2019t cool", style: "challenger" as StyleKey },
    { text: "Suggest shorter, flexible hangouts", style: "solver" as StyleKey },
    { text: "Say \u2018no worries!\u2019 every time even though it bothers me", style: "pleaser" as StyleKey },
  ]},
  { scenario: "Your boss takes credit for your idea in a meeting.", answers: [
    { text: "Talk to them privately and calmly", style: "peacekeeper" as StyleKey },
    { text: "Let it go. Don\u2019t want it awkward", style: "avoider" as StyleKey },
    { text: "Speak up: \u2018That came from my research\u2019", style: "challenger" as StyleKey },
    { text: "Document contributions more carefully going forward", style: "solver" as StyleKey },
    { text: "Tell myself it\u2019s fine", style: "pleaser" as StyleKey },
  ]},
  { scenario: "You and your sibling disagree about a family situation.", answers: [
    { text: "Listen and find common ground", style: "peacekeeper" as StyleKey },
    { text: "Change the subject", style: "avoider" as StyleKey },
    { text: "Tell them what I think and why", style: "challenger" as StyleKey },
    { text: "Break down options and weigh pros/cons", style: "solver" as StyleKey },
    { text: "Go with their preference to keep peace", style: "pleaser" as StyleKey },
  ]},
  { scenario: "Someone keeps crossing a boundary you\u2019ve only hinted at.", answers: [
    { text: "Say it gently: \u2018I need to be clear about something\u2019", style: "peacekeeper" as StyleKey },
    { text: "Hint harder and hope they get it", style: "avoider" as StyleKey },
    { text: "Draw the line firmly: \u2018This needs to stop\u2019", style: "challenger" as StyleKey },
    { text: "Write down what to say and rehearse it", style: "solver" as StyleKey },
    { text: "Let it slide \u2014 afraid they\u2019ll think I\u2019m difficult", style: "pleaser" as StyleKey },
  ]},
  { scenario: "One person in your group project isn\u2019t contributing.", answers: [
    { text: "Check in privately \u2014 maybe something\u2019s going on", style: "peacekeeper" as StyleKey },
    { text: "Do their part myself. Easier than confronting them", style: "avoider" as StyleKey },
    { text: "Call it out. Everyone should contribute equally", style: "challenger" as StyleKey },
    { text: "Redistribute tasks so strengths match better", style: "solver" as StyleKey },
    { text: "Pick up the slack and don\u2019t mention it", style: "pleaser" as StyleKey },
  ]},
  { scenario: "You realize you were wrong in an argument with someone you love.", answers: [
    { text: "Apologize and ask how we can move forward together", style: "peacekeeper" as StyleKey },
    { text: "Feel terrible but can\u2019t bring myself to reopen it", style: "avoider" as StyleKey },
    { text: "\u2018I was wrong. Here\u2019s what I should have said.\u2019", style: "challenger" as StyleKey },
    { text: "Analyze what went wrong and come back with a better approach", style: "solver" as StyleKey },
    { text: "Over-apologize and worry they\u2019re still upset for days", style: "pleaser" as StyleKey },
  ]},
];

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCompat(a: string, b: string) {
  const key1 = `${a}+${b}`;
  const key2 = `${b}+${a}`;
  return COMPAT[key1] || COMPAT[key2] || { dynamic: "An interesting combination.", strength: "You bring different perspectives.", watchFor: "Different styles can create friction.", practice: "Practice curiosity about each other\u2019s approach." };
}

function QuizInner() {
  const searchParams = useSearchParams();
  const [started, setStarted] = useState(false);
  const shuffledQs = useMemo(() => {
    const seed = Date.now();
    return QUESTIONS.map((q, i) => ({ ...q, answers: shuffle(q.answers, seed + i * 7) }));
  }, []);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<StyleKey, number>>({ peacekeeper: 0, avoider: 0, challenger: 0, solver: 0, pleaser: 0 });
  const [result, setResult] = useState<StyleKey | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState("");
  const [compareCopied, setCompareCopied] = useState(false);

  // Compare mode state
  const [compareMode, setCompareMode] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerStyle, setPartnerStyle] = useState<StyleKey | null>(null);

  useEffect(() => {
    const pName = searchParams.get("from");
    const pStyle = searchParams.get("s") as StyleKey | null;
    if (pName && pStyle && STYLES[pStyle]) {
      setCompareMode(true);
      setPartnerName(decodeURIComponent(pName));
      setPartnerStyle(pStyle);
    }
  }, [searchParams]);

  const pickAnswer = (idx: number, style: StyleKey) => {
    if (animating) return;
    setSelectedAnswer(idx);
    setAnimating(true);
    const ns = { ...scores, [style]: scores[style] + 1 };
    setScores(ns);
    setTimeout(() => {
      if (currentQ < shuffledQs.length - 1) { setCurrentQ(currentQ + 1); setSelectedAnswer(null); }
      else { setResult(Object.entries(ns).sort((a, b) => b[1] - a[1])[0][0] as StyleKey); }
      setAnimating(false);
    }, 600);
  };

  const shareText = result ? `I'm "${STYLES[result].name}" \u2014 ${STYLES[result].tagline}\n\nWhat's your communication style?\nhttps://debate-coach-seven.vercel.app/quiz` : "";
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: `I'm ${STYLES[result!].name}`, text: shareText, url: "https://debate-coach-seven.vercel.app/quiz" }); } catch {} }
    else { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  const handleCompareShare = async () => {
    const link = `https://debate-coach-seven.vercel.app/quiz?from=${encodeURIComponent(userName)}&s=${result}`;
    const txt = `I just took a communication style quiz and I\u2019m "${STYLES[result!].name}." Now I want to see how we compare \u2014 take it and we\u2019ll get our compatibility:\n\n${link}`;
    if (navigator.share) { try { await navigator.share({ title: "Compare communication styles", text: txt, url: link }); } catch {} }
    else { navigator.clipboard.writeText(txt); setCompareCopied(true); setTimeout(() => setCompareCopied(false), 2000); }
  };
  const restart = () => { setStarted(false); setCurrentQ(0); setScores({ peacekeeper: 0, avoider: 0, challenger: 0, solver: 0, pleaser: 0 }); setResult(null); setSelectedAnswer(null); setShowNameInput(false); setUserName(""); };

  // ====== LANDING ======
  if (!started) return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ animation: "fadeUp 0.8s ease-out" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>FORTE</div>
          {compareMode && partnerStyle ? (
            <>
              <div style={{ background: "linear-gradient(145deg, #1a3a28, #2d4a3a)", borderRadius: "20px", padding: "28px 24px", marginBottom: "32px", border: `1.5px solid ${STYLES[partnerStyle].color}33` }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>{STYLES[partnerStyle].emoji}</div>
                <div style={{ fontSize: "14px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginBottom: "4px" }}>{partnerName} is</div>
                <div style={{ fontSize: "22px", color: "#e8f0ec", fontWeight: "400" }}>{STYLES[partnerStyle].name}</div>
                <div style={{ fontSize: "13px", color: STYLES[partnerStyle].color, fontStyle: "italic", marginTop: "8px" }}>"{STYLES[partnerStyle].tagline}"</div>
              </div>
              <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 16px", lineHeight: 1.3 }}>Now it{"\u2019"}s your turn.</h1>
              <p style={{ color: "#52796f", fontSize: "15px", lineHeight: 1.8, margin: "0 0 32px" }}>Take the same quiz and see how your<br />communication styles compare.</p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: "clamp(32px, 7vw, 48px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.5px" }}>What{"\u2019"}s Your<br />Communication Style?</h1>
              <p style={{ color: "#52796f", fontSize: "16px", lineHeight: 1.8, margin: "0 0 40px" }}>7 real scenarios. No wrong answers.<br />Discover how you handle tension {"\u2014"} and what it costs you.</p>
            </>
          )}
          <button onClick={() => setStarted(true)} style={{ padding: "18px 48px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#40916c"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#2d6a4f"; e.currentTarget.style.transform = "none"; }}>{compareMode ? "Take the Quiz" : "Take the Quiz \u2192"}</button>
          {!compareMode && (
            <>
              <p style={{ color: "#84a98c", fontSize: "12px", marginTop: "24px", fontFamily: "-apple-system, sans-serif" }}>Takes 2 minutes {"\u00b7"} Free {"\u00b7"} Shareable</p>
              <div style={{ marginTop: "16px" }}>
                <a href="/social" style={{ color: "#52796f", fontSize: "14px", fontFamily: "-apple-system, sans-serif", textDecoration: "underline", textUnderlineOffset: "3px" }}>Skip for now</a>
              </div>
              <div style={{ marginTop: "32px", padding: "16px 20px", background: "#fff", borderRadius: "12px", border: "1.5px solid #d8e8e0", display: "inline-block" }}>
                <a href="/quiz/partner" style={{ color: "#1a2e1a", fontSize: "14px", fontFamily: "-apple-system, sans-serif", textDecoration: "none", fontWeight: "600" }}>{"\u2764\ufe0f"} Take the Partner Style Quiz instead</a>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );

  // ====== COMPARE RESULT ======
  if (result && compareMode && partnerStyle) {
    const mySt = STYLES[result];
    const theirSt = STYLES[partnerStyle];
    const compat = getCompat(result, partnerStyle);
    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px", animation: "fadeUp 0.6s ease-out" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Your compatibility</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "36px" }}>{theirSt.emoji}</div>
                <div style={{ fontSize: "12px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginTop: "4px" }}>{partnerName}</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: theirSt.color, fontFamily: "-apple-system, sans-serif" }}>{theirSt.name.replace("The ", "")}</div>
              </div>
              <div style={{ fontSize: "24px", color: "#d8e8e0" }}>{"\u00d7"}</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "36px" }}>{mySt.emoji}</div>
                <div style={{ fontSize: "12px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginTop: "4px" }}>You</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: mySt.color, fontFamily: "-apple-system, sans-serif" }}>{mySt.name.replace("The ", "")}</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: "20px", padding: "28px 24px", border: "1.5px solid #d8e8e0", marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>Your Dynamic</div>
            <p style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.8, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{compat.dynamic}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1.5px solid #d8e8e0" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>{"\u2714"} Your Strength Together</div>
              <p style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.6, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{compat.strength}</p>
            </div>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1.5px solid #d8e8e0" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", color: "#c9184a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>{"\u26a0"} Watch For</div>
              <p style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.6, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{compat.watchFor}</p>
            </div>
          </div>

          <div style={{ background: "linear-gradient(145deg, #1a3a28, #2d4a3a)", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>{"\ud83c\udfaf"} Practice Together</div>
            <p style={{ fontSize: "14px", color: "#e8f0ec", lineHeight: 1.7, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{compat.practice}</p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <button onClick={handleShare} style={{ flex: 1, padding: "14px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>{copied ? "Copied!" : "Share Results"}</button>
            <button onClick={restart} style={{ padding: "14px 20px", background: "transparent", color: "#52796f", border: "1.5px solid #d8e8e0", borderRadius: "12px", fontSize: "14px", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>Retake</button>
          </div>

          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #d8e8e0", textAlign: "center" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#1a2e1a", margin: "0 0 8px", fontFamily: "-apple-system, sans-serif" }}>Practice these conversations</h3>
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>FORTE lets you rehearse real conversations with AI that reacts to HOW you say it.</p>
            <a href="/social" style={{ display: "block", padding: "16px", background: "#2d6a4f", color: "#fff", borderRadius: "12px", fontSize: "15px", fontWeight: "600", textDecoration: "none", textAlign: "center", fontFamily: "-apple-system, sans-serif" }}>Try FORTE Free {"\u2192"}</a>
          </div>
        </div>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    );
  }

  // ====== SOLO RESULT ======
  if (result) {
    const st = STYLES[result];
    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ background: "linear-gradient(145deg, #1a3a28, #2d4a3a)", borderRadius: "24px", padding: "40px 28px", marginBottom: "24px", border: `1.5px solid ${st.color}33`, animation: "resultPop 0.6s cubic-bezier(0.34,1.56,0.64,1)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: `${st.color}08` }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", marginBottom: "20px", fontFamily: "-apple-system, sans-serif" }}>Your communication style is</div>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>{st.emoji}</div>
              <h2 style={{ fontSize: "32px", fontWeight: "400", color: "#e8f0ec", margin: "0 0 8px", letterSpacing: "-0.5px" }}>{st.name}</h2>
              <p style={{ fontSize: "16px", color: st.color, fontStyle: "italic", margin: "0 0 24px", lineHeight: 1.6 }}>"{st.tagline}"</p>
              <p style={{ fontSize: "14px", color: "#b7c9be", lineHeight: 1.8, margin: "0 0 24px" }}>{st.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "#0a1a1218", borderRadius: "12px", padding: "14px", border: "1px solid #2d6a4f22" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", fontFamily: "-apple-system, sans-serif" }}>Your Strength</div>
                  <div style={{ fontSize: "13px", color: "#b7c9be", lineHeight: 1.6, fontFamily: "-apple-system, sans-serif" }}>{st.strength}</div>
                </div>
                <div style={{ background: "#0a1a1218", borderRadius: "12px", padding: "14px", border: "1px solid #2d6a4f22" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#c9184a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", fontFamily: "-apple-system, sans-serif" }}>Growth Edge</div>
                  <div style={{ fontSize: "13px", color: "#b7c9be", lineHeight: 1.6, fontFamily: "-apple-system, sans-serif" }}>{st.growth}</div>
                </div>
              </div>
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "#52796f", fontFamily: "-apple-system, sans-serif", letterSpacing: "0.15em" }}>FORTE {"\u00b7"} debate-coach-seven.vercel.app</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <button onClick={handleShare} style={{ flex: 1, padding: "14px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>{copied ? "Copied!" : "Share My Result"}</button>
            <button onClick={restart} style={{ padding: "14px 20px", background: "transparent", color: "#52796f", border: "1.5px solid #d8e8e0", borderRadius: "12px", fontSize: "14px", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>Retake</button>
          </div>

          {!showNameInput ? (
            <button onClick={() => setShowNameInput(true)} style={{ width: "100%", padding: "18px", background: "#fff", border: "1.5px solid #d8e8e0", borderRadius: "14px", fontSize: "15px", fontWeight: "600", color: "#1a2e1a", cursor: "pointer", fontFamily: "-apple-system, sans-serif", marginBottom: "16px", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2d6a4f"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.transform = "none"; }}>
              Compare With Someone {"\u2192"}
            </button>
          ) : (
            <div style={{ background: "#fff", borderRadius: "14px", padding: "20px", border: "1.5px solid #2d6a4f", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a2e1a", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>Enter your first name</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text" placeholder="Your name" value={userName}
                  onChange={e => setUserName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && userName.trim()) handleCompareShare(); }}
                  style={{ flex: 1, padding: "12px 16px", border: "1.5px solid #d8e8e0", borderRadius: "10px", fontSize: "14px", fontFamily: "-apple-system, sans-serif", outline: "none" }}
                  autoFocus
                />
                <button onClick={handleCompareShare} disabled={!userName.trim()} style={{ padding: "12px 20px", background: userName.trim() ? "#2d6a4f" : "#d8e8e0", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: userName.trim() ? "pointer" : "default", fontFamily: "-apple-system, sans-serif" }}>
                  {compareCopied ? "Copied!" : "Send"}
                </button>
              </div>
              <div style={{ fontSize: "12px", color: "#84a98c", marginTop: "8px", fontFamily: "-apple-system, sans-serif" }}>They{"\u2019"}ll take the quiz and you{"\u2019"}ll both see your compatibility.</div>
            </div>
          )}

          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #d8e8e0", textAlign: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#1a2e1a", margin: "0 0 8px", fontFamily: "-apple-system, sans-serif" }}>Practice Your Growth Edge</h3>
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>FORTE lets you practice real conversations with AI that reacts to HOW you say it.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {st.scenarios.map((s: string, i: number) => (
                <div key={i} style={{ fontSize: "13px", color: "#52796f", fontFamily: "-apple-system, sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: st.color }}>{"\u2192"}</span> {s}
                </div>
              ))}
            </div>
            <a href="/social" style={{ display: "block", padding: "16px", background: "#2d6a4f", color: "#fff", borderRadius: "12px", fontSize: "15px", fontWeight: "600", textDecoration: "none", textAlign: "center", fontFamily: "-apple-system, sans-serif" }}>Try FORTE Free {"\u2192"}</a>
          </div>

          <div style={{ padding: "20px 0" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Your Full Breakdown</div>
            {Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([key, val]) => {
              const s = STYLES[key as StyleKey]; const pct = Math.round((val / shuffledQs.length) * 100);
              return (<div key={key} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ fontSize: "13px", color: key === result ? "#1a2e1a" : "#84a98c", fontFamily: "-apple-system, sans-serif", fontWeight: key === result ? "700" : "400" }}>{s.emoji} {s.name}</div>
                  <div style={{ fontSize: "12px", color: "#84a98c", fontFamily: "-apple-system, sans-serif" }}>{pct}%</div>
                </div>
                <div style={{ height: "6px", background: "#e0ebe4", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: key === result ? s.color : "#2d6a4f44", borderRadius: "3px", transition: "width 1s ease-out" }} />
                </div>
              </div>);
            })}
          </div>
        </div>
        <style>{`@keyframes resultPop{from{opacity:0;transform:scale(0.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div style={{ textAlign: "center", paddingBottom: "24px" }}>
          <a href="/quiz/partner" style={{ color: "#84a98c", fontSize: "13px", fontFamily: "-apple-system, sans-serif", textDecoration: "underline", textUnderlineOffset: "3px" }}>Take the Partner Style Quiz too</a>
        </div>
      </div>
    );
  }

  // ====== QUESTIONS ======
  const q = shuffledQs[currentQ];
  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <div style={{ flex: 1, height: "3px", background: "#e0ebe4", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((currentQ + 1) / shuffledQs.length) * 100}%`, background: "#2d6a4f", borderRadius: "2px", transition: "width 0.5s ease-out" }} />
          </div>
          <div style={{ fontSize: "12px", color: "#52796f", fontFamily: "-apple-system, sans-serif" }}>{currentQ + 1} / {shuffledQs.length}</div>
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

export default function QuizPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8faf8" }} />}>
      <QuizInner />
    </Suspense>
  );
}
