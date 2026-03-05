"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Dimension = "conflict" | "intimacy" | "communication" | "independence" | "support" | "growth" | "trust";

const DIMENSIONS: Record<Dimension, { name: string; emoji: string; color: string }> = {
  conflict: { name: "How You Repair", emoji: "\u26a1", color: "#c9184a" },
  intimacy: { name: "How You Connect", emoji: "\ud83d\udd25", color: "#e07a2f" },
  communication: { name: "How You Process Pain", emoji: "\ud83d\udde3\ufe0f", color: "#2d6a4f" },
  independence: { name: "How Close Is Close Enough", emoji: "\ud83e\udee7", color: "#7c5cbf" },
  support: { name: "How You Show Up in Hard Times", emoji: "\ud83e\ude77", color: "#1b4332" },
  growth: { name: "How You Handle Change", emoji: "\ud83c\udf31", color: "#40916c" },
  trust: { name: "What Trust Means to You", emoji: "\ud83d\udee1\ufe0f", color: "#52796f" },
};

const QUESTIONS: { question: string; dimension: Dimension; optionA: string; optionB: string; labelA: string; labelB: string; insightMatch: string; insightClash: string }[] = [
  {
    question: "It\u2019s been a long, draining week. You both finally have a free evening. What happens?",
    dimension: "intimacy",
    optionA: "I want to go somewhere \u2014 dinner, a walk, a drive. Being out together recharges me",
    optionB: "I want to stay in. Just us, the couch, maybe not even talking. Presence is enough",
    labelA: "Connection through doing",
    labelB: "Connection through being",
    insightMatch: "You recharge the same way. This sounds small but it\u2019s massive \u2014 couples who align on how they recover from stress naturally protect each other\u2019s energy instead of accidentally draining it. Your Friday nights will feel like home to both of you.",
    insightClash: "After a hard week, one of you wants to GO and the other wants to STOP. This creates a quiet resentment cycle: the doer feels like the homebody is boring, the homebody feels like the doer never slows down. The fix isn\u2019t compromise every time \u2014 it\u2019s taking turns. This Friday is yours. Next Friday is mine. And both of you show up fully for the other\u2019s version of rest.",
  },
  {
    question: "Your partner says something that hurts you. It wasn\u2019t intentional, but it stung. What do you do?",
    dimension: "communication",
    optionA: "Say something right away: \u2018Hey, that landed hard. Can we talk about it?\u2019",
    optionB: "Sit with it first. Figure out if it\u2019s really about what they said or something deeper before bringing it up",
    labelA: "Process out loud",
    labelB: "Process internally first",
    insightMatch: "You process pain the same way. This means when one of you is hurt, the other instinctively knows what\u2019s happening. The out-loud processors get to talk through it together. The internal processors give each other the space they both need. Either way, you\u2019re not misreading silence as anger or words as attack.",
    insightClash: "One of you needs to say it NOW. The other needs time to THINK first. Here\u2019s what happens: the talker brings it up, the thinker isn\u2019t ready, the talker reads silence as not caring, the thinker feels ambushed. The solution that changes everything: \u2018I need to talk about something. Is now a good time, or do you need a minute?\u2019 That one question prevents 80% of the escalation.",
  },
  {
    question: "You find out your partner has been stressed about something for weeks and didn\u2019t tell you. How do you feel?",
    dimension: "trust",
    optionA: "Hurt. If we\u2019re partners, I should know when you\u2019re struggling. Silence feels like being shut out",
    optionB: "I get it. Not everything needs to be shared immediately. I trust them to come to me when they\u2019re ready",
    labelA: "Transparency = trust",
    labelB: "Autonomy = trust",
    insightMatch: "You define trust the same way. This is foundational \u2014 you\u2019ll never have the fight where one person says \u2018why didn\u2019t you tell me?\u2019 and the other says \u2018because I was handling it.\u2019 Your definition of partnership matches, and that\u2019s one of the most stabilizing things a couple can share.",
    insightClash: "One of you thinks trust means full transparency: tell me everything, even the hard stuff, especially the hard stuff. The other thinks trust means autonomy: I\u2019ll handle what I can and come to you when I need to. Neither is wrong. But the transparency person will feel shut out, and the autonomy person will feel surveilled. The bridge: agree on what MUST be shared (health, finances, major decisions) and what\u2019s okay to process alone first. Define the lines together so nobody has to guess.",
  },
  {
    question: "Your partner wants to make a big change \u2014 new career, new city, something that disrupts the plan you had together.",
    dimension: "growth",
    optionA: "I\u2019m excited. Growth keeps a relationship alive. Let\u2019s figure out how to make it work",
    optionB: "I need to understand the impact first. Change is fine but not at the expense of what we\u2019ve built",
    labelA: "Change is fuel",
    labelB: "Stability is foundation",
    insightMatch: "You respond to change the same way. This means neither of you will feel held back or reckless to the other. When life throws curveballs, you\u2019ll face them with the same energy \u2014 and that kind of alignment is what gets couples through the hardest pivots.",
    insightClash: "One of you hears \u2018change\u2019 and feels alive. The other hears \u2018change\u2019 and feels afraid. The change-lover thinks the stability-seeker is holding them back. The stability-seeker thinks the change-lover is being reckless with their shared life. The truth: you BOTH want a good future \u2014 you just have different relationships with uncertainty. The move: the change-lover slows down to acknowledge what the stability-seeker would lose. The stability-seeker names their fear without making it a veto. Meet in the middle with a timeline both of you helped create.",
  },
  {
    question: "It\u2019s Sunday morning. Your partner is in the other room doing their own thing. You haven\u2019t spoken in an hour. How does that feel?",
    dimension: "independence",
    optionA: "A little lonely. I\u2019d rather be in the same room, even if we\u2019re not talking",
    optionB: "Great. I love that we can exist in the same house without needing to be together every second",
    labelA: "Closeness-seeking",
    labelB: "Space-comfortable",
    insightMatch: "Your baseline need for proximity matches. This prevents the silent Sunday morning tension that slowly erodes a lot of relationships. You both feel the same thing about shared silence \u2014 whether that\u2019s \u2018let\u2019s be together\u2019 or \u2018let\u2019s have our own space\u2019 \u2014 and that alignment creates day-to-day peace that\u2019s hard to overstate.",
    insightClash: "This is the \u2018roommate vs. soulmate\u2019 tension. The closeness-seeker interprets the other\u2019s comfort with distance as not caring enough. The space-comfortable person interprets the other\u2019s need for proximity as neediness. Neither is true. What\u2019s actually happening: you have different nervous system baselines for \u2018safe enough.\u2019 The closeness-seeker needs physical proximity to feel connected. The space-comfy person needs autonomy to feel like themselves. Say this out loud to each other. Literally: \u2018When you\u2019re in the other room, I feel [X]. What does it mean for you?\u2019 The answer will surprise you.",
  },
  {
    question: "Your partner made a mistake that affected you. They\u2019ve apologized sincerely. What do you need to move forward?",
    dimension: "conflict",
    optionA: "I need to see change. The apology is the beginning, not the end. Show me through actions over time",
    optionB: "If the apology is genuine, I can move on. I don\u2019t want to hold it over them. People make mistakes",
    labelA: "Trust through proof",
    labelB: "Trust through grace",
    insightMatch: "You repair the same way. This is huge for long-term survival \u2014 every couple will hurt each other eventually. If you agree on what repair looks like, you\u2019ll get through it. The proof people rebuild through demonstrated change. The grace people rebuild through forgiveness. Either path works when both people are on it together.",
    insightClash: "After a mistake, one of you needs to SEE change over time before trust returns. The other wants to forgive and move on because holding onto it feels toxic. Here\u2019s the tension: the proof-seeker feels like the grace-giver is letting them off too easy (or worse, enabling repeat behavior). The grace-giver feels like the proof-seeker is punishing them indefinitely. The bridge: the grace-giver acknowledges that forgiveness doesn\u2019t erase impact. The proof-seeker gives a clear picture of what \u2018enough change\u2019 looks like so it\u2019s not an open-ended sentence. Name the finish line.",
  },
  {
    question: "You\u2019re going through something hard and your partner asks \u2018What can I do?\u2019 What\u2019s your honest answer?",
    dimension: "support",
    optionA: "Help me figure this out. Think with me. Take something off my plate. DO something",
    optionB: "Just be here. Don\u2019t try to fix it. I need to feel like someone is with me in this, not managing it",
    labelA: "Support = action",
    labelB: "Support = presence",
    insightMatch: "You speak the same support language. When life gets hard \u2014 and it will \u2014 you\u2019ll instinctively give each other what\u2019s actually needed instead of what YOU would want. That\u2019s rarer than you think. Most couples spend years giving support in their own language, not their partner\u2019s.",
    insightClash: "This mismatch is responsible for more relationship resentment than almost anything else. Person A is drowning and their partner starts problem-solving. Person A doesn\u2019t feel helped \u2014 they feel managed. Meanwhile Person B IS drowning and their partner sits with them, holds space, says nothing useful. Person B doesn\u2019t feel supported \u2014 they feel watched. The question that fixes this permanently: \u2018Do you want me to help you solve this, or just be here with you?\u2019 Ask it every single time. Never assume.",
  },
]

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
    const txt = `I just answered 7 questions about how I experience our relationship. Now it\u2019s your turn \u2014 when you answer, we\u2019ll both see where we align and where our real conversations need to happen.\n\nTakes 2 minutes:\n${link}`;
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
                <div style={{ fontSize: "13px", color: "#52796f", fontStyle: "italic", marginTop: "8px" }}>They answered honestly. Now it{"\u2019"}s your turn. Same questions. Then you{"\u2019"}ll both see the truth.</div>
              </div>
              <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 16px", lineHeight: 1.3 }}>How Compatible<br />Are You Really?</h1>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: "clamp(32px, 7vw, 44px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.5px" }}>How Compatible<br />Are You Really?</h1>
              <p style={{ color: "#52796f", fontSize: "16px", lineHeight: 1.8, margin: "0 0 40px" }}>7 real relationship moments. Both of you answer.<br />See where you align, where the friction is {"\u2014"}<br />and exactly what to do about it.</p>
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
              {score >= 70 ? `Strong alignment across ${matches.length} of 7 dimensions. You naturally understand each other\u2019s needs in most areas. But don\u2019t let alignment make you complacent \u2014 the places you differ are where the deepest growth lives. Couples who are \"mostly aligned\" often ignore their friction points because everything else is easy. Don\u2019t. Those ${clashes.length} areas are where your next level lives.` : score >= 40 ? `A mix of alignment and real friction. This is actually what most healthy relationships look like \u2014 not perfect symmetry, but enough overlap to feel safe and enough difference to keep growing. Your ${clashes.length} friction points aren\u2019t problems to solve. They\u2019re conversations to keep having. The couples who make it aren\u2019t the ones who agree on everything. They\u2019re the ones who know exactly where they disagree and talk about it without fear.` : `Significant differences across ${clashes.length} of 7 dimensions. Before you panic: this doesn\u2019t mean you\u2019re incompatible. It means your relationship needs more active communication than most. Every friction point below is a place where one of you has been silently adapting to the other \u2014 and that adaptation has a shelf life. The good news? You now have the map. Use it. Have the conversations. The gap between you isn\u2019t the problem. The silence about the gap is.`}
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
              {score === 100 ? "Perfect alignment is beautiful and rare. But it can also make you lazy \u2014 when everything feels easy, you stop having the conversations that keep a relationship evolving. Your work isn\u2019t bridging gaps. It\u2019s making sure comfort doesn\u2019t become complacency. Keep asking each other the hard questions, even when things are good. Especially when things are good."
              : clashes.length === 1 ? `Your one friction point \u2014 ${DIMENSIONS[clashes[0]].name.toLowerCase()} \u2014 is the conversation you\u2019ve probably been having versions of for a while without resolving it. Read the insight above carefully. Then sit down together and say: \u2018This is where we\u2019re different. How do we make it work for both of us?\u2019 One honest conversation about one dimension can shift an entire relationship.`
              : clashes.length <= 3 ? `Your friction points \u2014 ${clashes.map(c => DIMENSIONS[c].name.toLowerCase()).join(", ")} \u2014 are probably already showing up as small recurring tensions. The kind where you both walk away thinking \u2018why does this keep happening?\u2019 Now you know why. Each clash above has a specific bridge. Use them. Start with the one that frustrates you most.`
              : `With ${clashes.length} areas of difference, you\u2019re in a relationship that requires real work \u2014 but that work is what transforms a relationship from something you\u2019re in to something you\u2019ve built. The couples who survive major differences aren\u2019t lucky. They\u2019re intentional. Pick one friction point above. Just one. Have the conversation this week. Then pick another next week. That\u2019s how you rebuild the bridge, one plank at a time.`}
            </p>
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ flex: 1, padding: "14px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>{copied ? "Copied!" : "Share Results"}</button>
            <button onClick={restart} style={{ padding: "14px 20px", background: "transparent", color: "#52796f", border: "1.5px solid #d8e8e0", borderRadius: "12px", fontSize: "14px", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>Retake</button>
          </div>

          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #d8e8e0", textAlign: "center" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#1a2e1a", margin: "0 0 8px", fontFamily: "-apple-system, sans-serif" }}>Practice the Hard Conversations</h3>
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>Every friction point above has matching scenarios in FORTE where you can practice the exact conversation with AI that reacts to HOW you say it. Not what to say {"\u2014"} how to say it so it actually lands.</p>
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
            <p style={{ color: "#52796f", fontSize: "15px", lineHeight: 1.8, margin: "0 0 36px", fontFamily: "-apple-system, sans-serif" }}>Now comes the real part. Send this to your partner.<br />When they answer the same 7 questions, you{"\u2019"}ll both see<br />exactly where you align {"\u2014"} and where the real conversations need to happen.</p>

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
