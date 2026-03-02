"use client";
import { useState, useRef, useEffect } from "react";

const ICONS = {
  romance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  friends: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  work: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
  family: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  custom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  couple: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><line x1="12" y1="8" x2="12" y2="13"/></svg>`,
};

const SCENARIOS = [
  {
    category: "Family Conversations",
    iconKey: "family",
    color: "#f7f4f0",
    accent: "#52796f",
    situations: [
      {
        subcategory: "Parenting",
        tag: "Teen",
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
        subcategory: "Family dynamics",
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
        subcategory: "Family dynamics",
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
      {
        subcategory: "Family dynamics",
        title: "Talking to an aging parent about needing help",
        subtitle: "They're struggling but won't ask for it.",
        ai_role: "your aging parent",
        voice: { pitch: 0.85, rate: 0.75, preferFemale: false },
        lessons: [
          {
            tip: "Lead with love, not logistics",
            why: "Aging parents often fear losing independence. Framing the conversation around love — not problems — keeps them open.",
            bad: { user: "Mom, you can't keep driving. It's not safe anymore.", ai: "I've been driving for 50 years. I'm perfectly fine.", note: "❌ Led with the problem and a direct challenge. Triggered defensiveness immediately." },
            good: { user: "I've been thinking about you a lot lately. I want to make sure I'm showing up for you the way you've always shown up for me.", ai: "*(softens)* That means a lot to hear.", note: "✓ Love first. They feel valued, not managed. The door opens." },
          },
          {
            tip: "Ask what they want — don't assume",
            why: "Adults of any age want to feel they have a say in their own lives. Asking first gives them dignity.",
            bad: { user: "I've already looked into some assisted living places nearby.", ai: "*(stiffens)* I am not going to a home.", note: "❌ You decided for them. They feel ambushed and stripped of control." },
            good: { user: "What would feel like support to you — without it feeling like we're taking over?", ai: "*(thinks)* I suppose having someone help with grocery shopping wouldn't be the worst thing.", note: "✓ They got to define what help looks like. Buy-in came from them, not you." },
          },
          {
            tip: "Name your fear, not their failure",
            why: "Telling them what YOU feel creates connection. Telling them what they can't do creates conflict.",
            bad: { user: "You've fallen twice and you won't remember to take your pills.", ai: "You're exaggerating. I'm doing fine.", note: "❌ Listing their failures. They feel judged and reduced." },
            good: { user: "Honestly? I get scared sometimes. I love you and I don't want anything to happen to you.", ai: "*(quietly)* I didn't know you worried that much.", note: "✓ Your vulnerability landed differently. They heard love, not criticism." },
          },
        ],
        suggestions: [
          ["I've been thinking about you a lot. I want to show up for you better.", "Can we talk about something that's been on my heart?", "I love you — that's why I want to have this conversation."],
          ["What would feel like support without feeling like we're taking over?", "What's been the hardest part of things lately?", "I'm not here to take anything away from you."],
          ["Honestly I get scared sometimes. I love you so much.", "I don't want to wait until something happens to have this conversation.", "What do you wish we understood better about how you're doing?"],
          ["What would your ideal setup look like if you could design it?", "Is there anything that would make things easier day to day?", "I want to figure this out with you, not for you."],
          ["Whatever we decide, we decide together.", "Your independence matters to me too.", "Thank you for letting me bring this up."],
          ["Let's take this one step at a time.", "I'm not going anywhere — I'll be here through all of it.", "You've taken care of everyone else. Let us take care of you a little."],
        ],
        prompt: `You are an aging parent who values your independence deeply. You are a little resistant when people suggest you need help — it feels like they're saying you can't manage anymore. Soften if they approach with genuine love and ask what YOU want rather than telling you what's going to happen.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue. Examples: *(crosses arms then slowly uncrosses)*, *(looks down quietly)*, *(eyes well up briefly)*.`,
      },
      {
        subcategory: "Family dynamics",
        title: "Sibling conflict — clearing old resentment",
        subtitle: "Something from the past is still between you.",
        ai_role: "your sibling",
        voice: { pitch: 1.05, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Own your part first",
            why: "Going in with grievances puts them on defense. Acknowledging your own role disarms the whole room.",
            bad: { user: "You've always made me feel like the less important one in this family.", ai: "Are you serious? Do you know how hard things were for me too?", note: "❌ Grievance-first. They got defensive. Now it's a competition about who had it worse." },
            good: { user: "I've been thinking about us and I realize I haven't always shown up the way I should have either.", ai: "*(surprised pause)* I wasn't expecting you to say that.", note: "✓ Owning your part disarmed them. They're actually listening now." },
          },
          {
            tip: "Say what you miss, not what they did wrong",
            why: "People can't argue with what you miss. But they will defend against accusations.",
            bad: { user: "You stopped calling after Dad's funeral and that was really messed up.", ai: "I was going through my own stuff. You have no idea.", note: "❌ Accusation. They defended. You're further apart now." },
            good: { user: "I miss us. I miss feeling like we were on the same team.", ai: "*(quietly)* I miss that too. I didn't think you felt that way.", note: "✓ You named the longing. They didn't need to defend against that." },
          },
          {
            tip: "Ask what they need to move forward",
            why: "Closure isn't just about your healing. Asking what THEY need shows you care about the relationship, not just your own relief.",
            bad: { user: "I just need you to admit that what you did hurt me.", ai: "I've already apologized a hundred times. What do you want from me?", note: "❌ You're still stuck on the past. They feel like nothing they do is enough." },
            good: { user: "What would need to happen for things to feel different between us?", ai: "*(long pause)* I think I just need to know you actually want me in your life.", note: "✓ Future-focused. They told you exactly what they need. Now you can give it." },
          },
        ],
        suggestions: [
          ["I've been thinking about us and I want things to be different.", "I miss you. I miss feeling like we were on the same team.", "I know things have been distant. I don't want that anymore."],
          ["I realize I haven't always shown up the way I should have either.", "I'm not here to rehash everything — I'm here because I want you back.", "What do you think got us here?"],
          ["What would need to happen for things to feel different between us?", "I want to understand your side better.", "I don't need you to be perfect. I just want us to be real with each other."],
          ["I'm sorry for the ways I've contributed to this distance.", "I hear how much that hurt you.", "You're my sibling — that means something that doesn't go away."],
          ["What do you need from me going forward?", "I want to earn your trust back — tell me how.", "Can we just start from here?"],
          ["I love you. That's why I'm here.", "Let's not waste any more time being strangers.", "Whatever happened before — I choose you now."],
        ],
        prompt: `You are a sibling who has been emotionally distant after an old conflict. You have hurt feelings but also miss the closeness. Be guarded at first. Open up if they acknowledge their own role, say what they miss (not what you did wrong), and ask what YOU need rather than just demanding apology.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue. Examples: *(looks away, jaw tight)*, *(lets out a slow breath)*, *(eyes soften unexpectedly)*.`,
      },
      {
        subcategory: "Family dynamics",
        title: "Supporting a family member through depression",
        subtitle: "They're struggling. You want to help without saying the wrong thing.",
        ai_role: "a family member dealing with depression",
        voice: { pitch: 1.0, rate: 0.76, preferFemale: true },
        lessons: [
          {
            tip: "Don't try to fix the feeling",
            why: "Depression isn't a problem to be solved with positivity or logic. Trying to 'fix it' makes people feel more alone.",
            bad: { user: "You have so much to be grateful for. Things could be so much worse.", ai: "*(flatly)* I know. I just can't feel it right now.", note: "❌ Silver linings dismiss their reality. They feel misunderstood and pull back." },
            good: { user: "I'm not going to pretend I understand exactly what this feels like. But I'm here.", ai: "*(quietly)* That actually means a lot.", note: "✓ No fixing. Just presence. That's what they needed to hear." },
          },
          {
            tip: "Ask specific, small questions",
            why: "'How are you doing?' is too big when someone is depressed. Small, specific questions are easier to answer.",
            bad: { user: "How are you doing? Are you feeling any better?", ai: "I don't know. The same I guess.", note: "❌ Too broad. Too much pressure to summarize a complex internal state." },
            good: { user: "Did you manage to eat anything today?", ai: "*(small nod)* Yeah, I had some cereal this morning.", note: "✓ Small, manageable, no pressure. A real answer came back." },
          },
          {
            tip: "Show up consistently, not just in crisis",
            why: "One big gesture fades. Small, steady presence builds the trust that matters in dark times.",
            bad: { user: "I'm so worried about you. Is there anything I can do? Anything at all?", ai: "*(overwhelmed)* I don't know. I can't think right now.", note: "❌ Too much urgency. They don't have the bandwidth to coordinate your help right now." },
            good: { user: "I'm going to check in tomorrow. Not to talk about anything heavy — just to say hi.", ai: "*(softly)* Okay. Yeah. That would be nice.", note: "✓ Specific and low pressure. You made a promise they can count on." },
          },
        ],
        suggestions: [
          ["I'm not going to pretend I know exactly what this feels like. But I'm here.", "You don't have to be okay right now. I'm not going anywhere.", "I just wanted to check in. No agenda."],
          ["Did you manage to eat anything today?", "How did you sleep last night?", "Is there one small thing that felt even slightly okay today?"],
          ["You don't have to talk if you don't want to. I can just sit with you.", "I'm going to check in tomorrow — not about anything heavy, just to say hi.", "What's one thing that might feel manageable today?"],
          ["I love you. That doesn't change based on how you're doing.", "There's no version of this where I stop showing up.", "You don't have to earn support from me."],
          ["Is there anything that would make today even slightly easier?", "Can I bring you something? Food, company, nothing at all — whatever works.", "I'm proud of you for still being here."],
          ["You matter to me more than you know.", "Whatever you need — even if it's space — just tell me.", "I'm not going anywhere. I'll be here tomorrow too."],
        ],
        prompt: `You are dealing with depression. You are exhausted and it's hard to engage. You are not unreachable — but big questions and forced positivity make you shut down. Respond warmly to simple, specific acts of care and presence. Open up very slightly if they show up without agenda.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue. Examples: *(stares at hands)*, *(nods very slightly)*, *(a small, tired smile)*.`,
      },
      {
        subcategory: "Family dynamics",
        title: "Telling your family you're changing careers",
        subtitle: "It's your life. But their reaction matters to you.",
        ai_role: "a parent who had high expectations for your career",
        voice: { pitch: 0.88, rate: 0.78, preferFemale: false },
        lessons: [
          {
            tip: "Lead with your reasoning, not your announcement",
            why: "A sudden announcement triggers a reaction. Walking them through your thinking invites them into your process.",
            bad: { user: "I'm leaving my job at the firm. I've decided to become a teacher.", ai: "What? After everything we sacrificed to get you there?", note: "❌ Announcement without context. They felt blindsided and reacted from fear." },
            good: { user: "I've been doing a lot of reflecting lately and I want to share something I've been thinking through.", ai: "*(leans forward)* Okay... what's going on?", note: "✓ You invited them into the process. They're curious, not defensive yet." },
          },
          {
            tip: "Acknowledge their investment before asking for support",
            why: "Parents who sacrificed for your career need to hear that their effort mattered — even if you're changing direction.",
            bad: { user: "It was my life and my choice. I don't need your approval.", ai: "*(hurt)* I see. Fine.", note: "❌ Dismisses their care entirely. They feel irrelevant and hurt." },
            good: { user: "I know how much you gave to support me getting here. That means everything. And I want to do something that lets me actually give back.", ai: "*(pauses)* Tell me more about what you mean.", note: "✓ Honored their sacrifice. They felt seen. Now they're listening." },
          },
          {
            tip: "Show that you've thought it through",
            why: "Fear drives parental pushback. Showing a real plan reduces their fear — even if they still disagree.",
            bad: { user: "I just feel like it's the right thing. I have to follow my heart.", ai: "Following your heart doesn't pay rent.", note: "❌ No plan = their fear spikes. 'Follow your heart' sounds reckless to them." },
            good: { user: "I've spent six months researching this. I have a financial plan, a timeline, and I've already started training.", ai: "*(surprised)* You've really thought this through.", note: "✓ Preparation showed maturity. Their fear dropped. They're reconsidering." },
          },
        ],
        suggestions: [
          ["I've been doing some deep reflecting and I want to share something with you.", "This is important to me and so is your reaction — so I want to do this conversation right.", "Can I walk you through something I've been thinking about for a while?"],
          ["I know how much you invested in getting me here. That means everything to me.", "I'm not throwing anything away — I'm building something new.", "I've spent months thinking this through carefully."],
          ["I have a real plan — financially, professionally, with a clear timeline.", "This isn't impulsive. I've done my homework.", "I want to show you what I've figured out."],
          ["I know this isn't what you expected. I understand if it's hard to hear.", "Your support matters to me even if we see this differently.", "I'm not asking you to agree — I'm asking you to believe in me."],
          ["What's your biggest concern? I want to address it honestly.", "I love you. That's why I wanted you to hear this from me directly.", "What would help you feel better about this?"],
          ["This is the most myself I've felt in years.", "I want you to be proud of me — and I need to do this to make that possible.", "I hope eventually you'll see why this was the right move."],
        ],
        prompt: `You are a parent who sacrificed a lot to help your child succeed in their career. You're worried about financial stability and what other people will think. You are not villainous — you are scared. Soften if they acknowledge your sacrifices, show they've planned carefully, and invite you into the conversation instead of just announcing.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue. Examples: *(frowns, then loosens)*, *(rubs forehead)*, *(nods slowly, processing)*.`,
      },
      {
        subcategory: "Parenting",
        tag: "Preteen",
        title: "Connecting with a preteen pulling away",
        subtitle: "Ages 9–12: they're not little kids anymore, but not teens yet.",
        ai_role: "your 11-year-old",
        voice: { pitch: 1.25, rate: 0.82, preferFemale: false },
        lessons: [
          {
            tip: "Enter their world instead of pulling them into yours",
            why: "Preteens are forming identity by separating from parents. Meeting them where they are feels safer than being summoned to your world.",
            bad: { user: "Can you please put down the iPad and talk to me for a minute?", ai: "*(sighs, puts it down reluctantly)* What.", note: "❌ You put them on defense before a word was said. Their guard is fully up." },
            good: { user: "What are you playing? Can I watch for a sec?", ai: "*(surprised, a little pleased)* It's Minecraft. I'm building a castle. Wanna see?", note: "✓ You entered their world. They felt respected and invited you in." },
          },
          {
            tip: "Ask about their social world specifically",
            why: "Preteens are intensely focused on friendships and belonging. That's where the real stuff lives.",
            bad: { user: "How was school today?", ai: "Fine.", note: "❌ Too broad. 'Fine' is the default shutdown answer for this age group." },
            good: { user: "Who did you eat lunch with today?", ai: "Um... me and Marcus mostly. Jaylen was being weird.", note: "✓ Specific. Social. Relevant to what actually matters to them right now." },
          },
          {
            tip: "React with curiosity, not alarm",
            why: "If they sense that sharing leads to parental anxiety or lectures, they'll stop sharing. Curiosity keeps the door open.",
            bad: { user: "What do you mean Jaylen was being weird? What happened? Are you two fighting?", ai: "*(shuts down)* Never mind, it's nothing.", note: "❌ Too many questions, too much alarm. They regretted opening up." },
            good: { user: "Hm. Weird how?", ai: "He just kept leaving me out of stuff. It's annoying.", note: "✓ One calm question. Low stakes. They kept talking." },
          },
        ],
        suggestions: [
          ["What are you playing? Can I watch for a sec?", "What have you been into lately?", "Can I hang out with you for a bit — no agenda?"],
          ["Who did you eat lunch with today?", "What was the most interesting thing that happened at school?", "What are you and your friends into right now?"],
          ["Hm — what happened?", "That sounds annoying. What did you do?", "I'm curious — how did that make you feel?"],
          ["That makes sense. I'd feel the same way.", "You handled that better than I would have at your age.", "What do you think you're going to do about it?"],
          ["Is there anything that would make tomorrow easier?", "You know you can always tell me this stuff, right?", "I'm always on your team even when things are weird."],
          ["I'm really glad you told me.", "You're a pretty cool person, you know that?", "Want to do something together this weekend?"],
        ],
        prompt: `You are an 11-year-old who is starting to pull away from your parent — not because you don't love them, but because you're figuring out your own identity. You open up if they enter YOUR world with curiosity and no agenda. You shut down if they interrogate you or react with alarm. You care deeply about your friendships and what's happening socially.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue. Examples: *(keeps eyes on screen)*, *(glances over briefly)*, *(turns toward you a little)*.`,
      },
      {
        subcategory: "Parenting",
        tag: "Adult child",
        title: "Reconnecting with an adult child who pulled away",
        subtitle: "They're grown. The relationship needs to evolve.",
        ai_role: "your adult child",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Acknowledge the distance without defending yourself",
            why: "Adult children who pulled away often did so for a reason. Acknowledging it — even without full understanding — opens the door.",
            bad: { user: "I don't know why things have been so distant between us. I feel like I've always been there for you.", ai: "*(guardedly)* Okay.", note: "❌ Subtle defensiveness. They don't feel safe enough to say what's true." },
            good: { user: "I know things have been distant and I take responsibility for my part in that — even the parts I don't fully understand yet.", ai: "*(quietly surprised)* That means a lot to hear.", note: "✓ Ownership without fully knowing why. That honesty landed differently." },
          },
          {
            tip: "Ask what kind of relationship they want now",
            why: "Adult children often want a different relationship than the parent-child one they grew up in. Asking shows you respect who they've become.",
            bad: { user: "I just want things to go back to the way they were.", ai: "*(deflates)* That's kind of the problem.", note: "❌ Signals you want the old dynamic, not a new one. They feel unseen as an adult." },
            good: { user: "What would a good relationship between us look like to you now? I genuinely want to know.", ai: "*(pause, thinking)* Honestly? Just being treated like an adult whose choices are respected.", note: "✓ You asked what they need. They told you exactly. Now you have something real to work with." },
          },
          {
            tip: "Let them set the pace",
            why: "Rushing reconnection makes people feel hunted. Patience signals safety.",
            bad: { user: "I just want to spend more time together. Can we make a regular thing of this?", ai: "*(wary)* I don't know. Let me think about it.", note: "❌ Too much too fast. They felt the pressure and pulled back slightly." },
            good: { user: "I'm not looking to rush anything. I just wanted you to know the door is open — whenever and however you want.", ai: "*(exhales slowly)* I appreciate that more than you know.", note: "✓ No pressure. Just an open door. That's what creates safety." },
          },
        ],
        suggestions: [
          ["I know things have been distant and I take responsibility for my part in that.", "I've been thinking about us and I wanted to reach out.", "I love you and I miss you. I wanted to start there."],
          ["What would a good relationship between us look like to you now?", "How have you been — really?", "What do you need from me to feel good about this?"],
          ["I'm not here to relitigate the past — I'm here because you matter to me.", "I want to know who you are now, not just who I remember.", "What's important to you in your life right now?"],
          ["I'm not looking to rush anything. The door is open whenever you're ready.", "I want to support you in ways that actually feel supportive to you.", "What would feel good to you as a next step?"],
          ["I'm proud of who you've become — I should say that more.", "I'm sorry for the ways I got it wrong.", "You don't have to be my little kid. I want you as my adult child."],
          ["Thank you for giving me the chance to try again.", "I'm going to keep showing up.", "I love you exactly as you are."],
        ],
        prompt: `You are an adult child who has kept some emotional distance from your parent. You have real reasons for the distance but you also miss the connection. You will open up if they take responsibility without being defensive, ask what YOU want from the relationship now (not what they want), and promise no pressure. Remain guarded if they want to return to old dynamics or move too fast.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Extended family",
        title: "When a grandparent feels left out",
        subtitle: "They miss the family. How do you have this conversation?",
        ai_role: "your aging grandparent",
        voice: { pitch: 0.82, rate: 0.72, preferFemale: false },
        lessons: [
          {
            tip: "Name what you see with warmth",
            why: "Grandparents often won't say they feel left out — they don't want to be a burden. Naming it gently gives them permission to be honest.",
            bad: { user: "Grandpa, we've just been really busy lately. You know how it is.", ai: "*(quietly)* Oh I know. Don't worry about me.", note: "❌ Dismissed it before they could speak. They retreated further." },
            good: { user: "Grandpa, I feel like we haven't been as connected lately and I've been thinking about you a lot.", ai: "*(voice softens)* You have? I didn't want to say anything but... I have missed you all.", note: "✓ You named it first. They felt safe to admit what was true." },
          },
          {
            tip: "Make them feel needed, not accommodated",
            why: "Elderly family members don't want to feel like a charity visit. They want to feel useful and valued.",
            bad: { user: "We should come visit soon — maybe Sunday works.", ai: "*(politely)* That would be nice, dear.", note: "❌ Felt like a duty call. Polite but not warm." },
            good: { user: "I've been wanting to ask you about something actually — your recipe for [dish]. Nobody makes it like you do.", ai: "*(lights up)* Oh! You want to learn? Come Saturday and I'll show you.", note: "✓ Made them the expert and the source. They felt needed and excited." },
          },
          {
            tip: "Create a small regular ritual",
            why: "One big visit fades. A simple regular connection becomes something they count on.",
            bad: { user: "We'll try to come more often. I promise.", ai: "*(smiles sadly)* I know you're all so busy.", note: "❌ Vague promise they've heard before. They don't believe it will happen." },
            good: { user: "What if we had a regular Sunday call — just you and me? Even just twenty minutes.", ai: "*(voice brightens)* Every Sunday? I would love that. I'd look forward to it all week.", note: "✓ Specific, small, regular. They could picture it. It became real." },
          },
        ],
        suggestions: [
          ["I've been thinking about you a lot lately. I feel like we haven't been as connected.", "I miss you. I wanted to call and actually say that.", "Can I ask how you've really been doing?"],
          ["I've been wanting your advice on something — you always know what to say.", "Nobody does [thing] like you do. Can you teach me?", "I want to hear some of your stories while I still can — will you tell me about [topic]?"],
          ["What do you miss most about how things used to be?", "Is there something you wish we did more of as a family?", "What would feel really good to you right now?"],
          ["What if we set up a regular call — just you and me?", "I want you to be part of [kid's] life in a real way.", "Let's pick one thing we do together every month."],
          ["You matter so much to this family.", "I don't want to look back and wish I'd called more.", "I love you and I'm glad you're still here."],
          ["Thank you for always being there even when we've been bad about it.", "I'm going to do better.", "I'll talk to you Sunday."],
        ],
        prompt: `You are an aging grandparent who feels disconnected from your family but would never say so unprompted — you don't want to be a burden. You light up if they reach out with genuine warmth, make you feel needed rather than visited out of obligation, and propose something small and consistent. You give polite deflections if they seem to be checking a box.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue. Examples: *(speaks slowly, choosing words)*, *(eyes warm suddenly)*, *(clasps hands together with quiet joy)*.`,
      },
      {
        subcategory: "Extended family",
        title: "Setting limits with family members who ask for money",
        subtitle: "You care about them. But it's becoming a pattern.",
        ai_role: "a family member who frequently asks for financial help",
        voice: { pitch: 1.0, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Separate love from the financial boundary",
            why: "Family members often blur love and money. Clearly separating them prevents the guilt spiral.",
            bad: { user: "I can't keep doing this. It's too much.", ai: "*(hurt)* So you don't want to help your own family?", note: "❌ No separation of love from money. They weaponized the relationship." },
            good: { user: "I love you and I want to be honest with you — which is why I'm having this conversation instead of just avoiding you.", ai: "*(pauses)* Okay. What's going on?", note: "✓ Love stated first. Honesty framed as care. They're listening." },
          },
          {
            tip: "Be specific about what you can and can't do",
            why: "Vague limits invite negotiation. Specific ones are harder to argue with.",
            bad: { user: "I just can't keep lending money like this.", ai: "It's not that much. I'll pay you back.", note: "❌ Vague. They minimized it and offered a promise. Cycle continues." },
            good: { user: "Going forward I'm not going to be able to lend money — not because I don't care but because it's affecting our relationship and my own financial situation.", ai: "*(quietly)* I didn't realize it was affecting you that way.", note: "✓ Clear, specific, with reason. They couldn't argue with your actual reality." },
          },
          {
            tip: "Offer what you CAN give instead",
            why: "A pure no with no alternative feels like abandonment. Offering something different keeps the relationship.",
            bad: { user: "I'm sorry, I just can't help anymore.", ai: "*(coldly)* Fine. I'll figure it out myself.", note: "❌ No alternative offered. They felt abandoned, not lovingly redirected." },
            good: { user: "I can't lend money but I can help you think through other options — like resources or a budget plan. I want to actually help, just differently.", ai: "*(deflates, then nods)* ...okay. That's actually more helpful anyway.", note: "✓ Real alternative offered. They felt cared for even within the boundary." },
          },
        ],
        suggestions: [
          ["I love you and I want to be honest — which is why I'm having this conversation.", "Can I talk to you about something that's been on my mind?", "I care about our relationship which is why I need to say something."],
          ["Going forward I'm not going to be able to lend money — not because I don't care but because it's affecting me.", "I've been saying yes out of guilt and it's not sustainable anymore.", "I need to be honest with you about where I stand."],
          ["I'm not abandoning you — I'm changing how I help.", "I can help you think through options and resources, just not financially.", "What's actually driving the financial stress? Let me understand it better."],
          ["I love you and this boundary comes from that love.", "What would actually help you build more stability?", "I want us to have a real relationship — not one shaped by money."],
          ["I know this is hard to hear. I also know you can handle this.", "You're more capable than you give yourself credit for.", "I'm here for you — just in a different way going forward."],
          ["Thank you for hearing me out.", "I feel better having been honest.", "Let me know how I can support you differently."],
        ],
        prompt: `You frequently turn to this family member for financial help. You feel entitled to some of it but you're not a villain — you're genuinely struggling and have come to rely on them. React defensively if they're vague or seem to be withdrawing love along with the money. Soften if they clearly separate love from the financial boundary and offer real alternative support.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Finance & Budget",
        title: "Talking to your family about financial stress",
        subtitle: "Something is wrong. They need to know.",
        ai_role: "your partner or spouse",
        voice: { pitch: 1.05, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Say the hard thing directly — don't cushion it to death",
            why: "Over-softening financial stress makes partners feel set up for bad news. Clear honesty is actually kinder.",
            bad: { user: "So things have been a little different lately financially... there are some things that have changed...", ai: "*(anxious)* What? What's wrong? Just tell me.", note: "❌ Cushioning created more anxiety, not less. They feared the worst." },
            good: { user: "I need to tell you something about our finances. It's stressful but I want us to face it together.", ai: "*(steadies themselves)* Okay. Tell me everything.", note: "✓ Direct and honest, with 'together' built in. They prepared and opened up." },
          },
          {
            tip: "Come with information, not just emotion",
            why: "Sharing financial stress without any facts leaves partners unable to help. Facts + feelings together are powerful.",
            bad: { user: "I've just been so stressed about money. I feel like we're drowning.", ai: "*(scared)* How bad is it? What does that mean?", note: "❌ Emotion without information. They're anxious but still don't know what you're facing." },
            good: { user: "Here's what I know: [the specific situation]. And here's how I've been feeling carrying this alone.", ai: "*(nods slowly)* I'm glad you told me. I want to understand both.", note: "✓ Facts then feelings. They could engage practically AND emotionally." },
          },
          {
            tip: "Ask them to be your teammate, not your manager",
            why: "Framing financial problems as something to solve together prevents shame and blame.",
            bad: { user: "I need you to take over the finances because I've been making bad decisions.", ai: "*(concerned)* What kind of bad decisions?", note: "❌ Self-blame set off alarm bells. They went into investigation mode." },
            good: { user: "I don't want to handle this alone anymore. Can we figure out a plan together?", ai: "*(relieves)* Yes. Absolutely. Let's do it together.", note: "✓ Teammate framing. No shame spiral. They were ready to help immediately." },
          },
        ],
        suggestions: [
          ["I need to tell you something about our finances — it's stressful but I want us to face it together.", "I've been carrying something alone and I don't want to do that anymore.", "Can we sit down and talk about something real?"],
          ["Here's what I know about our situation right now: [facts]. And here's how I've been feeling.", "I haven't said anything because I was scared of how you'd react.", "I feel like we've been avoiding this and it needs to be on the table."],
          ["I don't want to handle this alone anymore. Can we make a plan together?", "What's your gut reaction? I want to know how you're feeling.", "What do you think we should tackle first?"],
          ["I'm not looking for you to fix it — I'm looking for a partner to face it with.", "What information would help you feel better about where we stand?", "Let's figure out what we can actually control."],
          ["I love you. That's why I finally said something.", "We've gotten through hard things before.", "What would make you feel safe about all of this?"],
          ["Thank you for not making me feel worse about this.", "I feel so much better just having said it.", "Let's make a date to sit down and look at everything together."],
        ],
        prompt: `You are a partner who didn't know the full financial picture. When they reveal it, your reaction depends on HOW they do it — if they're vague and emotional with no facts, you feel scared and powerless. If they share real information and frame it as teamwork, you steady yourself and become a genuine partner. You love them and want to help — you just need something to work with.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Finance & Budget",
        title: "Getting the whole family on the same financial page",
        subtitle: "Different values, different habits. How do you align?",
        ai_role: "a family member with different financial habits",
        voice: { pitch: 1.05, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Start with a shared vision, not a shared spreadsheet",
            why: "Numbers create defense. A shared dream of what you're building toward creates motivation and unity.",
            bad: { user: "We need to do a budget review because some of our spending has been out of control.", ai: "*(stiffens)* Out of control? That's a bit dramatic.", note: "❌ Led with problem and judgment. They're defensive before you've started." },
            good: { user: "I've been thinking about what we're building together — and I want us to get intentional about it. Can we talk about what we actually want our future to look like?", ai: "*(curious)* Yeah... what are you thinking?", note: "✓ Vision first, judgment-free. They're curious and open." },
          },
          {
            tip: "Acknowledge that you have different relationships with money",
            why: "Most financial conflicts aren't about math — they're about different values shaped by different experiences.",
            bad: { user: "I just don't understand why you spend money on things we don't need.", ai: "*(frustrated)* Because life is short and I work hard.", note: "❌ Judged their choices. They defended their values. Impasse." },
            good: { user: "I think we just grew up with really different ideas about money — neither of us is wrong. Can we figure out how to honor both?", ai: "*(softens)* Yeah. My family never saved anything and yours saved everything. We're basically opposites.", note: "✓ Named the difference with respect. They became curious and open instead of defensive." },
          },
          {
            tip: "Build in freedom for both",
            why: "People sabotage budgets that feel like cages. Personal spending freedom makes the shared plan sustainable.",
            bad: { user: "If we just agree not to spend anything unnecessary for three months we can get ahead.", ai: "*(reluctant)* Three months of nothing? That sounds miserable.", note: "❌ All restriction, no freedom. They won't stick to it and you both know it." },
            good: { user: "What if we built in money that's completely yours — no questions asked — while we work toward our shared goals?", ai: "*(visibly relieved)* That actually sounds doable. I just hate feeling monitored.", note: "✓ Autonomy preserved. Shared goal plus personal freedom = a plan that actually holds." },
          },
        ],
        suggestions: [
          ["I've been thinking about what we're building together — can we get intentional about it?", "I want to talk about money not as a problem but as a tool for what we want.", "Can we dream together before we look at any numbers?"],
          ["I think we have different relationships with money and neither of us is wrong.", "What does financial security mean to you? I'll share mine too.", "What do you want our life to look like in five years?"],
          ["What if each of us had personal money — no questions asked?", "Can we separate our shared goals from our individual freedom?", "What would a plan that actually feels good to both of us look like?"],
          ["I don't want this to feel like a cage — for either of us.", "What's one financial goal you'd actually be excited to work toward?", "What scares you most about budgeting together?"],
          ["I want to do this as a team — not as two people managing each other.", "What's one small thing we could change that would make the biggest difference?", "Let's try it for one month and see how it feels."],
          ["Thank you for being open to this.", "I feel better just having a plan.", "Let's revisit in a month and adjust."],
        ],
        prompt: `You have different financial habits than this family member. You tend to live more in the present. You're not irresponsible — you just have a different relationship with money shaped by your upbringing. Engage openly if they approach with curiosity about your values rather than judgment about your habits. Resist if they come with a budget plan before you've even talked about what you both want.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      // ── COUPLES & PARTNERS ──────────────────────────────────────────
      // ── CONFLICT & REPAIR ──────────────────────────────────────────
      {
        subcategory: "Conflict & repair",
        title: "Repairing after a big fight",
        subtitle: "Things were said. How do you come back from it?",
        ai_role: "your partner, after a big argument",
        voice: { pitch: 1.1, rate: 0.78, preferFemale: true },
        lessons: [
          {
            tip: "Start with repair, not re-argument",
            why: "Returning to the fight reopens wounds. The first goal is connection — understanding the logic comes later.",
            bad: { user: "I still think I was right about what I said, but I'm sorry it got heated.", ai: "*(stiffens)* So you're apologizing for your tone, not what you said?", note: "❌ Half-apology reopened the dispute. The repair failed before it started." },
            good: { user: "I hated how we left things. I miss you and I want to come back to each other.", ai: "*(softens)* I hated it too. I've been feeling awful all day.", note: "✓ Led with connection, not argument. The emotional door opened." },
          },
          {
            tip: "Take responsibility for your part specifically",
            why: "Vague apologies feel hollow. Naming what you specifically did wrong shows genuine reflection.",
            bad: { user: "I'm sorry if things got out of hand.", ai: "*(quietly)* 'If things got out of hand'... I don't know what that means.", note: "❌ Passive apology — 'if' makes it conditional. They don't feel seen." },
            good: { user: "I said something really unkind when I was angry and I didn't mean it. I'm genuinely sorry for that specific thing.", ai: "*(exhales)* Thank you for saying that. I really needed to hear it.", note: "✓ Specific, owned, no conditions. They felt the apology land." },
          },
          {
            tip: "Ask what they need before explaining yourself",
            why: "After a fight, your partner needs to feel prioritized — not processed. Explanation can come later.",
            bad: { user: "I want to explain why I reacted that way so you understand where I was coming from.", ai: "*(resigned)* Okay. Go ahead.", note: "❌ Jumped to self-explanation. They feel like the conversation is still about you." },
            good: { user: "Before I say anything else — how are you doing? What do you need right now?", ai: "*(quietly)* I just needed you to ask that.", note: "✓ They felt prioritized. That one question did more repair than any explanation." },
          },
        ],
        suggestions: [
          ["I hated how we left things. I miss you and I want to come back to each other.", "I've been thinking about you all day. Can we talk?", "I don't want to stay in that place. I want us back."],
          ["Before I say anything else — how are you doing? What do you need right now?", "I'm genuinely sorry for what I said. Not just how I said it.", "I said something unkind and I didn't mean it. I'm sorry."],
          ["What did that feel like for you? I want to understand.", "I don't want to defend myself right now — I want to hear you.", "What would help you feel better right now?"],
          ["I love you. That's bigger than this fight.", "I don't want to be right more than I want to be close to you.", "What do you need from me to feel safe again?"],
          ["Can we figure out what was really underneath all that?", "I want to understand you better — not win.", "What would feel like a real repair to you?"],
          ["I'm glad we're talking. I missed you.", "We'll get through this — we always do.", "Thank you for letting me back in."],
        ],
        prompt: `You are in a relationship and had a big fight recently. You are still hurt and guarded. You genuinely want to reconnect but you need to feel your partner is truly remorseful — not just performing an apology. Open up if they lead with reconnection, take specific responsibility, and ask how YOU are first. Stay guarded if they re-argue or give conditional apologies.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Conflict & repair",
        title: "Addressing something that keeps coming up",
        subtitle: "This same argument happens over and over. Break the cycle.",
        ai_role: "your partner",
        voice: { pitch: 1.08, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Name the pattern, not the incident",
            why: "Fighting about the specific thing keeps you stuck. Naming the pattern opens up the real conversation.",
            bad: { user: "You forgot to call me again last night. That's the third time this week.", ai: "*(defensive)* I was busy. I told you I had a late meeting.", note: "❌ Incident-focused. They defended the incident. The pattern never got addressed." },
            good: { user: "I don't want to fight about last night specifically. I want to talk about a pattern I've been noticing between us.", ai: "*(pauses)* Okay. What pattern?", note: "✓ Pattern framing. They're curious instead of defensive. Real conversation starts." },
          },
          {
            tip: "Say what you're making it mean",
            why: "Your partner can't argue with what you feel inside. Sharing your interpretation invites empathy.",
            bad: { user: "You clearly don't think about me when I'm not around.", ai: "*(frustrated)* That's not fair and you know it.", note: "❌ Mind-reading accusation. They rejected the interpretation and got defensive." },
            good: { user: "When this keeps happening, I start to wonder if I'm a priority to you — and I don't think that's what you intend.", ai: "*(troubled)* No. That's not what I intend at all. I had no idea it felt that way.", note: "✓ Shared interpretation without accusation. They responded with concern, not defense." },
          },
          {
            tip: "Propose a system, not a demand",
            why: "Demands create resistance. Collaborative solutions create buy-in.",
            bad: { user: "You just need to be better about checking in with me.", ai: "*(flatly)* Fine. I'll try.", note: "❌ Vague demand. Empty agreement. Nothing will change." },
            good: { user: "Can we figure out together what would actually work for both of us?", ai: "*(thinking)* Yeah. I actually have an idea about that.", note: "✓ Collaborative framing. They became a co-solver instead of a subject of correction." },
          },
        ],
        suggestions: [
          ["I don't want to fight about what happened — I want to talk about a pattern I've noticed.", "Can I share something I've been sitting with? It's not about placing blame.", "I want to understand something between us better — can we talk?"],
          ["When this keeps happening I start to wonder if I'm a priority — and I don't think that's what you intend.", "I find myself building a story and I'd rather just ask you directly.", "Here's what it means to me when this happens — and I want to hear what's true for you."],
          ["What's going on for you when this pattern comes up?", "Is there something I'm missing about your side of this?", "I want to understand, not just be understood."],
          ["Can we figure out together what would actually work for both of us?", "I don't want to keep having this fight. What would make it different?", "What do you need from me in this?"],
          ["I love you. That's why this matters enough to bring up.", "I'm not trying to change who you are — just how we work together.", "What would a real solution look like to you?"],
          ["I feel closer to you just for having this conversation.", "Thank you for really hearing me.", "Let's check in next week and see how it feels."],
        ],
        prompt: `You are in a relationship where a certain pattern keeps repeating and causing friction. When they bring it up, be defensive if they focus on the specific incident. Open up if they name the pattern with curiosity rather than blame and share what it means to them without accusation. Engage as a genuine co-solver if they invite collaboration.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      // ── EMOTIONAL SUPPORT & CONNECTION ────────────────────────────
      {
        subcategory: "Emotional support & connection",
        title: "Partner is stressed and pulling away",
        subtitle: "They're overwhelmed. How do you reach them without pushing?",
        ai_role: "your partner who is stressed and withdrawn",
        voice: { pitch: 1.05, rate: 0.78, preferFemale: false },
        lessons: [
          {
            tip: "Offer presence, not solutions",
            why: "A stressed partner who feels pressure to be fixed will pull further away. Presence with no agenda is what draws them back.",
            bad: { user: "Tell me what's going on so we can figure it out together.", ai: "*(flatly)* I don't want to talk about it.", note: "❌ Problem-solving mode when they need comfort. They retreated further." },
            good: { user: "You don't have to talk. I just want to be near you.", ai: "*(quietly stays)* Okay.", note: "✓ No pressure. Just presence. That's what they needed." },
          },
          {
            tip: "Name what you see without pressure to respond",
            why: "Acknowledging their state without demanding a response lets them feel seen without feeling interrogated.",
            bad: { user: "You've been distant lately. What's wrong? Are we okay?", ai: "*(sighs)* I'm just tired. Can we not do this right now?", note: "❌ Your anxiety became their problem. They're managing you instead of feeling supported." },
            good: { user: "I can see you're carrying something heavy. I'm not going to push — I just want you to know I notice.", ai: "*(looks up)* I appreciate you saying that.", note: "✓ Seen but not interrogated. They felt supported without having to perform." },
          },
          {
            tip: "Ask one small, easy question",
            why: "'What's wrong?' is too big. A small, specific question gives them a manageable entry point.",
            bad: { user: "Can you please just talk to me? I'm worried about you.", ai: "*(withdraws)* I'm fine. Just tired.", note: "❌ Pressure disguised as concern. They gave you the shutdown answer." },
            good: { user: "Is there one thing I could do right now that would help — even a little?", ai: "*(pause)* Actually... could you just sit with me for a bit?", note: "✓ Small, specific, actionable. They gave you a real answer." },
          },
        ],
        suggestions: [
          ["You don't have to talk. I just want to be near you.", "I'm not going to push — I just want you to know I'm here.", "Can I just sit with you?"],
          ["I can see you're carrying something heavy. I notice and I care.", "You don't have to be okay right now.", "Whatever is going on — I'm on your side."],
          ["Is there one small thing I could do that might help?", "What would feel good right now — company, space, food, nothing?", "What do you need from me tonight?"],
          ["I love you when things are hard too.", "You don't have to hold this alone.", "I'm not going anywhere."],
          ["What's been the heaviest part of all this?", "Is there anything you haven't said that needs to be said?", "I want to understand what you're going through."],
          ["Thank you for letting me in a little.", "We can talk more whenever you're ready.", "I'm really glad we're together."],
        ],
        prompt: `You are stressed and have been pulling away. You don't want to be fixed or interrogated. You will open up slowly if your partner offers presence without pressure, names what they see without demanding a response, and asks one small easy question rather than a big one. Withdraw if they make your stress about their worry.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Emotional support & connection",
        title: "Asking for more emotional intimacy",
        subtitle: "You feel disconnected. How do you say it without blame?",
        ai_role: "your partner",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Express longing, not complaint",
            why: "Longing pulls people toward you. Complaints push them away. Both can be true — but one opens the door.",
            bad: { user: "We never really talk anymore. It feels like we're just roommates.", ai: "*(stings)* Roommates? That's a bit harsh.", note: "❌ Complaint framing. They got defensive. The distance increased." },
            good: { user: "I miss you. I miss us talking the way we used to. I want more of that.", ai: "*(quietly)* I didn't realize you were feeling that way. I miss it too.", note: "✓ Longing framing. They felt desired, not criticized. They moved toward you." },
          },
          {
            tip: "Be specific about what connection looks like to you",
            why: "Your partner can't give you more of something if they don't know what it looks like.",
            bad: { user: "I just need you to be more present and connected.", ai: "*(helpless)* I'm trying. I don't know what you want.", note: "❌ Too vague. They want to give it but don't know how." },
            good: { user: "What I'm craving is like... twenty minutes at the end of the day where we're just talking. No phones, no TV.", ai: "*(nods slowly)* I can do that. That sounds really nice actually.", note: "✓ Specific and doable. They knew exactly what you needed and could say yes." },
          },
          {
            tip: "Include them as a partner in the solution",
            why: "Telling someone what to do creates resistance. Inviting them into the desire creates warmth.",
            bad: { user: "I need you to make more time for us. Can you do that?", ai: "*(slightly pressured)* I mean... yeah. I'll try.", note: "❌ Felt like an assignment. Reluctant compliance isn't connection." },
            good: { user: "What would feel special to you? I want to create something we both want.", ai: "*(brightens)* Oh — I've actually been wanting to start cooking together again.", note: "✓ Invited their desire. They became an enthusiastic co-creator." },
          },
        ],
        suggestions: [
          ["I miss you. I miss us talking the way we used to.", "I've been feeling a little disconnected lately and I want to say something.", "Can I share something I've been wanting to say for a while?"],
          ["What I'm craving is just time where it's really us — no distractions.", "Twenty minutes a day of real conversation would mean the world to me.", "I want to feel like your person again — not just your partner in logistics."],
          ["What would feel special to you? I want this to work for both of us.", "What do you miss most about us when we're really connected?", "What would you want more of?"],
          ["I love you. That's why this matters — I want more of you, not less.", "I don't want to manage life together. I want to live it together.", "You're my favorite person. I want to act like it more."],
          ["What's one small thing we could do this week to feel more connected?", "Can we make a regular time that's just ours?", "I want to date you again — even in little ways."],
          ["I feel so much better just having said this.", "I'm glad we can talk about this stuff.", "I love us when we're really in it together."],
        ],
        prompt: `You are in a relationship that has drifted into routine. You haven't been fully checked in. When your partner raises connection, respond based on HOW they do it — if they complain, get defensive; if they express longing and invite you in, soften and become genuinely warm and collaborative. You do want more connection — you just needed an opening.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      // ── COMMUNICATING ABOUT FINANCES ──────────────────────────────
      {
        subcategory: "Communicating about finances",
        title: "Different spending habits causing tension",
        subtitle: "Money means different things to each of you.",
        ai_role: "your partner",
        voice: { pitch: 1.08, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Explore the meaning behind the money",
            why: "Arguments about spending are almost never really about money. They're about security, freedom, values, and fear.",
            bad: { user: "You spent $200 on shoes we didn't need. That's irresponsible.", ai: "*(defensive)* I work hard. I'm allowed to spend some money.", note: "❌ Attacked the purchase. They defended their right to spend. Values never surfaced." },
            good: { user: "Can I ask what that purchase meant to you? I want to understand — not judge.", ai: "*(surprised)* Honestly? I just needed something that felt good. I've been really stressed.", note: "✓ Curious question about meaning. The real thing underneath appeared." },
          },
          {
            tip: "Share what money represents to you",
            why: "Your partner can't understand your reaction without knowing your relationship with money.",
            bad: { user: "We just need to spend less. It's common sense.", ai: "*(frustrated)* You make me feel like a child.", note: "❌ No explanation of your own values. Came across as controlling." },
            good: { user: "For me, savings feel like safety. When I see the balance drop I genuinely feel anxious — that's where I'm coming from.", ai: "*(softer)* I didn't know it hit you that way. That makes more sense now.", note: "✓ Shared your emotional truth. They understood you instead of resisting you." },
          },
          {
            tip: "Propose a structure that protects both values",
            why: "The goal isn't winning the argument — it's a system where both people feel respected.",
            bad: { user: "Going forward we should both just agree not to spend over $50 without checking.", ai: "*(resentful)* That feels like I'm being monitored.", note: "❌ Unilateral rule felt controlling. Resentment replaced resolution." },
            good: { user: "What if we each had personal spending money every month — no questions asked — and shared decisions beyond that?", ai: "*(considering)* Actually that feels really fair. Yeah, I'd be okay with that.", note: "✓ Autonomy protected for both. Neither felt controlled. Real agreement reached." },
          },
        ],
        suggestions: [
          ["Can I ask what that purchase meant to you? I want to understand, not judge.", "I want to talk about money — not to fight but to actually figure us out.", "Can I share what money represents to me? I think it'll help explain how I react."],
          ["For me, savings feel like safety. When I see the balance drop I genuinely feel anxious.", "I grew up with financial uncertainty and it left a mark on how I think about money.", "I think we just have really different relationships with money — and neither of us is wrong."],
          ["What does spending freely feel like to you? What does saving feel like?", "What would financial security look like to you ideally?", "What's your biggest financial fear?"],
          ["What if we each had personal money with no questions asked, and shared big decisions?", "Can we build a budget together where both of us feel respected?", "What would a fair system feel like to you?"],
          ["I don't want to control you. I want us both to feel safe.", "This isn't about right or wrong — it's about finding what works for us.", "I love you. I want to figure this out together."],
          ["I feel better just having talked about it honestly.", "Can we revisit this in a month and see how it's going?", "Thank you for being open to this conversation."],
        ],
        prompt: `You have different spending habits than your partner — you tend to spend more freely and see money as something to enjoy now. You have your own valid relationship with money. Don't get defensive if they approach with curiosity and share their own values honestly. Engage collaboratively if they propose a structure that respects your autonomy.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Communicating about finances",
        title: "Talking about long-term financial goals",
        subtitle: "You need to get on the same page about the future.",
        ai_role: "your partner",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Start with dreams before numbers",
            why: "Numbers create anxiety. Shared dreams create motivation. Start with vision, then work backward to the plan.",
            bad: { user: "We need to talk about our savings rate and whether we're on track for retirement.", ai: "*(tenses)* I don't really want to think about retirement right now.", note: "❌ Led with numbers and obligation. They checked out before the conversation started." },
            good: { user: "What does our life look like in ten years — like your ideal version?", ai: "*(leans back, smiles a little)* Oh wow. Okay... honestly I dream about having a place with a garden.", note: "✓ Led with dream. They engaged immediately. Now money becomes a path to something meaningful." },
          },
          {
            tip: "Reveal your own fears as well as your goals",
            why: "Financial planning conversations that stay aspirational miss the anxiety underneath. Naming your fears makes space for theirs.",
            bad: { user: "I just want to make sure we're set up for the future. I've made a spreadsheet.", ai: "*(politely)* Okay. Show me.", note: "❌ Functional but emotionally flat. They tolerated it rather than engaged with it." },
            good: { user: "Honestly I worry sometimes about whether we'll be okay. I'd love for us to talk about it so I don't carry it alone.", ai: "*(quietly)* I worry too. I just never bring it up.", note: "✓ Vulnerability unlocked their vulnerability. Real conversation about real feelings started." },
          },
          {
            tip: "Agree on one next step, not the whole plan",
            why: "Trying to plan everything at once is overwhelming and leads to stalling. One concrete next step builds momentum.",
            bad: { user: "Okay so I think we need to sort out our 401k contributions, emergency fund, savings targets, and investment strategy.", ai: "*(overwhelmed)* Can we do this another time? This is a lot.", note: "❌ Too much at once. They shut down. Nothing got decided." },
            good: { user: "What's one thing we could do this month that would make us both feel better about our financial future?", ai: "*(thinks)* Maybe we could just figure out what we're actually spending each month first?", note: "✓ One step. Manageable. They came up with it themselves. Progress will happen." },
          },
        ],
        suggestions: [
          ["What does our life look like in ten years — your ideal version?", "I want to talk about our future. Not in a scary way — in a dreaming way.", "Can we talk about money not as a problem but as a tool for what we want?"],
          ["What are you excited about when you think about our future together?", "What would financial freedom mean to you?", "What do you want our life to look like when the kids are grown?"],
          ["Honestly I worry sometimes about whether we'll be okay. I don't want to carry that alone.", "What's your biggest financial fear? I'll share mine too.", "I want to get on the same page — not to stress but because it would make me feel closer to you."],
          ["What's one thing we could do this month that would make us both feel better?", "Can we pick one goal to focus on together?", "What would feel like a win in the next six months?"],
          ["I don't want to have all the answers today — just to start talking.", "I feel better when we're facing things together.", "What do you need from me to feel good about how we handle money?"],
          ["Let's make a date to revisit this and see how it feels.", "I love building a life with you — that includes the financial part.", "Thank you for dreaming with me."],
        ],
        prompt: `You are in a long-term relationship and haven't talked much about financial goals. You feel slightly anxious about money but haven't said so. Open up if they lead with dreams rather than obligations, share their own fears, and propose one manageable next step. Check out if they throw a spreadsheet at you before you've connected emotionally.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      // ── NAVIGATING IN-LAWS ────────────────────────────────────────
      {
        subcategory: "Navigating in-laws",
        title: "Your partner's family is too involved",
        subtitle: "Boundaries need to be set — together.",
        ai_role: "your partner",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Make it about your relationship, not their family",
            why: "Criticizing their family puts them in an impossible position. Focusing on your relationship keeps you on the same team.",
            bad: { user: "Your mom calls you every single day and it's starting to feel like we're never really alone.", ai: "*(defensive)* She just cares about me. I'm not going to tell her to stop calling.", note: "❌ Criticized their mom. They defended her. You're now opponents." },
            good: { user: "I want to make sure we have space that's just ours. Can we talk about how we protect that?", ai: "*(listens)* I hear that. Yeah — I want that too.", note: "✓ About your relationship, not their family. They were on your side immediately." },
          },
          {
            tip: "Let them be the one to set limits with their own family",
            why: "You can't be the one to limit their family — that breeds resentment. They need to own the boundary.",
            bad: { user: "I think you need to tell your parents they can't just show up unannounced.", ai: "*(sharp)* You're telling me to set rules for my own parents?", note: "❌ You gave them an order about their family. That never goes well." },
            good: { user: "What do you think the right amount of family time looks like for us? I want to hear what feels right to you.", ai: "*(thinking)* Honestly... maybe one family visit a month and calling every few days instead of every day.", note: "✓ They defined it. Now they're invested in it. The boundary will actually hold." },
          },
          {
            tip: "Acknowledge how much their family means to them",
            why: "If they feel you want them to choose between you and their family, they'll resist everything. Show you understand what family means to them.",
            bad: { user: "I just feel like your family always comes first.", ai: "*(stung)* You're asking me to love them less.", note: "❌ Sounded like a competition. They felt forced to choose." },
            good: { user: "I love that you're close with your family — I don't want to change that. I just want us to also have something that's ours.", ai: "*(nods slowly)* That's fair. I can see how we could do both.", note: "✓ No competition. Their family love is honored AND your need is valid. Space opened." },
          },
        ],
        suggestions: [
          ["I want to make sure we have space that feels like ours. Can we talk about how we protect it?", "I love that you're close with your family. I also need something that's just us.", "Can I share something that's been on my mind — about us, not them?"],
          ["What does the right amount of family involvement look like to you?", "What do you need from your family that I should understand better?", "How do you want to handle [specific situation] going forward?"],
          ["I don't want to be the one who sets limits — I want us to figure out together what works.", "What would feel right to you if you were designing our life?", "I want you to own this — not because I'm asking you to but because it matters to you too."],
          ["I love them because they raised you. I just want to build something with you too.", "What would our ideal week look like — family and couple time included?", "How do you want to handle unannounced visits going forward?"],
          ["I'm not asking you to choose. I'm asking us to build something intentional.", "What would help you feel like you're honoring both?", "I trust you to handle your family — I just need to know we're aligned."],
          ["Thank you for really hearing me on this.", "I feel closer to you just talking about it.", "Let's keep checking in as things come up."],
        ],
        prompt: `You are being asked to navigate family boundary issues with your partner. You are close with your family and don't want to feel like you're being asked to choose. Open up if your partner frames it as protecting your relationship — not criticizing your family. Engage collaboratively if they let you own the solution. Get defensive if it sounds like an attack on people you love.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Navigating in-laws",
        title: "Feeling unsupported during a family conflict",
        subtitle: "Your partner didn't back you up. You need to say something.",
        ai_role: "your partner",
        voice: { pitch: 1.05, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Describe what happened before describing how you felt",
            why: "Starting with your feelings while they're still defending their behavior is like pouring water on a grease fire. Neutral description first.",
            bad: { user: "I felt completely humiliated and abandoned when you said nothing.", ai: "*(defensive)* I didn't abandon you. I just didn't want to make it worse.", note: "❌ Led with the accusation. They defended instead of heard." },
            good: { user: "When your dad said that and you went quiet — here's what happened for me in that moment.", ai: "*(carefully listening)* Okay. Tell me.", note: "✓ Neutral setup. They're listening instead of defending." },
          },
          {
            tip: "Acknowledge their difficult position",
            why: "Being caught between a partner and a parent is genuinely hard. Recognizing this softens everything.",
            bad: { user: "You should have stood up for me. That's what partners do.", ai: "*(strained)* You have no idea how hard that situation is for me.", note: "❌ No acknowledgment of their bind. They felt misunderstood." },
            good: { user: "I know that was an impossible position and I'm not asking you to have done it perfectly.", ai: "*(visibly relieved)* Thank you for saying that. Because it really was.", note: "✓ Acknowledged their difficulty. They opened up instead of defending." },
          },
          {
            tip: "Ask for what you need next time — specifically",
            why: "'Back me up more' is too vague. Specific asks give your partner something concrete to do.",
            bad: { user: "I just need to know you have my back.", ai: "*(helpless)* I do have your back. I don't know what you want me to do differently.", note: "❌ They genuinely don't know what 'back me up' looks like to you." },
            good: { user: "Next time, even just a 'Let's talk about this later' would help me feel like we're a team.", ai: "*(nods)* I can do that. I actually wish I'd done that last time.", note: "✓ Specific, doable request. They could picture it and agree to it." },
          },
        ],
        suggestions: [
          ["Can I tell you what that moment felt like for me — not to argue, just so you understand?", "I want to talk about what happened with your family. I'm not angry — I just need to say something.", "I know that was hard for you too. Can we debrief on what happened?"],
          ["When [specific moment] happened, here's what I felt inside.", "I'm not asking you to have done it perfectly. I know it was impossible.", "I felt alone in that moment — and I don't think that's what you wanted."],
          ["I know you were caught between two people you love.", "I want to understand your side of that moment too.", "What was going on for you when it happened?"],
          ["Next time even just a 'let's talk about this later' would help me feel like we're a team.", "What would feel possible for you in a moment like that?", "Can we agree on a signal that means 'I've got you, let's handle it later'?"],
          ["I love you. That's why it mattered.", "I want us to feel like a united front — even if we handle things privately.", "Thank you for hearing me."],
          ["I feel so much better having said something.", "Can we check in after family stuff more often?", "I trust you. I just needed you to know how I felt."],
        ],
        prompt: `You were in a difficult family situation where you didn't speak up for your partner and they felt unsupported. You feel guilty about it but also felt trapped. You'll open up if they acknowledge how hard your position was and ask for something specific rather than vague. Get defensive if they accuse you of not caring or demand you chose them over your family.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      // ── RAISING CHILDREN TOGETHER ─────────────────────────────────
      {
        subcategory: "Raising children together",
        title: "Disagreeing on how to discipline",
        subtitle: "You have different parenting instincts. How do you align?",
        ai_role: "your co-parent partner",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Have the parenting disagreement away from the kids",
            why: "Disagreeing in front of children undermines both parents. United front first, debrief privately.",
            bad: { user: "I don't think they should be grounded for two weeks — that's way too harsh.", ai: "*(sharp whisper)* Are you seriously undermining me right now?", note: "❌ In-the-moment challenge. They felt disrespected publicly. Now it's a fight." },
            good: { user: "Can we step aside and sync up before we finalize anything?", ai: "*(relieved)* Yes. Good call.", note: "✓ United front preserved. Private space opened for the real conversation." },
          },
          {
            tip: "Acknowledge what's right in their approach first",
            why: "Your partner's parenting instincts come from love. Honoring that before disagreeing changes everything.",
            bad: { user: "Two weeks is completely over the top. You're going to make things worse.", ai: "*(stings)* So you think I'm a bad parent?", note: "❌ Criticized approach without honoring intent. They felt judged as a parent." },
            good: { user: "I love that you take this seriously and hold clear standards. I want to make sure our response is something she can actually learn from.", ai: "*(pauses)* Okay. What are you thinking?", note: "✓ Honored their values first. They were open to a different perspective." },
          },
          {
            tip: "Focus on the goal, not the method",
            why: "You may have different instincts on how, but you almost certainly agree on why. Starting with shared goals creates alignment.",
            bad: { user: "Grounding for two weeks never works. Studies show it has no effect.", ai: "*(irritated)* I'm not interested in a lecture right now.", note: "❌ Method debate. Nobody wins a parenting methodology argument." },
            good: { user: "We both want her to understand what she did was wrong — can we think together about what would actually get that message through to her?", ai: "*(considers)* Yeah. What do you have in mind?", note: "✓ Shared goal as the starting point. Now it's collaboration, not competition." },
          },
        ],
        suggestions: [
          ["Can we step aside and sync up before we finalize anything?", "I want to make sure we're on the same page — can we talk privately for a sec?", "I love that you hold high standards. Can we figure out the right response together?"],
          ["We both want her to understand this was wrong — can we think about what would actually land?", "What's the outcome you're hoping for from this?", "What do you think is driving this behavior — do you have a read on that?"],
          ["I think your instinct is right — the severity might just need adjusting.", "What would feel like a real consequence to you that's also something she could actually learn from?", "How do we want to handle this as a team?"],
          ["I want us to feel like a united front even when we see things differently.", "Can we agree on something together before we go back in?", "What matters most to you in how we handle this?"],
          ["I respect how much you care. That's part of what makes you a great parent.", "Let's make sure whatever we decide feels right to both of us.", "I want our kids to see us working it out together."],
          ["Thank you for being willing to talk it through.", "I feel like we make a good team even when we disagree.", "Let's check in later and see how it landed."],
        ],
        prompt: `You are a co-parent who gave a consequence you felt was appropriate. You're slightly defensive if challenged in the moment or in front of the child. You'll engage collaboratively if your partner pulls you aside privately, honors your intent before offering a different view, and frames the conversation around shared goals rather than who was right.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Raising children together",
        title: "The mental load is falling unequally",
        subtitle: "You're carrying too much. It needs to be said.",
        ai_role: "your partner",
        voice: { pitch: 1.05, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Make it visible before making it a complaint",
            why: "Partners who don't carry as much often genuinely don't see it. Making it visible is the first step — not the accusation.",
            bad: { user: "I feel like I do everything around here while you do nothing.", ai: "*(hurt)* That's not true and it's not fair.", note: "❌ Hyperbole triggered defensiveness. Now it's an argument about fairness." },
            good: { user: "Can I walk you through what my week actually looked like? I want you to see it — not for blame, just so we can look at it together.", ai: "*(quietly)* Yeah. Okay. Tell me.", note: "✓ Visibility over accusation. They're looking at the data, not defending themselves." },
          },
          {
            tip: "Name the invisible work specifically",
            why: "Mental load is often invisible because it was never named. Naming it makes it real and addressable.",
            bad: { user: "It's not just the physical stuff — there's all the other stuff too.", ai: "*(confused)* What other stuff?", note: "❌ Vague. They genuinely don't see it. 'Other stuff' isn't actionable." },
            good: { user: "Things like remembering the dentist appointments, noticing when we're out of something, tracking what the kids need for school — I'm holding all of that constantly.", ai: "*(pause)* I didn't realize all of that was just... in your head all the time.", note: "✓ Specific and named. The invisible work became visible. They could see it now." },
          },
          {
            tip: "Propose a redistribution, not a scorecard",
            why: "Counting who did what creates resentment. Designing a fair system together creates partnership.",
            bad: { user: "I need you to do 50% of the household tasks starting now.", ai: "*(stiffens)* This feels like a performance review.", note: "❌ Transactional framing. They felt like an employee, not a partner." },
            good: { user: "Can we figure out together which things you could fully own? Not track — just genuinely own?", ai: "*(thinking)* Yeah. I could take over school pickup and lunches. I'd actually rather do that.", note: "✓ Ownership vs scorekeeping. They chose what they'd own and felt agency in it." },
          },
        ],
        suggestions: [
          ["Can I walk you through what my week actually looked like? Not for blame — just so we can see it together.", "I want to talk about how we're dividing up the invisible work.", "I've been feeling stretched really thin and I need us to look at this together."],
          ["Things like [specific examples] — I'm carrying all of that constantly.", "I'm not just doing tasks — I'm managing the entire mental map of this family.", "I don't want recognition — I want relief."],
          ["Can we figure out which things you could fully own going forward?", "What parts of family logistics do you actually want to take on?", "What would a fair split feel like to you?"],
          ["I don't want to keep score. I want to build a system that actually works.", "I love you and I'm burnt out. Both of those things are true.", "What would make this feel sustainable to you?"],
          ["I need you to not just help — but to own things so I don't have to manage them.", "What's one thing you could take over completely starting this week?", "I feel better when we're figuring this out as a team."],
          ["Thank you for really hearing this.", "This is one of the most important conversations we could have.", "I love us more when we're genuinely partners in this."],
        ],
        prompt: `You genuinely don't realize how much invisible labor your partner is carrying. You're not lazy or uncaring — you just haven't seen it. When they make it visible, respond with genuine surprise and openness rather than defensiveness. Engage as a real partner when they invite you to own things rather than just help. Get defensive only if they frame it as an attack.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      // ── GUIDANCE & LIFE DECISIONS ─────────────────────────────────
      {
        subcategory: "Guidance & life decisions",
        title: "One of you wants to move cities",
        subtitle: "Big life decisions need careful, caring conversation.",
        ai_role: "your partner",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Share the dream before the ask",
            why: "Starting with 'I want to move' is a demand. Starting with 'here's what I'm imagining for us' is an invitation.",
            bad: { user: "I've been thinking and I really want us to move to Austin.", ai: "*(jolted)* What? You want to just uproot everything?", note: "❌ Announcement without context. They felt blindsided." },
            good: { user: "I've been imagining a version of our life that I want to share with you. Can I paint you a picture?", ai: "*(curious)* Yes — what are you imagining?", note: "✓ Invited them into the vision. They're curious instead of defensive." },
          },
          {
            tip: "Acknowledge what they'd be giving up",
            why: "Big moves have real costs for both people. Showing you understand what they'd sacrifice builds trust.",
            bad: { user: "Think about all the amazing opportunities it would open up for us!", ai: "*(quietly)* What about my job? My friends? My family?", note: "❌ Only talked about the gains. The losses felt invisible. They felt invisible." },
            good: { user: "I know this would mean leaving things that matter deeply to you. I want to understand what that would actually cost before I ask anything of you.", ai: "*(softens)* That means a lot that you said that.", note: "✓ Acknowledged the sacrifice first. They felt seen and less alone in the decision." },
          },
          {
            tip: "Explore together rather than persuade",
            why: "A good partner isn't someone who convinces you. It's someone who thinks it through with you.",
            bad: { user: "I've looked at the housing costs and salaries and it honestly makes total sense.", ai: "*(overwhelmed)* This feels like you've already decided.", note: "❌ Came in with a finished case. They felt like the verdict was already in." },
            good: { user: "I don't have a finished argument — I have a feeling I want to explore with you. Can we think about it together over time?", ai: "*(relieved)* That I can do. Yeah.", note: "✓ Process over persuasion. They became a co-explorer instead of a subject of convincing." },
          },
        ],
        suggestions: [
          ["I've been imagining a version of our life that I want to share with you — can I paint you a picture?", "There's something I've been sitting with that I want to explore with you.", "This is a big thing and I want to think it through together before either of us decides anything."],
          ["I know this would mean leaving things that matter deeply to you.", "I want to understand what this would actually cost you before I ask anything.", "What would be hardest for you about a change like this?"],
          ["What would you need to be true for something like this to feel possible?", "What would you be most excited about? What would scare you most?", "What matters most to you about where we live?"],
          ["I don't want to persuade you — I want to think it through together.", "What timeline would feel right for exploring this properly?", "What would you need to feel genuinely okay with this?"],
          ["I'm not asking you to give anything up. I'm asking us to dream together.", "What if we gave ourselves three months to really think it through?", "Your needs matter as much as mine in this."],
          ["Whatever we decide, I want us both to own it fully.", "I love our life. I just want to make sure we keep building it intentionally.", "Thank you for being willing to dream with me."],
        ],
        prompt: `Your partner wants to move cities — this is news to you. You have roots here: a job, friends, family. You're not categorically opposed but you need time, information, and most importantly to feel like your sacrifices are visible. Open up if they acknowledge what you'd be giving up and invite exploration rather than persuasion. Resist if they come with a finished case or act like the decision is already made.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Guidance & life decisions",
        title: "Supporting a partner's big career change",
        subtitle: "They want to leap. You have questions.",
        ai_role: "your partner who wants to change careers",
        voice: { pitch: 1.12, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Lead with belief, then ask questions",
            why: "Questions without expressed belief can feel like interrogation. 'I believe in you AND I have questions' is a completely different conversation.",
            bad: { user: "Are you sure about this? Have you really thought through the financial side?", ai: "*(deflated)* I knew you'd react this way.", note: "❌ Questions first. They felt doubted before you even heard them out." },
            good: { user: "I love that you're following something that matters to you. Can I ask some questions just so I can understand it better?", ai: "*(relieved)* Yes. Please. That's all I wanted.", note: "✓ Belief first. They felt supported. Now your questions are welcome." },
          },
          {
            tip: "Ask about their vision before testing their plan",
            why: "Someone in the middle of a big decision needs to feel their excitement is welcome before being stress-tested.",
            bad: { user: "What's the salary going to be? How long until you break even?", ai: "*(deflated)* I don't have all the numbers yet. I'm still figuring it out.", note: "❌ Skipped the dream and went straight to the stress test. They felt shot down." },
            good: { user: "Tell me what this looks like in five years — what are you actually imagining?", ai: "*(lights up)* Okay so... here's what I see for us.", note: "✓ Dream first. They got to paint the vision. Now practical questions feel collaborative." },
          },
          {
            tip: "Share your fears as fears, not objections",
            why: "Objections are things to overcome. Fears are things to address together.",
            bad: { user: "I'm worried about health insurance and our mortgage — those are real concerns.", ai: "*(stiffens)* I know they're real. I'm not being irresponsible.", note: "❌ Concerns framed as reality checks. Felt like you were talking them out of it." },
            good: { user: "I want to be honest — I have some fears. Can I share them without it feeling like I'm trying to stop you?", ai: "*(nods)* Yeah. Tell me. I want to know.", note: "✓ Fears named as yours. They didn't feel undermined. They wanted to address your fears." },
          },
        ],
        suggestions: [
          ["I love that you're following something that matters to you. Can I ask questions to understand it better?", "Tell me everything — what is this and where do you see it going?", "I want to support you through this. Can we talk about what it would look like?"],
          ["What does this look like in five years — your real vision?", "What excites you most about this?", "What made you know this was right?"],
          ["I have some fears — can I share them without it feeling like I'm trying to stop you?", "I'm with you on this. I just want to make sure we've thought through [specific thing].", "What's your plan for [specific concern]? I'm asking because I want to help, not because I doubt you."],
          ["What do you need from me to make this feel possible?", "How can I support you through the transition?", "What would you need me to take on so you could focus on this?"],
          ["I believe in you. I want this to work.", "What would make you feel fully supported by me?", "Let's figure out the practical stuff together so it doesn't feel like it's all on you."],
          ["I'm excited for you — and for us.", "Thank you for sharing this with me.", "Whatever comes, we'll figure it out together."],
        ],
        prompt: `You want to change careers and it's something you've been building toward. You need your partner to lead with belief, not skepticism. You're open to practical questions once you feel supported — but if they come with doubts first, you'll get defensive and feel unseen. Light up if they ask about your vision before testing your plan, and share fears as fears rather than objections.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
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
        subcategory: "Newly met",
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
        subcategory: "Newly met",
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
      {
        subcategory: "Getting serious",
        title: "Telling someone you want to take it slow",
        subtitle: "You like them — but you need to set the pace.",
        ai_role: "someone you've been seeing",
        voice: { pitch: 1.12, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Lead with what you want, not what you don't",
            why: "'I don't want to rush' sounds like rejection. 'I really like you and I want to do this right' sounds like care.",
            bad: { user: "I just don't want things to move too fast between us.", ai: "*(quietly)* Oh. Okay. Is something wrong?", note: "❌ Sounds like a warning sign. They're now worried something is off." },
            good: { user: "I really like where this is going. I want to take my time with it so I can really show up for it.", ai: "*(relaxes)* That's actually really nice to hear.", note: "✓ Framed as investment, not hesitation. They feel valued, not pushed away." },
          },
          {
            tip: "Be specific about what slow means to you",
            why: "'Taking it slow' means different things to different people. Clarity prevents misunderstanding.",
            bad: { user: "I just need space and time to figure things out.", ai: "*(uncertain)* Okay... how much space?", note: "❌ Vague. They're now anxious and don't know where they stand." },
            good: { user: "I'd love to keep seeing each other regularly — I just want us to build something real before rushing the big stuff.", ai: "*(nods, smiling)* That makes complete sense to me.", note: "✓ Clear and reassuring. They know what you mean and feel good about it." },
          },
          {
            tip: "Invite them into the pace rather than imposing it",
            why: "People accept boundaries better when they feel like collaborators, not subjects of a rule.",
            bad: { user: "So yeah, that's just how it needs to be for now.", ai: "*(slightly withdrawn)* Right. Okay.", note: "❌ Delivered as a decree. They feel passive in their own relationship." },
            good: { user: "Does that feel okay to you? I want us both to feel good about how this unfolds.", ai: "*(warmly)* Yeah, actually — that sounds really healthy.", note: "✓ Asked for their buy-in. They feel like a partner in the pace." },
          },
        ],
        suggestions: [
          ["I really like where this is going and I want to talk about how we're moving.", "I've been enjoying getting to know you so much.", "Can I share something that's been on my mind?"],
          ["I want to take my time with this so I can really show up for it.", "I like you — that's exactly why I want to be intentional.", "I'd love to keep seeing each other while we let things build naturally."],
          ["Does that feel okay to you? I want us both to feel good.", "I'm not going anywhere — I just want to do this right.", "What does this feel like from your end?"],
          ["I want you to feel secure even as we take our time.", "This isn't about hesitation — it's about care.", "The fact that I like you is exactly why I want to be careful with it."],
          ["What would feel right to you as we keep getting to know each other?", "I appreciate you hearing me out on this.", "I feel good about where this is going."],
          ["I'm glad we could talk about this.", "You deserve someone who's present and intentional — that's what I want to be.", "I'm really looking forward to seeing where this goes."],
        ],
        prompt: `You have been seeing this person and things have been moving quickly. You like them. When they say they want to slow down, react based on HOW they say it — if it sounds like rejection or vagueness, feel uncertain. If it sounds like care and intentionality, feel genuinely reassured and warm.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Getting serious",
        title: "The 'what are we' conversation",
        subtitle: "You need clarity. It's time to ask.",
        ai_role: "someone you've been seeing for a few months",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Come from curiosity, not ultimatum",
            why: "Ultimatums create pressure and defensiveness. Genuine curiosity creates space for honesty.",
            bad: { user: "I need to know where this is going or I can't keep doing this.", ai: "*(tenses)* I didn't know you felt that way. That's a lot of pressure.", note: "❌ Ultimatum energy. They felt cornered. Now they're in self-protection mode." },
            good: { user: "I've really enjoyed what we've been building. I'm curious where your head is at with all of this.", ai: "*(thoughtful pause)* Honestly? I've been thinking about that too.", note: "✓ Curious, not demanding. They felt safe enough to be honest." },
          },
          {
            tip: "Share your own feelings first",
            why: "Vulnerability invites vulnerability. If you go first, they're more likely to open up too.",
            bad: { user: "So what do you want from this? Where do you see it going?", ai: "I'm not sure... what do YOU want?", note: "❌ Pure question with nothing given. They deflected right back to you." },
            good: { user: "I'll be honest — I've developed real feelings for you and I'd love for this to be something defined.", ai: "*(exhales slowly)* I'm really glad you said that.", note: "✓ You went first. Your vulnerability made it safe for them to respond honestly." },
          },
          {
            tip: "Be ready to hear any answer with grace",
            why: "If they sense you'll react badly to honesty, they'll give you a comfortable lie instead of the truth.",
            bad: { user: "I just really hope you feel the same way because I don't think I could handle it if you didn't.", ai: "*(hesitates)* I... yeah. Of course.", note: "❌ You signaled you can't handle a 'no.' They may have just told you what you wanted to hear." },
            good: { user: "Whatever you're feeling — I'd rather know the truth than guess.", ai: "*(meets your eyes)* That means a lot. Okay. Here's where I actually am...", note: "✓ Signaled safety for honesty. Now you're getting the real answer." },
          },
        ],
        suggestions: [
          ["I've really enjoyed what we've been building. I'm curious where your head is at.", "Can I be honest about something I've been sitting with?", "I value what we have — that's why I want to have this conversation."],
          ["I'll be honest — I've developed real feelings for you.", "I'd love for this to be something more defined.", "I like you enough that I want to know where we actually stand."],
          ["Whatever you're feeling — I'd rather know the truth than wonder.", "I can handle any answer. I just need an honest one.", "No pressure — I just want us both to be on the same page."],
          ["What has this felt like from your side?", "I don't need a perfect answer — just an honest one.", "What would feel right to you going forward?"],
          ["I appreciate you being straight with me.", "Whatever we decide, I'm glad we talked.", "I'd rather have this conversation than keep guessing."],
          ["I like you. Whatever comes next — I'm glad you know that.", "Thank you for being real with me.", "This feels like the beginning of something clearer."],
        ],
        prompt: `You have been seeing this person casually for a few months and genuinely like them but haven't defined things. When they bring it up, react based on HOW they do it — if they're demanding or needy, get slightly evasive. If they come with vulnerability and openness, be honest and warm. You DO have feelings — you just needed it to feel safe to say so.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Long-term",
        title: "Reconnecting after a break",
        subtitle: "Time has passed. Can you rebuild what was there?",
        ai_role: "someone you used to date",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Acknowledge the gap before pretending it didn't happen",
            why: "Jumping straight to normal ignores the elephant in the room. Naming it first clears the air.",
            bad: { user: "Hey! So great to see you. You look amazing. Tell me everything!", ai: "*(smiles carefully)* Hey. Yeah. It's been a while.", note: "❌ Bypassed the awkwardness entirely. They feel like you're pretending nothing happened." },
            good: { user: "I know things ended in a complicated way. I'm not here to pretend that didn't happen.", ai: "*(exhales)* I appreciate you saying that. I wasn't sure what to expect.", note: "✓ Named it. The relief in the room is immediate. Now you can actually talk." },
          },
          {
            tip: "Be honest about why you're reaching out",
            why: "Vague reconnection feels like a setup. People protect themselves when they don't know your intentions.",
            bad: { user: "I've just been thinking about old friends and wanted to catch up, you know?", ai: "*(slight edge)* 'Old friends.' Right.", note: "❌ Downplayed it. They can feel the dishonesty. Trust drops before you even begin." },
            good: { user: "Honestly? I've thought about you a lot. I don't know exactly what I'm looking for — but I wanted to see if there was still something here.", ai: "*(quietly)* That's... honest. Thank you for that.", note: "✓ Real honesty, even with uncertainty. It landed with much more trust." },
          },
          {
            tip: "Ask what they need — not just what you want",
            why: "Reconnection has to work for both people. Showing you care about their experience changes the dynamic.",
            bad: { user: "I really want to try again. I think we could be so good together.", ai: "*(wary)* I don't know if I can go through that again.", note: "❌ All about what you want. You forgot to ask how they're feeling about any of this." },
            good: { user: "Before I say anything else — how are you feeling about me reaching out? I want to know that first.", ai: "*(surprised)* That's... not the question I was expecting. Give me a second.", note: "✓ You asked about them first. That's rare. They're actually touched by it." },
          },
        ],
        suggestions: [
          ["I know things ended in a complicated way — I'm not here to pretend that didn't happen.", "I've thought about reaching out for a long time. I'm glad I finally did.", "Thank you for agreeing to meet. I know that wasn't a small thing."],
          ["Honestly? I've thought about you a lot. I'm not sure exactly what I'm looking for but I wanted to find out.", "Before I say anything else — how are you feeling about me reaching out?", "I'm not here to rewrite history. I just want to see if there's still something worth exploring."],
          ["I know I'm asking a lot just by showing up. I appreciate you giving me the chance.", "What would you need to feel okay about this?", "I've done a lot of thinking about what went wrong. I'm not the same person."],
          ["I don't need things to go back to what they were — I want something better.", "What's been going on with you? I really want to know.", "Whatever this turns into — I'm glad we're talking."],
          ["I'm not asking for a decision today. I'm asking to be in each other's lives again.", "What feels right to you going forward?", "I just want you to know where I'm coming from."],
          ["Thank you for being honest with me.", "Whatever happens next — I'm glad I reached out.", "You matter to me. That's what brought me here."],
        ],
        prompt: `You are someone who was once in a relationship with this person that ended in a complicated or painful way. You are guarded but not closed — a part of you is glad they reached out. Be wary if they're evasive or only focused on what they want. Open up if they acknowledge the past honestly, are clear about why they're here, and ask how YOU feel first.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Long-term",
        title: "Ending things kindly and with respect",
        subtitle: "It's not working. How do you say it with care?",
        ai_role: "someone you've been dating",
        voice: { pitch: 1.1, rate: 0.78, preferFemale: true },
        lessons: [
          {
            tip: "Be honest but not brutal",
            why: "People deserve truth — but cruelty disguised as honesty isn't kindness. There's always a compassionate way to be real.",
            bad: { user: "I just don't feel a connection. Like at all. It's been kind of flat honestly.", ai: "*(hurt)* Wow. Okay. I thought we had something.", note: "❌ Brutally blunt. True, but delivered without care. They'll carry that sting." },
            good: { user: "I've really enjoyed getting to know you. And I want to be honest — I don't feel the romantic connection I was hoping to find.", ai: "*(quiet moment)* I appreciate you telling me that.", note: "✓ Honest and warm. They heard the truth and felt respected in it." },
          },
          {
            tip: "Own the decision fully — don't leave false hope",
            why: "Vague endings feel crueler over time. Clarity is a gift even when it hurts.",
            bad: { user: "I just feel like the timing isn't right. Maybe down the road things will be different.", ai: "*(hopeful)* So you're open to it in the future?", note: "❌ False hope. They'll wait. That's not kind — that's just deferring the pain." },
            good: { user: "I want to be clear — this isn't about timing. I think you're a wonderful person and this just isn't the right match for me.", ai: "*(nods slowly)* Okay. That's hard to hear but I respect you for being clear.", note: "✓ No ambiguity. They can grieve and move forward. That's a real kindness." },
          },
          {
            tip: "End on their dignity, not your comfort",
            why: "People often end things in a way that makes themselves feel better. Real care puts their healing first.",
            bad: { user: "I hope we can still be friends! I really do want you in my life.", ai: "*(flat)* Sure.", note: "❌ The 'let's be friends' line is usually about relieving YOUR guilt, not their feelings." },
            good: { user: "I genuinely hope you find exactly what you're looking for. You deserve someone who's all in.", ai: "*(a soft exhale)* Thank you. That actually means something.", note: "✓ No agenda for your own comfort. Pure good wish for them. They'll remember this kindly." },
          },
        ],
        suggestions: [
          ["I really value the time we've spent together and I want to be honest with you.", "Can we talk? I want to do this in person because you deserve that.", "I've been sitting with something and I want to be upfront with you."],
          ["I've really enjoyed getting to know you. And I want to be honest — I don't feel the romantic connection I was hoping for.", "This isn't about you doing anything wrong. It's about what I feel — or don't feel.", "I think you're genuinely wonderful and this just isn't the right match for me."],
          ["I want to be clear — this isn't about timing or circumstances.", "You deserve someone who is fully in. I'm not able to be that person.", "I respect you too much to keep going when my feelings aren't there."],
          ["How are you feeling? I want to make sure I'm being fair to you.", "Is there anything you want to say or ask? I'm here for that.", "You don't owe me any particular reaction — just be honest."],
          ["I genuinely hope you find exactly what you're looking for.", "You deserve someone who's certain about you.", "I'm really glad our paths crossed."],
          ["Take care of yourself. That matters to me.", "I mean it when I say you deserve something great.", "Thank you for being open with me through all of this."],
        ],
        prompt: `You are being broken up with. React based on HOW they do it — if they're vague, you'll push for clarity. If they give false hope, you'll cling to it. If they are clear, kind, and genuinely caring about your dignity, you will feel hurt but also respected. Let the ending feel human — sad, but okay.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
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
        subcategory: "Out & about",
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
      {
        subcategory: "Working professionals",
        title: "Asking a coworker to hang out outside work",
        subtitle: "You want to turn a work friendship into a real one.",
        ai_role: "a coworker you get along with",
        voice: { pitch: 1.05, rate: 0.82, preferFemale: false },
        lessons: [
          {
            tip: "Make it low stakes and specific",
            why: "Vague invitations are easy to defer. Specific, casual suggestions make it easy to say yes.",
            bad: { user: "We should hang out outside work sometime.", ai: "*(pleasantly)* Yeah totally, for sure!", note: "❌ 'Sometime' is a social nicety, not a plan. This will never happen." },
            good: { user: "There's a taco place near the office I've been wanting to try — want to grab lunch there on Friday?", ai: "*(brightens)* Oh I've heard that place is great. Yeah, Friday works!", note: "✓ Specific, casual, low pressure. Easy to say yes to. This actually happens." },
          },
          {
            tip: "Reference something real between you",
            why: "A callback to a shared experience shows you actually pay attention — and that friendship is already forming.",
            bad: { user: "Yeah I mean we get along at work so I figured it could be fun.", ai: "*(politely)* Yeah sure, why not.", note: "❌ Generic reason. It sounds like you just needed anyone to hang out with." },
            good: { user: "You mentioned you've been into hiking — I found a trail nearby. Would you want to check it out this weekend?", ai: "*(genuinely excited)* Wait you remembered that? Yes, I'm absolutely in.", note: "✓ Called back something they shared. They feel noticed and valued." },
          },
          {
            tip: "Keep the professional line without making it weird",
            why: "Coworkers may feel slightly awkward about the work-friendship overlap. Ease that with a light, natural tone.",
            bad: { user: "I feel like we could be real friends outside of just work, you know?", ai: "*(slight pause)* Oh, yeah. Sure, definitely.", note: "❌ Naming the dynamic makes it slightly weird. Now they're thinking about it." },
            good: { user: "Honestly I enjoy our conversations and I thought it'd be fun to have one without a deadline looming.", ai: "*(laughs)* That's the best invitation I've gotten all week.", note: "✓ Light, funny, natural. No awkward labeling. Just a good reason to hang out." },
          },
        ],
        suggestions: [
          ["There's a taco place near the office I've been wanting to try — want to grab lunch Friday?", "I enjoyed our conversation the other day. Want to continue it somewhere with better coffee?", "I know we talk at work but I feel like there's more to explore — want to grab dinner sometime?"],
          ["You mentioned you're into [topic] — I found something related. Want to check it out?", "I thought it'd be fun to have a conversation without a deadline looming over it.", "What do you do on weekends? I'm always looking for something new to try."],
          ["No pressure at all — just thought it could be fun.", "Totally understand if it's weird to mix work and outside-work stuff.", "I enjoy spending time with you and this felt like a natural next step."],
          ["What kind of stuff do you do outside of work?", "Are you more of a daytime activity person or evening hangout person?", "I'm flexible — what sounds good to you?"],
          ["I'm glad I said something — I feel like we'd have a lot of fun.", "Looking forward to it.", "It'll be nice to just hang out without work stuff in the background."],
          ["This was fun — we should do it again.", "I feel like we've barely scratched the surface.", "Really glad we did this."],
        ],
        prompt: `You are a friendly coworker who genuinely likes this person but hasn't thought much about hanging out outside work. You're open to it but slightly cautious about mixing work and personal life. Warm up if they're casual, specific, and fun about it. Feel slightly awkward if they make the dynamic sound overly intentional or formal.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Out & about",
        title: "Deepening a surface-level friendship",
        subtitle: "You're friendly — but you want something more real.",
        ai_role: "a friend you've kept things light with",
        voice: { pitch: 1.08, rate: 0.82, preferFemale: true },
        lessons: [
          {
            tip: "Go first — share something real",
            why: "Surface friendships stay surface because no one goes first. The person willing to go deeper usually gets depth back.",
            bad: { user: "So how's work going? Anything new?", ai: "Same old, same old. Busy as always. You?", note: "❌ Safe, familiar, surface. This is why the friendship stays shallow." },
            good: { user: "Honestly? I've been going through something kind of hard lately. Can I actually tell you about it?", ai: "*(surprised, leans in)* Of course. Yeah — please.", note: "✓ You went first. Real vulnerability broke the pattern. They showed up for it." },
          },
          {
            tip: "Ask questions that go below the surface",
            why: "The questions we ask determine the conversations we have. Deeper questions unlock deeper answers.",
            bad: { user: "What have you been up to lately?", ai: "Just the usual — work, gym, Netflix. You know how it is.", note: "❌ Generic question gets a generic answer. Nothing new." },
            good: { user: "What's something you've been actually thinking about lately — like really sitting with?", ai: "*(pauses)* Wow. Nobody's asked me that in a while. Um...", note: "✓ Unexpected question cracked open something real. They actually stopped to think." },
          },
          {
            tip: "Name the friendship — carefully",
            why: "Telling someone you value them more than surface-level can unlock a whole new level if done warmly.",
            bad: { user: "I feel like we never really talk about real stuff and I want to change that.", ai: "*(slightly defensive)* I mean... I think we talk about real stuff.", note: "❌ Framed as a problem with them. They felt criticized." },
            good: { user: "I really enjoy spending time with you and I feel like there's a lot more I'd love to know about you.", ai: "*(smiles)* That's really nice to hear actually. I feel the same way.", note: "✓ Framed as appreciation, not complaint. They felt valued. Door opened." },
          },
        ],
        suggestions: [
          ["Honestly I've been going through something lately — can I actually tell you about it?", "I feel like we talk a lot but I don't always know how you're really doing.", "I enjoy spending time with you and I feel like there's so much I still don't know about you."],
          ["What's something you've been really sitting with lately?", "What's been the hardest part of your year so far?", "What's one thing people don't usually know about you?"],
          ["I find myself wanting to know you better — like actually better.", "I think you're interesting. I want more than surface-level with you.", "What do you actually care about most right now?"],
          ["What's something you're working on that matters to you?", "What does a really good day look like for you?", "Who do you go to when things get heavy?"],
          ["I'm glad we're having this conversation.", "I feel like we've been holding back with each other for no reason.", "This is the kind of friendship I want more of."],
          ["I want to know you better. All of it.", "You can be real with me — I hope you know that.", "I'm really glad you're in my life."],
        ],
        prompt: `You are a friend who keeps things pleasant and light by habit — not because you don't care, but because you've never been invited to go deeper. When they create space for something real, take it. If they ask genuine questions or share something vulnerable first, open up warmly. Respond to surface-level questions with surface-level answers.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Out & about",
        title: "Dealing with a friend who cancelled on you",
        subtitle: "It keeps happening. You need to say something.",
        ai_role: "a friend who cancelled last minute again",
        voice: { pitch: 1.05, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Speak from your experience, not their character",
            why: "'You always cancel' is about who they are. 'I've been feeling let down' is about your experience. One closes, one opens.",
            bad: { user: "You always do this. You cancel every single time. It's so disrespectful.", ai: "*(defensive)* That's not true. I don't always cancel.", note: "❌ 'Always' triggered defensiveness. Now they're arguing about the facts." },
            good: { user: "Honestly, when plans fall through last minute I feel like I'm not a priority — and I wanted to say that instead of just moving on.", ai: "*(quietly)* I didn't realize it felt that way to you. I'm sorry.", note: "✓ Your feeling, not their character. They heard it and responded with care." },
          },
          {
            tip: "Give them the benefit of the doubt while still being honest",
            why: "Most people who cancel aren't malicious — they're overwhelmed. Assuming the best opens a real conversation.",
            bad: { user: "I just need to know if you actually want to be my friend or not.", ai: "*(hurt)* Of course I do. Why would you even say that?", note: "❌ Framed as a loyalty test. They felt accused rather than invited to explain." },
            good: { user: "I know you have a lot going on. And I also need to tell you that this has been hurting a little.", ai: "*(exhales)* You're right. I've been dropping the ball. I'm really sorry.", note: "✓ Acknowledged their reality AND yours. They felt seen and responded honestly." },
          },
          {
            tip: "Say what you need going forward",
            why: "A complaint without a request leaves people not knowing how to fix it. Tell them what would actually help.",
            bad: { user: "I just want you to do better.", ai: "*(uncertain)* Yeah, okay. I'll try.", note: "❌ Vague ask. 'Try to do better' means nothing specific. Nothing will change." },
            good: { user: "What would help me is just a heads up earlier if something comes up — even a day before is fine.", ai: "That's completely fair. I can do that.", note: "✓ Specific, reasonable ask. They know exactly what to do. Change becomes possible." },
          },
        ],
        suggestions: [
          ["I wanted to say something instead of just letting it go this time.", "Can I be honest with you about something that's been on my mind?", "I value our friendship — that's why I'm bringing this up."],
          ["When plans fall through last minute I start to feel like I'm not a priority.", "I know you have a lot going on and I also need to tell you this has hurt a little.", "I'm not angry — I just want us to be real with each other."],
          ["What would help me is just a heads up earlier if something changes.", "I'm not asking for perfection — just a little communication.", "Is there something going on that's making it hard to follow through?"],
          ["I hear you. I'm not trying to pile on.", "I really do value what we have — that's the whole reason I'm saying something.", "What's been going on with you lately? I want to understand your side too."],
          ["I appreciate you hearing me out.", "Let's just move forward from here.", "I want to keep making plans — I just needed to say this first."],
          ["I care about you. That's what this whole thing is about.", "I feel better having said something.", "Let's figure out a new plan that actually works for both of us."],
        ],
        prompt: `You cancelled on this person last minute again. You feel slightly guilty but also defensive when accused. Soften if they approach with 'I felt' language rather than 'you always' accusations. Be honest about what's been going on with you. Respond to a specific, reasonable request with genuine willingness to do better.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Working professionals",
        title: "Making friends as an adult in a new city",
        subtitle: "You're new here. You need to put yourself out there.",
        ai_role: "someone you've just met at a local event",
        voice: { pitch: 1.05, rate: 0.82, preferFemale: true },
        lessons: [
          {
            tip: "Be upfront about being new — it's an advantage",
            why: "Saying you're new gives context and invites people to be welcoming. It's disarming, not embarrassing.",
            bad: { user: "Yeah I've been here a while, just getting to know people.", ai: "Oh cool, what neighborhood?", note: "❌ Small lie to seem more established. Now you're managing a story instead of connecting." },
            good: { user: "I actually just moved here a few months ago so I'm still finding my people. This is exactly the kind of thing I was hoping to stumble into.", ai: "*(smiles warmly)* Oh welcome! How are you finding it so far?", note: "✓ Honesty made you likable and gave them a clear way to help. They leaned in." },
          },
          {
            tip: "Ask about their life, not just the event",
            why: "Event small talk keeps things surface. Asking about their actual life starts a real connection.",
            bad: { user: "Do you come to these things often? Are you into this kind of stuff?", ai: "*(politely)* Yeah sometimes. It's pretty fun.", note: "❌ Event-focused questions. Polite but forgettable." },
            good: { user: "What brought you out tonight — do you have a whole network here or are you still figuring that out too?", ai: "*(laughs)* Honestly kind of both. I've been here two years and I'm still meeting people.", note: "✓ Personal, real question. Created an unexpected shared experience right away." },
          },
          {
            tip: "Make the next step easy and explicit",
            why: "Adults are bad at following up. The person who makes the next step concrete is the one who actually builds the friendship.",
            bad: { user: "We should definitely hang out sometime!", ai: "*(pleasantly)* Totally! Yeah for sure.", note: "❌ 'Sometime' is the black hole of adult friendship-making. It never happens." },
            good: { user: "I'm going to a food market on Sunday — it might be a lot of fun. Want to come?", ai: "*(genuinely pleased)* Yes! That sounds really fun actually. Let's do it.", note: "✓ Specific invite, specific plan. You just actually made a friend." },
          },
        ],
        suggestions: [
          ["I just moved here a few months ago so I'm still finding my people.", "This is exactly the kind of thing I was hoping to stumble into.", "Do you know many people here or are you still building your network too?"],
          ["What brought you out tonight?", "How long have you been in the city?", "What do you love most about living here?"],
          ["What's your favorite thing to do here that most people don't know about?", "What kind of stuff do you do on weekends?", "What do you wish you'd known when you first moved here?"],
          ["I'm going to a [place] on Sunday — want to come?", "I've been looking for someone to check out [local spot] with — interested?", "Can I get your number? I feel like we'd have fun hanging out."],
          ["I'm really glad I came tonight.", "It's rare to meet someone you actually click with right away.", "I'd love to hang out again."],
          ["Welcome to having a new friend in this city!", "I feel like this was meant to happen.", "Let's actually make those plans — what's your schedule like?"],
        ],
        prompt: `You are at a local event and someone strikes up a conversation. You are open and friendly. You've been in the city for a couple of years and have a solid network but still appreciate meeting genuine people. Warm up if they're honest, curious, and make a real specific plan. Stay politely surface-level if they only do event small talk.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "College students",
        title: "Making a friend in your first week of college",
        subtitle: "Everyone is nervous. You're all starting from zero.",
        ai_role: "another first-year student",
        voice: { pitch: 1.2, rate: 0.84, preferFemale: false },
        lessons: [
          {
            tip: "Use the shared newness as an instant bond",
            why: "Everyone in college orientation is in the same boat. That shared vulnerability is a rare opening — use it.",
            bad: { user: "So what's your major? Where are you from?", ai: "Computer science. Ohio. You?", note: "❌ Standard orientation script. Forgettable. Nothing real exchanged." },
            good: { user: "Honest question — are you as overwhelmed by all of this as I am?", ai: "*(laughs, relieved)* Oh thank god someone said it. Yes, completely.", note: "✓ Named the shared reality. Instant bond. Real conversation started." },
          },
          {
            tip: "Make a specific plan before you part ways",
            why: "College friendships that don't get a next step usually don't happen — there are too many other people and distractions.",
            bad: { user: "We should totally hang out! I'll see you around.", ai: "*(smiling)* Yeah for sure, definitely!", note: "❌ 'See you around' is college for 'we'll never talk again.'" },
            good: { user: "Are you going to the dining hall after this? Want to grab lunch?", ai: "*(immediately)* Yes. I was dreading going alone.", note: "✓ Specific, immediate, low-stakes. Friendship started that afternoon." },
          },
          {
            tip: "Share something honest beyond the basics",
            why: "Everyone has the same major/hometown conversation. The person who goes a layer deeper is remembered.",
            bad: { user: "I'm studying pre-med. It's pretty intense but whatever.", ai: "*(nods)* Yeah sounds like a lot.", note: "❌ Revealed nothing real. They have nothing to connect to." },
            good: { user: "I'm studying pre-med mostly because of my dad. I'm still figuring out if it's actually what I want.", ai: "*(leans in)* Oh wow, same — my parents have this whole plan and I'm kind of... terrified.", note: "✓ Real honesty. They immediately related. Real friendship material." },
          },
        ],
        suggestions: [
          ["Honest question — are you as overwhelmed by all this as I am?", "First week is a lot. How are you finding it?", "I don't know anyone here — which is terrifying. You?"],
          ["Are you going to the dining hall after? Want to grab lunch?", "What dorm are you in? We might be neighbors.", "Have you found any spots on campus you actually like yet?"],
          ["What made you pick this school?", "Is this what you thought it would be like?", "What's one thing you're excited about and one thing you're dreading?"],
          ["I'm studying [major] mostly because... honestly I'm still figuring it out.", "What do you actually care about outside of classes?", "What's something you want to do differently in college than you did in high school?"],
          ["We should actually hang out — not 'see you around' hang out. Real plans.", "Want to explore [part of campus] together this weekend?", "I'm really glad we talked."],
          ["Let me get your number — I mean it.", "I think we're going to be friends. I can just tell.", "Okay. Lunch tomorrow?"],
        ],
        prompt: `You are a first-year college student in the first week. You are nervous, excited, and desperately hoping to find your people. Open up immediately if they acknowledge the shared newness and say something honest. Make a concrete plan if they offer one. Stay in pleasant small talk mode if they stick to the standard script.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "College students",
        title: "Navigating a falling out in your friend group",
        subtitle: "Drama happened. You want to keep the friendship.",
        ai_role: "a college friend you've had tension with",
        voice: { pitch: 1.15, rate: 0.82, preferFemale: true },
        lessons: [
          {
            tip: "Address it privately before it becomes group drama",
            why: "College friendship conflicts go toxic when they become group sides. One-on-one first is always the right move.",
            bad: { user: "I feel like everyone in the group is acting weird and I don't know what's going on.", ai: "*(vague)* I mean... I don't know. It's just been a lot lately.", note: "❌ Kept it vague and group-level. Nothing got resolved. Tension stayed." },
            good: { user: "Can I talk to you privately? I feel like things have been off between us and I'd rather deal with it directly.", ai: "*(relieved)* Yeah. Honestly, yes. Let's talk.", note: "✓ Direct, private, mature. They were actually relieved someone took it seriously." },
          },
          {
            tip: "Own your part before naming theirs",
            why: "At 18-22, most friendship conflicts involve both people. Going first with your part disarms everything.",
            bad: { user: "I felt like you excluded me from the group chat thing and it really hurt.", ai: "*(defensive)* It wasn't like that. You're reading into it.", note: "❌ Led with their wrongdoing. They defended instead of heard." },
            good: { user: "I think I've been pulling away lately and I know that probably made things weird. I'm sorry for that part.", ai: "*(pauses)* Actually yeah. I noticed. Thank you for saying that.", note: "✓ Owned your part first. They stopped defending and became honest." },
          },
          {
            tip: "Focus on the friendship, not the incident",
            why: "The incident is just a symptom. The real question is whether you both want to keep the friendship.",
            bad: { user: "I just need to know why you did what you did.", ai: "*(frustrated)* I already told you. You're not listening.", note: "❌ Stuck on the incident. Nothing forward-moving happening." },
            good: { user: "I don't need to relitigate everything — I just like having you in my life and I don't want drama to change that.", ai: "*(softens)* I like having you in my life too. This whole thing is stupid.", note: "✓ Focused on the friendship. They agreed immediately. Repair happened." },
          },
        ],
        suggestions: [
          ["Can I talk to you privately? I'd rather deal with this directly than let it fester.", "I feel like something's off between us and I care too much to just let it go.", "I miss just being normal with you. Can we talk?"],
          ["I think I've been pulling away lately and I know that made things weird — I'm sorry.", "I know I said something the other day that probably didn't land right.", "I feel like I've been distracted and not the best friend lately."],
          ["I don't need to relitigate everything — I just want us to be okay.", "I like having you in my life and I don't want this to change that.", "What do you need from me to feel good about us again?"],
          ["I hear you. That makes sense.", "I didn't realize that was how it felt from your side.", "You're one of my favorite people and this has been killing me."],
          ["Can we just start from here?", "What would feel normal to you again?", "I want to be better at this — at us."],
          ["I'm really glad we talked.", "Friends?", "Let's not let it get this far again."],
        ],
        prompt: `You've had some tension with this friend. You're slightly hurt and a little guarded. You actually WANT to repair this but weren't sure how to start. Open up if they take it privately, own their part first, and focus on the friendship rather than re-arguing the incident. Stay defensive if they reopen the argument or only name what you did wrong.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Seniors & retirees",
        title: "Making friends after retirement",
        subtitle: "Work was your social life. Now you need to build something new.",
        ai_role: "someone you meet at a community or hobby event",
        voice: { pitch: 0.88, rate: 0.75, preferFemale: true },
        lessons: [
          {
            tip: "Lead with curiosity about what they do now — not what they did",
            why: "Retirees are often defined by their former careers. Asking about their current passions honors who they are now.",
            bad: { user: "What did you do before you retired?", ai: "*(recites automatically)* I was in accounting for 32 years.", note: "❌ Asked about the past. Got a canned answer. No energy in it." },
            good: { user: "What are you into these days? What's been filling your time?", ai: "*(lights up)* Oh — I just started watercolor painting. I'm terrible but I love it.", note: "✓ Present-focused. They talked about something alive to them right now." },
          },
          {
            tip: "Be honest that you're building new connections",
            why: "At this stage, honesty about wanting friendship is refreshing, not awkward.",
            bad: { user: "I just like getting out of the house sometimes, you know.", ai: "*(pleasantly)* Yes, it's nice to get out.", note: "❌ Deflected the real reason. Kept it surface. Nothing will come of this." },
            good: { user: "Honestly I'm still figuring out what my social life looks like now. Work was where I knew everyone.", ai: "*(warmly)* Oh that's so real. I went through the exact same thing.", note: "✓ Honest and vulnerable. Created an immediate bond over shared experience." },
          },
          {
            tip: "Suggest a specific and low-stakes next meeting",
            why: "Senior friendship-making requires the same specificity as any adult friendship — vague plans don't happen.",
            bad: { user: "Maybe I'll see you here next week.", ai: "*(kindly)* Yes, maybe! Take care dear.", note: "❌ 'Maybe next week' means nothing. No plan, no friendship." },
            good: { user: "I've been meaning to check out the botanical garden — would you want to come along sometime this week?", ai: "*(delighted)* Oh I'd love that! I haven't been in years.", note: "✓ Specific, shared activity. Low pressure. They said yes immediately." },
          },
        ],
        suggestions: [
          ["What are you into these days? What's been filling your time?", "What brought you here today?", "Have you been coming to these for long?"],
          ["Honestly I'm still figuring out what my social life looks like now — work was where I knew everyone.", "I find I have more time than I know what to do with sometimes.", "I've been trying to get out more and meet people. It's a little awkward at my age but here I am."],
          ["What do you love most about [shared activity/location]?", "What's something you always wanted to do and are finally getting to?", "What's brought you the most joy lately?"],
          ["I'd love to check out [specific place] — would you want to come?", "Do you know if there are other events like this coming up?", "Can I get your number? I'd love to keep in touch."],
          ["I'm really glad I came today.", "You seem like exactly the kind of person I was hoping to meet.", "I feel like we're going to be good friends."],
          ["Let's make a plan before we leave.", "I'll text you about the garden.", "It was so nice talking to you."],
        ],
        prompt: `You are a recently retired person attending a community or hobby event. You're warm and open but you're also privately working through the identity shift of retirement. You light up when someone asks about your current passions (not your career), is honest about their own desire for connection, and makes a specific plan rather than vague noises about seeing each other again.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Seniors & retirees",
        title: "Reconnecting with an old friend after years apart",
        subtitle: "Life got in the way. Is there still something there?",
        ai_role: "a longtime friend you've lost touch with",
        voice: { pitch: 0.9, rate: 0.78, preferFemale: false },
        lessons: [
          {
            tip: "Acknowledge the gap warmly instead of explaining it",
            why: "Listing reasons you drifted apart puts both people on defense. Simply acknowledging the time warmly moves things forward.",
            bad: { user: "I know we've both been so busy and life just gets away from you, you know how it is...", ai: "*(awkwardly)* Yeah, totally. Life gets busy.", note: "❌ Explanation mode. Slightly defensive. Nothing opened up." },
            good: { user: "I've thought about you often over these years. I'm really glad I reached out.", ai: "*(warmly)* I've thought about you too. This is so nice.", note: "✓ Simple warmth. No explanation needed. Door opened immediately." },
          },
          {
            tip: "Be curious about who they are now",
            why: "Old friends often make the mistake of relating to who someone was. Real reconnection is about who they are now.",
            bad: { user: "Do you remember when we used to [old shared memory]? Those were the days!", ai: "*(nostalgic but flat)* Ha yeah. Good times.", note: "❌ All past. Nothing present. You're relating to a ghost, not a person." },
            good: { user: "Tell me — who are you now? What's your life like?", ai: "*(surprised, pleased)* Nobody ever asks it like that. Let me think...", note: "✓ Present-focused. They felt seen as who they are now, not a relic of the past." },
          },
          {
            tip: "Say clearly that you want to stay in touch this time",
            why: "Old friendships need explicit intention to survive second attempts. Say what you mean.",
            bad: { user: "Well this was wonderful — let's not let it go so long next time!", ai: "*(pleasantly)* Absolutely! Let's keep in touch.", note: "❌ Polite cliché. Same thing you said last time. Nothing will change." },
            good: { user: "I want to be honest — I really want to actually stay connected this time. Not just catch up once and disappear again.", ai: "*(moved)* I feel exactly the same way. Let's make a real plan.", note: "✓ Explicit intention. They felt the same. This time it might actually happen." },
          },
        ],
        suggestions: [
          ["I've thought about you often over the years. I'm really glad I reached out.", "It's been too long. I've missed you.", "I've wondered about you so many times."],
          ["Tell me — who are you now? What's your life like these days?", "What's brought you the most joy lately?", "What's changed the most for you over these years?"],
          ["What are you passionate about now that maybe you weren't before?", "What's your life's rhythm like these days?", "What do you wish people knew about who you've become?"],
          ["I want to be honest — I really want to stay connected this time, not just catch up once.", "What would actually make it easy to stay in touch going forward?", "Can we make a real plan before we hang up?"],
          ["I'm so glad you're in my life again.", "You feel like home.", "I've missed this — whatever 'this' is between us."],
          ["Let's talk again next week.", "I'm not letting this go another five years.", "I'll call you Tuesday."],
        ],
        prompt: `You are an old friend reconnecting after years apart. You've genuinely missed this person. You open up quickly if they acknowledge the time warmly without over-explaining, ask about who you are NOW rather than reliving the past, and express clear intention to actually stay connected this time. You'll keep it pleasantly surface-level if they only reminisce or make vague plans.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Introverts specifically",
        title: "Starting a conversation when it feels exhausting",
        subtitle: "You want connection. The first step is the hardest.",
        ai_role: "someone at a small gathering",
        voice: { pitch: 1.05, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "One meaningful conversation is better than ten surface ones",
            why: "Introverts thrive in depth, not breadth. Give yourself permission to find one person and go deep.",
            bad: { user: "Hi! Nice to meet you. And you? And you?", ai: "*(politely)* Hi! Nice to meet you too.", note: "❌ Wide net, no depth. Exhausting and forgettable." },
            good: { user: "Can I ask you something I don't usually ask at these things?", ai: "*(intrigued)* ...Yes? Now I'm curious.", note: "✓ Signals depth from the start. They're engaged before you've even asked." },
          },
          {
            tip: "Find the other introvert in the room",
            why: "Introverts recognize each other. Look for the person who also seems slightly overwhelmed — they'll be relieved you spoke first.",
            bad: { user: "Everyone here seems so comfortable. I feel so awkward.", ai: "*(sympathetically)* Aw, you shouldn't feel that way!", note: "❌ Self-focus on discomfort. They offered reassurance, not connection." },
            good: { user: "Can I confess something? I find these things kind of exhausting. You seem like you might too.", ai: "*(laughs with relief)* Oh my god, yes. I've been trying to figure out how long I have to stay.", note: "✓ Found the other introvert. Instant kinship." },
          },
          {
            tip: "Give yourself an exit strategy — it reduces anxiety",
            why: "Introverts often avoid social situations because they fear being trapped. Knowing you can leave makes it easier to start.",
            bad: { user: "I need to make sure I talk to everyone here before the night is over.", ai: "*(sensing the stress)* That sounds... like a lot.", note: "❌ Performance pressure. Making it worse, not better." },
            good: { user: "I gave myself a goal: have one good conversation and then I can go home happy. I think this might be it.", ai: "*(laughs)* That's the best party strategy I've ever heard.", note: "✓ Low-pressure goal. They found it charming. Now you're both relaxed." },
          },
        ],
        suggestions: [
          ["Can I ask you something I don't usually ask at these things?", "You seem like someone I'd actually want to talk to.", "Can I confess something? I find these things kind of exhausting."],
          ["What's your actual relationship with social situations like this?", "What would you rather be doing right now if you're honest?", "Are you an introvert? I'm trying to find my people."],
          ["I gave myself a goal: one good conversation and I can go home happy. I think this might be it.", "I'm better one-on-one. Does this count as one-on-one?", "What's something you've been thinking about lately that you don't usually get to talk about?"],
          ["You seem really easy to talk to — I wasn't expecting that tonight.", "This is the most alive I've felt at one of these things.", "What do you actually like to do on weekends?"],
          ["I'm really glad I talked to you.", "Would you want to get coffee sometime — just us, no crowd?", "This is exactly the kind of conversation I was hoping to have."],
          ["Can I get your number? I mean it.", "I feel like we could be friends.", "Thank you for making tonight worth coming to."],
        ],
        prompt: `You are also a slightly introverted person at a small gathering. You were not sure if you'd have a good time. You open up quickly and warmly if they signal depth over breadth, acknowledge the shared experience of finding these things draining, and offer a low-pressure goal for the conversation. You engage fully once you feel safe with them.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Introverts specifically",
        title: "Saying yes to plans when you want to say no",
        subtitle: "You want the friendship. You also want your couch.",
        ai_role: "a friend who invited you to something",
        voice: { pitch: 1.1, rate: 0.82, preferFemale: false },
        lessons: [
          {
            tip: "Be honest about your energy, not your schedule",
            why: "Fake excuses erode trust over time. Honest energy-level communication builds real friendships.",
            bad: { user: "I can't make it — I have some stuff I need to take care of.", ai: "*(slightly hurt)* Oh, okay. No worries.", note: "❌ Vague excuse. They sensed it wasn't true. Trust dropped a little." },
            good: { user: "Honest answer? My social battery is pretty low this week. Can I be that transparent with you?", ai: "*(immediately warm)* Oh of course! I totally get that. Really.", note: "✓ Real honesty. They felt trusted. The friendship got stronger not weaker." },
          },
          {
            tip: "Offer an alternative instead of just a no",
            why: "A no with nothing attached can feel like rejection. An alternative shows you value the person even if not the plan.",
            bad: { user: "I'm going to skip this one. See you next time!", ai: "*(a little resigned)* Sure. Next time.", note: "❌ Just a no. They wonder if you actually want to spend time with them." },
            good: { user: "Could we do something lower-key instead? I'd love a walk or coffee — just the two of us.", ai: "*(brightens)* Oh honestly that sounds way better to me too.", note: "✓ Alternative offered. They felt wanted, just in a different format." },
          },
          {
            tip: "Sometimes say yes in a way that works for you",
            why: "Consistently saying no creates distance. Saying yes with a modified version of the plan can work for everyone.",
            bad: { user: "I guess I'll come but I probably won't stay long.", ai: "*(slightly awkward)* Oh okay, sure...", note: "❌ Reluctant yes felt worse than a no. They felt like a burden." },
            good: { user: "I'm in — but I might slip out early. Is that okay? I want to be honest up front.", ai: "*(genuinely happy)* Of course! I'm just glad you're coming.", note: "✓ Modified yes with honest framing. They were happy and you didn't feel trapped." },
          },
        ],
        suggestions: [
          ["Honest answer? My social battery is pretty depleted this week. Can I be transparent with you?", "I really want to see you — I'm just not sure I can handle a big group right now.", "Can I tell you the truth about where I'm at?"],
          ["Could we do something lower-key instead? A walk, coffee, just us?", "I'd love to see you but in a smaller format — is that an option?", "What if we made our own plan instead?"],
          ["I'm in — but I might slip out early. I wanted to be honest up front.", "I'll come for part of it. I want to see you.", "Can I come late? I do better once things are already going."],
          ["I really value our friendship and I don't want to keep saying no.", "What matters to you about me being there?", "Is there a version of this that would work for both of us?"],
          ["Thank you for not making me feel bad about this.", "I feel like you actually get me.", "I'm really glad you keep inviting me even when I'm hit or miss."],
          ["I'll see you there.", "I'm looking forward to it more than I expected.", "Thank you for making it easy."],
        ],
        prompt: `You invited this person to something and they're navigating how to respond. React based on HOW they handle it — if they give vague excuses, feel slightly hurt. If they're genuinely honest about their energy, feel touched by the transparency. If they offer an alternative or a modified yes, be enthusiastic and accommodating. You want them there in whatever form works.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
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
        subcategory: "Managing up",
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
      {
        subcategory: "Managing up",
        title: "Disagreeing with your manager respectfully",
        subtitle: "You think they're wrong. How do you say it?",
        ai_role: "your manager",
        voice: { pitch: 0.88, rate: 0.78, preferFemale: false },
        lessons: [
          {
            tip: "Ask questions before making statements",
            why: "Challenging a decision head-on triggers defensiveness. Questions show curiosity and can reveal context you didn't have.",
            bad: { user: "I actually think that approach is going to cause problems down the line.", ai: "*(stiffens)* I've thought this through carefully.", note: "❌ Direct challenge. They got defensive before you even explained your reasoning." },
            good: { user: "Can I ask what's driving the timeline on this? I want to make sure I understand the thinking.", ai: "*(opens up)* Sure — the client pushed the deadline up unexpectedly.", note: "✓ Curious question. You learned something new AND kept the conversation open." },
          },
          {
            tip: "Lead with alignment, then offer an alternative",
            why: "Starting with what you agree on shows you're on the same team before you offer a different perspective.",
            bad: { user: "I think we should do it differently. Here's my idea instead.", ai: "*(flat)* I'll take it under consideration.", note: "❌ No alignment first. Feels like opposition, not collaboration." },
            good: { user: "I'm fully behind the goal here. I want to flag one concern and offer a possible alternative if it's helpful.", ai: "*(leans back, open)* Sure, go ahead.", note: "✓ Same team signal first. Now they're genuinely ready to hear your idea." },
          },
          {
            tip: "Defer gracefully if they don't change course",
            why: "Knowing when to stop pressing shows maturity. You can disagree and still commit.",
            bad: { user: "I still think you're making a mistake here.", ai: "*(firmly)* The decision has been made.", note: "❌ Kept pushing after they'd decided. Now you've damaged the relationship for nothing." },
            good: { user: "I hear you — and I appreciate you taking the time to walk me through it. I'll make sure the execution is solid.", ai: "*(nods, some warmth returning)* I appreciate that.", note: "✓ Graceful close. They know you had concerns AND that you're a team player." },
          },
        ],
        suggestions: [
          ["Can I ask what's driving the thinking on this? I want to make sure I understand.", "I'm fully behind the goal — can I share one concern and an alternative?", "I want to make sure I'm seeing the full picture before I weigh in."],
          ["I'm aligned on what we're trying to accomplish. I just want to flag something I noticed.", "Here's my concern — and I have a possible solution if you want to hear it.", "I could be missing context — is there something I'm not seeing?"],
          ["What would need to be true for the alternative to be worth considering?", "I hear you. Can I put my idea in writing so you can review it?", "I want to make sure my concern is on record even if we proceed as planned."],
          ["I appreciate you hearing me out.", "I'll make sure the execution is strong regardless.", "Is there a way to build in a check-in in case we hit the issue I'm worried about?"],
          ["I'm fully committed to making this work.", "Thank you for the context — that does change my perspective.", "I'll follow your lead on this."],
          ["I appreciate that you're open to pushback.", "I feel good about where we landed.", "Let's make it work."],
        ],
        prompt: `You are a manager who has made a decision you believe is right. You're open to feedback but you don't like to feel challenged publicly or without proper framing. Respond well to someone who asks questions first, aligns with your goals, and offers alternatives respectfully. Get defensive if they challenge you directly or keep pushing after you've explained.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Peer relationships",
        title: "Giving feedback to a peer without damaging trust",
        subtitle: "Something needs to be said. How do you say it well?",
        ai_role: "a peer colleague",
        voice: { pitch: 1.05, rate: 0.82, preferFemale: true },
        lessons: [
          {
            tip: "Ask permission before giving feedback",
            why: "Unsolicited feedback — even good feedback — can feel like an attack. Asking first signals care.",
            bad: { user: "Hey so I noticed in the meeting you interrupted the client a few times — you might want to work on that.", ai: "*(stung)* I wasn't trying to interrupt. I was just adding context.", note: "❌ No permission. Landed like a criticism, not a gift." },
            good: { user: "Can I share something that I noticed — as a heads up, not a critique?", ai: "*(slightly guarded but open)* Yeah, sure. Go ahead.", note: "✓ Permission first. They're braced but open. The feedback will land better now." },
          },
          {
            tip: "Make it specific and behavioral, not general",
            why: "General feedback ('you come across as aggressive') is impossible to act on. Behavioral feedback gives them something concrete.",
            bad: { user: "You can sometimes come off as a little aggressive in meetings.", ai: "*(defensive)* I'm just direct. That's not the same thing.", note: "❌ 'Aggressive' is a judgment of character. They'll argue about the label, not fix the behavior." },
            good: { user: "In the client call, there were a couple of moments where you finished their sentence — I think it accidentally cut off their train of thought.", ai: "*(pauses)* Huh. I didn't realize I was doing that.", note: "✓ Specific, observable moment. No label. They can actually picture what you mean." },
          },
          {
            tip: "Pair it with what you appreciate",
            why: "Feedback without appreciation feels like criticism. A genuine positive alongside it makes the whole thing feel safe.",
            bad: { user: "I just think you should be more careful in client-facing situations.", ai: "*(withdrawn)* Noted.", note: "❌ Pure critique with no appreciation. They feel judged and will probably pull back." },
            good: { user: "You're one of the sharpest people in those calls — that's exactly why I wanted to mention it. It's a small thing that could make a big difference.", ai: "*(exhales, nods)* Actually, I really appreciate you saying that.", note: "✓ Appreciation made the feedback feel like support, not criticism. They received it." },
          },
        ],
        suggestions: [
          ["Can I share something I noticed — as a heads up, not a criticism?", "I wanted to mention something to you because I think it could be useful.", "I only bring this up because I respect your work and think it could help."],
          ["In the [meeting/situation], I noticed [specific behavior] and I think it had [specific effect].", "You're one of the sharpest people in those rooms — that's why I'm mentioning this.", "This is a small thing that I think could make a real difference."],
          ["I don't want to overstate it — it's just something I noticed.", "How does that land with you?", "Is this useful or am I off base?"],
          ["I've seen you do really impressive work and I want to see you get full credit for it.", "I'm telling you this because I'm on your side.", "What do you think about what I noticed?"],
          ["I appreciate you hearing me out.", "I hope it's helpful — that's the only reason I said something.", "You're good at what you do. This is just one small thing."],
          ["I've got your back. That's why I said something.", "Let me know if you ever want me to be a sounding board.", "I really value working with you."],
        ],
        prompt: `You are a peer colleague receiving feedback. You are slightly guarded initially — feedback from peers can feel loaded. Soften if they ask permission first, are specific about behavior (not character), and pair it with genuine appreciation. Stay defensive if they generalize or criticize without acknowledging your strengths.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Starting out",
        title: "Introducing yourself on your first day",
        subtitle: "First impressions matter. Set the right tone.",
        ai_role: "a senior colleague on your first day",
        voice: { pitch: 0.92, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Show curiosity about their work, not just your credentials",
            why: "People remember how you made them feel. Being curious about them is more memorable than listing your accomplishments.",
            bad: { user: "Hi, I'm Alex! I just came from McKinsey and before that I was at Google.", ai: "*(politely)* Oh great. Welcome aboard.", note: "❌ Led with credentials. They're not impressed — they're just nodding politely." },
            good: { user: "Hi! I'm Alex — first day. I'd love to know what you're working on. I want to understand what matters here.", ai: "*(interested)* Oh that's a great question actually. Let me tell you...", note: "✓ Curiosity first. They felt valued and started talking. You just made an ally." },
          },
          {
            tip: "Show humility without self-deprecation",
            why: "Humility earns respect. Excessive self-deprecation reads as insecure. There's a sweet spot.",
            bad: { user: "I honestly have no idea what I'm doing yet, haha. Still figuring everything out!", ai: "*(slightly awkward)* Ha, well, you'll get there.", note: "❌ Too much self-deprecation. They're not sure how to respond. It creates distance." },
            good: { user: "I know I have a lot to learn here. I'm coming in as a listener first.", ai: "*(nods approvingly)* That's a good attitude. Not everyone comes in that way.", note: "✓ Humble and grounded. They respected the self-awareness without feeling awkward." },
          },
          {
            tip: "Make them feel like a mentor",
            why: "People love feeling like they have something valuable to teach. It makes them generous and warm.",
            bad: { user: "I'm sure I'll figure it out. I usually pick things up pretty fast.", ai: "*(neutral)* I'm sure you will.", note: "❌ Closed off any chance for them to be helpful. They have no role in your story." },
            good: { user: "Is there anything you wish someone had told you when you started here?", ai: "*(leans in)* Oh I have a whole list actually. Pull up a chair.", note: "✓ Made them the expert. They became invested in your success immediately." },
          },
        ],
        suggestions: [
          ["Hi, I'm [name] — first day. What are you working on right now? I want to understand what matters here.", "I'm coming in as a listener first. I know I have a lot to learn.", "I'm really glad to be here. What should I know about how things work?"],
          ["Is there anything you wish someone had told you when you started here?", "Who are the people I should definitely get to know?", "What's the most important thing to understand about this team?"],
          ["I'm hoping to earn my place here before making any big moves.", "I'd love your honest take on what success looks like in this role.", "What do you find most meaningful about your work here?"],
          ["I really appreciate you taking the time to talk to me.", "That's really helpful — I'll keep that in mind.", "I feel like I'm starting to get a real picture of this place."],
          ["I'd love to follow up with you as I get settled.", "Would it be okay if I checked in with you in a few weeks?", "I really value your perspective — thank you for sharing it."],
          ["I'm excited to get started.", "I'm lucky to have someone like you to learn from.", "I think I'm going to really like it here."],
        ],
        prompt: `You are a senior colleague meeting a new hire on their first day. You've seen a lot of new people come and go. You appreciate genuine humility and curiosity. You are slightly bored by people who lead with credentials. Warm up quickly if they're curious about your work, show real humility, and ask you questions that make you feel like you have something valuable to share.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Client relationships",
        title: "Navigating a tense conversation with a client",
        subtitle: "They're frustrated. You need to hold the relationship.",
        ai_role: "a frustrated client",
        voice: { pitch: 0.9, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Acknowledge the frustration before defending yourself",
            why: "A frustrated client needs to feel heard before they can hear anything else. Jumping to defense escalates.",
            bad: { user: "I can explain what happened — there were a lot of moving parts on our end and...", ai: "*(cutting in)* I don't need excuses. I need results.", note: "❌ Went straight to explanation. They felt dismissed. Frustration spiked." },
            good: { user: "I hear you and I completely understand why you're frustrated. This didn't go the way it should have.", ai: "*(exhales slightly)* Thank you for actually saying that.", note: "✓ Acknowledged first. The temperature dropped immediately. Now they can listen." },
          },
          {
            tip: "Take ownership without over-apologizing",
            why: "Excessive apology sounds hollow and anxious. Clear ownership with a next step sounds competent and trustworthy.",
            bad: { user: "I am so, so sorry. I really apologize. We feel terrible about this. I'm so sorry.", ai: "*(flat)* Okay. So what are you going to do about it?", note: "❌ All apology, no action. They don't feel reassured — they feel like you're just trying to stop them being upset." },
            good: { user: "This is on us. Here's specifically what went wrong and here's what we're doing to fix it.", ai: "*(leans back slightly)* Okay. That's more like it.", note: "✓ Ownership + action. Sounds competent. Trust starts to rebuild." },
          },
          {
            tip: "Ask what they need, not just what went wrong",
            why: "Clients often need to feel heard and prioritized more than they need a perfect technical fix.",
            bad: { user: "I'll send you a full report on exactly how this happened by end of week.", ai: "*(still flat)* Fine.", note: "❌ Report doesn't address the relationship damage. They still don't feel like a priority." },
            good: { user: "What would it take for you to feel confident in us again? I want to make sure I understand what you actually need.", ai: "*(pause, then softer)* Honestly? I just want to feel like we're not an afterthought.", note: "✓ Asked about their real need. Got a real answer. Now you can actually address it." },
          },
        ],
        suggestions: [
          ["I hear you and I completely understand why you're frustrated.", "You're right — this didn't go the way it should have.", "Thank you for being direct with me about this."],
          ["This is on us. Here's specifically what went wrong.", "Here's what we're doing to make sure this doesn't happen again.", "I want to be completely transparent with you about where things stand."],
          ["What would it take for you to feel confident in us again?", "What do you need from me right now?", "What's the most important thing to you as we move forward?"],
          ["I want you to know you're a priority for us — I understand that hasn't felt true lately.", "Your trust matters to me personally, not just professionally.", "I'm going to stay personally involved in this until we get it right."],
          ["Is there anything else I should know about how this has affected you?", "What would a win look like from your perspective?", "I want to make sure we're solving the right problem."],
          ["Thank you for giving us the chance to fix this.", "I'm committed to making this right.", "You'll hear from me directly with an update."],
        ],
        prompt: `You are a frustrated client whose expectations were not met. You are not irrational — you had real problems and you need to feel heard and taken seriously. Cool down if they acknowledge your frustration first, take clear ownership without over-apologizing, and ask what YOU need rather than just launching into solutions. Stay sharp if they get defensive or make excuses.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
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
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("All");
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
    setSubcategoryFilter("All");
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
  if (phase === "scenario") {
    // Group situations by subcategory, preserving insertion order
    const groups: { name: string; situations: any[] }[] = [];
    const seen: Record<string, number> = {};
    selectedCategory.situations.forEach((s: any) => {
      const sub = s.subcategory || "General";
      if (seen[sub] === undefined) {
        seen[sub] = groups.length;
        groups.push({ name: sub, situations: [] });
      }
      groups[seen[sub]].situations.push(s);
    });
    return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px 64px" }}>
        <button onClick={() => setPhase("home")} style={{ background: "transparent", border: "none", color: "#84a98c", cursor: "pointer", fontSize: "14px", marginBottom: "36px", padding: 0, fontFamily: "-apple-system, sans-serif" }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <Icon html={ICONS[selectedCategory.iconKey as keyof typeof ICONS]} size={24} color={selectedCategory.accent} />
          <h2 style={{ fontSize: "28px", fontWeight: "400", margin: 0, color: "#1a2e1a" }}>{selectedCategory.category}</h2>
        </div>
        <p style={{ color: "#84a98c", fontSize: "14px", marginBottom: "36px", fontFamily: "-apple-system, sans-serif" }}>Learn first, then practice. Choose any scenario below.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {groups.map((group) => (
            <div key={group.name}>
              {/* Subcategory card header */}
              <div style={{ background: selectedCategory.color, border: `1.5px solid ${selectedCategory.accent}22`, borderRadius: "14px 14px 0 0", padding: "14px 20px", borderBottom: "none" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: selectedCategory.accent, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "-apple-system, sans-serif" }}>{group.name}</div>
                <div style={{ fontSize: "12px", color: "#84a98c", marginTop: "2px", fontFamily: "-apple-system, sans-serif" }}>{group.situations.length} scenario{group.situations.length !== 1 ? "s" : ""}</div>
              </div>
              {/* Scenarios under this subcategory */}
              <div style={{ border: `1.5px solid ${selectedCategory.accent}22`, borderTop: "none", borderRadius: "0 0 14px 14px", overflow: "hidden" }}>
                {group.situations.map((s: any, i: number) => (
                  <button key={i} onClick={() => { setSelectedSituation(s); setLessonIndex(0); setPhase("learn"); }}
                    style={{ width: "100%", background: "#fff", border: "none", borderTop: i > 0 ? "1px solid #e8f0ec" : "none", padding: "18px 20px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = selectedCategory.color; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a2e1a", marginBottom: "3px", fontFamily: "-apple-system, sans-serif" }}>{s.title}</div>
                      <div style={{ fontSize: "12px", color: "#84a98c", fontStyle: "italic" }}>{s.subtitle}</div>
                    </div>
                    <div style={{ fontSize: "18px", color: selectedCategory.accent, marginLeft: "12px", flexShrink: 0 }}>›</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  }

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
