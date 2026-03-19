"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Scenario = {
  situation: string;
  isRedFlag: boolean;
  explanation: string;
  category: string;
};

const SCENARIOS: Scenario[] = [
  {
    situation: "Two weeks into dating, they say \"I\u2019ve never felt this way about anyone before. I think you\u2019re the one.\"",
    isRedFlag: true,
    explanation: "Love bombing. Real love grows over time. Someone who\u2019s certain you\u2019re \u2018the one\u2019 before knowing your middle name isn\u2019t falling in love with you \u2014 they\u2019re falling in love with an idea of you.",
    category: "Love bombing",
  },
  {
    situation: "After a disagreement, your partner says \"I need 30 minutes to cool down, then I want to come back and talk about this.\"",
    isRedFlag: false,
    explanation: "This is healthy self-regulation. They\u2019re managing their nervous system AND committing to return. A red flag would be walking out with no explanation or timeline.",
    category: "Healthy boundary",
  },
  {
    situation: "They get upset when you want to spend Saturday with your friends instead of them. \"I just miss you so much when you\u2019re not here.\"",
    isRedFlag: true,
    explanation: "Isolation disguised as devotion. A healthy partner wants you to have a full life. Someone who guilts you for seeing friends is building a cage, not a relationship.",
    category: "Isolation",
  },
  {
    situation: "Your partner has a close best friend of the gender they\u2019re attracted to. They\u2019ve been friends since college.",
    isRedFlag: false,
    explanation: "Not a red flag. Long-standing friendships across genders are normal and healthy. Demanding someone drop a friend because of their gender is the actual red flag.",
    category: "Healthy friendship",
  },
  {
    situation: "Every argument somehow ends with YOU apologizing \u2014 even when you\u2019re the one who brought up the issue.",
    isRedFlag: true,
    explanation: "DARVO: Deny, Attack, Reverse Victim and Offender. If you consistently end up apologizing for having concerns, you\u2019re being trained to stop speaking up.",
    category: "Manipulation",
  },
  {
    situation: "They don\u2019t post you on their social media even though you\u2019ve been dating for months.",
    isRedFlag: false,
    explanation: "Not automatically a red flag. Many people keep relationships private. The red flag would be if they hide you from specific people, deny the relationship, or get angry when YOU post about them.",
    category: "Privacy preference",
  },
  {
    situation: "They want to know your location at all times. They say it\u2019s \"just for safety\" and they share theirs too.",
    isRedFlag: true,
    explanation: "Surveillance framed as care. Sharing locations can be healthy IF both people choose it freely. But if it\u2019s expected, enforced, or used to check up on you \u2014 that\u2019s control, not safety.",
    category: "Controlling behavior",
  },
  {
    situation: "Your partner cries when receiving critical feedback and needs time to process before discussing it.",
    isRedFlag: false,
    explanation: "Emotional reactions to feedback are human. The key question is: do they eventually engage with the feedback? Crying isn\u2019t manipulation \u2014 unless it consistently prevents the conversation from ever happening.",
    category: "Emotional processing",
  },
  {
    situation: "Every single one of their exes is \"crazy.\" They\u2019ve never had a relationship end on good terms.",
    isRedFlag: true,
    explanation: "If everyone in their past is the villain, guess who the common denominator is. People with zero accountability for past relationships will have zero accountability in yours.",
    category: "No accountability",
  },
  {
    situation: "After a big fight, they send a long, heartfelt message owning their part and asking what they can do differently. They follow through on what they promised.",
    isRedFlag: false,
    explanation: "This is repair done right. Ownership + specific follow-through is the gold standard. The key words: they FOLLOWED THROUGH. Words without action would be different.",
    category: "Healthy repair",
  },
  {
    situation: "They go through your phone while you\u2019re in the shower, then claim they \"just had a feeling\" something was off.",
    isRedFlag: true,
    explanation: "Violation of privacy. \u2018Having a feeling\u2019 doesn\u2019t justify surveillance. If they have concerns, they should voice them directly \u2014 not investigate secretly.",
    category: "Privacy violation",
  },
  {
    situation: "They suggest couples therapy after a recurring argument, even though things aren\u2019t \"that bad.\"",
    isRedFlag: false,
    explanation: "Proactive, not alarming. Seeking help before things get bad is a sign of emotional maturity, not a sign that something\u2019s wrong. Most couples wait too long.",
    category: "Emotional maturity",
  },
];

const TIERS = [
  { min: 0, max: 4, name: "Rookie", emoji: "\ud83d\udfe2", color: "#52796f", bg: "#f0f7f4", desc: "You\u2019ve got a kind heart \u2014 and that\u2019s beautiful. But some of these sailed right past you. A few of the \u2018sweet\u2019 ones? Not sweet. And a few you flagged? Actually healthy. Your heart is in the right place. Your radar needs calibration." },
  { min: 5, max: 7, name: "Getting Sharper", emoji: "\ud83d\udfe1", color: "#e07a2f", bg: "#fef3e8", desc: "You caught the obvious ones. But the disguised red flags \u2014 the ones wrapped in \u2018I love you so much\u2019 \u2014 those slipped through. That\u2019s where the real danger lives. The good news: you\u2019re building the instinct." },
  { min: 8, max: 9, name: "Sharp Eye", emoji: "\ud83d\udfe0", color: "#c9184a", bg: "#fdf2f4", desc: "You see through the performance. The love bombing, the disguised control, the DARVO \u2014 you caught almost all of it. AND you knew that healthy behavior isn\u2019t always pretty. That\u2019s real emotional intelligence." },
  { min: 10, max: 10, name: "Bulletproof", emoji: "\ud83d\udee1\ufe0f", color: "#2d6a4f", bg: "#f0f7f4", desc: "Nothing gets past you. You know the difference between a boundary and a red flag, between love bombing and real affection, between privacy and secrecy. Share this with someone who needs it." },
  { min: 11, max: 12, name: "Bulletproof+", emoji: "\ud83d\udee1\ufe0f", color: "#2d6a4f", bg: "#f0f7f4", desc: "Perfect score. You identified every single red flag AND every healthy behavior correctly. You didn\u2019t overcorrect either way. That\u2019s not paranoia \u2014 that\u2019s wisdom. Now share this with someone who needs it." },
];

function getTier(score: number) {
  return TIERS.find(t => score >= t.min && score <= t.max) || TIERS[0];
}

function RedFlagInner() {
  const searchParams = useSearchParams();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(SCENARIOS.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const shuffled = useMemo(() => {
    const arr = SCENARIOS.map((s, i) => ({ ...s, origIdx: i }));
    let seed = 12345;
    for (let i = arr.length - 1; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      const j = seed % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const score = answers.reduce((acc, a, i) => {
    if (a === null) return acc;
    const scenario = shuffled.find(s => s.origIdx === i);
    if (!scenario) return acc;
    return acc + (a === scenario.isRedFlag ? 1 : 0);
  }, 0);

  const pickAnswer = (isFlag: boolean) => {
    const scenario = shuffled[currentQ];
    const newAnswers = [...answers];
    newAnswers[scenario.origIdx] = isFlag;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (currentQ < shuffled.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setDone(true);
    }
  };

  const tier = getTier(score);

  const handleShare = async () => {
    const url = `https://debate-coach-seven.vercel.app/quiz/redflag`;
    const txt = `\ud83d\udea9 I scored ${score}/${SCENARIOS.length} on the Red Flag IQ test \u2014 "${tier.name}"\n\nCan you beat my score? Most people miss at least 3.\n\n${url}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Red Flag IQ Test", text: txt, url }); } catch {}
    } else {
      navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const restart = () => {
    setStarted(false); setCurrentQ(0); setAnswers(Array(SCENARIOS.length).fill(null)); setShowExplanation(false); setDone(false);
  };

  // ====== LANDING ======
  if (!started) return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ animation: "fadeUp 0.8s ease-out" }}>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif" }}>BeBoldn</div>
            <div style={{ fontSize: "12px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginTop: "4px" }}>Practice real conversations before they happen</div>
          </div>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>{"\ud83d\udea9"}</div>
          <h1 style={{ fontSize: "clamp(32px, 7vw, 44px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.5px" }}>Red Flag IQ Test</h1>
          <p style={{ color: "#52796f", fontSize: "16px", lineHeight: 1.8, margin: "0 0 12px" }}>12 real dating scenarios.<br />Some are red flags. Some aren{"\u2019"}t.<br />Can you tell the difference?</p>
          <p style={{ color: "#c9184a", fontSize: "14px", fontWeight: "600", margin: "0 0 40px", fontFamily: "-apple-system, sans-serif" }}>Most people miss at least 3.</p>
          <button onClick={() => setStarted(true)} style={{ padding: "18px 48px", background: "#c9184a", color: "#fff", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e0506a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#c9184a"; e.currentTarget.style.transform = "none"; }}>Test My Red Flag IQ {"\u2192"}</button>
          <p style={{ color: "#84a98c", fontSize: "12px", marginTop: "24px", fontFamily: "-apple-system, sans-serif" }}>Takes 3 minutes {"\u00b7"} Free</p>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );

  // ====== RESULT CARD ======
  if (done) {
    const correct = shuffled.map((s, i) => {
      const userAnswer = answers[s.origIdx];
      return { ...s, userAnswer, isCorrect: userAnswer === s.isRedFlag };
    });
    const missed = correct.filter(c => !c.isCorrect);
    const caught = correct.filter(c => c.isCorrect);
    const isGreatScore = score >= 9;
    const isGoodScore = score >= 7;

    const shareUrl = `https://debate-coach-seven.vercel.app/quiz/redflag`;
    const shareText = `\ud83d\udea9 I scored ${score}/${SCENARIOS.length} on the Red Flag IQ test \u2014 "${tier.name}"\n\nCan you beat my score? Most people miss at least 3.`;

    const shareToFacebook = () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank", "width=600,height=400");
    };
    const shareToTikTok = () => {
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      alert("Link & caption copied! Paste it in your TikTok bio or comment.");
    };
    const copyLink = () => {
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    };

    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif", position: "relative", overflow: "hidden" }}>

        {/* Confetti for great scores */}
        {isGoodScore && (
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100 }}>
            {Array.from({ length: 40 }).map((_, i) => {
              const colors = ["#c9184a", "#2d6a4f", "#e07a2f", "#7c5cbf", "#40916c", "#f0a050"];
              const color = colors[i % colors.length];
              const left = Math.random() * 100;
              const delay = Math.random() * 2;
              const duration = 2.5 + Math.random() * 2;
              const size = 6 + Math.random() * 8;
              const rotation = Math.random() * 360;
              return (
                <div key={i} style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: "-20px",
                  width: `${size}px`,
                  height: `${size * 0.6}px`,
                  background: color,
                  borderRadius: "2px",
                  transform: `rotate(${rotation}deg)`,
                  animation: `confettiFall ${duration}s ease-in ${delay}s forwards`,
                  opacity: 0,
                }} />
              );
            })}
          </div>
        )}

        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>

          {/* Score celebration popup */}
          <div style={{ textAlign: "center", marginBottom: "32px", animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ fontSize: isGreatScore ? "72px" : "56px", marginBottom: "12px" }}>
              {isGreatScore ? "\ud83c\udf89" : isGoodScore ? "\ud83d\udd25" : score >= 5 ? "\ud83d\udc40" : "\ud83d\ude2c"}
            </div>
            <div style={{ fontSize: "64px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif", lineHeight: 1 }}>{score}<span style={{ fontSize: "28px", color: "#84a98c" }}>/{SCENARIOS.length}</span></div>
            <div style={{ display: "inline-block", padding: "6px 20px", background: `${tier.color}15`, borderRadius: "99px", marginTop: "12px", marginBottom: "8px" }}>
              <span style={{ fontSize: "16px", marginRight: "6px" }}>{tier.emoji}</span>
              <span style={{ fontSize: "16px", fontWeight: "700", color: tier.color, fontFamily: "-apple-system, sans-serif" }}>{tier.name}</span>
            </div>
          </div>

          {/* Shareable card — designed for screenshots */}
          <div style={{ background: "linear-gradient(145deg, #1a2e1a, #2d4a3a)", borderRadius: "24px", padding: "36px 28px", marginBottom: "24px", textAlign: "center", position: "relative", overflow: "hidden", animation: "fadeUp 0.6s ease-out 0.3s both" }}>
            <div style={{ position: "absolute", top: "16px", left: "20px", fontSize: "20px", opacity: 0.1 }}>{"\ud83d\udea9"}</div>
            <div style={{ position: "absolute", bottom: "20px", right: "24px", fontSize: "16px", opacity: 0.08 }}>{"\ud83d\udea9"}</div>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.3em", color: "#84a98c", textTransform: "uppercase", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Red Flag IQ</div>
            <div style={{ fontSize: "56px", fontWeight: "700", color: "#fff", fontFamily: "-apple-system, sans-serif", lineHeight: 1 }}>{score}<span style={{ fontSize: "22px", color: "#84a98c" }}>/{SCENARIOS.length}</span></div>
            <div style={{ fontSize: "22px", fontWeight: "600", color: tier.color, marginTop: "8px", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>{tier.emoji} {tier.name}</div>
            <p style={{ fontSize: "13px", color: "#b8d4c8", lineHeight: 1.7, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>{tier.desc}</p>
            <div style={{ borderTop: "1px solid #ffffff12", paddingTop: "12px" }}>
              <div style={{ fontSize: "10px", color: "#52796f", fontFamily: "-apple-system, sans-serif", letterSpacing: "0.15em" }}>BeBoldn {"\u00b7"} Practice real conversations before they happen</div>
            </div>
          </div>

          {/* Share section */}
          <div style={{ animation: "fadeUp 0.6s ease-out 0.6s both" }}>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "#1a2e1a", textAlign: "center", marginBottom: "14px", fontFamily: "-apple-system, sans-serif" }}>
              {isGreatScore ? "That score deserves to be seen \ud83d\udc40" : isGoodScore ? "Challenge your friends \u2014 can they beat you?" : "Think your friends would do better?"}
            </p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <button onClick={shareToFacebook} style={{ flex: 1, padding: "14px", background: "#1877F2", color: "#fff", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                Facebook
              </button>
              <button onClick={shareToTikTok} style={{ flex: 1, padding: "14px", background: "#000", color: "#fff", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                TikTok
              </button>
              <button onClick={copyLink} style={{ flex: 1, padding: "14px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
            <p style={{ fontSize: "11px", color: "#84a98c", textAlign: "center", marginBottom: "32px", fontFamily: "-apple-system, sans-serif" }}>or screenshot the card above for your story</p>
          </div>

          {/* Breakdown */}
          {missed.length > 0 && (
            <div style={{ marginBottom: "24px", animation: "fadeUp 0.6s ease-out 0.9s both" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#c9184a", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>{"\u274c"} What you missed ({missed.length})</div>
              {missed.map((m, i) => (
                <div key={i} style={{ background: "#fff", border: "1.5px solid #f0d8dc", borderRadius: "14px", padding: "16px 20px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.6, marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>{m.situation}</div>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#c9184a", marginBottom: "6px", fontFamily: "-apple-system, sans-serif" }}>{m.isRedFlag ? "\ud83d\udea9 This IS a red flag" : "\u2705 This is NOT a red flag"}</div>
                  <div style={{ fontSize: "12px", color: "#52796f", lineHeight: 1.6, fontFamily: "-apple-system, sans-serif" }}>{m.explanation}</div>
                </div>
              ))}
            </div>
          )}

          {caught.length > 0 && (
            <div style={{ marginBottom: "24px", animation: "fadeUp 0.6s ease-out 1.2s both" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>{"\u2714"} What you caught ({caught.length})</div>
              {caught.map((m, i) => (
                <div key={i} style={{ background: "#fff", border: "1.5px solid #d8e8e0", borderRadius: "14px", padding: "16px 20px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.6, marginBottom: "6px", fontFamily: "-apple-system, sans-serif" }}>{m.situation}</div>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#2d6a4f", fontFamily: "-apple-system, sans-serif" }}>{m.isRedFlag ? "\ud83d\udea9 Red flag \u2014 caught it" : "\u2705 Healthy \u2014 knew it"}</div>
                </div>
              ))}
            </div>
          )}

          {/* Retake + CTA */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <button onClick={restart} style={{ flex: 1, padding: "16px", background: "transparent", color: "#52796f", border: "1.5px solid #d8e8e0", borderRadius: "14px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>Retake Quiz</button>
          </div>

          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #d8e8e0", textAlign: "center" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#1a2e1a", margin: "0 0 8px", fontFamily: "-apple-system, sans-serif" }}>Want to Practice These Conversations?</h3>
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>BeBoldn lets you rehearse real red flag scenarios with AI that reacts to how you respond. Learn to set boundaries and protect yourself {"\u2014"} before you need to.</p>
            <a href="/social" style={{ display: "block", padding: "16px", background: "#2d6a4f", color: "#fff", borderRadius: "12px", fontSize: "15px", fontWeight: "600", textDecoration: "none", textAlign: "center", fontFamily: "-apple-system, sans-serif" }}>Try BeBoldn Free {"\u2192"}</a>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
            <a href="/quiz" style={{ color: "#84a98c", fontSize: "13px", fontFamily: "-apple-system, sans-serif", textDecoration: "underline", textUnderlineOffset: "3px" }}>Communication Quiz</a>
            <a href="/quiz/partner" style={{ color: "#84a98c", fontSize: "13px", fontFamily: "-apple-system, sans-serif", textDecoration: "underline", textUnderlineOffset: "3px" }}>Partner Style Quiz</a>
            <a href="/quiz/compatibility" style={{ color: "#84a98c", fontSize: "13px", fontFamily: "-apple-system, sans-serif", textDecoration: "underline", textUnderlineOffset: "3px" }}>Compatibility Quiz</a>
          </div>
        </div>
        <style>{`
          @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes popIn{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
          @keyframes confettiFall{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(100vh) rotate(720deg)}}
        `}</style>
      </div>
    );
  }

  // ====== QUESTIONS ======
  const q = shuffled[currentQ];
  const userAnswer = answers[q.origIdx];
  const isCorrect = userAnswer === q.isRedFlag;

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <div style={{ flex: 1, height: "3px", background: "#e0ebe4", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((currentQ + 1) / shuffled.length) * 100}%`, background: "#c9184a", borderRadius: "2px", transition: "width 0.5s ease-out" }} />
          </div>
          <div style={{ fontSize: "12px", color: "#52796f", fontFamily: "-apple-system, sans-serif" }}>{currentQ + 1} / {shuffled.length}</div>
            <button onClick={() => { window.location.href = "/social"; }} style={{ background: "none", border: "none", color: "#84a98c", fontSize: "13px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", padding: "4px 8px", whiteSpace: "nowrap" }}>{"✕ Exit"}</button>
        </div>

        {/* Scenario */}
        <div key={currentQ} style={{ animation: showExplanation ? "none" : "slideIn 0.4s ease-out" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", color: "#c9184a", textTransform: "uppercase", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>{"\ud83d\udea9"} Red Flag or Not?</div>
          <div style={{ background: "#fff", border: "1.5px solid #e8e0e0", borderRadius: "18px", padding: "28px 24px", marginBottom: "24px" }}>
            <p style={{ fontSize: "16px", color: "#1a2e1a", lineHeight: 1.8, margin: 0 }}>{q.situation}</p>
          </div>

          {!showExplanation ? (
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => pickAnswer(true)}
                style={{ flex: 1, padding: "20px", background: "#fff", border: "1.5px solid #f0d8dc", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.2s", color: "#c9184a" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fdf2f4"; e.currentTarget.style.borderColor = "#c9184a"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#f0d8dc"; }}>
                {"\ud83d\udea9"} Red Flag
              </button>
              <button onClick={() => pickAnswer(false)}
                style={{ flex: 1, padding: "20px", background: "#fff", border: "1.5px solid #d8e8e0", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.2s", color: "#2d6a4f" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f0f7f4"; e.currentTarget.style.borderColor = "#2d6a4f"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#d8e8e0"; }}>
                {"\u2705"} Not a Red Flag
              </button>
            </div>
          ) : (
            <div style={{ animation: "fadeUp 0.3s ease-out" }}>
              <div style={{ background: isCorrect ? "#f0f7f4" : "#fdf2f4", border: `1.5px solid ${isCorrect ? "#d8e8e0" : "#f0d8dc"}`, borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "24px" }}>{isCorrect ? "\u2705" : "\u274c"}</span>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: isCorrect ? "#2d6a4f" : "#c9184a", fontFamily: "-apple-system, sans-serif" }}>
                    {isCorrect ? "Correct!" : "Missed this one"}
                  </span>
                </div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: q.isRedFlag ? "#c9184a" : "#2d6a4f", marginBottom: "10px", fontFamily: "-apple-system, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {q.isRedFlag ? "\ud83d\udea9 This IS a red flag" : "\u2705 This is NOT a red flag"} {"\u00b7"} {q.category}
                </div>
                <p style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.7, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{q.explanation}</p>
              </div>
              <button onClick={nextQuestion}
                style={{ width: "100%", padding: "18px", background: "#1a2e1a", color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#2d4a3a"}
                onMouseLeave={e => e.currentTarget.style.background = "#1a2e1a"}>
                {currentQ < shuffled.length - 1 ? "Next Scenario \u2192" : "See My Score \u2192"}
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

export default function RedFlagPage() {

  // Paywall check + count this quiz toward sessions
  const [paywallLocked, setPaywallLocked] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("forte_free");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.sessionsUsed >= 3 && !data.isPro) {
          setPaywallLocked(true);
        } else if (!data.isPro) {
          // Count this quiz visit as a session
          data.sessionsUsed = (data.sessionsUsed || 0) + 1;
          localStorage.setItem("forte_free", JSON.stringify(data));
        }
      } else {
        // First time user — create the entry with 1 session used
        localStorage.setItem("forte_free", JSON.stringify({ sessionsUsed: 1, isPro: false }));
      }
    } catch {}
  }, []);

  if (paywallLocked) return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "420px", margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>{"\uD83D\uDD12"}</div>
        <h2 style={{ fontSize: "24px", fontWeight: "400", color: "#1a2e1a", margin: "0 0 12px" }}>Free Sessions Used</h2>
        <p style={{ fontSize: "14px", color: "#52796f", lineHeight: 1.6, margin: "0 0 24px", fontFamily: "-apple-system, sans-serif" }}>
          You have used your 3 free sessions. Upgrade to unlock unlimited access.
        </p>
        <a href="/social" style={{ display: "inline-block", padding: "14px 32px", background: "#2d6a4f", color: "#fff", borderRadius: "14px", fontSize: "16px", fontWeight: "600", textDecoration: "none", fontFamily: "-apple-system, sans-serif" }}>
          Go Back
        </a>
      </div>
    </div>
  );

  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8faf8" }} />}>
      <RedFlagInner />
    </Suspense>
  );
}
