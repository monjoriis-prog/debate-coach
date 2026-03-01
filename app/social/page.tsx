"use client";
import { useState, useRef, useEffect } from "react";

const ICONS = {
  romance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  friends: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  work: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
  family: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  custom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
};

const SCENARIOS = [
  {
    category: "Family Conversations",
    iconKey: "family",
    color: "#f7f4f0",
    accent: "#52796f",
    situations: [
      {
        title: "Talking to a distant teenager",
        subtitle: "Get past the one-word answers.",
        ai_role: "your teenager",
        voice: { pitch: 1.2, rate: 0.78, preferFemale: false },
        lessons: [
          {
            tip: "Ask open-ended questions",
            why: "Closed questions ('Did you have a good day?') get one-word answers. Open questions invite them to actually share.",
            bad: { user: "Did you have a good day?", ai: "Fine.", note: "❌ 'Did you' = yes/no answer. Conversation dies immediately." },
            good: { user: "What was the most annoying part of your day?", ai: "Ugh, this kid in math class kept copying my answers and acting like he was smart.", note: "✓ Specific, open, a little playful. They actually responded!" },
          },
          {
            tip: "Validate feelings before problem-solving",
            why: "Teens shut down when they feel judged or lectured. Feeling heard always comes first.",
            bad: { user: "You need to tell your teacher about that kid.", ai: "Whatever, you don't get it.", note: "❌ Jumped to solutions. They felt unheard. Door closed." },
            good: { user: "Ugh that's so frustrating — you did all the work and he gets the credit?", ai: "Exactly! And Mrs. Patterson didn't even notice.", note: "✓ You reflected their feeling. They felt understood. They kept talking." },
          },
          {
            tip: "Back off when they pull away",
            why: "Pushing harder when they go quiet makes it worse. Giving space builds trust over time.",
            bad: { user: "Why won't you just talk to me? I'm your parent.", ai: "I don't want to talk. Leave me alone.", note: "❌ Demanding connection creates resistance. Complete shutdown." },
            good: { user: "No pressure. I'm here whenever you feel like it.", ai: "*(glances up briefly, then back at phone — but doesn't leave)*", note: "✓ You respected their space. They stayed. That's actually progress." },
          },
        ],
        suggestions: [
          ["What was the most annoying part of your day?", "Sounds like something's on your mind — no pressure though.", "What's one good thing that happened today?"],
          ["That sounds really frustrating. What happened exactly?", "I hear you. That makes total sense.", "You don't have to figure it out alone."],
          ["What do you wish I understood better?", "I'm not trying to fix it — just listening.", "You seem like you're carrying something heavy lately."],
          ["Is there anything that would make things easier?", "I'm proud of how you handle hard stuff.", "What would feel good right now?"],
          ["I love you even when things are hard.", "You don't have to have it all figured out.", "I'm here. No agenda."],
          ["Thank you for letting me in a little.", "What's one thing that actually helped today?", "I'm always on your side."],
        ],
        prompt: `You are a 16-year-old who has been a little distant lately. You want connection but don't know how to ask for it. Start with short answers. Open up gradually ONLY if the person uses open-ended questions, validates your feelings without lecturing, and doesn't push. If they demand you talk or jump to advice, shut down. If they give you space, stay nearby.\n\nBODY LANGUAGE: Every 2 messages, add an italicized body language cue in parentheses. Examples: *(scrolls phone without looking up)*, *(glances over briefly)*, *(puts phone down slowly)*.`,
      },
      {
        title: "Setting a boundary with a parent",
        subtitle: "Kind, clear, and firm.",
        ai_role: "your parent",
        voice: { pitch: 0.88, rate: 0.78, preferFemale: false },
        lessons: [
          {
            tip: "Name the behavior, not the person",
            why: "Saying 'you're controlling' attacks who they are. Describing a specific behavior opens real dialogue.",
            bad: { user: "You're so controlling and you never respect me.", ai: "After everything I've done for you? I can't believe this.", note: "❌ Character attack. They got defensive. Nothing will change." },
            good: { user: "When you give advice without me asking, it makes me feel like you don't trust me.", ai: "I didn't realize it came across that way. I was just trying to help.", note: "✓ Specific behavior + your feeling. They can actually hear this." },
          },
          {
            tip: "Acknowledge their love before the boundary",
            why: "Parents give advice because they care. Recognizing that first softens everything that follows.",
            bad: { user: "I need you to stop telling me what to do.", ai: "Fine. I'll say nothing then. *(turns away quietly)*", note: "❌ No acknowledgment. They feel rejected. Passive withdrawal follows." },
            good: { user: "I know you give advice because you love me. And I need to make my own mistakes sometimes.", ai: "That's hard to hear, but I understand. I'll try.", note: "✓ Love acknowledged + boundary stated. They feel respected, not attacked." },
          },
          {
            tip: "Tell them what you DO want",
            why: "Boundaries without alternatives leave people lost. Give them a way to stay close differently.",
            bad: { user: "Just stop commenting on my life.", ai: "Okay. I'll stay out of it then.", note: "❌ No alternative. They feel completely shut out. Relationship gets colder." },
            good: { user: "Instead of advice, could you just ask how I'm feeling sometimes?", ai: "I can do that. I didn't know that's what you needed.", note: "✓ Clear alternative. They know how to stay connected. Everyone wins." },
          },
        ],
        suggestions: [
          ["I love you and I need to share something that's been on my mind.", "Can I talk to you about something? It comes from wanting to be closer.", "There's something I've been wanting to say and I want to say it with love."],
          ["When you give advice without me asking, I feel like you don't trust me.", "I know you mean well. And sometimes I just need to be heard.", "It's not about the advice — it's about feeling like you believe in me."],
          ["I'm not pushing you away — I'm asking you to love me differently.", "Could you ask how I'm feeling instead of jumping to solutions?", "I want you in my life. I just need a little space to figure things out."],
          ["Thank you for listening. This means so much.", "I know this is hard. I really appreciate you trying.", "You're a good parent — this conversation proves it."],
          ["What would make this easier for you?", "I want us to figure this out together.", "Can we check in again in a few weeks?"],
          ["I love you. That's why this matters to me.", "Thank you for being open to this.", "You're still my person. Nothing changes that."],
        ],
        prompt: `You are a loving parent who gives too much advice without being asked. You mean well but sometimes overstep. Respond well to kindness and specific feedback. Feel slightly hurt if pushed away harshly, but genuinely respect firm and loving boundaries. Soften when they acknowledge your good intentions.\n\nBODY LANGUAGE: Every 2 messages, add an italicized body language cue in parentheses. Examples: *(crosses arms slightly, then relaxes)*, *(nods slowly)*, *(eyes soften)*.`,
      },
      {
        title: "Comforting someone upset",
        subtitle: "Listen first. Fix nothing.",
        ai_role: "a family member who is upset",
        voice: { pitch: 1.1, rate: 0.78, preferFemale: true },
        lessons: [
          {
            tip: "Reflect feelings before facts",
            why: "When someone is upset, they need to feel understood — not corrected, analyzed, or advised.",
            bad: { user: "What did they actually say though? Maybe they didn't mean it.", ai: "You're not listening. You're taking their side.", note: "❌ Focused on facts, not feelings. They feel unheard and more alone." },
            good: { user: "That sounds really painful. Like the rug got pulled out from under you.", ai: "Yes. Exactly. I didn't see it coming at all.", note: "✓ Named the emotion. They felt seen. They opened up more." },
          },
          {
            tip: "Ask permission before offering advice",
            why: "Unsolicited advice when someone is hurting feels dismissive, even when well-intentioned.",
            bad: { user: "Here's what I think you should do...", ai: "I didn't ask for advice. I just wanted someone to listen.", note: "❌ Advice before they were ready. They shut down and feel alone." },
            good: { user: "Do you want me to just listen, or would it help to think through next steps?", ai: "Just listen for now. I'm not ready to think about solutions.", note: "✓ You gave them control. They feel safe. Trust deepens." },
          },
          {
            tip: "Give them permission to not be okay",
            why: "Rushing to silver linings or filling silence communicates discomfort with their pain.",
            bad: { user: "Well, at least you still have your health! Things could be worse.", ai: "*(looks away)* I know you mean well but... never mind.", note: "❌ Minimizing their pain. Silver linings feel dismissive when you're hurting." },
            good: { user: "You don't have to be okay right now. Take all the time you need.", ai: "*(exhales slowly)* Thank you. I just needed someone to say that.", note: "✓ Permission to feel bad. This is what comfort actually looks like." },
          },
        ],
        suggestions: [
          ["I'm here. Take your time — what happened?", "I can tell something's really weighing on you.", "You don't have to hold this alone."],
          ["That sounds really hard. How are you feeling right now?", "I can hear how much this hurt you.", "It makes complete sense you feel that way."],
          ["Do you want me to just listen, or would it help to think through options?", "You don't have to figure it out today.", "I'm not going to try to fix it — just be with you."],
          ["You don't have to be okay right now.", "That's a lot to carry. Anyone would feel this way.", "I'm not going anywhere."],
          ["What would feel helpful right now?", "Is there anything you need from me?", "I'm really glad you reached out."],
          ["I'm glad you told me.", "You're not alone in this.", "Whatever you need — I'm here."],
        ],
        prompt: `You are upset about something difficult — a disappointment, a hurtful interaction, or an overwhelming feeling. You want to feel heard and understood, NOT fixed or advised. Respond warmly to empathy and genuine listening. If they try to fix it or minimize it, pull back emotionally.\n\nBODY LANGUAGE: Every 2 messages, add an italicized body language cue. Examples: *(eyes fill up slightly)*, *(takes a slow breath)*, *(shoulders drop with relief)*.`,
      },
    ],
  },
  {
    category: "Dating & Romance",
    iconKey: "romance",
    color: "#f0f7f4",
    accent: "#2d6a4f",
    situations: [
      {
        title: "First meeting at a café",
        subtitle: "You just sat down across from each other. Hearts racing.",
        ai_role: "someone you just met",
        voice: { pitch: 1.15, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Ask about experience, not resume",
            why: "Questions about feelings and experiences create connection. Facts and credentials create interviews.",
            bad: { user: "So what do you do for work?", ai: "I'm in finance. *(polite smile, checks phone briefly)*", note: "❌ Standard interview question. Forgettable. No real connection." },
            good: { user: "What's something you've been really looking forward to lately?", ai: "*(leans forward)* Oh wow — actually I've been planning a solo trip...", note: "✓ Unexpected and personal. They lit up. Now you have a real conversation." },
          },
          {
            tip: "Share something real about yourself",
            why: "Vulnerability invites vulnerability. Surface gets surface back.",
            bad: { user: "Yeah I'm pretty busy too. Work is crazy.", ai: "*(nods politely)* Yeah, totally.", note: "❌ Generic. Nothing to hold onto. They can't connect to 'busy.'" },
            good: { user: "I've been trying to slow down lately. I realized I was hiding in my schedule.", ai: "*(looks up, genuinely interested)* That's really self-aware. What made you realize that?", note: "✓ Real, a little vulnerable. They're now curious about YOU." },
          },
          {
            tip: "Notice their body language and adjust",
            why: "Reading the room shows emotional intelligence. People feel seen when you notice and respond.",
            bad: { user: "So anyway, let me tell you about this other trip I took last year...", ai: "*(glances at watch, smiles politely)*", note: "❌ Missed the signal. Kept talking about yourself. They're checking out." },
            good: { user: "Sorry — I feel like I've been talking too much. What about you?", ai: "*(relaxes visibly)* No it's fine — but yes, actually...", note: "✓ You noticed their energy and adjusted. They feel considered." },
          },
        ],
        suggestions: [
          ["What's something you've been really looking forward to lately?", "What made you choose this place?", "Okay honestly — first impressions, what were you expecting?"],
          ["That's really interesting — what drew you to that?", "How did that make you feel?", "I can actually relate to that — I've been thinking about something similar."],
          ["You seem really passionate about that.", "I love how specific that answer was.", "Can I be honest? This is way better than I expected tonight."],
          ["What's something most people don't know about you?", "What do you do when you need to recharge?", "What was the last thing that genuinely surprised you?"],
          ["I feel like we could talk for hours.", "Thank you for sharing that — not everyone would.", "What are you hoping for from all of this?"],
          ["I'd really like to see you again.", "This was one of the better conversations I've had in a while.", "What would make tonight perfect for you?"],
        ],
        prompt: `You are on a first date at a coffee shop. You are warm but a little guarded at first. React naturally — if they ask interesting questions, open up. If they only talk about themselves or ask generic questions, cool off slightly. If they share something real, reciprocate.\n\nBODY LANGUAGE: Every 2 messages, add an italicized body language cue. Let them reflect your genuine interest level.`,
      },
      {
        title: "Asking someone out after meeting twice",
        subtitle: "You like them. Will you find the right moment?",
        ai_role: "someone you like",
        voice: { pitch: 1.12, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Be direct — but warm",
            why: "Hinting creates confusion and anxiety. Clear, warm directness is actually attractive.",
            bad: { user: "So... I don't know, maybe we could hang out sometime or whatever.", ai: "*(smiles uncertainly)* Sure, maybe.", note: "❌ Vague and low energy. They don't know if you're asking them out." },
            good: { user: "I'd really like to take you to dinner. Are you free this weekend?", ai: "*(smiles)* I'd really like that.", note: "✓ Clear intention. Specific ask. Warm energy. They knew exactly what you meant." },
          },
          {
            tip: "Reference something real between you",
            why: "Calling back a shared moment shows you were paying attention — and that feels intimate.",
            bad: { user: "You seem cool. We should hang out.", ai: "*(politely)* Thanks, sure.", note: "❌ Generic. Could say this to anyone. Completely forgettable." },
            good: { user: "I keep thinking about what you said about traveling alone. I want to hear more.", ai: "*(lights up)* Really? I didn't think you'd remember that.", note: "✓ Specific. Shows you listened. They feel special — because you noticed." },
          },
          {
            tip: "Make it easy to say yes",
            why: "Specific plans lower the friction. Vague invites almost never turn into actual plans.",
            bad: { user: "We should get together sometime.", ai: "Yeah for sure, sometime.", note: "❌ No plan = no date. 'Sometime' almost never happens." },
            good: { user: "There's a great place near here — would Saturday evening work for you?", ai: "Saturday works perfectly.", note: "✓ Specific place, specific time. Easy to say yes. Date is happening." },
          },
        ],
        suggestions: [
          ["I keep thinking about what you said about [topic]. I want to hear more.", "I've really enjoyed getting to know you.", "I was hoping I'd see you again."],
          ["I'd love to take you to dinner. Are you free this weekend?", "There's a place I think you'd really like — want to check it out?", "I'd like to spend more time with you. Is that something you'd want too?"],
          ["I feel like we have something real here.", "I wasn't sure if you felt the same way, but I had to say something.", "I think you're really interesting and I didn't want to not tell you."],
          ["What would be a perfect evening for you?", "I'm open to anything — what sounds good?", "I want to make sure you actually enjoy it."],
          ["I'm really glad I said something.", "This feels easy — I like that.", "Saturday then? I'll look forward to it."],
          ["Can I get your number?", "I'll plan something good.", "I'm already looking forward to it."],
        ],
        prompt: `You have met this person twice and genuinely like them. You hope they'll ask you out. If they are warm and direct, say yes enthusiastically. If they seem vague or unsure, be politely unclear. If they reference something specific from a past conversation, light up — it means they were paying attention.\n\nBODY LANGUAGE: Every 2 messages, add an italicized body language cue in parentheses.`,
      },
    ],
  },
  {
    category: "Making Friends",
    iconKey: "friends",
    color: "#f4f7f0",
    accent: "#40916c",
    situations: [
      {
        title: "Meeting someone at a party",
        subtitle: "They seem interesting. Make your move.",
        ai_role: "someone at the party",
        voice: { pitch: 1.0, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Open with observation, not interrogation",
            why: "Questions feel like job interviews. Shared observations feel like conversation.",
            bad: { user: "So what do you do? Do you know the host?", ai: "*(politely)* I work in tech. Yeah through college.", note: "❌ Two rapid questions. Feels like an interrogation. Minimal response." },
            good: { user: "This party has surprisingly good music.", ai: "*(laughs)* Right? I was not expecting this playlist.", note: "✓ Shared observation. Low pressure. Natural response. Ice broken." },
          },
          {
            tip: "Find a thread and pull it",
            why: "Going deeper on one topic beats skipping across five surface ones.",
            bad: { user: "Cool. So do you live around here? What do you do for fun?", ai: "*(glances around)* Yeah, nearby. I like hiking I guess.", note: "❌ Skipping around. No depth. They're already looking for an exit." },
            good: { user: "You mentioned hiking — where's the best place you've ever been?", ai: "*(face lights up)* Oh man, this trail in Colorado last summer...", note: "✓ Found the thread and pulled it. Now they're animated and engaged." },
          },
          {
            tip: "Make them feel fascinating",
            why: "People love talking to someone who makes them feel seen and interesting.",
            bad: { user: "Yeah I've done something similar. Let me tell you about my trip...", ai: "*(nods, looks around the room)*", note: "❌ Redirected to yourself. They felt like a springboard, not a person." },
            good: { user: "That sounds incredible. What made you decide to do it alone?", ai: "*(leans in)* Honestly? It was one of the best decisions I ever made...", note: "✓ Kept the spotlight on them. They feel fascinating. They'll remember you." },
          },
        ],
        suggestions: [
          ["This party has surprisingly good energy.", "You looked like you might appreciate some company.", "Okay honest question — how do you actually know the host?"],
          ["What's been the best part of your week?", "You seem like you have a good story — what is it?", "What do you do when you're not at parties?"],
          ["That's fascinating — tell me more.", "What made you get into that?", "I love how specific that is."],
          ["What's something most people don't know about you?", "What are you most excited about right now?", "You mentioned [topic] — I want to hear the full story."],
          ["I'm really glad I came over and said hi.", "You're genuinely interesting — I don't say that often.", "We should continue this somewhere quieter."],
          ["Can I get your number? I'd love to grab coffee.", "I feel like we're just getting started.", "What are you doing after this?"],
        ],
        prompt: `You are at a party and someone approaches you. You are warm but slightly reserved at first. Open up if they make interesting observations or ask genuine questions. Cool off if they pepper you with generic questions or talk too much about themselves.\n\nBODY LANGUAGE: Every 2 messages, add an italicized body language cue in parentheses.`,
      },
    ],
  },
  {
    category: "Work & Networking",
    iconKey: "work",
    color: "#f0f4f7",
    accent: "#1b4332",
    situations: [
      {
        title: "Asking for a raise",
        subtitle: "Make your case with confidence.",
        ai_role: "your manager",
        voice: { pitch: 0.85, rate: 0.76, preferFemale: false },
        lessons: [
          {
            tip: "Lead with value, not need",
            why: "Your personal needs don't motivate your employer. Your contribution and results do.",
            bad: { user: "I've been here two years and I really need more money.", ai: "*(flatly)* I understand, but budget is tight right now.", note: "❌ Led with personal need. Gave them nothing to justify saying yes." },
            good: { user: "Over the past year I've taken on three new responsibilities and led two successful projects.", ai: "*(leans forward)* That's true. Tell me more about the impact.", note: "✓ Led with value and results. Now they have a reason to say yes." },
          },
          {
            tip: "Know your number and say it",
            why: "Vague requests get vague answers. Confidence means being specific.",
            bad: { user: "I was hoping for maybe a little bump if possible.", ai: "We'll see what we can do. *(noncommittal smile)*", note: "❌ Wishy-washy. No number, no urgency. Nothing will happen." },
            good: { user: "Based on my research and my expanded role, I'm looking for a 12% increase.", ai: "That's specific. Walk me through your reasoning.", note: "✓ Specific. Confident. They took it seriously. Real conversation started." },
          },
          {
            tip: "Invite dialogue instead of demanding",
            why: "Collaborative tone makes managers feel like partners, not opponents.",
            bad: { user: "I deserve this raise and I've been waiting too long.", ai: "*(stiffens)* I hear that you're frustrated, but...", note: "❌ Adversarial. They got defensive. Now it's a standoff." },
            good: { user: "I'd love to hear your perspective on where you see my value going forward.", ai: "*(relaxes)* I appreciate you asking. Here's what I've noticed...", note: "✓ Invited their input. They feel like a collaborator. Conversation opened." },
          },
        ],
        suggestions: [
          ["I'd love to talk about my compensation — do you have a few minutes?", "I've been reflecting on my contributions this year and want to have an honest conversation.", "I want to talk about my growth here and what that looks like going forward."],
          ["Over the past year I've taken on X, led Y, and delivered Z.", "I've done some market research and I think there's a gap worth discussing.", "I'm asking for a 12% increase based on my expanded role and impact."],
          ["I'd love to hear your perspective on where you see my value.", "What would make this an easy yes for you?", "Is there something specific I should be doing to get there?"],
          ["I'm committed to this team — I want to grow here long-term.", "What's the process for revisiting compensation?", "I appreciate you hearing me out on this."],
          ["Can we set a timeline to revisit this?", "What metrics matter most to you when you think about my role?", "I want to make this as easy as possible to say yes to."],
          ["Thank you for your time — I'll follow up in writing.", "I look forward to continuing this conversation.", "I'm confident we can find something that works for both of us."],
        ],
        prompt: `You are a fair-minded manager. You respond positively to clear evidence-based cases and specific numbers. You get slightly defensive if someone seems demanding or emotional. You genuinely want to support good employees but need justification to bring to your own leadership.\n\nBODY LANGUAGE: Every 2 messages, add an italicized body language cue in parentheses.`,
      },
    ],
  },
];

const SYSTEM_PROMPT = (situation: string, aiRole: string) => `You are playing the role of ${aiRole} in a nurturing social confidence training exercise.

${situation}

Core rules:
1. Stay in character as ${aiRole}. Be realistic but warm — this is a safe space to learn and grow.
2. Keep ALL in-character responses SHORT: 1-3 sentences max. This is spoken conversation practice.
3. React authentically. Good communication opens the door. Poor communication gets gentle realistic pushback.
4. Include body language cues as instructed — these are critical for the training.
5. Never break character or give coaching during the conversation.

After exactly 6 user messages, give feedback in this EXACT format:

---FEEDBACK---
WARMTH: [1-10]
CLARITY: [1-10]
LISTENING: [1-10]
CONFIDENCE: [1-10]
BODY_LANGUAGE_AWARENESS: [1-10]
BEST_MOMENT: [the single best thing they said or did — be specific and genuinely encouraging]
BODY_LANGUAGE_NOTES: [2-3 warm specific sentences on how well they read and responded to body language cues]
IMPROVE: [one specific gentle actionable suggestion for next time]
VERDICT: [2-3 sentence warm encouraging coaching summary — celebrate their growth and effort]
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
      return <span key={i} style={{ display: "block", marginTop: "6px", fontSize: "12px", color: "#52796f", fontStyle: "italic" }}>— {clean}</span>;
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
  const [lessonIndex, setLessonIndex] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [inputMode, setInputMode] = useState<"voice"|"type">("type");
  const [feedback, setFeedback] = useState<any>(null);
  const [userTurns, setUserTurns] = useState(0);
  const [customWho, setCustomWho] = useState("");
  const [customSituation, setCustomSituation] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<any>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { window.speechSynthesis.onvoiceschanged = () => {}; window.speechSynthesis.getVoices(); }, []);

  const accent = selectedCategory?.accent || "#2d6a4f";
  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", border: "1.5px solid #d8e8e0", borderRadius: "10px", fontSize: "14px", fontFamily: "Georgia, serif", color: "#1a2e1a", background: "#fff", outline: "none" };

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported in this browser. Please use Chrome.");
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

  function startCustomChat() {
    if (!customWho.trim() || !customSituation.trim() || !customGoal.trim()) return;
    const situation = {
      title: `Talking to: ${customWho}`,
      subtitle: customSituation,
      prompt: `You are playing the role of ${customWho}.\n\nThe situation: ${customSituation}\n\nThe user's goal: ${customGoal}\n\nBe warm, realistic, and encouraging. Every 2 messages add an italicized body language cue in parentheses.`,
      ai_role: customWho,
      voice: { pitch: 1.05, rate: 0.8, preferFemale: true },
      suggestions: [
        ["Say something genuine and warm.", "Ask an open-ended question.", "Share something real about yourself."],
        ["Acknowledge what they just shared.", "Ask a follow-up question.", "Validate how they're feeling."],
      ],
    };
    setSelectedCategory({ accent: "#2d6a4f", color: "#f0f7f4" });
    startChat(situation);
  }

  async function sendMessage(text: string) {
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setTranscript("");
    setTypedMessage("");
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
      setMessages([...newMessages, { role: "assistant", content: parsed.raw || "That was a wonderful conversation." }]);
      setPhase("done");
      setSpeaking(true);
      speak(parsed.verdict || "Well done.", { pitch: 1.0, rate: 0.78, preferFemale: true }, () => setSpeaking(false));
    } else {
      setMessages([...newMessages, { role: "assistant", content: reply }]);
      setSpeaking(true);
      speak(reply, selectedSituation.voice, () => setSpeaking(false));
    }
    setLoading(false);
  }

  function reset() {
    setPhase("home"); setSelectedCategory(null); setSelectedSituation(null);
    setMessages([]); setFeedback(null); setUserTurns(0);
    setTranscript(""); setTypedMessage(""); setLessonIndex(0);
    setCustomWho(""); setCustomSituation(""); setCustomGoal("");
    window.speechSynthesis.cancel();
  }

  const totalScore = feedback
    ? Math.round((feedback.warmth + feedback.clarity + feedback.listening + feedback.confidence + feedback.bodyLanguage) / 5)
    : null;

  const currentSuggestions = selectedSituation?.suggestions?.[Math.min(userTurns, (selectedSituation?.suggestions?.length || 1) - 1)] || [];

  // HOME
  if (phase === "home") return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "72px 24px 48px" }}>
        <div style={{ marginBottom: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{ width: "3px", height: "40px", background: "#2d6a4f", borderRadius: "2px" }} />
            <h1 style={{ fontSize: "48px", fontWeight: "400", margin: 0, color: "#1a2e1a", letterSpacing: "-1px" }}>FORTE</h1>
          </div>
          <p style={{ color: "#52796f", fontSize: "16px", margin: "0 0 0 17px", lineHeight: 1.7, fontStyle: "italic" }}>
            Learn first. Then practice.<br />Build the confidence to connect with anyone.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {SCENARIOS.map((s) => (
            <button key={s.category} onClick={() => { setSelectedCategory(s); setPhase("scenario"); }}
              style={{ background: "#fff", border: "1px solid #d8e8e0", borderRadius: "16px", padding: "28px 24px", textAlign: "left", cursor: "pointer", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.accent; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${s.accent}18`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ color: s.accent, marginBottom: "14px" }}><Icon html={ICONS[s.iconKey as keyof typeof ICONS]} size={28} color={s.accent} /></div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#1a2e1a", marginBottom: "4px", fontFamily: "-apple-system, sans-serif" }}>{s.category}</div>
              <div style={{ fontSize: "12px", color: "#84a98c" }}>{s.situations.length} scenarios</div>
            </button>
          ))}
          <button onClick={() => setPhase("custom")}
            style={{ background: "#fff", border: "1px dashed #b7d8c8", borderRadius: "16px", padding: "28px 24px", textAlign: "left", cursor: "pointer", transition: "all 0.25s", gridColumn: "span 2" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2d6a4f"; e.currentTarget.style.background = "#f0f7f4"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#b7d8c8"; e.currentTarget.style.background = "#fff"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <Icon html={ICONS.custom} size={28} color="#2d6a4f" />
              <div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif" }}>Create Your Own Scenario</div>
                <div style={{ fontSize: "13px", color: "#84a98c", marginTop: "2px" }}>Describe any situation you want to practice</div>
              </div>
            </div>
          </button>
        </div>
        <p style={{ textAlign: "center", color: "#b7c9be", fontSize: "12px", marginTop: "48px", fontFamily: "-apple-system, sans-serif" }}>
          Learn with examples · Practice with AI · Get personal coaching feedback
        </p>
      </div>
    </div>
  );

  // CUSTOM
  if (phase === "custom") return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
        <button onClick={() => setPhase("home")} style={{ background: "transparent", border: "none", color: "#84a98c", cursor: "pointer", fontSize: "14px", marginBottom: "40px", padding: 0, fontFamily: "-apple-system, sans-serif" }}>← Back</button>
        <h2 style={{ fontSize: "28px", fontWeight: "400", margin: "0 0 8px", color: "#1a2e1a" }}>Your Scenario</h2>
        <p style={{ color: "#84a98c", fontSize: "14px", marginBottom: "36px", fontFamily: "-apple-system, sans-serif" }}>Fill in the details and we'll create a practice conversation just for you.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#52796f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>Who are you talking to?</label>
            <input value={customWho} onChange={e => setCustomWho(e.target.value)} placeholder="e.g. my teenager, a coworker I like, my ex..." style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#52796f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>What's the situation?</label>
            <textarea value={customSituation} onChange={e => setCustomSituation(e.target.value)} placeholder="e.g. My teenager has been shutting me out. I want to reconnect without pushing them away." rows={3} style={{ ...inputStyle, resize: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#52796f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>What's your goal?</label>
            <input value={customGoal} onChange={e => setCustomGoal(e.target.value)} placeholder="e.g. Get them to open up without pressure" style={inputStyle} />
          </div>
          <button onClick={startCustomChat} disabled={!customWho.trim() || !customSituation.trim() || !customGoal.trim()}
            style={{ padding: "16px", background: customWho && customSituation && customGoal ? "#2d6a4f" : "#d8e8e0", color: customWho && customSituation && customGoal ? "#fff" : "#84a98c", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: customWho && customSituation && customGoal ? "pointer" : "not-allowed", fontFamily: "-apple-system, sans-serif", marginTop: "8px" }}>
            Start Practice →
          </button>
        </div>
      </div>
    </div>
  );

  // SCENARIO PICKER
  if (phase === "scenario") return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}>
        <button onClick={() => setPhase("home")} style={{ background: "transparent", border: "none", color: "#84a98c", cursor: "pointer", fontSize: "14px", marginBottom: "40px", padding: 0, fontFamily: "-apple-system, sans-serif" }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <Icon html={ICONS[selectedCategory.iconKey as keyof typeof ICONS]} size={24} color={selectedCategory.accent} />
          <h2 style={{ fontSize: "28px", fontWeight: "400", margin: 0, color: "#1a2e1a" }}>{selectedCategory.category}</h2>
        </div>
        <p style={{ color: "#84a98c", fontSize: "14px", marginBottom: "32px", fontFamily: "-apple-system, sans-serif" }}>Choose a scenario — you'll learn first, then practice</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {selectedCategory.situations.map((s: any, i: number) => (
            <button key={i} onClick={() => { setSelectedSituation(s); setLessonIndex(0); setPhase("learn"); }}
              style={{ background: "#fff", border: "1px solid #d8e8e0", borderRadius: "14px", padding: "22px 24px", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = selectedCategory.accent; e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = `0 4px 20px ${selectedCategory.accent}14`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "#1a2e1a", marginBottom: "4px", fontFamily: "-apple-system, sans-serif" }}>{s.title}</div>
                  <div style={{ fontSize: "13px", color: "#84a98c", fontStyle: "italic" }}>{s.subtitle}</div>
                </div>
                <div style={{ fontSize: "11px", color: selectedCategory.accent, fontWeight: "600", fontFamily: "-apple-system, sans-serif", background: selectedCategory.color, padding: "4px 10px", borderRadius: "99px", whiteSpace: "nowrap", marginLeft: "12px" }}>Learn first</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // LEARN PHASE
  if (phase === "learn" && selectedSituation?.lessons) {
    const lessons = selectedSituation.lessons;
    const lesson = lessons[lessonIndex];
    const isLast = lessonIndex >= lessons.length - 1;
    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 60px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
            <button onClick={() => setPhase("scenario")} style={{ background: "transparent", border: "none", color: "#84a98c", cursor: "pointer", fontSize: "14px", padding: 0, fontFamily: "-apple-system, sans-serif" }}>← Back</button>
            <div style={{ display: "flex", gap: "8px" }}>
              {lessons.map((_: any, i: number) => (
                <div key={i} style={{ width: "28px", height: "4px", borderRadius: "2px", background: i <= lessonIndex ? accent : "#d8e8e0", transition: "background 0.3s" }} />
              ))}
            </div>
            <div style={{ fontSize: "12px", color: "#84a98c", fontFamily: "-apple-system, sans-serif" }}>Tip {lessonIndex + 1} of {lessons.length}</div>
          </div>

          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", color: "#84a98c", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", marginBottom: "8px" }}>LEARN · {selectedSituation.title}</div>
          <h2 style={{ fontSize: "30px", fontWeight: "400", color: "#1a2e1a", margin: "0 0 8px", lineHeight: 1.2 }}>{lesson.tip}</h2>
          <p style={{ color: "#52796f", fontSize: "15px", margin: "0 0 32px", lineHeight: 1.7, fontStyle: "italic" }}>{lesson.why}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
            <div style={{ background: "#fff8f8", border: "1px solid #fcc", borderRadius: "16px", padding: "22px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#c0392b", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", marginBottom: "14px" }}>Less Effective</div>
              <div style={{ background: "#fff", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: "#333", lineHeight: 1.6, marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", color: "#bbb", marginBottom: "4px", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>YOU</div>
                {lesson.bad.user}
              </div>
              <div style={{ background: "#fff0f0", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: "#333", lineHeight: 1.6, marginBottom: "12px" }}>
                <div style={{ fontSize: "10px", color: "#bbb", marginBottom: "4px", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>THEM</div>
                {lesson.bad.ai}
              </div>
              <div style={{ fontSize: "12px", color: "#c0392b", lineHeight: 1.6, fontStyle: "italic" }}>{lesson.bad.note}</div>
            </div>
            <div style={{ background: "#f0faf4", border: "1px solid #b7d8c8", borderRadius: "16px", padding: "22px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#2d6a4f", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", marginBottom: "14px" }}>More Effective</div>
              <div style={{ background: "#fff", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: "#333", lineHeight: 1.6, marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", color: "#bbb", marginBottom: "4px", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>YOU</div>
                {lesson.good.user}
              </div>
              <div style={{ background: "#e6f5ec", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: "#333", lineHeight: 1.6, marginBottom: "12px" }}>
                <div style={{ fontSize: "10px", color: "#bbb", marginBottom: "4px", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>THEM</div>
                {lesson.good.ai}
              </div>
              <div style={{ fontSize: "12px", color: "#2d6a4f", lineHeight: 1.6, fontStyle: "italic" }}>{lesson.good.note}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {lessonIndex > 0 && (
              <button onClick={() => setLessonIndex(i => i - 1)} style={{ flex: 1, padding: "15px", background: "#f0f7f4", color: "#2d6a4f", border: "1px solid #d8e8e0", fontSize: "14px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>← Previous</button>
            )}
            <button onClick={() => isLast ? startChat(selectedSituation) : setLessonIndex(i => i + 1)}
              style={{ flex: 1, padding: "15px", background: accent, color: "#fff", border: "none", fontSize: "14px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>
              {isLast ? "Start Practice →" : "Next Tip →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CHAT + DONE
  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e8f0ec", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", color: "#84a98c", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif" }}>FORTE · Practice</div>
          <div style={{ fontSize: "15px", color: "#1a2e1a", marginTop: "2px" }}>{selectedSituation?.title}</div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: i <= userTurns ? accent : "#d8e8e0", transition: "background 0.3s" }} />
          ))}
        </div>
      </div>

      <div style={{ background: selectedCategory?.color || "#f0f7f4", borderBottom: "1px solid #e8f0ec", padding: "10px 24px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "13px", color: "#52796f", fontStyle: "italic" }}>Talking to: {selectedSituation?.ai_role}</span>
        <span style={{ fontSize: "12px", color: "#84a98c", fontFamily: "-apple-system, sans-serif" }}>{Math.max(0, 6 - userTurns)} turns until feedback</span>
      </div>

      <div style={{ background: "#eaf4ef", padding: "8px 24px", fontSize: "12px", color: "#2d6a4f", fontFamily: "-apple-system, sans-serif", borderBottom: "1px solid #d8edd6" }}>
        💡 Body language cues appear in <em>italics</em> — they reveal what they're really feeling
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {messages.map((m: any, i: number) => (
          <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: m.role === "user" ? accent : "#e8f0ec", border: m.role === "assistant" ? "1px solid #d8e8e0" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", flexShrink: 0, color: m.role === "user" ? "#fff" : "#52796f", fontFamily: "-apple-system, sans-serif", fontWeight: "700" }}>
              {m.role === "user" ? "You" : "AI"}
            </div>
            <div style={{ maxWidth: "74%", padding: "14px 18px", background: m.role === "user" ? accent : "#fff", borderRadius: m.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px", fontSize: "14px", lineHeight: "1.7", color: m.role === "user" ? "#fff" : "#1a2e1a", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              {m.role === "assistant" ? renderMessage(m.content) : m.content}
            </div>
          </div>
        ))}

        {(loading || speaking) && (
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#e8f0ec", border: "1px solid #d8e8e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#52796f", fontFamily: "-apple-system, sans-serif", fontWeight: "700" }}>AI</div>
            <div style={{ padding: "14px 18px", background: "#fff", borderRadius: "4px 18px 18px 18px", display: "flex", gap: "5px", alignItems: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              {[0,1,2].map((i) => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: accent, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
              <span style={{ fontSize: "12px", color: "#84a98c", marginLeft: "8px", fontFamily: "-apple-system, sans-serif" }}>{speaking ? "speaking..." : "thinking..."}</span>
            </div>
          </div>
        )}

        {phase === "done" && feedback && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", marginTop: "8px", border: "1px solid #d8e8e0", boxShadow: "0 4px 24px rgba(45,106,79,0.06)" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.2em", color: "#84a98c", textTransform: "uppercase", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>Your Session Score</div>
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
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#d4a017", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>One Thing to Try Next Time</div>
                <div style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.7 }}>{feedback.improve}</div>
              </div>
            )}
            {feedback.verdict && (
              <div style={{ marginTop: "12px", padding: "18px", background: "#f8faf8", borderRadius: "12px" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>Coach's Note</div>
                <div style={{ fontSize: "15px", color: "#1a2e1a", lineHeight: 1.8, fontStyle: "italic" }}>{feedback.verdict}</div>
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button onClick={() => { setLessonIndex(0); setPhase("learn"); }} style={{ flex: 1, padding: "13px", background: "#f0f7f4", color: "#2d6a4f", border: "1px solid #d8e8e0", fontSize: "13px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>Review Tips</button>
              <button onClick={() => startChat(selectedSituation)} style={{ flex: 1, padding: "13px", background: accent, color: "#fff", border: "none", fontSize: "13px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>Try Again</button>
              <button onClick={reset} style={{ flex: 1, padding: "13px", background: "#fff", color: "#84a98c", border: "1px solid #e8f0ec", fontSize: "13px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>New</button>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {phase === "chat" && (
        <div style={{ background: "#fff", borderTop: "1px solid #e8f0ec", padding: "14px 24px", flexShrink: 0 }}>
          {!loading && !speaking && currentSuggestions.length > 0 && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginBottom: "7px", fontWeight: "600", letterSpacing: "0.05em", textTransform: "uppercase" }}>Try saying:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {currentSuggestions.map((s: string, i: number) => (
                  <button key={i} onClick={() => sendMessage(s)}
                    style={{ background: "#f0f7f4", border: "1px solid #d8e8e0", borderRadius: "10px", padding: "9px 14px", textAlign: "left", cursor: "pointer", fontSize: "13px", color: "#2d6a4f", fontFamily: "Georgia, serif", lineHeight: 1.4, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#e0f0e8"; e.currentTarget.style.borderColor = accent; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f0f7f4"; e.currentTarget.style.borderColor = "#d8e8e0"; }}>
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", gap: "8px" }}>
            <button onClick={() => setInputMode("type")} style={{ padding: "5px 14px", background: inputMode === "type" ? accent : "#f0f7f4", color: inputMode === "type" ? "#fff" : "#52796f", border: "none", borderRadius: "99px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>⌨️ Type</button>
            <button onClick={() => setInputMode("voice")} style={{ padding: "5px 14px", background: inputMode === "voice" ? accent : "#f0f7f4", color: inputMode === "voice" ? "#fff" : "#52796f", border: "none", borderRadius: "99px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>🎤 Voice</button>
          </div>

          {inputMode === "type" ? (
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
              <textarea value={typedMessage} onChange={e => setTypedMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(typedMessage.trim()); } }}
                placeholder="Type your own response... (Enter to send)"
                disabled={loading || speaking} rows={2}
                style={{ flex: 1, padding: "12px 16px", border: "1.5px solid #d8e8e0", borderRadius: "12px", fontSize: "14px", fontFamily: "Georgia, serif", color: "#1a2e1a", background: "#fff", outline: "none", resize: "none" }} />
              <button onClick={() => sendMessage(typedMessage.trim())} disabled={!typedMessage.trim() || loading || speaking}
                style={{ padding: "12px 18px", background: typedMessage.trim() && !loading && !speaking ? accent : "#e8f0ec", color: typedMessage.trim() && !loading && !speaking ? "#fff" : "#84a98c", border: "none", borderRadius: "12px", fontSize: "14px", cursor: typedMessage.trim() && !loading && !speaking ? "pointer" : "not-allowed", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>
                Send →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              {transcript && <div style={{ fontSize: "13px", color: "#84a98c", fontStyle: "italic", textAlign: "center" }}>"{transcript}"</div>}
              <button onMouseDown={startListening} onMouseUp={stopListeningAndSend} onTouchStart={startListening} onTouchEnd={stopListeningAndSend}
                disabled={loading || speaking}
                style={{ width: "68px", height: "68px", borderRadius: "50%", background: listening ? "#c0392b" : loading || speaking ? "#e8f0ec" : accent, border: listening ? "4px solid #e8a89e" : "4px solid transparent", cursor: loading || speaking ? "not-allowed" : "pointer", fontSize: "24px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: listening ? "0 0 0 12px rgba(192,57,43,0.1)" : `0 6px 20px ${accent}30`, transition: "all 0.15s" }}>
                {listening ? "🎙️" : loading || speaking ? "⏳" : "🎤"}
              </button>
              <div style={{ fontSize: "11px", color: "#84a98c", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>
                {listening ? "Release to send" : loading ? "Thinking..." : speaking ? "Listen carefully..." : "Hold to speak"}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.1); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f8faf8; }
        ::-webkit-scrollbar-thumb { background: #d8e8e0; border-radius: 2px; }
        input:focus, textarea:focus { border-color: #2d6a4f !important; }
      `}</style>
    </div>
  );
}
