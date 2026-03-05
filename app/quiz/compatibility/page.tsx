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

const QUESTIONS: { question: string; dimension: Dimension; optionA: string; optionB: string; labelA: string; labelB: string }[] = [
  // INTIMACY - How You Connect
  {
    question: "It\u2019s been a long, draining week. You both finally have a free evening. What happens?",
    dimension: "intimacy",
    optionA: "I want to go somewhere \u2014 dinner, a walk, a drive. Being out together recharges me",
    optionB: "I want to stay in. Just us, the couch, maybe not even talking. Presence is enough",
    labelA: "Connection through doing",
    labelB: "Connection through being",
  },
  {
    question: "You haven\u2019t had real quality time in weeks. When you finally get it, what does \u2018connected\u2019 feel like?",
    dimension: "intimacy",
    optionA: "Laughing together. Doing something. Energy and aliveness between us",
    optionB: "A long conversation with eye contact. Feeling understood. Emotional depth",
    labelA: "Connection through energy",
    labelB: "Connection through depth",
  },
  // COMMUNICATION - How You Process Pain
  {
    question: "Your partner says something that hurts you. It wasn\u2019t intentional, but it stung. What do you do?",
    dimension: "communication",
    optionA: "Say something right away: \u2018Hey, that landed hard. Can we talk about it?\u2019",
    optionB: "Sit with it first. Figure out if it\u2019s really about what they said or something deeper before bringing it up",
    labelA: "Process out loud",
    labelB: "Process internally first",
  },
  {
    question: "You need to tell your partner something they won\u2019t want to hear. How do you approach it?",
    dimension: "communication",
    optionA: "Be direct. Rip the band-aid. Honesty delivered fast is kinder than dragging it out",
    optionB: "Ease into it. Set the context. Make sure they feel safe before the hard part lands",
    labelA: "Direct delivery",
    labelB: "Gentle framing",
  },
  // CONFLICT - How You Repair
  {
    question: "Your partner made a mistake that affected you. They\u2019ve apologized sincerely. What do you need to move forward?",
    dimension: "conflict",
    optionA: "I need to see change. The apology is the beginning, not the end. Show me through actions over time",
    optionB: "If the apology is genuine, I can move on. I don\u2019t want to hold it over them. People make mistakes",
    labelA: "Trust through proof",
    labelB: "Trust through grace",
  },
  {
    question: "You\u2019re in the middle of an argument and it\u2019s getting heated. What\u2019s your instinct?",
    dimension: "conflict",
    optionA: "Push through it. I\u2019d rather fight and resolve it tonight than go to bed with it hanging over us",
    optionB: "Pause. Walk away. Cool down. Come back when I can actually hear them without reacting",
    labelA: "Resolve now",
    labelB: "Cool down first",
  },
  // INDEPENDENCE - How Close Is Close Enough
  {
    question: "It\u2019s Sunday morning. Your partner is in the other room doing their own thing. You haven\u2019t spoken in an hour. How does that feel?",
    dimension: "independence",
    optionA: "A little lonely. I\u2019d rather be in the same room, even if we\u2019re not talking",
    optionB: "Great. I love that we can exist in the same house without needing to be together every second",
    labelA: "Closeness-seeking",
    labelB: "Space-comfortable",
  },
  {
    question: "Your partner wants to go on a trip with their friends for a long weekend. No partners. How do you feel?",
    dimension: "independence",
    optionA: "Honestly? A little left out. I\u2019d rather we did something together, or I was at least invited",
    optionB: "Happy for them. I\u2019ll enjoy my own time. We don\u2019t need to do everything together",
    labelA: "Inclusion-oriented",
    labelB: "Autonomy-oriented",
  },
  // SUPPORT - How You Show Up in Hard Times
  {
    question: "You\u2019re going through something hard and your partner asks \u2018What can I do?\u2019 What\u2019s your honest answer?",
    dimension: "support",
    optionA: "Help me figure this out. Think with me. Take something off my plate. DO something",
    optionB: "Just be here. Don\u2019t try to fix it. I need to feel like someone is with me in this, not managing it",
    labelA: "Support = action",
    labelB: "Support = presence",
  },
  {
    question: "Your partner comes home devastated about something at work. Before they\u2019ve said a word, your instinct is to\u2026",
    dimension: "support",
    optionA: "Start thinking about how to help. Who to call. What to do. My love language is problem-solving",
    optionB: "Sit close. Touch their hand. Say nothing. Let them feel it before anything else",
    labelA: "Action first",
    labelB: "Presence first",
  },
  // GROWTH - How You Handle Change
  {
    question: "Your partner wants to make a big change \u2014 new career, new city, something that disrupts the plan you had together.",
    dimension: "growth",
    optionA: "I\u2019m excited. Growth keeps a relationship alive. Let\u2019s figure out how to make it work",
    optionB: "I need to understand the impact first. Change is fine but not at the expense of what we\u2019ve built",
    labelA: "Change is fuel",
    labelB: "Stability is foundation",
  },
  {
    question: "You notice your partner has been evolving \u2014 new interests, new perspectives, different energy. How does that feel?",
    dimension: "growth",
    optionA: "Exciting. I want to grow WITH them. Stagnation is what kills relationships",
    optionB: "A little unsettling. I fell in love with who they were. I hope the core doesn\u2019t change",
    labelA: "Growth-embracing",
    labelB: "Consistency-valuing",
  },
  // TRUST - What Trust Means to You
  {
    question: "You find out your partner has been stressed about something for weeks and didn\u2019t tell you. How do you feel?",
    dimension: "trust",
    optionA: "Hurt. If we\u2019re partners, I should know when you\u2019re struggling. Silence feels like being shut out",
    optionB: "I get it. Not everything needs to be shared immediately. I trust them to come to me when they\u2019re ready",
    labelA: "Transparency = trust",
    labelB: "Autonomy = trust",
  },
  {
    question: "Your partner\u2019s phone buzzes face-down at dinner. They glance at it and put it away without saying anything. What happens in your head?",
    dimension: "trust",
    optionA: "I notice it. I might ask who it was. Not because I\u2019m suspicious \u2014 I just like being in the loop",
    optionB: "Nothing. Their phone is their phone. I don\u2019t need to know every text that comes in",
    labelA: "Openness expectation",
    labelB: "Privacy default",
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
      if (decoded.length === 14) {
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
    const link = `https://forte-social.vercel.app/quiz/compatibility?from=${encodeURIComponent(userName)}&a=${encode(answers)}`;
    const txt = `I just answered 14 questions about how I experience our relationship. Now it\u2019s your turn \u2014 when you answer, we\u2019ll both see where we align and where our real conversations need to happen.\n\nTakes 3 minutes:\n${link}`;
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
              <p style={{ color: "#52796f", fontSize: "16px", lineHeight: 1.8, margin: "0 0 40px" }}>14 real relationship moments. Both of you answer.<br />See where you align, where the friction is {"\u2014"}<br />and exactly what to do about it.</p>
            </>
          )}
          <button onClick={() => setStarted(true)} style={{ padding: "18px 48px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#40916c"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#2d6a4f"; e.currentTarget.style.transform = "none"; }}>Take the Quiz {"\u2192"}</button>
          {!compareMode && (
            <p style={{ color: "#84a98c", fontSize: "12px", marginTop: "24px", fontFamily: "-apple-system, sans-serif" }}>Takes 3 minutes {"\u00b7"} Free {"\u00b7"} Send to your partner</p>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );

  // ====== COMPARE RESULTS ======
  if (done && compareMode && partnerAnswers) {
    // Score each dimension: 0, 1, or 2 matches out of 2 questions
    const dimScores: Record<Dimension, { mine: number[]; theirs: number[]; matches: number }> = {} as any;
    const dims: Dimension[] = ["intimacy", "communication", "conflict", "independence", "support", "growth", "trust"];
    dims.forEach(d => { dimScores[d] = { mine: [], theirs: [], matches: 0 }; });
    QUESTIONS.forEach((q, i) => {
      dimScores[q.dimension].mine.push(answers[i]);
      dimScores[q.dimension].theirs.push(partnerAnswers[i]);
      if (answers[i] === partnerAnswers[i]) dimScores[q.dimension].matches++;
    });
    const strongAlign = dims.filter(d => dimScores[d].matches === 2);
    const partialAlign = dims.filter(d => dimScores[d].matches === 1);
    const fullClash = dims.filter(d => dimScores[d].matches === 0);
    const totalMatches = QUESTIONS.reduce((acc, q, i) => acc + (answers[i] === partnerAnswers[i] ? 1 : 0), 0);
    const score = Math.round((totalMatches / 14) * 100);

    const INSIGHTS: Record<Dimension, { strong: string; partial: string; clash: string }> = {
      intimacy: {
        strong: "You recharge and connect the same way. This is one of the most powerful forms of alignment \u2014 your idea of a perfect evening together is actually the same evening. You\u2019ll rarely have the \u2018I wanted to go out / I wanted to stay in\u2019 tension that erodes so many couples. Protect this by not taking it for granted.",
        partial: "You overlap on connection but not completely. One of your answers aligned and one didn\u2019t \u2014 meaning you share SOME of the same needs but diverge in specific moments. This is workable and common. The key: ask each other \u2018what do you need tonight?\u2019 instead of assuming. Sometimes the answer will surprise you.",
        clash: "You connect in fundamentally different ways. One of you needs energy and activity to feel close. The other needs stillness and depth. Neither is wrong, but if you don\u2019t name this, you\u2019ll both feel chronically unfulfilled \u2014 one person always dragging the other out, or always holding them back. The fix: alternate. And when it\u2019s not your kind of connection, show up fully anyway. That\u2019s what love looks like across a difference.",
      },
      communication: {
        strong: "You process and deliver information the same way. This means fewer miscommunications, less \u2018why didn\u2019t you just tell me,\u2019 and less \u2018why did you ambush me with that.\u2019 When both people speak the same emotional language, the signal-to-noise ratio in hard conversations is dramatically better. This is a genuine superpower.",
        partial: "You\u2019re partly aligned on communication but there\u2019s a gap. Maybe you process pain the same way but deliver hard truths differently, or vice versa. Pay attention to WHICH question you diverged on \u2014 that\u2019s where your specific friction lives. The partial alignment gives you a foundation. The gap gives you a growth edge.",
        clash: "You communicate in opposite ways. One of you is direct and immediate; the other is gradual and reflective. This creates a specific, predictable loop: the direct one feels like they\u2019re talking to a wall. The reflective one feels ambushed and pressured. The bridge: the direct communicator learns to say \u2018I need to talk about something \u2014 is now good?\u2019 The reflective one commits to a timeframe: \u2018Give me an hour and I\u2019ll be ready.\u2019 That exchange prevents 80% of your communication breakdowns.",
      },
      conflict: {
        strong: "You fight and repair the same way. This is more important than most people realize \u2014 it\u2019s not about whether you fight, it\u2019s about whether you can find your way back to each other afterward. Aligned repair styles mean you\u2019re never in the situation where one person has moved on and the other is still wounded. You heal at the same pace, and that\u2019s a gift.",
        partial: "Your conflict styles partially overlap. You agree on some aspects of how to handle disagreements but diverge on others. Maybe you align on when to engage but differ on what forgiveness requires, or vice versa. This is normal and manageable \u2014 but the divergent piece needs a conversation. Ask: \u2018What do you need from me after we fight?\u2019 The answer might not match what you\u2019ve been giving.",
        clash: "You handle conflict in opposite ways. One of you pushes to resolve immediately; the other needs space. One forgives quickly; the other needs to see proof of change. This mismatch is one of the most common relationship killers \u2014 not because the difference is fatal, but because it creates a cycle where each person\u2019s coping mechanism triggers the other\u2019s wound. The pursuer chases, the withdrawer retreats, the pursuer feels abandoned, the withdrawer feels attacked. Name this cycle OUT LOUD together. That alone changes 50% of it.",
      },
      independence: {
        strong: "Your need for togetherness vs. space matches. This sounds simple but it prevents one of the most insidious relationship tensions: the slow buildup of resentment from one person always wanting more closeness and the other always needing more air. You\u2019ll naturally give each other what you both need without negotiation. That\u2019s rare.",
        partial: "You\u2019re mostly aligned on independence but not entirely. One scenario felt the same, another didn\u2019t. This means in SOME contexts you naturally match, but in others, one of you will feel smothered and the other will feel abandoned. Map the specific contexts where you diverge and create explicit agreements: \u2018Friends trips are fine without checking in every hour\u2019 or \u2018Sunday mornings we spend together.\u2019 Structure creates safety.",
        clash: "One of you craves closeness. The other craves space. This is the pursuer-distancer dynamic and it\u2019s in almost every relationship to some degree \u2014 but yours is strong. The closeness-seeker reads the space-seeker\u2019s independence as rejection. The space-seeker reads the closeness-seeker\u2019s need as suffocation. Neither is true. What\u2019s true: you have different nervous system baselines for what \u2018safe\u2019 feels like. Say this to each other: \u2018When you need space, I feel [X]. When I need closeness, you feel [Y].\u2019 Start there. Everything else follows.",
      },
      support: {
        strong: "You show up for each other the way you each need to be shown up for. This is the rarest and most valuable alignment. When life gets hard \u2014 and it will \u2014 you won\u2019t have to translate your needs. You\u2019ll instinctively do the right thing. The action-oriented couple springs into problem-solving mode together. The presence-oriented couple holds space together. Either way, nobody feels unsupported.",
        partial: "Your support styles partially overlap. In some hard moments you\u2019ll naturally give each other what\u2019s needed. In others, you\u2019ll miss. The miss usually looks like this: one person tries to fix while the other just needs a hug, or one person sits quietly while the other is screaming for help. The magic question that eliminates guessing forever: \u2018Do you need me to help solve this, or just be here with you?\u2019 Ask it every time. Never assume.",
        clash: "You show love in hard times in completely opposite ways. The fixer feels useless \u2018just sitting there.\u2019 The presence person feels managed and unheard when they get solutions instead of empathy. This is the \u2018I was trying to HELP\u2019 / \u2018I didn\u2019t ASK you to fix it\u2019 argument that plays on a loop. The one question that ends this forever: \u2018Do you want me to help fix this, or just hear you right now?\u2019 Tape it to the fridge. Ask it every single time either of you is struggling. This one change will transform your relationship.",
      },
      growth: {
        strong: "You respond to change and evolution the same way. This means neither of you will feel held back or destabilized by the other. When life throws curveballs \u2014 career shifts, identity changes, new passions \u2014 you\u2019ll face them with the same energy. Couples who align on growth rarely outgrow each other, because they grow in parallel.",
        partial: "You partly agree on how to handle change but diverge in some areas. Maybe you\u2019re both excited by growth but differ on the risk tolerance, or you both value stability but one of you has a higher threshold for disruption. This partial alignment means most changes will go smoothly, but the BIG ones \u2014 career pivots, relocations, identity shifts \u2014 will need explicit conversation about pace and comfort.",
        clash: "One of you sees change as oxygen and the other sees it as threat. The growth-oriented partner feels held back and restless. The stability-oriented partner feels unsafe and unseen. Here\u2019s what\u2019s really happening: the growth person is afraid of stagnation. The stability person is afraid of losing what they have. BOTH fears are valid. The move: the growth person slows down to acknowledge what the stability person would be giving up. The stability person names their fear without making it a veto. Create a timeline together that honors both.",
      },
      trust: {
        strong: "You define trust the same way. This is foundational. You\u2019ll never have the fight where one person says \u2018why didn\u2019t you tell me?\u2019 and the other says \u2018because it\u2019s my business.\u2019 Your expectations about transparency, privacy, and information-sharing match. In a world where trust issues destroy more relationships than infidelity, this alignment is worth more than you realize.",
        partial: "Your trust definitions partially overlap. You agree on some aspects of what trust looks like but diverge on others. Maybe you both value honesty but disagree on how much sharing is required vs. how much privacy is respected. This is a nuanced but important gap. Have a specific conversation about lines: \u2018What MUST be shared between us? What\u2019s okay to keep private?\u2019 Define the categories together so nobody has to guess.",
        clash: "You define trust in fundamentally different ways. One of you equates trust with full transparency: share everything, hide nothing, open book. The other equates trust with autonomy: I trust you to handle your world and come to me when you need to. Neither is wrong, but the transparency person will feel shut out, and the autonomy person will feel surveilled. This creates a slow-building tension that often erupts around specific triggers (phones, friendships, separate plans). The fix: agree on specific categories. Finances, health, and major decisions = always shared. Daily texts, private thoughts, solo time = respected privacy. Draw the lines together.",
      },
    };

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
              {score >= 70 ? `Strong alignment across most dimensions. You naturally understand each other\u2019s needs. But don\u2019t let alignment make you complacent \u2014 the places you differ are where the deepest growth lives.` : score >= 40 ? `A mix of alignment and real friction. This is what most healthy relationships look like \u2014 enough overlap to feel safe, enough difference to keep growing. Your friction points aren\u2019t problems. They\u2019re conversations.` : `Significant differences in how you experience the relationship. This doesn\u2019t mean you\u2019re incompatible. It means you need to talk more, not less. The silence about the gap is always worse than the gap itself.`}
            </p>
          </div>

          {strongAlign.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>{"\u2714"} Strong Alignment ({strongAlign.length})</div>
              {strongAlign.map(dim => {
                const d = DIMENSIONS[dim];
                return (
                  <div key={dim} style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1.5px solid #d8e8e0", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "18px" }}>{d.emoji}</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: d.color, fontFamily: "-apple-system, sans-serif" }}>{d.name}</span>
                      <span style={{ fontSize: "11px", color: "#2d6a4f", fontFamily: "-apple-system, sans-serif", marginLeft: "auto" }}>2/2 match</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.7, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{INSIGHTS[dim].strong}</p>
                  </div>
                );
              })}
            </div>
          )}

          {partialAlign.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#e07a2f", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>{"\ud83e\udd1d"} Partial Alignment ({partialAlign.length})</div>
              {partialAlign.map(dim => {
                const d = DIMENSIONS[dim];
                return (
                  <div key={dim} style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1.5px solid #f0e0d0", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "18px" }}>{d.emoji}</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: d.color, fontFamily: "-apple-system, sans-serif" }}>{d.name}</span>
                      <span style={{ fontSize: "11px", color: "#e07a2f", fontFamily: "-apple-system, sans-serif", marginLeft: "auto" }}>1/2 match</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.7, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{INSIGHTS[dim].partial}</p>
                  </div>
                );
              })}
            </div>
          )}

          {fullClash.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#c9184a", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>{"\u26a0"} Needs Attention ({fullClash.length})</div>
              {fullClash.map(dim => {
                const d = DIMENSIONS[dim];
                return (
                  <div key={dim} style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1.5px solid #f0d8dc", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "18px" }}>{d.emoji}</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: d.color, fontFamily: "-apple-system, sans-serif" }}>{d.name}</span>
                      <span style={{ fontSize: "11px", color: "#c9184a", fontFamily: "-apple-system, sans-serif", marginLeft: "auto" }}>0/2 match</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.7, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{INSIGHTS[dim].clash}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ background: "linear-gradient(145deg, #1a3a28, #2d4a3a)", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>{"\ud83c\udfaf"} What This Means</div>
            <p style={{ fontSize: "14px", color: "#e8f0ec", lineHeight: 1.8, margin: 0, fontFamily: "-apple-system, sans-serif" }}>
              {fullClash.length === 0 && partialAlign.length === 0 ? "Perfect alignment across all 7 dimensions. That\u2019s extraordinary. Your work isn\u2019t bridging gaps \u2014 it\u2019s making sure this deep compatibility doesn\u2019t make you complacent. Keep asking the hard questions."
              : fullClash.length === 0 ? `No major clashes. Your ${partialAlign.length} partial alignments are areas where you mostly agree but occasionally miss each other. These are fine-tuning conversations, not fundamental repairs. Have them with curiosity, not urgency.`
              : fullClash.length <= 2 ? `Your ${fullClash.length} area${fullClash.length > 1 ? 's' : ''} of full divergence \u2014 ${fullClash.map(c => DIMENSIONS[c].name.toLowerCase()).join(" and ")} \u2014 ${fullClash.length > 1 ? 'are' : 'is'} where your most important conversations live. Start there. One dimension at a time. The couples who make it aren\u2019t the ones without friction. They\u2019re the ones who face it together.`
              : `With ${fullClash.length} areas of full divergence, your relationship needs intentional work \u2014 but that work is what transforms a relationship from something you\u2019re in to something you\u2019ve built. Pick one area. Just one. Have the conversation this week. Then the next one next week. That\u2019s how bridges get built.`}
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
            <p style={{ color: "#52796f", fontSize: "15px", lineHeight: 1.8, margin: "0 0 36px", fontFamily: "-apple-system, sans-serif" }}>Now comes the real part. Send this to your partner.<br />When they answer the same 14 questions, you{"\u2019"}ll both see<br />exactly where you align {"\u2014"} and where the real conversations need to happen.</p>

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
                <p style={{ fontSize: "12px", color: "#84a98c", marginTop: "12px", fontFamily: "-apple-system, sans-serif" }}>They{"\u2019"}ll answer the same 14 questions. Then you{"\u2019"}ll both see the results.</p>
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
