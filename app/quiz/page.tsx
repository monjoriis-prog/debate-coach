"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type StyleKey = "peacekeeper" | "avoider" | "challenger" | "solver" | "pleaser";

const STYLES: Record<StyleKey, any> = {
  peacekeeper: {
    name: "The Peacekeeper", emoji: "\ud83d\udd4a\ufe0f", color: "#2d6a4f",
    tagline: "You\u2019d rather find common ground than fight for yours.",
    description: "You\u2019re the person everyone trusts to stay calm when things get heated. You naturally read the room, de-escalate tension, and find the middle path. People come to you when they need to feel heard.\n\nBut here\u2019s what most people don\u2019t see: you\u2019re not actually calm inside. You feel the tension deeply \u2014 you\u2019re just skilled at absorbing it so others don\u2019t have to. Over time, this becomes exhausting. You carry other people\u2019s emotions and rarely put your own on the table.",
    deepInsight: "You probably learned early that keeping the peace was how you earned love or safety. That instinct still runs your relationships \u2014 even when the threat is gone. The hardest thing for you isn\u2019t conflict. It\u2019s admitting you have a side.",
    strength: "You make people feel safe enough to be honest. That\u2019s rare and powerful.",
    growth: "Practice saying \u2018I hear you, AND here\u2019s what I need\u2019 \u2014 not just the first half.",
    patterns: ["You say \u2018I\u2019m fine\u2019 when you\u2019re not, because bringing it up feels selfish", "You\u2019ve swallowed your opinion to avoid a fight \u2014 then felt invisible afterward", "You\u2019re everyone\u2019s mediator but nobody asks how YOU\u2019RE doing", "When two people you love are in conflict, you feel physically sick"],
    cost: "People close to you may not actually know what you want \u2014 because you\u2019ve never made them choose between their comfort and yours.",
    scenarios: ["Setting a boundary with someone you love without apologizing for it", "Saying what you actually think when you know it\u2019ll create tension"]
  },
  avoider: {
    name: "The Avoider", emoji: "\ud83e\udee5", color: "#6c757d",
    tagline: "If I don\u2019t bring it up, maybe it\u2019ll resolve itself.",
    description: "You\u2019re not afraid of conflict because you\u2019re weak. You avoid it because you feel everything at full volume. Confrontation doesn\u2019t just stress you out \u2014 it overwhelms your nervous system. So you\u2019ve developed an incredible ability to sidestep, delay, and redirect.\n\nThe thing is, you\u2019re usually the most perceptive person in the room. You see the problem before anyone else does. You just don\u2019t say it \u2014 because the last time you did, it didn\u2019t go well. Or because you\u2019re not sure your feelings are \u2018valid enough\u2019 to bring up.",
    deepInsight: "Your avoidance isn\u2019t laziness. It\u2019s a protection strategy that probably saved you at some point. But what once kept you safe now keeps you stuck. The things you don\u2019t say don\u2019t disappear \u2014 they come out sideways. As distance. As resentment. As leaving.",
    strength: "You read situations with scary accuracy. You know exactly what\u2019s wrong \u2014 often before anyone else.",
    growth: "The conversation you\u2019re avoiding is almost always the one that would change everything.",
    patterns: ["You\u2019ve ended relationships in your head weeks before saying anything out loud", "You reply \u2018lol\u2019 or \u2018it\u2019s all good\u2019 when something genuinely hurt you", "You\u2019d rather leave than fight \u2014 not because you don\u2019t care, but because you care too much", "You rehearse confrontations in your head but never have them"],
    cost: "People think you don\u2019t care. The truth is you care so much it paralyzes you. And the gap between what you feel and what you say grows wider every day.",
    scenarios: ["Having the conversation you\u2019ve been replaying in your head for weeks", "Saying \u2018that hurt me\u2019 within 24 hours instead of letting it fester"]
  },
  challenger: {
    name: "The Challenger", emoji: "\u26a1", color: "#c9184a",
    tagline: "You say what everyone else is thinking but won\u2019t say.",
    description: "You\u2019re honest. Not cruel \u2014 honest. You believe that avoiding the truth causes more damage than speaking it. And you\u2019re usually right. People respect your directness. They come to you when they need someone who won\u2019t sugarcoat it.\n\nBut here\u2019s the part you might not see: your delivery sometimes overshoots. What feels like \u2018just being real\u2019 to you can land as an attack to someone who isn\u2019t ready. And when people pull back from your honesty, you tell yourself they can\u2019t handle the truth \u2014 when really, they couldn\u2019t handle the way it was delivered.",
    deepInsight: "Somewhere along the way, you learned that being soft meant being vulnerable \u2014 and being vulnerable meant getting hurt. So you chose strength. The challenge now isn\u2019t learning to be honest. You\u2019ve mastered that. It\u2019s learning that softness and strength aren\u2019t opposites.",
    strength: "You have the courage to name what everyone else dances around. That\u2019s a gift most people don\u2019t have.",
    growth: "Before speaking, ask yourself: \u2018Am I trying to be right, or am I trying to be close?\u2019 Both matter \u2014 but they require different deliveries.",
    patterns: ["You\u2019ve been told you\u2019re \u2018too much\u2019 or \u2018intimidating\u2019 \u2014 and it stung more than you showed", "You get frustrated when people hint instead of just saying what they mean", "After an argument, you replay it wondering if you went too far \u2014 but you\u2019d never admit that", "You respect people more when they push back, and lose respect when they fold"],
    cost: "The people who need your truth the most are sometimes the ones least equipped to receive it the way you give it. And the ones who love you may be holding back because they\u2019ve learned it\u2019s not safe to be vulnerable around your honesty.",
    scenarios: ["Giving honest feedback with enough warmth that the other person can actually hear it", "Apologizing without explaining why you were right"]
  },
  solver: {
    name: "The Problem-Solver", emoji: "\ud83e\udde9", color: "#1b4332",
    tagline: "Every disagreement is a puzzle with a solution.",
    description: "Your brain works like an engine: identify the problem, analyze the variables, propose a solution, move forward. In a world of chaos, you\u2019re the calm, logical center. People trust your judgment. At work, you\u2019re indispensable.\n\nBut in personal relationships, logic isn\u2019t always what people need first. When someone you love is upset, your instinct is to fix it. And sometimes \u2018fixing\u2019 communicates: \u2018Your feelings are a problem to be solved.\u2019 That\u2019s not what you mean \u2014 but it\u2019s what lands.",
    deepInsight: "You may have learned that emotions were unreliable or unsafe, and logic became your anchor. Solving gave you a role \u2014 a way to be valuable without being vulnerable. But the people closest to you don\u2019t need you to fix their problems. They need you to sit in the mess with them.",
    strength: "When everyone else is spiraling, you see the path forward. That clarity is a genuine superpower.",
    growth: "Practice saying \u2018That sounds really hard\u2019 and then stopping. No fix. No suggestion. Just presence.",
    patterns: ["When someone vents, your brain is already three solutions ahead before they finish talking", "You get uncomfortable with emotions that don\u2019t have clear next steps", "You\u2019ve been told you\u2019re \u2018not empathetic enough\u2019 and it confused you \u2014 because you were trying to HELP", "You struggle to sit with uncertainty. Not knowing the answer feels physically uncomfortable"],
    cost: "The people who love you may have stopped bringing you their feelings \u2014 not because they don\u2019t trust you, but because they know you\u2019ll try to fix instead of feel with them. You\u2019re solving problems no one asked you to solve.",
    scenarios: ["Listening to someone vent without offering a single solution", "Saying \u2018I don\u2019t know what to do about this and that\u2019s okay\u2019"]
  },
  pleaser: {
    name: "The People-Pleaser", emoji: "\ud83e\udea9", color: "#7c5cbf",
    tagline: "You\u2019d set yourself on fire to keep someone else warm.",
    description: "You are generous in a way that most people will never understand. You anticipate needs before they\u2019re spoken. You adjust yourself \u2014 your tone, your opinions, your plans \u2014 to make the people around you comfortable. And you do it so naturally that most people don\u2019t even realize you\u2019re doing it.\n\nBut here\u2019s the cost: you\u2019ve been performing so long that you may not know what YOU actually want anymore. Your \u2018preferences\u2019 are shaped by what will cause the least friction. Your \u2018I don\u2019t mind\u2019 isn\u2019t easy-going \u2014 it\u2019s a surrender you\u2019ve learned to dress up as flexibility.",
    deepInsight: "At some point, you learned that your value was in what you gave \u2014 not who you were. So you became indispensable. The helper. The easy one. The one who never makes things hard. But the version of you that everyone loves? It\u2019s a curated version. And the real you is exhausted from never being seen.",
    strength: "You make everyone around you feel valued. That\u2019s not weakness \u2014 it\u2019s emotional intelligence operating at full power.",
    growth: "Your needs are not a burden. Say them out loud before they turn into resentment. The right people won\u2019t leave.",
    patterns: ["You\u2019ve said \u2018I don\u2019t mind, you choose\u2019 when you absolutely had a preference", "You apologize when someone else bumps into YOU", "You feel guilty saying no \u2014 even to things you never wanted to do", "You\u2019ve done favors you resented because saying no felt impossible", "After social situations, you replay everything you said wondering if anyone was upset"],
    cost: "The resentment you\u2019re not expressing is slowly poisoning your closest relationships. And the people who love you have no idea \u2014 because you\u2019ve trained them to believe you\u2019re fine.",
    scenarios: ["Saying \u2018actually, I\u2019d prefer this\u2019 without apologizing or explaining", "Letting someone be disappointed in you and surviving it"]
  },
};

const COMPAT: Record<string, { dynamic: string; strength: string; watchFor: string; practice: string }> = {
  "peacekeeper+peacekeeper": { dynamic: "Two Peacekeepers create a warm, harmonious space \u2014 but nobody advocates for themselves. You both sense what the other needs, yet neither says what THEY need. Important conversations get replaced by comfortable silence.", strength: "Deep mutual empathy and almost effortless harmony. You genuinely care about each other\u2019s experience.", watchFor: "Important things go unsaid because you\u2019re both waiting for the other to bring it up. You can mistake avoidance for agreement.", practice: "Take turns going first: \u2018Here\u2019s something I haven\u2019t said yet.\u2019 Make it a ritual, not a crisis." },
  "peacekeeper+avoider": { dynamic: "You both value peace \u2014 but in different ways. The Peacekeeper smooths things over; the Avoider pretends nothing happened. The surface stays calm while things pile up underneath.", strength: "Neither of you escalates. You give each other a lot of grace and space.", watchFor: "You can go months without addressing something real. That\u2019s not peace \u2014 it\u2019s avoidance with good manners.", practice: "Monthly check-in: \u2018What\u2019s one thing we haven\u2019t talked about?\u2019 Make honesty safe before it becomes necessary." },
  "peacekeeper+challenger": { dynamic: "This is one of the most common \u2014 and powerful \u2014 pairings. The Challenger says what needs saying; the Peacekeeper softens how it lands. When it works, you balance each other beautifully. When it doesn\u2019t, the Challenger steamrolls and the Peacekeeper disappears.", strength: "You cover each other\u2019s blind spots perfectly. One brings honesty, the other brings care.", watchFor: "The Peacekeeper won\u2019t push back until resentment explodes. The Challenger needs to learn that silence isn\u2019t agreement.", practice: "Challengers: ask before you push. Peacekeepers: speak up BEFORE you\u2019re full." },
  "peacekeeper+solver": { dynamic: "A natural partnership. The Peacekeeper brings emotional intelligence; the Solver brings structure. Together you can navigate almost anything \u2014 IF you let both strengths lead equally.", strength: "Empathy meets clarity. You resolve things thoroughly and thoughtfully when you\u2019re aligned.", watchFor: "The Solver may rush to fix before the Peacekeeper has fully processed. Efficiency isn\u2019t always what\u2019s needed.", practice: "Solver goes second. Let feelings land before solutions arrive. Sometimes the feeling IS the point." },
  "peacekeeper+pleaser": { dynamic: "Two of the most generous hearts \u2014 and the most likely to lose themselves. You\u2019re both so focused on the other person\u2019s comfort that nobody\u2019s steering. You can spend years being \u2018fine\u2019 while quietly drowning.", strength: "You genuinely, deeply care about each other\u2019s happiness. That\u2019s real.", watchFor: "Who\u2019s taking care of the person who\u2019s always taking care of everyone else? Both of you need to receive, not just give.", practice: "Ask each other: \u2018What do YOU actually want?\u2019 \u2014 and don\u2019t accept \u2018I don\u2019t mind.\u2019" },
  "avoider+avoider": { dynamic: "Two Avoiders means a LOT of elephants in the room. You\u2019re both perceptive enough to sense every tension \u2014 and skilled enough to dance around it indefinitely. The relationship can feel peaceful on the surface and hollow underneath.", strength: "You never blow up. You give each other incredible space and patience.", watchFor: "Unaddressed issues don\u2019t dissolve. They calcify. You might wake up distant and not know when it started.", practice: "Use a code word for \u2018I need to say something hard.\u2019 Make it safe to break the pattern without a big buildup." },
  "avoider+challenger": { dynamic: "The classic pursue-withdraw loop. The Challenger chases the conversation; the Avoider runs from it. The Challenger feels stonewalled; the Avoider feels attacked. Both are right. Both are hurting.", strength: "You actually need each other. The Challenger pulls important things into the open. The Avoider slows things down before they escalate into damage.", watchFor: "The chase-retreat cycle will destroy you if you don\u2019t name it. It\u2019s not personal \u2014 it\u2019s two nervous systems in conflict.", practice: "Avoiders: send a text when speaking feels too hard. Challengers: let the text be enough sometimes. Meet in the middle." },
  "avoider+solver": { dynamic: "The Solver wants to fix it NOW. The Avoider isn\u2019t ready to even name it yet. This creates a frustrating loop where one pushes solutions and the other withdraws further into silence.", strength: "When timing works, this is powerful. The Solver creates structure; the Avoider brings emotional depth once they feel safe enough to speak.", watchFor: "The Solver may interpret avoidance as apathy. The Avoider may feel the Solver is cold and transactional. Neither is true.", practice: "Solvers: ask \u2018Do you want to talk about this now or later?\u2019 and genuinely respect the answer." },
  "avoider+pleaser": { dynamic: "Two people who struggle to say what they need. The Avoider withdraws; the Pleaser over-gives to compensate. Nobody\u2019s actual needs get met.", strength: "Incredible sensitivity and emotional attunement. You both notice everything.", watchFor: "Silent resentment building on both sides. The Pleaser burns out giving; the Avoider shuts down receiving.", practice: "Write down one need each week and trade papers. Sometimes writing is easier than saying." },
  "challenger+challenger": { dynamic: "Two Challengers means raw, unfiltered honesty \u2014 which is rare and beautiful. It also means sparks. Your arguments can be intense, fast, and sharp. Neither of you backs down.", strength: "Nothing festers. You respect each other\u2019s directness. Issues surface fast and get addressed.", watchFor: "Winning becomes more important than connecting. You can wound each other deeply when you both refuse to soften.", practice: "Before responding in heat, ask: \u2018Am I trying to be right, or trying to be close?\u2019 You can\u2019t always be both." },
  "challenger+solver": { dynamic: "Both direct, both action-oriented \u2014 but different fuel. The Challenger leads with conviction; the Solver leads with logic. You can be an incredible team or lock horns over approach.", strength: "You get things done. No one avoids the issue, and solutions come fast.", watchFor: "The Challenger may see the Solver as emotionally disconnected. The Solver may see the Challenger as irrational. Both have valid points.", practice: "Name the shared goal before debating the method. You almost always agree on WHAT \u2014 it\u2019s the HOW that clashes." },
  "challenger+pleaser": { dynamic: "The most dangerous imbalance. The Challenger dominates; the Pleaser accommodates. Short-term this feels smooth \u2014 one leads, one follows. Long-term the Pleaser drowns in resentment and the Challenger has no idea.", strength: "The Challenger\u2019s honesty can actually free the Pleaser to be more real. The Pleaser\u2019s warmth can soften the Challenger\u2019s edges.", watchFor: "If the Pleaser can\u2019t say no, the relationship isn\u2019t balanced \u2014 it\u2019s managed. This WILL break eventually.", practice: "Challengers: ask what they want, then wait in silence. Pleasers: practice one honest \u2018no\u2019 per week. Start small." },
  "solver+solver": { dynamic: "Two Solvers are efficient and fair. You approach every issue like a team tackling a project. Logical, structured, resolution-focused. Just don\u2019t forget that relationships aren\u2019t projects.", strength: "You rarely get stuck. When something\u2019s off, you analyze it, discuss it, and move forward quickly.", watchFor: "Emotions getting filed under \u2018irrational.\u2019 Some things need to be felt, not fixed. If you optimize away all the mess, you optimize away the intimacy too.", practice: "Once a week, share something with NO solution attached. Just: \u2018This is how I feel.\u2019 Resist the urge to problem-solve each other\u2019s inner life." },
  "solver+pleaser": { dynamic: "The Solver decides; the Pleaser agrees. On the surface, everything runs smoothly. Underneath, the Pleaser\u2019s real feelings never enter the equation because they\u2019ve never been asked \u2014 or they answer with what the Solver wants to hear.", strength: "The Solver\u2019s structure provides comfort. The Pleaser\u2019s warmth provides connection. When balanced, you\u2019re a strong team.", watchFor: "The Solver making every decision because the Pleaser always says yes. That\u2019s not agreement \u2014 it\u2019s surrender.", practice: "Solvers: stop asking yes/no questions. Ask \u2018What would YOUR ideal version of this look like?\u2019 Pleasers: answer honestly. Practice it." },
  "pleaser+pleaser": { dynamic: "Two Pleasers create the most outwardly kind relationship imaginable \u2014 and the most quietly dishonest. You\u2019re both so busy making the other person comfortable that neither of you is being real.", strength: "Genuine, deep care for each other. You\u2019re both generous beyond measure.", watchFor: "You\u2019re both drowning and smiling. Resentment builds silently because nobody asks for what they need. One day it surfaces as an explosion or a quiet exit.", practice: "Take turns completing: \u2018Something I need but haven\u2019t asked for is...\u2019 No deflecting. No \u2018but it\u2019s fine.\u2019" },
};

const QUESTIONS = [
  { scenario: "You\u2019re at dinner with friends. Someone says something that bothers you \u2014 not a joke, something that actually stings. The table keeps laughing.", answers: [
    { text: "Smile, redirect the conversation smoothly. Bring it up with them privately later \u2014 maybe", style: "peacekeeper" as StyleKey },
    { text: "Laugh along. Tell myself it wasn\u2019t that deep. Replay it in the shower for three days", style: "avoider" as StyleKey },
    { text: "Say something right there. Not aggressively, but they need to know that wasn\u2019t okay", style: "challenger" as StyleKey },
    { text: "Make a mental note. Figure out if this is a pattern worth addressing or a one-off", style: "solver" as StyleKey },
    { text: "Laugh it off, make sure THEY don\u2019t feel awkward, even though I\u2019m the one who got hurt", style: "pleaser" as StyleKey },
  ]},
  { scenario: "Your partner/close friend hasn\u2019t asked about something important happening in your life. You know they\u2019re busy, but it still hurts.", answers: [
    { text: "Find a gentle way to mention it: \u2018Hey, I\u2019d love your thoughts on something when you have a sec\u2019", style: "peacekeeper" as StyleKey },
    { text: "Don\u2019t bring it up. If they cared, they\u2019d ask. Maybe I\u2019m expecting too much", style: "avoider" as StyleKey },
    { text: "Tell them straight: \u2018I\u2019m going through something big and I need you to show up for me\u2019", style: "challenger" as StyleKey },
    { text: "Think about why they might not have asked \u2014 maybe they don\u2019t know it\u2019s important to me", style: "solver" as StyleKey },
    { text: "Send THEM a supportive message instead. At least someone will feel cared for", style: "pleaser" as StyleKey },
  ]},
  { scenario: "Someone you respect gives you feedback that feels unfair. They\u2019re wrong about part of it \u2014 but maybe right about another part.", answers: [
    { text: "Thank them, acknowledge what\u2019s fair, and gently clarify the rest", style: "peacekeeper" as StyleKey },
    { text: "Nod, say thanks, and process it alone for days trying to figure out what I actually think", style: "avoider" as StyleKey },
    { text: "Push back on the unfair part immediately. I can accept what\u2019s true, but I won\u2019t accept what\u2019s not", style: "challenger" as StyleKey },
    { text: "Separate the emotional reaction from the facts. What specifically was accurate? What wasn\u2019t?", style: "solver" as StyleKey },
    { text: "Accept all of it. They probably see something I don\u2019t. Who am I to argue?", style: "pleaser" as StyleKey },
  ]},
  { scenario: "Two people you care about are in a conflict and both come to you separately. They each have a point.", answers: [
    { text: "Listen to both. Help them see each other\u2019s perspective. Try to bridge it", style: "peacekeeper" as StyleKey },
    { text: "Listen to both. Agree with both privately. Hope it resolves itself. Feel exhausted", style: "avoider" as StyleKey },
    { text: "Tell each of them what I honestly think \u2014 including where they\u2019re wrong", style: "challenger" as StyleKey },
    { text: "Help them break down the actual issue. Most conflicts are solvable if you remove the emotion", style: "solver" as StyleKey },
    { text: "Take on the emotional labor of fixing it so nobody has to feel uncomfortable", style: "pleaser" as StyleKey },
  ]},
  { scenario: "You realize you were wrong about something important in a relationship. The other person doesn\u2019t know yet.", answers: [
    { text: "Bring it up gently. Own it, but frame it so the conversation stays constructive", style: "peacekeeper" as StyleKey },
    { text: "Feel terrible. Think about telling them every day. Don\u2019t. Weeks pass", style: "avoider" as StyleKey },
    { text: "Go to them directly: \u2018I was wrong. Here\u2019s what I should have said.\u2019 Rip the band-aid", style: "challenger" as StyleKey },
    { text: "Figure out exactly how to make it right before bringing it up. Come with a plan", style: "solver" as StyleKey },
    { text: "Over-apologize. Worry for days that they\u2019re secretly still upset. Check in too much", style: "pleaser" as StyleKey },
  ]},
  { scenario: "Someone keeps crossing a boundary you\u2019ve only ever hinted at. It\u2019s happening again right now.", answers: [
    { text: "Find a calm moment after and say clearly but kindly what I need", style: "peacekeeper" as StyleKey },
    { text: "Hint harder. Change the subject. Remove myself from the situation if I can", style: "avoider" as StyleKey },
    { text: "Name it in the moment: \u2018Hey, I need this to stop.\u2019 Clear and direct", style: "challenger" as StyleKey },
    { text: "Write it down afterward. Prepare exactly what to say next time so I\u2019m ready", style: "solver" as StyleKey },
    { text: "Let it slide again. They probably don\u2019t realize they\u2019re doing it. I don\u2019t want to make things weird", style: "pleaser" as StyleKey },
  ]},
  { scenario: "You\u2019re burned out and overwhelmed. Someone asks you for a big favor that would cost you real time and energy.", answers: [
    { text: "Say yes, but negotiate the scope down to something manageable for both of us", style: "peacekeeper" as StyleKey },
    { text: "Say \u2018let me think about it\u2019 and then agonize privately, never giving a real answer", style: "avoider" as StyleKey },
    { text: "Be honest: \u2018I can\u2019t right now. I\u2019m tapped out.\u2019 No guilt", style: "challenger" as StyleKey },
    { text: "Assess whether I can reorganize my week to fit it in. There\u2019s usually a way", style: "solver" as StyleKey },
    { text: "Say yes immediately. Feel resentful for the next two weeks. Tell no one", style: "pleaser" as StyleKey },
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
    if (navigator.share) { try { await navigator.share({ title: `I'm ${STYLES[result!].name}`, text: shareText }); } catch {} }
    else { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  const handleCompareShare = async () => {
    const link = `https://debate-coach-seven.vercel.app/quiz?from=${encodeURIComponent(userName)}&s=${result}`;
    const txt = `I just took a communication style quiz and I\u2019m "${STYLES[result!].name}." Now I want to see how we compare:\n\n${link}`;
    if (navigator.share) { try { await navigator.share({ title: "Compare communication styles", text: txt, url: link }); } catch {} }
    else { navigator.clipboard.writeText(txt); setCompareCopied(true); setTimeout(() => setCompareCopied(false), 2000); }
  };
  const restart = () => { setStarted(false); setCurrentQ(0); setScores({ peacekeeper: 0, avoider: 0, challenger: 0, solver: 0, pleaser: 0 }); setResult(null); setSelectedAnswer(null); setShowNameInput(false); setUserName(""); };

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
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>BeBoldn lets you rehearse real conversations with AI that reacts to HOW you say it.</p>
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
    const descParts = st.description.split("\n\n");
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
              {descParts.map((p: string, i: number) => (
                <p key={i} style={{ fontSize: "14px", color: "#b7c9be", lineHeight: 1.8, margin: i < descParts.length - 1 ? "0 0 16px" : "0 0 24px" }}>{p}</p>
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
              Compare With Someone {"\u2192"}
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
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>BeBoldn lets you practice real conversations with AI that reacts to HOW you say it.</p>
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
            <a href="/quiz/partner" style={{ color: "#84a98c", fontSize: "13px", fontFamily: "-apple-system, sans-serif", textDecoration: "underline", textUnderlineOffset: "3px" }}>Take the Partner Style Quiz too</a>
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

export default function QuizPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8faf8" }} />}>
      <QuizInner />
    </Suspense>
  );
}
