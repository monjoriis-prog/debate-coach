"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type StyleKey = "protector" | "freeSpirit" | "nurturer" | "spark" | "anchor";

const STYLES: Record<StyleKey, any> = {
  protector: {
    name: "The Protector", emoji: "\ud83d\udee1\ufe0f", color: "#2d6a4f",
    tagline: "You love by making sure they never have to worry.",
    description: "You show love through action \u2014 fixing things, planning ahead, stepping up when life gets hard. Your partner always feels safe with you. You\u2019re the one who checks the locks, handles the logistics, and carries the heavy things \u2014 literal and emotional.\n\nBut here\u2019s the part you don\u2019t see: you sometimes take over when your partner needs a teammate, not a hero. And you rarely let yourself be taken care of \u2014 because needing help feels like failing at your one job.",
    deepInsight: "You probably learned early that love meant protection \u2014 that your value was in what you could provide, fix, or shield others from. That instinct is beautiful. But it\u2019s also exhausting, and it can quietly communicate to your partner: \u2018I don\u2019t trust you to handle things.\u2019 That\u2019s not what you mean. But it\u2019s what lands.",
    strength: "Your partner never doubts that you\u2019ll show up. In a world of unreliable people, that\u2019s everything.",
    growth: "Ask \u2018Do you want my help or just my presence?\u2019 before jumping in. Let yourself be held sometimes.",
    patterns: ["You\u2019ve taken over a task your partner was handling because you thought you\u2019d do it better", "Being needed feels more natural to you than being wanted", "You have trouble relaxing when something is unresolved or unfinished", "You\u2019ve been told \u2018I can handle it\u2019 and felt useless instead of relieved"],
    cost: "Your partner may have stopped asking you for emotional vulnerability because you\u2019ve trained them to see you as the strong one. They take care of your feelings by never requiring them.",
    scenarios: ["Letting your partner handle something without stepping in", "Saying \u2018I\u2019m not okay\u2019 without immediately having a plan to fix it"]
  },
  freeSpirit: {
    name: "The Free Spirit", emoji: "\ud83e\udee7", color: "#7c5cbf",
    tagline: "You love deeply \u2014 but you need room to breathe.",
    description: "You value independence, growth, and authenticity in love. You\u2019re drawn to partners who have their own thing going on \u2014 who don\u2019t need you to complete them. You love deeply, but your love needs air. Without space, you feel trapped. With it, you\u2019re the most present, passionate partner imaginable.\n\nBut what feels like healthy independence to you can feel like distance to someone who needs more closeness. You\u2019re not cold \u2014 you\u2019re just wired to recharge alone. The problem is, your partner may not know the difference.",
    deepInsight: "Your need for space isn\u2019t about not loving enough. It\u2019s often about fear \u2014 fear that too much closeness will swallow who you are. Maybe you watched someone lose themselves in a relationship. Maybe you did. So you built walls that look like independence but function like armor.",
    strength: "You keep the relationship from becoming codependent. You inspire your partner to grow alongside you, not into you.",
    growth: "Sometimes \u2018I need space\u2019 lands as \u2018I don\u2019t need you.\u2019 Name the difference out loud. It costs you nothing and means everything to them.",
    patterns: ["You\u2019ve pulled away after a really intimate moment \u2014 not because it was bad, but because it was a lot", "You\u2019ve been called \u2018hard to read\u2019 or \u2018emotionally unavailable\u2019 and it stung because you DO feel deeply", "You need solo time to process your emotions before you can share them", "You\u2019ve ended something good because it started to feel like it was consuming you"],
    cost: "The people who love you most may be quietly starving for a closeness you\u2019re capable of but rarely offer. And they\u2019ve stopped asking because they don\u2019t want to be the \u2018needy\u2019 one.",
    scenarios: ["Saying \u2018I need alone time\u2019 without it feeling like rejection", "Moving toward your partner instead of away when things get intense"]
  },
  nurturer: {
    name: "The Nurturer", emoji: "\ud83e\ude77", color: "#c9184a",
    tagline: "You love by making people feel like they matter.",
    description: "You\u2019re the partner who remembers the small things \u2014 the coffee order, the hard day at work, the thing they mentioned three weeks ago. You check in. You make people feel seen in a way that most people have never experienced. Love, for you, is emotional attentiveness.\n\nBut here\u2019s the shadow side: you give so much that you lose yourself in the giving. And you expect your partner to read your needs the way you read theirs \u2014 which sets them up to fail, because nobody\u2019s intuition matches yours.",
    deepInsight: "You may have learned that being loved meant being needed \u2014 that your worth was in how well you anticipated and met other people\u2019s needs. So you became the best at it. But somewhere in the process, your own needs became invisible. Not to others \u2014 to you. You genuinely might not know what you need anymore.",
    strength: "Your partner feels emotionally held in a way they\u2019ve probably never experienced. That kind of love is transformative.",
    growth: "Say what you need before it becomes resentment. Your partner can\u2019t match your intuition \u2014 that\u2019s not a failure of their love.",
    patterns: ["You\u2019ve gotten upset that your partner didn\u2019t notice something you\u2019d never actually asked for", "You feel guilty taking time for yourself when your partner is stressed", "You\u2019ve said \u2018I\u2019m fine\u2019 while holding back tears because the timing wasn\u2019t right", "Other people\u2019s moods directly affect yours \u2014 their bad day becomes your bad day"],
    cost: "You\u2019re building resentment one unspoken need at a time. And the person you\u2019re resenting has no idea \u2014 because you\u2019ve been so good at seeming fine.",
    scenarios: ["Asking for care instead of hoping to be noticed", "Letting your partner give back to you without deflecting"]
  },
  spark: {
    name: "The Spark", emoji: "\ud83d\udd25", color: "#e07a2f",
    tagline: "You keep love from ever getting boring.",
    description: "You bring energy, spontaneity, and passion. You plan the surprise weekend trips, the random Tuesday date nights, the \u2018let\u2019s just GO\u2019 moments. You keep the relationship alive because you refuse to let it become routine.\n\nBut here\u2019s the edge: you can mistake comfort for complacency. Not every quiet night means something\u2019s dying. The partner who craves stability might feel exhausted trying to match your pace \u2014 and guilty for wanting to just... be still.",
    deepInsight: "Your need for intensity might be connected to a fear that ordinary love isn\u2019t real love. If it\u2019s not exciting, is it even alive? That belief keeps the fire burning \u2014 but it also means you might run from the deepest kind of intimacy: the kind that\u2019s quiet, steady, and unspectacular.",
    strength: "Your partner never takes the relationship for granted. With you, love is an experience, not a contract.",
    growth: "Practice being bored together. Boredom isn\u2019t a threat \u2014 it\u2019s sometimes just peace wearing different clothes.",
    patterns: ["You\u2019ve felt panicky when a relationship settled into routine, even if it was healthy", "You create excitement partly because stillness makes you anxious", "You\u2019ve been told you\u2019re \u2018a lot\u2019 \u2014 and you\u2019re not sure if it\u2019s a compliment", "When things are going well, you sometimes unconsciously create drama because calm feels suspicious"],
    cost: "Your partner might be exhausted but won\u2019t say it because your energy is part of what they fell in love with. They\u2019re performing enthusiasm to match yours \u2014 and slowly burning out.",
    scenarios: ["Enjoying a quiet night in without creating excitement or fixing the \u2018problem\u2019 of stillness", "Asking your partner what THEY need instead of planning what you think they\u2019ll love"]
  },
  anchor: {
    name: "The Anchor", emoji: "\u2693", color: "#1b4332",
    tagline: "You love by being the person who never wavers.",
    description: "You\u2019re steady, dependable, and consistent. Your partner always knows where they stand with you. You don\u2019t do grand gestures \u2014 you do every day. You show love through reliability: showing up, following through, being the calm in every storm.\n\nBut here\u2019s the other side: stability can become rigidity. You might resist change, avoid difficult conversations, or stick with what\u2019s comfortable even when it\u2019s no longer working. Your strength is your consistency \u2014 but your blind spot is thinking that consistency alone is enough.",
    deepInsight: "You may have grown up in chaos \u2014 or you watched someone you loved become unreliable. So you became the opposite. The one who always shows up. The one who never shakes. But in building that steadiness, you may have also learned to avoid anything that might rock the boat \u2014 including the hard truths your relationship needs to hear.",
    strength: "Your partner feels grounded and secure. In a world of uncertainty, you\u2019re the foundation everything else is built on.",
    growth: "Stability doesn\u2019t mean avoiding discomfort. The most loving thing you can do is sometimes shake things up.",
    patterns: ["You\u2019d rather keep a routine than try something your partner is excited about", "You\u2019ve avoided a conversation because things were \u2018fine enough\u2019", "Change \u2014 even positive change \u2014 makes you more anxious than you\u2019d admit", "You show love through actions so consistently that your partner might forget you have emotional needs too"],
    cost: "Your reliability can become invisible \u2014 like air. Essential, but taken for granted. And you might be so focused on keeping things stable that you\u2019re missing the growth your relationship is asking for.",
    scenarios: ["Initiating a hard conversation even though nothing is \u2018wrong\u2019", "Doing something spontaneous that makes you uncomfortable but makes your partner light up"]
  },
}

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
  { scenario: "Your partner had a terrible day. They walk in the door looking defeated. They haven\u2019t said a word yet.", answers: [
    { text: "Already scanning for what went wrong and how I can fix it before they even sit down", style: "protector" as StyleKey },
    { text: "Give them quiet space. They\u2019ll talk when they\u2019re ready \u2014 pushing won\u2019t help", style: "freeSpirit" as StyleKey },
    { text: "Sit close. Touch their hand. \u2018I\u2019m here. Tell me everything or tell me nothing.\u2019", style: "nurturer" as StyleKey },
    { text: "Suggest scrapping all plans and doing something completely different to reset the energy", style: "spark" as StyleKey },
    { text: "Quietly handle dinner, keep the house calm, let them come to me when they\u2019re ready", style: "anchor" as StyleKey },
  ]},
  { scenario: "Things have been fine between you \u2014 not bad, not great. Just\u2026 flat. You realize you can\u2019t remember the last time you felt truly connected.", answers: [
    { text: "Plan something intentional to fix it \u2014 a trip, a special dinner, a conversation", style: "protector" as StyleKey },
    { text: "Focus on my own growth first. When I\u2019m fulfilled, I show up better", style: "freeSpirit" as StyleKey },
    { text: "Write them a letter about what I love about us and what I\u2019ve been missing", style: "nurturer" as StyleKey },
    { text: "Shake everything up. Break the routine. Surprise them. Do something we\u2019d never do", style: "spark" as StyleKey },
    { text: "Trust the season. Not every chapter needs to be a highlight. We\u2019re solid", style: "anchor" as StyleKey },
  ]},
  { scenario: "Your partner tells you: \u2018I don\u2019t feel like you really see me anymore.\u2019 It catches you off guard.", answers: [
    { text: "Immediately think about what I\u2019ve been missing and start making changes", style: "protector" as StyleKey },
    { text: "Need a moment. Ask them to explain what they mean \u2014 I can\u2019t fix what I don\u2019t understand", style: "freeSpirit" as StyleKey },
    { text: "Feel it in my chest. Sit with them and say: \u2018Tell me more. I want to hear all of it.\u2019", style: "nurturer" as StyleKey },
    { text: "Plan something that proves I see them \u2014 something only I would know they\u2019d love", style: "spark" as StyleKey },
    { text: "Reflect honestly. Have I been on autopilot? Probably. Time to be more intentional", style: "anchor" as StyleKey },
  ]},
  { scenario: "You disagree about something that matters \u2014 money, family, or a major life decision. Neither of you is budging.", answers: [
    { text: "Take the lead. Research options, run numbers, present a plan that protects us both", style: "protector" as StyleKey },
    { text: "Need time alone to think before I can talk about it without reacting emotionally", style: "freeSpirit" as StyleKey },
    { text: "Before pushing my view, I need to understand what this means to them emotionally", style: "nurturer" as StyleKey },
    { text: "Hash it out right now. Tension gets worse the longer you let it breathe", style: "spark" as StyleKey },
    { text: "Find the middle ground that keeps things stable. Compromise keeps us together", style: "anchor" as StyleKey },
  ]},
  { scenario: "Your partner wants to make a big change \u2014 new career, new city, something that would upend your current life together.", answers: [
    { text: "Start mapping how to make it work safely. If they want this, I\u2019ll build the plan", style: "protector" as StyleKey },
    { text: "Honestly excited. Growth is what keeps a relationship alive. Let\u2019s evolve", style: "freeSpirit" as StyleKey },
    { text: "Ask how they\u2019re really feeling about it \u2014 the excitement AND the fear underneath", style: "nurturer" as StyleKey },
    { text: "Jump in with them. This is what life is for. We\u2019ll figure it out on the way", style: "spark" as StyleKey },
    { text: "Need time to process. I want to support them but I also need to know we\u2019re not destabilizing everything we\u2019ve built", style: "anchor" as StyleKey },
  ]},
  { scenario: "After an argument, there\u2019s still tension in the air. You\u2019re both in the same room but neither of you has spoken yet.", answers: [
    { text: "Break the silence first. Bring a peace offering \u2014 a drink, a blanket, something small that says \u2018I\u2019m still here\u2019", style: "protector" as StyleKey },
    { text: "Give it time. Rushing repair before we\u2019ve both processed will just restart the fight", style: "freeSpirit" as StyleKey },
    { text: "Go to them. Touch their arm. \u2018I don\u2019t want to be in this space with you. Can we talk?\u2019", style: "nurturer" as StyleKey },
    { text: "Say something unexpected. Make them laugh. Break the ice before it freezes solid", style: "spark" as StyleKey },
    { text: "Wait. Let the dust settle. We\u2019ll talk when we\u2019re both calm and the words will be better", style: "anchor" as StyleKey },
  ]},
  { scenario: "Your partner does something small but deeply thoughtful \u2014 remembers your coffee order after a bad week, leaves a note, handles the thing you hate doing.", answers: [
    { text: "Think: wait, that\u2019s MY job. But also feel quietly, surprisingly loved", style: "protector" as StyleKey },
    { text: "Appreciate it. But I don\u2019t need gestures to feel loved \u2014 I need them to respect my space and support my growth", style: "freeSpirit" as StyleKey },
    { text: "Completely melt. THIS is love. And I will absolutely return it tenfold", style: "nurturer" as StyleKey },
    { text: "Love it \u2014 and immediately start planning how to one-up them", style: "spark" as StyleKey },
    { text: "Notice it quietly. Feel grateful in a way I might not say out loud but will remember for months", style: "anchor" as StyleKey },
  ]},
]

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
          <div style={{ marginBottom: "24px" }}><div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif" }}>BeBoldn</div><div style={{ fontSize: "12px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginTop: "4px" }}>Practice real conversations before they happen</div></div>
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
              <p style={{ color: "#52796f", fontSize: "16px", lineHeight: 1.8, margin: "0 0 40px" }}>7 real relationship moments. No wrong answers.<br />Discover how you love {"\u2014"} and what your partner needs to know.</p>
            </>
          )}
          <button onClick={() => setStarted(true)} style={{ padding: "18px 48px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#40916c"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#2d6a4f"; e.currentTarget.style.transform = "none"; }}>{compareMode ? "Take the Quiz" : "Take the Quiz \u2192"}</button>
          {!compareMode && (
            <>
            <p style={{ color: "#84a98c", fontSize: "12px", marginTop: "24px", fontFamily: "-apple-system, sans-serif" }}>Takes 2 minutes {"\u00b7"} Free {"\u00b7"} Send to your partner</p>
              <div style={{ marginTop: "32px", padding: "16px 20px", background: "#fff", borderRadius: "12px", border: "1.5px solid #d8e8e0", display: "inline-block" }}>
                <a href="/quiz" style={{ color: "#1a2e1a", fontSize: "14px", fontFamily: "-apple-system, sans-serif", textDecoration: "none", fontWeight: "600" }}>{"\ud83d\udde3\ufe0f"} Take the Communication Style Quiz instead</a>
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
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>BeBoldn lets you rehearse real relationship conversations with AI that reacts to how you say it.</p>
            <a href="/social" style={{ display: "block", padding: "16px", background: "#2d6a4f", color: "#fff", borderRadius: "12px", fontSize: "15px", fontWeight: "600", textDecoration: "none", textAlign: "center", fontFamily: "-apple-system, sans-serif" }}>Try BeBoldn Free {"\u2192"}</a>
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
              {st.description.split("\n\n").map((p: string, i: number) => (
                <p key={i} style={{ fontSize: "14px", color: "#b7c9be", lineHeight: 1.8, margin: "0 0 16px" }}>{p}</p>
              ))}
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
                <div style={{ fontSize: "10px", color: "#52796f", fontFamily: "-apple-system, sans-serif", letterSpacing: "0.15em" }}>BeBoldn {"\u00b7"} debate-coach-seven.vercel.app</div>
              </div>
            </div>
          </div>


          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #d8e8e0", marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#1a2e1a", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>What you might not realize</div>
            <p style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.8, margin: "0 0 20px", fontFamily: "-apple-system, sans-serif", fontStyle: "italic" }}>{st.deepInsight}</p>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#c9184a", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>What it costs you</div>
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.7, margin: 0, fontFamily: "-apple-system, sans-serif" }}>{st.cost}</p>
          </div>

          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #d8e8e0", marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#1a2e1a", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>You might recognize this</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {st.patterns.map((p: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: st.color, marginTop: "8px", flexShrink: 0 }} />
                  <div style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, fontFamily: "-apple-system, sans-serif" }}>{p}</div>
                </div>
              ))}
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
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>BeBoldn lets you practice real relationship conversations with AI coaching.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {st.scenarios.map((s: string, i: number) => (
                <div key={i} style={{ fontSize: "13px", color: "#52796f", fontFamily: "-apple-system, sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: st.color }}>{"\u2192"}</span> {s}
                </div>
              ))}
            </div>
            <a href="/social" style={{ display: "block", padding: "16px", background: "#2d6a4f", color: "#fff", borderRadius: "12px", fontSize: "15px", fontWeight: "600", textDecoration: "none", textAlign: "center", fontFamily: "-apple-system, sans-serif" }}>Try BeBoldn Free {"\u2192"}</a>
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
            <button onClick={() => { window.location.href = "/social"; }} style={{ background: "none", border: "none", color: "#84a98c", fontSize: "13px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", padding: "4px 8px", whiteSpace: "nowrap" }}>{"✕ Exit"}</button>
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
