"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type StyleKey = "protector" | "freeSpirit" | "nurturer" | "spark" | "anchor";

const STYLES: Record<StyleKey, any> = {
  protector: {
    name: "The Protector", emoji: "\ud83d\udee1\ufe0f", color: "#2d6a4f",
    tagline: "You love by making sure they never have to worry.",
    description: "You show love through action \u2014 fixing things, planning ahead, stepping up when life gets hard. Your partner always feels safe with you. Your blind spot? You sometimes take over when they need partnership, not rescue. And you forget to let yourself be taken care of too.",
    strength: "Your partner never doubts that you\u2019ll show up when it matters.",
    growth: "Ask \u2018Do you want me to help or just listen?\u2019 before jumping in.",
    scenarios: ["Letting your partner handle something without stepping in", "Asking for help when YOU need it"]
  },
  freeSpirit: {
    name: "The Free Spirit", emoji: "\ud83e\udee7", color: "#7c5cbf",
    tagline: "You love deeply \u2014 but you need room to breathe.",
    description: "You value growth, independence, and authenticity in love. You\u2019re drawn to partners who have their own thing going on. Your blind spot? What feels like healthy independence to you can feel like distance to someone who needs more closeness. You\u2019re not cold \u2014 you just recharge alone.",
    strength: "You keep the relationship from becoming codependent. You inspire growth.",
    growth: "Sometimes \u2018I need space\u2019 lands as \u2018I don\u2019t need you.\u2019 Name the difference.",
    scenarios: ["Saying \u2018I need alone time\u2019 without it feeling like rejection", "Being fully present when your partner needs closeness"]
  },
  nurturer: {
    name: "The Nurturer", emoji: "\ud83e\ude77", color: "#c9184a",
    tagline: "You love by making people feel like they matter.",
    description: "You\u2019re the partner who remembers the small things, checks in after a hard day, and makes people feel truly seen. Love for you is emotional attentiveness. Your blind spot? You give so much that you can lose yourself. And you sometimes expect your partner to read your needs the way you read theirs.",
    strength: "Your partner always feels emotionally held and valued.",
    growth: "Say what you need out loud. Your partner can\u2019t match your intuition \u2014 that\u2019s not a failure of love.",
    scenarios: ["Asking for care instead of waiting to be noticed", "Setting limits on how much you give"]
  },
  spark: {
    name: "The Spark", emoji: "\ud83d\udd25", color: "#e07a2f",
    tagline: "You keep love from ever getting boring.",
    description: "You bring energy, spontaneity, and passion. You plan surprises, shake up routines, and keep the relationship alive. Your blind spot? You can mistake comfort for complacency. Not every quiet night means something\u2019s wrong. The partner who craves stability might feel exhausted trying to keep up.",
    strength: "Your partner never takes the relationship for granted. You keep the spark alive.",
    growth: "Practice being still together. Boredom isn\u2019t a threat \u2014 it\u2019s sometimes just peace.",
    scenarios: ["Enjoying a quiet night without creating excitement", "Letting your partner set the pace sometimes"]
  },
  anchor: {
    name: "The Anchor", emoji: "\u2693", color: "#1b4332",
    tagline: "You love by being the person who never wavers.",
    description: "You\u2019re steady, dependable, and consistent. Your partner always knows where they stand with you. You show love through reliability \u2014 showing up, following through, being the calm in every storm. Your blind spot? Stability can become rigidity. You might resist change or avoid hard conversations to keep the peace.",
    strength: "Your partner feels grounded and secure. You\u2019re the foundation everything else is built on.",
    growth: "Stability doesn\u2019t mean avoiding discomfort. Sometimes love requires shaking things up.",
    scenarios: ["Initiating a hard conversation you\u2019ve been avoiding", "Being spontaneous when your partner needs it"]
  },
};

const COMPAT: Record<string, { dynamic: string; strength: string; watchFor: string; practice: string }> = {
  "protector+protector": { dynamic: "Two Protectors create a fortress \u2014 but nobody\u2019s inside it being vulnerable. You\u2019re both so busy shielding each other that real intimacy gets locked out.", strength: "Unshakable loyalty. You\u2019d go to war for each other.", watchFor: "Competing over who takes care of whom. Neither of you asks for help.", practice: "Take turns being the \u2018weak\u2019 one. Vulnerability isn\u2019t a crack in the armor \u2014 it\u2019s the door." },
  "protector+freeSpirit": { dynamic: "The Protector wants to hold close; the Free Spirit needs room to roam. This can feel like chasing and retreating \u2014 or it can become beautiful if you find the rhythm.", strength: "The Protector offers safety the Free Spirit didn\u2019t know they needed. The Free Spirit shows the Protector that love doesn\u2019t require control.", watchFor: "Protector: \u2018pulling away\u2019 isn\u2019t rejection. Free Spirit: \u2018holding close\u2019 isn\u2019t control. Name what you need.", practice: "Free Spirit tells the Protector: \u2018I\u2019m not leaving, I just need an hour.\u2019 That one sentence changes everything." },
  "protector+nurturer": { dynamic: "A deeply caring pairing. The Protector handles the world; the Nurturer handles the heart. When it works, it\u2019s one of the strongest bonds possible.", strength: "You both lead with love. Different expressions, same devotion.", watchFor: "You can both burn out from over-giving. Who\u2019s refueling whom?", practice: "Schedule a night where NEITHER of you is taking care of the other. Just be." },
  "protector+spark": { dynamic: "The Protector builds the structure; the Spark lights it up. You balance safety and excitement \u2014 but you can clash over pace and risk.", strength: "Together you create a life that\u2019s both secure and exciting.", watchFor: "Protector sees risk everywhere; Spark sees adventure. Neither is wrong.", practice: "Protector: say yes to one spontaneous thing a month. Spark: appreciate when they plan ahead for you." },
  "protector+anchor": { dynamic: "Two pillars of stability. You create an incredibly secure home \u2014 but where\u2019s the play? Where\u2019s the mess? Where\u2019s the passion?", strength: "Rock-solid reliability. Your partnership can weather anything.", watchFor: "Too much structure, not enough spark. Comfort becomes autopilot.", practice: "Do one thing each month that surprises the other. Break the pattern on purpose." },
  "freeSpirit+freeSpirit": { dynamic: "You give each other infinite space \u2014 sometimes so much that the relationship floats away. You\u2019re two kites with no string.", strength: "No codependency. Deep respect for individuality. Intellectual and personal freedom.", watchFor: "Who\u2019s tending the relationship? Freedom without intention becomes drift.", practice: "Create one non-negotiable ritual \u2014 weekly dinner, morning coffee, Sunday walk. An anchor point you both choose." },
  "freeSpirit+nurturer": { dynamic: "The Nurturer gives and gives. The Free Spirit takes the space without realizing the cost. This pairing needs the most communication to survive.", strength: "The Nurturer\u2019s warmth draws the Free Spirit closer than they expected. The Free Spirit teaches the Nurturer that space isn\u2019t abandonment.", watchFor: "Nurturer: you\u2019ll over-give and resent the silence. Free Spirit: check in before they have to chase you.", practice: "Free Spirit initiates contact FIRST sometimes. It costs you nothing and means everything to them." },
  "freeSpirit+spark": { dynamic: "Adventure meets independence. You\u2019re the couple everyone envies from the outside \u2014 spontaneous, exciting, free. But who\u2019s building the foundation?", strength: "Life is never boring. You push each other to grow and explore.", watchFor: "All spark, no roots. When things get hard, neither of you may want to stay and do the work.", practice: "When something is wrong, sit with it instead of planning the next trip. The boring conversation IS the adventure." },
  "freeSpirit+anchor": { dynamic: "The Anchor wants routine; the Free Spirit wants possibility. This is a classic tension \u2014 but when it works, you give each other exactly what you lack.", strength: "The Anchor gives roots; the Free Spirit gives wings. Together you\u2019re whole.", watchFor: "Anchor: don\u2019t mistake their need for space as flakiness. Free Spirit: don\u2019t mistake their routine as boring.", practice: "Build a life with flexible structure \u2014 some things stay consistent, some things stay open." },
  "nurturer+nurturer": { dynamic: "Two Nurturers create the warmest relationship imaginable. You both feel deeply cared for \u2014 until you both burn out from giving without asking.", strength: "Emotional depth and attentiveness that most couples never reach.", watchFor: "You\u2019re both waiting for the other to say what they need. Say it first.", practice: "Each week, complete the sentence: \u2018Something I need right now is...\u2019 No deflecting." },
  "nurturer+spark": { dynamic: "The Nurturer creates emotional depth; the Spark keeps it exciting. When aligned, this is romantic love at its best \u2014 intimate AND alive.", strength: "You balance feeling and fun. The Nurturer grounds the Spark; the Spark energizes the Nurturer.", watchFor: "Spark: slow down to receive the care being offered. Nurturer: join the adventure sometimes instead of worrying.", practice: "Spark plans something intimate (not exciting). Nurturer tries something spontaneous (not planned)." },
  "nurturer+anchor": { dynamic: "Deeply stable and emotionally rich. The Anchor provides safety; the Nurturer fills it with warmth. This is the pairing most likely to build a lasting home.", strength: "Consistency meets care. You create a relationship people feel safe around.", watchFor: "Comfort can become complacency. You\u2019re so good at peace that you might avoid growth.", practice: "Once a month, have a \u2018state of us\u2019 conversation. Not because something\u2019s wrong \u2014 because you\u2019re growing." },
  "spark+spark": { dynamic: "Fireworks. All the time. You\u2019re electric together \u2014 the highs are intoxicating. But who\u2019s there for the lows? Two Sparks can burn bright and burn out.", strength: "Unmatched passion and energy. You make each other feel alive.", watchFor: "When the excitement fades, do you still choose each other? Passion isn\u2019t the same as partnership.", practice: "Practice being boring together. Cook dinner. Watch something slow. If that feels hard, that\u2019s the work." },
  "spark+anchor": { dynamic: "The Spark wants to shake things up; the Anchor wants to keep things steady. This creates a healthy tension IF you respect each other\u2019s nature.", strength: "The Anchor\u2019s steadiness makes the Spark feel safe to be wild. The Spark\u2019s energy keeps the Anchor from stagnating.", watchFor: "Spark: their \u2018no\u2019 isn\u2019t rejection. Anchor: their \u2018let\u2019s go\u2019 isn\u2019t chaos.", practice: "Alternate who plans the weekend. One picks comfort, one picks adventure. Both say yes." },
  "anchor+anchor": { dynamic: "The most stable pairing possible. You build a life that\u2019s predictable, secure, and deeply reliable. But stable can become stagnant without intention.", strength: "Absolute trust. You know exactly what you\u2019re getting, and that\u2019s a gift.", watchFor: "When was the last time you surprised each other? Growth requires discomfort.", practice: "Say one honest thing you\u2019ve been holding back. Stability should make honesty safer, not unnecessary." },
};

const QUESTIONS = [
  { scenario: "Your partner had a terrible day at work. They walk in the door looking defeated.", answers: [
    { text: "Already researching solutions before they finish talking", style: "protector" as StyleKey },
    { text: "Give them space to decompress alone first", style: "freeSpirit" as StyleKey },
    { text: "Sit next to them, hold their hand, ask what happened", style: "nurturer" as StyleKey },
    { text: "Suggest ditching plans and doing something fun to reset", style: "spark" as StyleKey },
    { text: "Make dinner, keep things calm, let them come to you", style: "anchor" as StyleKey },
  ]},
  { scenario: "You\u2019re planning your anniversary. What matters most to you?", answers: [
    { text: "Making sure everything is handled so they don\u2019t have to think", style: "protector" as StyleKey },
    { text: "Something meaningful but low-pressure \u2014 no forced romance", style: "freeSpirit" as StyleKey },
    { text: "A heartfelt letter or gift that shows I really see them", style: "nurturer" as StyleKey },
    { text: "A surprise they\u2019d never expect \u2014 something unforgettable", style: "spark" as StyleKey },
    { text: "Revisiting the place or tradition that\u2019s become \u2018ours\u2019", style: "anchor" as StyleKey },
  ]},
  { scenario: "Your partner wants to make a big life change \u2014 new career, new city, something risky.", answers: [
    { text: "Start mapping out how to make it work safely", style: "protector" as StyleKey },
    { text: "Excited \u2014 growth is what keeps a relationship alive", style: "freeSpirit" as StyleKey },
    { text: "Ask how they\u2019re feeling about it emotionally, not just logistically", style: "nurturer" as StyleKey },
    { text: "Jump in with them \u2014 why not? Life\u2019s short", style: "spark" as StyleKey },
    { text: "Need time to process \u2014 want to make sure it won\u2019t destabilize what we\u2019ve built", style: "anchor" as StyleKey },
  ]},
  { scenario: "Things have felt routine lately. The relationship isn\u2019t bad, just\u2026 flat.", answers: [
    { text: "Plan something to fix it \u2014 a trip, a date, a reset", style: "protector" as StyleKey },
    { text: "Focus on my own growth \u2014 when I\u2019m fulfilled, the relationship improves", style: "freeSpirit" as StyleKey },
    { text: "Write them a note about what I love about us and what I miss", style: "nurturer" as StyleKey },
    { text: "Shake everything up \u2014 try something new, break the pattern", style: "spark" as StyleKey },
    { text: "Trust that seasons are normal \u2014 not every week needs to be a highlight reel", style: "anchor" as StyleKey },
  ]},
  { scenario: "Your partner says \u2018I don\u2019t feel like you really see me.\u2019", answers: [
    { text: "Think about what I\u2019ve been missing and make changes immediately", style: "protector" as StyleKey },
    { text: "Ask what they need \u2014 I can\u2019t guess, and that\u2019s okay", style: "freeSpirit" as StyleKey },
    { text: "Feel it deeply \u2014 sit with them and ask them to tell me more", style: "nurturer" as StyleKey },
    { text: "Plan something that shows I know them \u2014 actions over words", style: "spark" as StyleKey },
    { text: "Reflect honestly on whether I\u2019ve been on autopilot", style: "anchor" as StyleKey },
  ]},
  { scenario: "You disagree about something important \u2014 finances, family, future plans.", answers: [
    { text: "Take the lead and find a solution that protects both of us", style: "protector" as StyleKey },
    { text: "Need time alone to think before I can talk about it clearly", style: "freeSpirit" as StyleKey },
    { text: "Focus on understanding their feelings before pushing my view", style: "nurturer" as StyleKey },
    { text: "Hash it out right now \u2014 tension just gets worse when you wait", style: "spark" as StyleKey },
    { text: "Look for the compromise that keeps things stable and fair", style: "anchor" as StyleKey },
  ]},
  { scenario: "Your partner does something small but thoughtful \u2014 remembers your coffee order, leaves a note, handles a chore you hate.", answers: [
    { text: "Think: that\u2019s MY job \u2014 but also feel quietly loved", style: "protector" as StyleKey },
    { text: "Appreciate it but don\u2019t need it \u2014 love isn\u2019t about small gestures for me", style: "freeSpirit" as StyleKey },
    { text: "Melt. This is exactly how love should feel. Return it tenfold", style: "nurturer" as StyleKey },
    { text: "Love it \u2014 and immediately plan something to one-up them", style: "spark" as StyleKey },
    { text: "Notice it, feel grateful, and remember it for a long time", style: "anchor" as StyleKey },
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
  return COMPAT[key1] || COMPAT[key2] || { dynamic: "An interesting combination.", strength: "You bring different things to the table.", watchFor: "Different styles need different communication.", practice: "Practice curiosity about how your partner loves." };
}

function QuizInner() {
  const searchParams = useSearchParams();
  const [started, setStarted] = useState(false);
  const shuffledQs = useMemo(() => {
    const seed = Date.now();
    return QUESTIONS.map((q, i) => ({ ...q, answers: shuffle(q.answers, seed + i * 7) }));
  }, []);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<StyleKey, number>>({ protector: 0, freeSpirit: 0, nurturer: 0, spark: 0, anchor: 0 });
  const [result, setResult] = useState<StyleKey | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState("");
  const [compareCopied, setCompareCopied] = useState(false);
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

  const shareText = result ? `In love, I'm "${STYLES[result].name}" \u2014 ${STYLES[result].tagline}\n\nWhat kind of partner are you?\nhttps://debate-coach-seven.vercel.app/quiz/partner` : "";
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: `I'm ${STYLES[result!].name}`, text: shareText }); } catch {} }
    else { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  const handleCompareShare = async () => {
    const link = `https://debate-coach-seven.vercel.app/quiz/partner?from=${encodeURIComponent(userName)}&s=${result}`;
    const txt = `I just took a partner style quiz and I\u2019m "${STYLES[result!].name}." Take it and see how we match:\n\n${link}`;
    if (navigator.share) { try { await navigator.share({ title: "Compare partner styles", text: txt, url: link }); } catch {} }
    else { navigator.clipboard.writeText(txt); setCompareCopied(true); setTimeout(() => setCompareCopied(false), 2000); }
  };
  const restart = () => { setStarted(false); setCurrentQ(0); setScores({ protector: 0, freeSpirit: 0, nurturer: 0, spark: 0, anchor: 0 }); setResult(null); setSelectedAnswer(null); setShowNameInput(false); setUserName(""); };

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
              <p style={{ color: "#52796f", fontSize: "15px", lineHeight: 1.8, margin: "0 0 32px" }}>Take the same quiz and see how your<br />partner styles compare.</p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: "clamp(32px, 7vw, 48px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.5px" }}>What Kind of<br />Partner Are You?</h1>
              <p style={{ color: "#52796f", fontSize: "16px", lineHeight: 1.8, margin: "0 0 40px" }}>7 real relationship moments. No right answers.<br />Discover how you love {"\u2014"} and what your partner needs to know.</p>
            </>
          )}
          <button onClick={() => setStarted(true)} style={{ padding: "18px 48px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#40916c"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#2d6a4f"; e.currentTarget.style.transform = "none"; }}>{compareMode ? "Take the Quiz" : "Take the Quiz \u2192"}</button>
          {!compareMode && (
            <p style={{ color: "#84a98c", fontSize: "12px", marginTop: "24px", fontFamily: "-apple-system, sans-serif" }}>Takes 2 minutes {"\u00b7"} Free {"\u00b7"} Send to your partner</p>
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
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Your Love Compatibility</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "36px" }}>{theirSt.emoji}</div>
                <div style={{ fontSize: "12px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginTop: "4px" }}>{partnerName}</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: theirSt.color, fontFamily: "-apple-system, sans-serif" }}>{theirSt.name.replace("The ", "")}</div>
              </div>
              <div style={{ fontSize: "24px", color: "#c9184a" }}>{"\u2764\ufe0f"}</div>
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
              <div style={{ fontSize: "10px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>{"\u2714"} Together You Have</div>
              <p style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.6, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{compat.strength}</p>
            </div>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1.5px solid #d8e8e0" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", color: "#c9184a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>{"\u26a0"} Watch For</div>
              <p style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.6, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{compat.watchFor}</p>
            </div>
          </div>

          <div style={{ background: "linear-gradient(145deg, #1a3a28, #2d4a3a)", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>{"\ud83c\udfaf"} Try This Together</div>
            <p style={{ fontSize: "14px", color: "#e8f0ec", lineHeight: 1.7, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{compat.practice}</p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <button onClick={handleShare} style={{ flex: 1, padding: "14px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>{copied ? "Copied!" : "Share Results"}</button>
            <button onClick={restart} style={{ padding: "14px 20px", background: "transparent", color: "#52796f", border: "1.5px solid #d8e8e0", borderRadius: "12px", fontSize: "14px", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>Retake</button>
          </div>

          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #d8e8e0", textAlign: "center" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#1a2e1a", margin: "0 0 8px", fontFamily: "-apple-system, sans-serif" }}>Practice these conversations</h3>
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>FORTE lets you rehearse real relationship conversations with AI that reacts to how you say it.</p>
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
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", marginBottom: "20px", fontFamily: "-apple-system, sans-serif" }}>In love, you are</div>
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
              Send to Your Partner {"\u2192"}
            </button>
          ) : (
            <div style={{ background: "#fff", borderRadius: "14px", padding: "20px", border: "1.5px solid #2d6a4f", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a2e1a", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>Enter your first name</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <input type="text" placeholder="Your name" value={userName} onChange={e => setUserName(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && userName.trim()) handleCompareShare(); }}
                  style={{ flex: 1, padding: "12px 16px", border: "1.5px solid #d8e8e0", borderRadius: "10px", fontSize: "14px", fontFamily: "-apple-system, sans-serif", outline: "none" }} autoFocus />
                <button onClick={handleCompareShare} disabled={!userName.trim()} style={{ padding: "12px 20px", background: userName.trim() ? "#2d6a4f" : "#d8e8e0", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: userName.trim() ? "pointer" : "default", fontFamily: "-apple-system, sans-serif" }}>
                  {compareCopied ? "Copied!" : "Send"}
                </button>
              </div>
              <div style={{ fontSize: "12px", color: "#84a98c", marginTop: "8px", fontFamily: "-apple-system, sans-serif" }}>They{"\u2019"}ll take the quiz and you{"\u2019"}ll both see your compatibility.</div>
            </div>
          )}

          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #d8e8e0", textAlign: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#1a2e1a", margin: "0 0 8px", fontFamily: "-apple-system, sans-serif" }}>Practice Your Growth Edge</h3>
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>FORTE lets you practice real relationship conversations with AI coaching.</p>
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

          <div style={{ textAlign: "center", paddingBottom: "24px" }}>
            <a href="/quiz" style={{ color: "#84a98c", fontSize: "13px", fontFamily: "-apple-system, sans-serif", textDecoration: "underline", textUnderlineOffset: "3px" }}>Take the Communication Style Quiz too</a>
          </div>
        </div>
        <style>{`@keyframes resultPop{from{opacity:0;transform:scale(0.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
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

export default function PartnerQuizPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8faf8" }} />}>
      <QuizInner />
    </Suspense>
  );
}
