"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Dimension = "conflict" | "intimacy" | "communication" | "independence" | "support" | "growth" | "trust";

const DIMENSIONS: Record<Dimension, { name: string; emoji: string; color: string }> = {
  conflict: { name: "Conflict Style", emoji: "\u26a1", color: "#c9184a" },
  intimacy: { name: "Intimacy & Closeness", emoji: "\ud83d\udd25", color: "#e07a2f" },
  communication: { name: "Communication", emoji: "\ud83d\udde3\ufe0f", color: "#2d6a4f" },
  independence: { name: "Independence", emoji: "\ud83e\udee7", color: "#7c5cbf" },
  support: { name: "Emotional Support", emoji: "\ud83e\ude77", color: "#1b4332" },
  growth: { name: "Growth & Change", emoji: "\ud83c\udf31", color: "#40916c" },
  trust: { name: "Trust & Security", emoji: "\ud83d\udee1\ufe0f", color: "#52796f" },
};

const QUESTIONS: { question: string; dimension: Dimension; optionA: string; optionB: string; labelA: string; labelB: string; insightMatch: string; insightClash: string }[] = [
  {
    question: "When we disagree about something important, I usually want to\u2026",
    dimension: "conflict",
    optionA: "Talk it through right now, even if it gets heated",
    optionB: "Take space first and come back to it when we're both calm",
    labelA: "Address immediately",
    labelB: "Process first",
    insightMatch: "You're aligned on timing. Whether you both want to talk it out now or take space first, being on the same page about WHEN to engage means less resentment and fewer blow-ups.",
    insightClash: "One of you needs to talk NOW and the other needs space FIRST. Neither is wrong \u2014 but without awareness, the pursuer feels abandoned and the spacer feels attacked. The fix: the spacer gives a time ('I need 30 minutes, then I'm coming back') and the pursuer trusts the return.",
  },
  {
    question: "When it comes to quality time, I feel most connected when\u2026",
    dimension: "intimacy",
    optionA: "We're doing something together \u2014 an experience, an adventure, something active",
    optionB: "We're just being together \u2014 couch, quiet, no agenda, just us",
    labelA: "Shared experiences",
    labelB: "Quiet presence",
    insightMatch: "You both recharge the same way. This is a huge advantage \u2014 you'll naturally plan time together that actually fills both of you up instead of draining one to fill the other.",
    insightClash: "One of you needs adventure to feel alive and the other needs stillness to feel close. Neither is wrong. The key: alternate. One weekend is theirs, the next is yours. And both of you show up fully for the other's version of connection.",
  },
  {
    question: "When something is bothering me, I tend to\u2026",
    dimension: "communication",
    optionA: "Say it directly, even if it's uncomfortable",
    optionB: "Wait for the right moment and hint at it first",
    labelA: "Direct communicator",
    labelB: "Gradual communicator",
    insightMatch: "You speak the same language. Whether you're both direct or both gradual, you understand each other's style intuitively. Less guessing, less frustration.",
    insightClash: "One of you says it straight and the other hints. The direct one may miss the hints entirely ('why didn't you just tell me?'). The gradual one may feel bulldozed by the directness ('you didn't even ease into it'). The bridge: direct communicators learn to soften the opening. Gradual communicators practice saying it sooner.",
  },
  {
    question: "When it comes to alone time vs. together time, I need\u2026",
    dimension: "independence",
    optionA: "More together time \u2014 being with my partner is how I recharge",
    optionB: "More alone time \u2014 I need space to come back to the relationship energized",
    labelA: "Togetherness-oriented",
    labelB: "Independence-oriented",
    insightMatch: "Your attachment needs are similar. This means less anxiety about whether the other person wants 'too much' or 'too little.' You naturally give each other what you both need.",
    insightClash: "This is one of the most common relationship tensions. One person's need for closeness feels like clinginess to the other. One person's need for space feels like rejection to the other. The truth: BOTH needs are valid. Name them. Schedule both. 'Tuesday is our night, Thursday is mine.' Structure creates safety.",
  },
  {
    question: "When my partner is going through a hard time, my instinct is to\u2026",
    dimension: "support",
    optionA: "Fix it \u2014 problem-solve, research, take action, make it better",
    optionB: "Feel it \u2014 listen, hold space, be present, let them process",
    labelA: "Action-oriented support",
    labelB: "Presence-oriented support",
    insightMatch: "You support each other the same way you want to be supported. This is rare and powerful \u2014 you intuitively give what the other needs without having to translate.",
    insightClash: "One of you shows love by solving and the other by sitting. The solver feels useless 'just listening.' The listener feels unheard when they get a solution instead of empathy. The magic phrase: 'Do you want me to help fix this, or just hear you right now?' Ask every time.",
  },
  {
    question: "When it comes to personal growth and change, I believe\u2026",
    dimension: "growth",
    optionA: "We should push each other to grow \u2014 comfort zones aren't where magic happens",
    optionB: "We should accept each other as we are \u2014 love means not trying to change someone",
    labelA: "Growth-focused",
    labelB: "Acceptance-focused",
    insightMatch: "You agree on what love looks like in practice. Whether you both push for growth or both prioritize acceptance, you won't feel like the other person is trying to fix you or hold you back.",
    insightClash: "The growth-focused one sees potential everywhere and pushes their partner toward it. The acceptance-focused one feels like they're never enough as they are. Both are expressions of love \u2014 one says 'I believe you can be more,' the other says 'you're already enough.' The bridge: push with permission, accept with honesty.",
  },
  {
    question: "When trust feels shaky \u2014 after a mistake, a lie, or a rough patch \u2014 I need\u2026",
    dimension: "trust",
    optionA: "Transparency and proof \u2014 show me through actions that things are different now",
    optionB: "Time and space \u2014 don't hover, just be consistent and let trust rebuild naturally",
    labelA: "Needs visible proof",
    labelB: "Needs patient consistency",
    insightMatch: "You rebuild trust the same way. This means neither of you will feel smothered or abandoned during repair \u2014 you'll naturally give what the other needs.",
    insightClash: "One needs to SEE the change (transparency, check-ins, openness) and the other needs to FEEL it over time (consistency, patience, no pressure). If the proof-seeker pushes too hard, the patience-seeker feels controlled. If the patience-seeker goes quiet, the proof-seeker panics. The fix: agree on specific, small acts of transparency with a timeline for reducing them.",
  },
];

function encode(answers: number[]): string {
  return answers.map(a => a.toString()).join("");
}

function decode(s: string): number[] {
  return s.split("").map(Number).filter(n => n === 0 || n === 1);
}

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

function CompatInner() {
  const searchParams = useSearchParams();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);
  const [userName, setUserName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Partner data from URL
  const [partnerName, setPartnerName] = useState("");
  const [partnerAnswers, setPartnerAnswers] = useState<number[] | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  const shuffledQs = useMemo(() => {
    const seed = compareMode ? 42 : Date.now(); // Fixed seed for compare mode so questions match
    return shuffle([...QUESTIONS.map((q, i) => ({ ...q, origIndex: i }))], seed);
  }, [compareMode]);

  useEffect(() => {
    const pName = searchParams.get("from");
    const pAnswers = searchParams.get("a");
    if (pName && pAnswers) {
      const decoded = decode(pAnswers);
      if (decoded.length === 7) {
        setCompareMode(true);
        setPartnerName(decodeURIComponent(pName));
        setPartnerAnswers(decoded);
      }
    }
  }, [searchParams]);

  const pickAnswer = (choice: number) => {
    if (animating) return;
    setSelectedAnswer(choice);
    setAnimating(true);
    const q = shuffledQs[currentQ];
    const newAnswers = [...answers];
    newAnswers[q.origIndex] = choice;
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentQ < shuffledQs.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
      } else {
        setDone(true);
      }
      setAnimating(false);
    }, 500);
  };

  const handleShare = async () => {
    const link = `https://debate-coach-seven.vercel.app/quiz/compatibility?from=${encodeURIComponent(userName)}&a=${encode(answers)}`;
    const txt = `I just took a relationship compatibility quiz on FORTE. Now I want to see how we compare \u2014 take it and we'll get our results together:\n\n${link}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Compatibility Quiz", text: txt, url: link }); } catch {}
    } else {
      navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const restart = () => {
    setStarted(false); setCurrentQ(0); setAnswers([]); setSelectedAnswer(null); setDone(false); setNameSubmitted(false); setUserName("");
  };

  // ====== LANDING ======
  if (!started) return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ animation: "fadeUp 0.8s ease-out" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>FORTE</div>
          {compareMode && partnerName ? (
            <>
              <div style={{ background: "linear-gradient(145deg, #1a3a28, #2d4a3a)", borderRadius: "20px", padding: "28px 24px", marginBottom: "32px" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>{"\ud83d\udd17"}</div>
                <div style={{ fontSize: "14px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginBottom: "4px" }}>{partnerName} took the quiz</div>
                <div style={{ fontSize: "20px", color: "#e8f0ec", fontWeight: "400" }}>Now it{"\u2019"}s your turn</div>
                <div style={{ fontSize: "13px", color: "#52796f", fontStyle: "italic", marginTop: "8px" }}>Answer the same 7 questions and see your compatibility</div>
              </div>
              <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 16px", lineHeight: 1.3 }}>How Compatible<br />Are You Really?</h1>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: "clamp(32px, 7vw, 44px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.5px" }}>How Compatible<br />Are You Really?</h1>
              <p style={{ color: "#52796f", fontSize: "16px", lineHeight: 1.8, margin: "0 0 40px" }}>7 questions about how you experience your relationship.<br />Send it to your partner. See where you align {"\u2014"} and where the work is.</p>
            </>
          )}
          <button onClick={() => setStarted(true)} style={{ padding: "18px 48px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#40916c"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#2d6a4f"; e.currentTarget.style.transform = "none"; }}>Take the Quiz {"\u2192"}</button>
          {!compareMode && (
            <p style={{ color: "#84a98c", fontSize: "12px", marginTop: "24px", fontFamily: "-apple-system, sans-serif" }}>Takes 2 minutes {"\u00b7"} Free {"\u00b7"} Send to your partner</p>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );

  // ====== COMPARE RESULTS ======
  if (done && compareMode && partnerAnswers) {
    const matches: Dimension[] = [];
    const clashes: Dimension[] = [];
    QUESTIONS.forEach((q, i) => {
      if (answers[i] === partnerAnswers[i]) matches.push(q.dimension);
      else clashes.push(q.dimension);
    });
    const score = Math.round((matches.length / 7) * 100);

    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px", animation: "fadeUp 0.6s ease-out" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Your Compatibility</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px" }}>{"\ud83d\udc64"}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif" }}>{partnerName}</div>
              </div>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: score >= 70 ? "linear-gradient(145deg, #2d6a4f, #40916c)" : score >= 40 ? "linear-gradient(145deg, #e07a2f, #f0a050)" : "linear-gradient(145deg, #c9184a, #e06080)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#fff", fontFamily: "-apple-system, sans-serif" }}>{score}%</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px" }}>{"\ud83d\udc64"}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif" }}>You</div>
              </div>
            </div>
            <p style={{ fontSize: "14px", color: "#52796f", fontFamily: "-apple-system, sans-serif", lineHeight: 1.6 }}>
              {score >= 70 ? "Strong alignment. You naturally understand each other\u2019s needs in most areas. The places you differ are where the real growth happens." : score >= 40 ? "A mix of alignment and friction. This is actually normal \u2014 and the differences are where the most important conversations live." : "Significant differences in how you experience the relationship. This isn\u2019t bad \u2014 it means you need more conversation, not less. The gap is the map."}
            </p>
          </div>

          {matches.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>{"\u2714"} Where You Align</div>
              {matches.map(dim => {
                const d = DIMENSIONS[dim];
                const q = QUESTIONS.find(q => q.dimension === dim)!;
                return (
                  <div key={dim} style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1.5px solid #d8e8e0", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "18px" }}>{d.emoji}</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: d.color, fontFamily: "-apple-system, sans-serif" }}>{d.name}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.7, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{q.insightMatch}</p>
                  </div>
                );
              })}
            </div>
          )}

          {clashes.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#c9184a", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>{"\u26a0"} Where to Focus</div>
              {clashes.map(dim => {
                const d = DIMENSIONS[dim];
                const q = QUESTIONS.find(q => q.dimension === dim)!;
                return (
                  <div key={dim} style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1.5px solid #f0d8dc", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "18px" }}>{d.emoji}</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: d.color, fontFamily: "-apple-system, sans-serif" }}>{d.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                      <div style={{ flex: 1, padding: "8px 12px", background: "#f8faf8", borderRadius: "8px", fontSize: "12px", color: "#52796f", fontFamily: "-apple-system, sans-serif" }}>{partnerName}: {partnerAnswers[QUESTIONS.indexOf(q)] === 0 ? q.labelA : q.labelB}</div>
                      <div style={{ flex: 1, padding: "8px 12px", background: "#f8faf8", borderRadius: "8px", fontSize: "12px", color: "#52796f", fontFamily: "-apple-system, sans-serif" }}>You: {answers[QUESTIONS.indexOf(q)] === 0 ? q.labelA : q.labelB}</div>
                    </div>
                    <p style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.7, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{q.insightClash}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ background: "linear-gradient(145deg, #1a3a28, #2d4a3a)", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>{"\ud83c\udfaf"} What This Means</div>
            <p style={{ fontSize: "14px", color: "#e8f0ec", lineHeight: 1.8, margin: 0, fontFamily: "-apple-system, sans-serif" }}>
              {score === 100 ? "Perfect alignment is rare \u2014 and it doesn\u2019t mean there\u2019s no work to do. It means you have a strong foundation. The growth comes from going deeper, not bridging gaps."
              : clashes.length <= 2 ? `Your friction points are in ${clashes.map(c => DIMENSIONS[c].name.toLowerCase()).join(" and ")}. These aren\u2019t problems \u2014 they\u2019re conversations waiting to happen. Have them before they become patterns.`
              : "Multiple areas of difference means your relationship needs active communication to thrive. The good news: you now have a map. Every friction point above is a conversation starter, not a death sentence."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ flex: 1, padding: "14px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>{copied ? "Copied!" : "Share Results"}</button>
            <button onClick={restart} style={{ padding: "14px 20px", background: "transparent", color: "#52796f", border: "1.5px solid #d8e8e0", borderRadius: "12px", fontSize: "14px", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>Retake</button>
          </div>

          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #d8e8e0", textAlign: "center" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#1a2e1a", margin: "0 0 8px", fontFamily: "-apple-system, sans-serif" }}>Practice These Conversations</h3>
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>FORTE has real scenarios for every friction point above. Practice them together with AI that reacts to HOW you say it.</p>
            <a href="/social" style={{ display: "block", padding: "16px", background: "#2d6a4f", color: "#fff", borderRadius: "12px", fontSize: "15px", fontWeight: "600", textDecoration: "none", textAlign: "center", fontFamily: "-apple-system, sans-serif" }}>Try FORTE Free {"\u2192"}</a>
          </div>
        </div>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    );
  }

  // ====== SOLO RESULT — send to partner ======
  if (done && !compareMode) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ animation: "fadeUp 0.6s ease-out" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>{"\u2705"}</div>
            <h2 style={{ fontSize: "28px", fontWeight: "400", color: "#1a2e1a", margin: "0 0 12px" }}>Your answers are locked in</h2>
            <p style={{ color: "#52796f", fontSize: "15px", lineHeight: 1.8, margin: "0 0 36px", fontFamily: "-apple-system, sans-serif" }}>Now send it to your partner. When they take it,<br />you{"\u2019"}ll both see where you align and where the work is.</p>

            {!nameSubmitted ? (
              <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #2d6a4f", marginBottom: "24px", textAlign: "left" }}>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#1a2e1a", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>Enter your first name</div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="text" placeholder="Your name" value={userName} onChange={e => setUserName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && userName.trim()) setNameSubmitted(true); }}
                    style={{ flex: 1, padding: "14px 16px", border: "1.5px solid #d8e8e0", borderRadius: "10px", fontSize: "15px", fontFamily: "-apple-system, sans-serif", outline: "none" }}
                    autoFocus />
                  <button onClick={() => { if (userName.trim()) setNameSubmitted(true); }} disabled={!userName.trim()}
                    style={{ padding: "14px 24px", background: userName.trim() ? "#2d6a4f" : "#d8e8e0", color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: userName.trim() ? "pointer" : "default", fontFamily: "-apple-system, sans-serif" }}>Next</button>
                </div>
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #2d6a4f", marginBottom: "24px" }}>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#1a2e1a", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Send this to your partner</div>
                <button onClick={handleShare} style={{ width: "100%", padding: "18px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.25s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#40916c"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#2d6a4f"; }}>
                  {copied ? "Link Copied!" : "Send Compatibility Link \u2192"}
                </button>
                <p style={{ fontSize: "12px", color: "#84a98c", marginTop: "12px", fontFamily: "-apple-system, sans-serif" }}>They{"\u2019"}ll answer the same 7 questions. Then you{"\u2019"}ll both see the results.</p>
              </div>
            )}

            <div style={{ marginTop: "16px" }}>
              <a href="/quiz" style={{ color: "#84a98c", fontSize: "13px", fontFamily: "-apple-system, sans-serif", textDecoration: "underline", textUnderlineOffset: "3px", marginRight: "16px" }}>Communication Quiz</a>
              <a href="/quiz/partner" style={{ color: "#84a98c", fontSize: "13px", fontFamily: "-apple-system, sans-serif", textDecoration: "underline", textUnderlineOffset: "3px" }}>Partner Style Quiz</a>
            </div>
          </div>
        </div>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontSize: "20px" }}>{DIMENSIONS[q.dimension].emoji}</span>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", color: DIMENSIONS[q.dimension].color, textTransform: "uppercase", fontFamily: "-apple-system, sans-serif" }}>{DIMENSIONS[q.dimension].name}</span>
          </div>
          <h2 style={{ fontSize: "clamp(20px, 5vw, 26px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 36px", lineHeight: 1.5 }}>{q.question}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[q.optionA, q.optionB].map((opt, i) => (
              <button key={i} onClick={() => pickAnswer(i)} disabled={animating}
                style={{ width: "100%", padding: "20px 24px", background: selectedAnswer === i ? "#2d6a4f" : "#fff", border: `1.5px solid ${selectedAnswer === i ? "#2d6a4f" : "#d8e8e0"}`, borderRadius: "14px", color: selectedAnswer === i ? "#fff" : "#1a2e1a", fontSize: "15px", textAlign: "left", cursor: animating ? "default" : "pointer", fontFamily: "-apple-system, sans-serif", lineHeight: 1.6, transition: "all 0.25s", transform: selectedAnswer === i ? "scale(1.02)" : "none" }}
                onMouseEnter={e => { if (!animating && selectedAnswer !== i) { e.currentTarget.style.borderColor = "#2d6a4f"; e.currentTarget.style.background = "#f0f5f0"; } }}
                onMouseLeave={e => { if (!animating && selectedAnswer !== i) { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.background = "#fff"; } }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}

export default function CompatibilityQuizPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8faf8" }} />}>
      <CompatInner />
    </Suspense>
  );
}
