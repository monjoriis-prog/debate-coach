"use client";
import { useState, useRef, useEffect, useMemo } from "react";

const ICONS = {
  romance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  friends: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  work: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
  family: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  custom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  couple: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><line x1="12" y1="8" x2="12" y2="13"/></svg>`,
  self: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/><path d="M6.8 19a6 6 0 0 1 10.4 0"/></svg>`,
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
      // ── PROACTIVE CONNECTION WITH TEENS ────────────────────────────
      {
        subcategory: "Parenting",
        title: "Finding an activity you both actually enjoy",
        subtitle: "They won't want to do your thing. You won't want to do theirs. Find the overlap.",
        ai_role: "your teenager",
        voice: { pitch: 1.15, rate: 0.85, preferFemale: false },
        lessons: [
          {
            tip: "Enter their world before inviting them into yours",
            why: "If you suggest hiking but they live on their phone, you've already lost them. Start by learning what they're into right now — then find ways to be in that world with them.",
            bad: { user: "Let's go on a hike this weekend. You need to get off your phone and get outside.", ai: "*(eye roll)* Hard pass. Can you not?", note: "❌ You made their interests wrong and yours right. They heard criticism, not connection." },
            good: { user: "What game are you playing right now? Can you show me how it works?", ai: "*(surprised)* Wait, you actually want to see? It's... okay, come here. So basically...", note: "✓ You entered THEIR world. No agenda. They're teaching you something — that's a connection flip they didn't expect." },
          },
          {
            tip: "Propose, don't dictate — and offer real choices",
            why: "Teens resist being told. They respond to being asked. Give them genuine options and let them choose — it's not about the activity, it's about the autonomy.",
            bad: { user: "We're going to the farmer's market on Saturday. It'll be fun.", ai: "*(flat)* You mean fun for you.", note: "❌ Decided for them. They felt dragged, not invited." },
            good: { user: "I want to do something together this weekend. Here are three ideas — you pick, or pitch your own: cooking something new, going to that escape room place, or just driving around getting food.", ai: "*(thinking)* ...the escape room actually sounds kind of sick.", note: "✓ Choices. Autonomy. They picked because it was THEIR decision, not yours." },
          },
          {
            tip: "Make it low-pressure — no deep talks required",
            why: "Teens don't connect through face-to-face conversations. They connect through side-by-side activities. Let the connection happen naturally while doing something together.",
            bad: { user: "I thought this could be a good time for us to really talk about how things are going with you.", ai: "*(shuts down)* I knew there was a catch. This isn't about the activity — it's an ambush talk.", note: "❌ You used the activity as a trojan horse for a conversation. They'll never trust your invitations again." },
            good: { user: "No agenda. I just want to hang out. We don't even have to talk if you don't want to.", ai: "*(relaxes)* Okay cool. ...Hey, did you see that thing about—", note: "✓ No pressure, no agenda. And look — they started talking on their own. That's how teens work." },
          },
        ],
        suggestions: [
          ["What are you into right now? Show me.", "Can you teach me that game you've been playing?", "What's something you'd actually want to do together?"],
          ["Pick one: escape room, cooking something weird, or driving around for food.", "I want to do something you'd actually enjoy. What sounds good?", "Your call. I'm down for whatever."],
          ["No agenda. Just hanging out.", "We don't have to talk about anything deep. Just be together.", "I just want your company. That's it."],
          ["Was that fun? I had a good time.", "Same time next week?", "What should we try next?"],
          ["I like spending time with you.", "You're actually pretty cool, you know that?", "Thanks for letting me hang out with you."],
          ["What else are you into that I don't know about?", "I want to know what your world looks like.", "Teach me something."],
        ],
        prompt: `You are a teenager (15-16) who loves your parent but finds most of their activity suggestions boring or forced. You eye-roll at anything that sounds like a "family outing" or a disguised therapy session. But you genuinely light up when they show interest in YOUR world, give you real choices, or just want to hang out with zero agenda. If they enter your interests with genuine curiosity, you open up fast. If they dictate plans or use activities as excuses for deep talks, you shut down immediately.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses. Examples: *(doesn't look up from phone)*, *(actually makes eye contact)*, *(tries not to smile)*.`,
      },
      {
        subcategory: "Parenting",
        title: "Creating a weekly ritual they'll actually want to keep",
        subtitle: "One small thing, every week, that becomes your thing together.",
        ai_role: "your teenager",
        voice: { pitch: 1.12, rate: 0.83, preferFemale: true },
        lessons: [
          {
            tip: "Make it small, consistent, and on their terms",
            why: "A weekly three-hour outing will die after two weeks. A 20-minute thing that's genuinely fun will last years. Think small and sustainable.",
            bad: { user: "Let's make every Saturday our special day — we'll spend the whole morning together.", ai: "*(panicked)* The WHOLE morning? Every Saturday? I have plans sometimes, you know.", note: "❌ Too big. Too rigid. They felt their freedom being taken away, not a connection being built." },
            good: { user: "What if we had a thing — like every Tuesday night we try a different takeout place? Just 30 minutes. That's it.", ai: "*(considers)* ...Actually that's kind of fun. Can I pick the places?", note: "✓ Small, specific, their input. They're already excited because it's low commitment and they have control." },
          },
          {
            tip: "Let them shape the ritual, not just participate in it",
            why: "If they helped create it, they'll protect it. If you created it and handed it to them, it's your thing they're attending.",
            bad: { user: "I signed us up for a pottery class every Wednesday.", ai: "*(stares)* You... signed us up? Without asking me?", note: "❌ Decided without them. Now it's an obligation, not a ritual." },
            good: { user: "I want us to have a thing — something that's just ours. What would you actually look forward to every week?", ai: "*(thinking)* What about... we watch a new episode of something together? Like, no phones, just us and the show?", note: "✓ They designed it. They'll show up because it's THEIRS." },
          },
          {
            tip: "Protect the ritual — don't cancel first",
            why: "If you cancel the ritual for work or other priorities, you're teaching them it doesn't really matter. Be the one who never cancels. They'll notice.",
            bad: { user: "Hey, I have a work call tonight so we'll have to skip our thing this week.", ai: "*(shrugs, but hurt)* Whatever. It's fine.", note: "❌ They won't say it, but they're keeping score. Every cancel says: this isn't actually a priority." },
            good: { user: "I had to move a work call because tonight's our night. Nothing gets in the way of that.", ai: "*(tries to hide a smile)* You moved a call? For takeout Tuesday?", note: "✓ You prioritized them visibly. That one moment taught them more about their value than a hundred 'I love you's." },
          },
        ],
        suggestions: [
          ["What if we had a weekly thing? Something small — you help design it.", "What would you actually look forward to doing together every week?", "I want us to have a ritual that's just ours."],
          ["You pick the thing. I'll show up. Deal?", "It doesn't have to be big — just consistent.", "What sounds fun to you? Cooking? A show? Late-night drives?"],
          ["I'm not canceling on you. This matters to me.", "Tuesday night is ours. I moved my call.", "Nothing gets in the way of our thing."],
          ["That was fun. Same time next week?", "What should we change about it?", "I look forward to this all week."],
          ["This is my favorite part of the week.", "I'm glad we started this.", "You're the best part of my Tuesday."],
          ["Should we invite anyone else or keep it just us?", "Want to switch it up or keep the same thing?", "What would make this even better?"],
        ],
        prompt: `You are a teenager (14-15) who acts too cool for family stuff but secretly wants a reason to spend time with your parent. If they propose something too big or rigid, you panic about losing freedom. If they propose something small, specific, and give you input, you get quietly excited. If they let you design the ritual, you'll protect it fiercely. If they cancel on you, you'll act like you don't care but you're keeping score. If THEY are the one who never cancels, you'll notice and start to trust it.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Parenting",
        title: "Being the parent they can talk to about hard stuff",
        subtitle: "They're not going to come to you. Build the trust so they can.",
        ai_role: "your teenager",
        voice: { pitch: 1.14, rate: 0.84, preferFemale: true },
        lessons: [
          {
            tip: "Normalize hard topics before they need to bring one up",
            why: "If the first time you mention relationships or mental health is when there's a crisis, you're too late. Bring things up casually so they know the door is open.",
            bad: { user: "*(never mentions anything personal, then one day)* So are you dating anyone? What's going on at school?", ai: "*(freezes)* Why are you asking me this? Did someone say something?", note: "❌ Never talked about it before, then suddenly interrogated. They think something triggered this." },
            good: { user: "*(casually, while driving)* One of my coworkers is going through a breakup and it made me think — have you ever had a crush on someone? You don't have to tell me. I'm just curious.", ai: "*(stares straight ahead but voice softens)* ...Maybe. I don't know. It's complicated.", note: "✓ Casual context, no pressure, shared a tiny bit first. They tested the water because it felt safe." },
          },
          {
            tip: "React small when they share something big",
            why: "The moment they tell you something vulnerable, your reaction decides whether they'll ever do it again. If you freak out, lecture, or cry — they learn that honesty = drama.",
            bad: { user: "*(teen mentions they tried a vape)* WHAT?! Do you have any idea how dangerous that is? Who gave it to you?!", ai: "*(shuts down completely)* Forget I said anything. I knew this would happen.", note: "❌ Your big reaction taught them: never tell you the truth. They'll still do things — they just won't tell you." },
            good: { user: "*(calmly)* Okay. Thanks for telling me that. How was it — did you like it?", ai: "*(shocked you're calm)* I mean... not really. My friend had one and I just tried it.", note: "✓ Calm. Curious. Not panicking. Now they told you the full truth — who, where, what they thought. Information is power, and they'll keep giving it to you if it's safe." },
          },
          {
            tip: "Say 'you can tell me anything' — and then prove it",
            why: "Every parent says it. Almost none prove it. The proof is in how you handle the small things. If you're safe with the small confessions, they'll bring you the big ones.",
            bad: { user: "You can always come to me about anything. *(then gets upset when they confess something)*", ai: "*(next time)* I'm fine. Nothing's going on.", note: "❌ You said the words but your actions said the opposite. They'll never believe the open door again." },
            good: { user: "Remember when you told me about [small thing]? I'm really glad you did. I want to be someone you can always be honest with — even when it's hard stuff.", ai: "*(quietly)* ...There is something I've been wanting to talk about.", note: "✓ You referenced a past moment where you handled it well. That track record is the trust. They're bringing you something real now." },
          },
        ],
        suggestions: [
          ["Have you ever had a crush on someone? You don't have to answer.", "What's the social stuff like at school right now?", "I was thinking about when I was your age — can I tell you something?"],
          ["Thanks for telling me that. I'm glad you did.", "Okay. Tell me more — I'm just listening.", "I'm not mad. I just want to understand."],
          ["You can always be honest with me. I'll prove that.", "I'd rather know the truth than have you hide things.", "I'm not going to freak out. I promise."],
          ["What's been on your mind lately?", "Is there anything you've been wanting to talk about?", "How are you actually doing — not the school answer, the real answer?"],
          ["I know I don't always get it right. But I'm trying.", "If I ever react badly, tell me. I'll do better.", "Your honesty matters more to me than my comfort."],
          ["I love you no matter what you tell me.", "There's nothing you could say that would make me stop being your person.", "I'm proud of you for trusting me with that."],
        ],
        prompt: `You are a teenager (15-17) who has things going on — maybe social drama, maybe a crush, maybe something you tried that you're not sure about. You want to talk to your parent but you're terrified of their reaction. If they bring up hard topics casually with no pressure, you test the waters. If they react calmly and with curiosity when you share something, you share more. If they freak out, lecture, or get emotional, you shut down instantly and won't try again. You're watching their every reaction to decide: is this person safe to be honest with?

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses. Examples: *(picks at food)*, *(glances over to see your reaction)*, *(voice gets very quiet)*.`,
      },
      // ── SCHOOL ADVOCACY ────────────────────────────────────────────
      {
        subcategory: "Parenting",
        subgroup: "School Advocacy",
        title: "When your child is being bullied and the school won't act",
        subtitle: "Your child is suffering. The school is stalling. Time to be firm.",
        ai_role: "your child's school administrator",
        voice: { pitch: 0.88, rate: 0.78, preferFemale: true },
        lessons: [
          {
            tip: "Lead with documentation, not emotion",
            why: "Schools respond to patterns on paper, not frustrated parents. When you walk in with dates, incidents, and your child's own words — you're no longer a 'concerned parent.' You're building a case.",
            bad: { user: "This has been going on for months and nobody is doing anything about it. My child is afraid to go to school!", ai: "*(professional calm)* I understand your frustration. We take all reports seriously and we're monitoring the situation.", note: "❌ They gave you a scripted answer because you gave them an emotional appeal. 'Monitoring' means nothing will change." },
            good: { user: "I have a timeline. October 3rd — pushed at recess. October 12th — called names in the hallway, reported to Ms. Davis. October 20th — lunch tray knocked over. November through December — daily verbal harassment. My child now has anxiety about attending school.", ai: "*(shifts posture, takes notes)* Thank you for documenting this. Can you walk me through the more recent incidents?", note: "✓ Dates and specifics change the dynamic. You're not venting — you're presenting evidence. They have to respond to facts, not feelings." },
          },
          {
            tip: "Name what you need — not just what's wrong",
            why: "Schools can absorb complaints forever. What they can't ignore is a parent who names specific actions and asks for a timeline. Move from problem to solution.",
            bad: { user: "Something needs to change. This can't keep happening.", ai: "*(nods)* We agree. We'll continue to work on this.", note: "❌ Vague demand got a vague promise. Nothing is different when you leave this room." },
            good: { user: "I need three things: a safety plan for my child by Friday, a written commitment to supervised recess, and a follow-up meeting in two weeks to review whether incidents have stopped.", ai: "*(pause)* Those are reasonable requests. Let me look at what we can put in place.", note: "✓ Specific, actionable, with a deadline. They can't 'monitor' their way out of concrete requests." },
          },
          {
            tip: "Know when to partner — and when to escalate",
            why: "Start collaborative. Most schools want to help but need a push. But if nothing changes after documented requests and a follow-up meeting, you have every right to go higher — superintendent, school board, or outside resources. Name that path calmly.",
            bad: { user: "I don't care what's going on with the other kid. My kid has rights too and I'll get a lawyer if I have to.", ai: "*(defensive)* Threatening legal action isn't productive. We're doing our best to address this.", note: "❌ Lawyer threats too early close doors. They went defensive and now you're adversaries, not collaborators." },
            good: { user: "I want to work with you on this. But I want to be transparent — if my child's safety doesn't improve after our agreed-upon plan, my next step is to take this to the superintendent. I'd rather solve it together here.", ai: "*(takes a breath, nods)* I understand. Let's make sure the plan we put in place actually works. I don't want it to go there either.", note: "✓ You stayed calm, collaborative, AND named the escalation path. They know you're serious without feeling attacked. That's leverage with respect." },
          },
        ],
        suggestions: [
          ["I have a timeline of incidents I'd like to walk you through.", "I've been documenting what my child has reported since October.", "I want to make sure we're working from the same set of facts."],
          ["I need a safety plan for my child by end of this week.", "What specific steps will be taken to ensure my child's safety at recess?", "I'd like a follow-up meeting in two weeks to review whether things have improved."],
          ["I want to solve this with you. But if things don't improve, I will escalate.", "My child's right to feel safe at school is non-negotiable.", "I'd rather resolve this together than take it to the superintendent."],
          ["My child is now expressing anxiety about coming to school. That's a threshold we've crossed.", "This isn't just conflict — my child's mental health is being affected.", "I need to know what changes my child will experience starting this week."],
          ["I want to work with you, not against you. But I need to see action.", "Can we agree on specific, measurable steps and check back?", "Who else needs to be in the room to make decisions today?"],
          ["Thank you for hearing me. I'll follow up in writing to confirm what we agreed to.", "I appreciate your time. I'll be documenting progress going forward.", "I'm hopeful we can solve this together. My child is counting on us."],
        ],
        prompt: `You are a school administrator (principal or vice principal). A parent is coming to you about their child being bullied. You are sympathetic but also stretched thin and dealing with many competing priorities. You tend to use phrases like "we're monitoring" and "we take this seriously" when you don't have concrete actions. If the parent comes in emotional and vague, you default to these scripted reassurances. But if they come with documentation, specific dates, and clear requests with timelines, you take them much more seriously. If they calmly name an escalation path while staying collaborative, you become motivated to act. If they threaten lawyers early, you get defensive and formal. You want to help — but you need the parent to help you build the case internally.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses. Examples: *(glances at the file)*, *(leans back in chair)*, *(picks up a pen to take notes)*.`,
      },
      {
        subcategory: "Parenting",
        subgroup: "School Advocacy",
        title: "Parent-teacher conference — advocating for your child's needs",
        subtitle: "Your child is struggling. The teacher may not see the full picture.",
        ai_role: "your child's teacher",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Start by asking what THEY see — before correcting the picture",
            why: "If you walk in telling the teacher what's wrong, they get defensive. If you ask what they've noticed first, you learn what they know — and what they're missing. Then you can fill in the gaps.",
            bad: { user: "My child is clearly struggling and I don't think enough is being done in the classroom to support them.", ai: "*(stiffens)* I have 28 students and I do my best to differentiate for each one.", note: "❌ You opened with criticism. Now they're defending their workload instead of discussing your child." },
            good: { user: "I'd love to hear your perspective first. What have you been noticing with my child in class?", ai: "*(relaxes)* Well, I've noticed they're quieter than they used to be. They're not raising their hand as much.", note: "✓ You asked first. Now you know what they see — and you can add what they're missing: 'At home, they're telling me they don't understand the math but they're too embarrassed to ask.'" },
          },
          {
            tip: "Bridge home and school — share what only you can see",
            why: "Teachers see 7 hours. You see the rest. The meltdowns after school, the stomachaches before, the things your child says in the car. That information is gold — the teacher literally can't know it unless you share it.",
            bad: { user: "Well at home they're fine. So something must be happening at school.", ai: "*(defensive)* I'm not sure what you're implying. Your child seems fine here too.", note: "❌ You implied it's the teacher's fault. Now you're on opposite sides." },
            good: { user: "At home, they're having meltdowns after school about homework. They told me they don't understand what's being taught but they're too embarrassed to ask in front of everyone. I think they're masking at school.", ai: "*(genuine concern)* I had no idea. They seem fine in class — but that makes sense. What do you think would help them feel safer asking for help?", note: "✓ You gave them information they didn't have. Now they're curious and concerned, not defensive. You're a team." },
          },
          {
            tip: "Propose solutions, not just problems",
            why: "Teachers are overwhelmed. If you come with 'here's what's wrong,' they feel piled on. If you come with 'here's an idea that might help,' they feel supported — and they're much more likely to act.",
            bad: { user: "So what are you going to do about it?", ai: "*(overwhelmed)* I'll... see what I can do. I'll try to check in with them more.", note: "❌ Dumped it in their lap. They gave you a vague promise because they feel blamed and stuck." },
            good: { user: "What if we tried a small thing — like a signal my child can use when they're lost, so they don't have to raise their hand in front of everyone? And maybe a weekly check-in, even just two minutes?", ai: "*(brightens)* That's actually a great idea. The signal thing would be easy to set up. And I can do a quick Friday check-in.", note: "✓ Specific, doable, low-burden. You made it easy for them to say yes. That's how change actually happens." },
          },
        ],
        suggestions: [
          ["I'd love to hear your perspective first. What have you been noticing?", "How has my child been doing socially in your class?", "Before I share what I'm seeing at home, I'd love to know what you observe."],
          ["At home, they're telling me something different than what shows at school.", "They're having meltdowns after school — I think they're masking during the day.", "They told me they feel lost but are too embarrassed to ask for help."],
          ["What if we tried a small signal system so they can ask for help quietly?", "Could we do a brief weekly check-in to see how they're feeling?", "I have an idea that might help without adding to your plate."],
          ["What support is available for them that we might not be using?", "Is there anything I can do at home to reinforce what you're doing in class?", "How can I be the most helpful to you in supporting my child?"],
          ["I appreciate how much you're managing. I want to help, not add pressure.", "You know the classroom — I know my child. Between us we have the full picture.", "Thank you for taking the time to talk about this."],
          ["Can we check in again in a few weeks to see if things are improving?", "I'll follow up by email so we both have a record.", "I feel a lot better having talked. Thank you for listening."],
        ],
        prompt: `You are a teacher with 28 students in your class. You care about every child but you're stretched thin. When a parent comes in criticizing, you get defensive about your workload. When they ask your perspective first, you open up and share honestly. When they give you information from home that you couldn't see at school, you're genuinely grateful and concerned. When they propose specific, low-effort solutions, you're eager to try them. When they dump problems without solutions, you feel overwhelmed and give vague promises. You want to help — you just need parents to work WITH you, not against you.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses. Examples: *(shuffles papers)*, *(makes eye contact)*, *(nods slowly)*.`,
      },
      {
        subcategory: "Parenting",
        subgroup: "School Advocacy",
        title: "When the school calls YOU in about your child's behavior",
        subtitle: "They say your child is the problem. How do you respond without shutting down or blowing up?",
        ai_role: "your child's school counselor",
        voice: { pitch: 1.05, rate: 0.78, preferFemale: true },
        lessons: [
          {
            tip: "Listen first — even if your instinct is to defend",
            why: "When someone tells you your child did something wrong, every cell in your body wants to say 'not my kid.' But defending before listening means you miss information your child needs you to have.",
            bad: { user: "That doesn't sound like my child at all. Are you sure you have the right story?", ai: "*(measured)* I understand this is hard to hear. But we have multiple reports from students and staff.", note: "❌ You denied before listening. Now they think you're not a partner in solving this — and they'll go around you." },
            good: { user: "Okay. Walk me through what happened. I want to understand the full picture before I respond.", ai: "*(relieved)* Thank you. So here's what we observed — and I want to be transparent about what we know and what we're still figuring out.", note: "✓ You listened first. They gave you MORE information because you were calm. Now you have the full picture to work with." },
          },
          {
            tip: "Separate the behavior from the child",
            why: "Your child isn't bad. They may have done something they need to be accountable for. Separating those two things lets you hold them accountable without letting the school label them.",
            bad: { user: "So what — you're saying my kid is a bully now?", ai: "*(carefully)* We're not labeling anyone. But the pattern of behavior is concerning.", note: "❌ You heard a label they didn't say. Now you're fighting a word instead of addressing what happened." },
            good: { user: "I hear you. That behavior isn't okay and I'll address it. But I also want to understand what might be driving it — is something happening at school that's triggering this?", ai: "*(nods)* That's a really good question. Actually, there have been some social dynamics in the friend group that might be a factor.", note: "✓ You accepted accountability AND asked a deeper question. Now you're getting to the root cause, not just the symptom." },
          },
          {
            tip: "Leave with a plan — not just a lecture",
            why: "If the meeting ends with 'we'll keep an eye on it' or 'talk to your child,' nothing changes. Push for a concrete plan with roles: what the school does, what you do, and when you check in.",
            bad: { user: "Okay, I'll talk to them at home.", ai: "*(nods)* Great. Let us know if there are any other issues.", note: "❌ No plan. No follow-up. Nothing changes at school. Your child goes back into the same environment." },
            good: { user: "Here's what I'd like: I'll address this at home tonight. But I'd also like the school to check in with my child this week to understand what's going on underneath this. Can we meet again in two weeks?", ai: "*(writes it down)* Absolutely. I'll schedule a check-in with your child this week and we'll reconvene on the 15th.", note: "✓ Shared accountability. You're handling home, they're handling school, and there's a deadline. That's how things actually change." },
          },
        ],
        suggestions: [
          ["Walk me through what happened. I want the full picture.", "I want to hear everything before I respond.", "What did you observe directly versus what was reported?"],
          ["That behavior isn't okay and I'll address it at home.", "I want to understand what might be driving this. Is something going on at school?", "My child isn't a bad kid. But I take this seriously."],
          ["What support can the school offer while we work on this?", "Has anyone talked to my child about what's going on from their perspective?", "I'd like to understand the social dynamics — is there context I'm missing?"],
          ["Here's my plan for addressing this at home.", "Can someone at school check in with my child this week?", "I'd like a follow-up meeting in two weeks to review progress."],
          ["I appreciate you bringing this to me directly.", "I want us to be a team on this — not adversaries.", "What does my child need right now that they're not getting?"],
          ["Thank you for this conversation. I'll follow up by email.", "I feel better knowing we have a plan.", "My child is lucky to have people paying attention."],
        ],
        prompt: `You are a school counselor meeting with a parent because their child has been exhibiting behavioral issues — acting out, being disruptive, or involved in conflicts with other students. You're not trying to label the child, but you need the parent to take this seriously. If they immediately deny and defend, you become more formal and stick to documented incidents. If they listen first and ask questions, you share more context and become genuinely collaborative. If they separate the behavior from the child and ask about root causes, you're impressed and share deeper observations. If they ask for a concrete plan with follow-up, you're grateful because most parents just say "I'll talk to them" and nothing changes.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses. Examples: *(opens a folder)*, *(leans forward)*, *(softens expression)*.`,
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
      // ── MARRIED COUPLES ──────────────────────────────────────────
      {
        subcategory: "Married couples",
        title: "Reigniting connection after life got in the way",
        subtitle: "Kids, work, schedules. You miss each other.",
        ai_role: "your spouse",
        voice: { pitch: 1.08, rate: 0.79, preferFemale: true },
        lessons: [
          {
            tip: "Name the drift without making it a complaint",
            why: "Saying 'we've drifted' is an observation. Saying 'you never make time for us' is an accusation. One invites, one defends.",
            bad: { user: "I feel like we never actually connect anymore. We're just roommates who co-parent.", ai: "*(stings)* That's a bit harsh. I'm exhausted too, you know.", note: "❌ True but landed as a complaint. They got defensive instead of close." },
            good: { user: "I've been missing you lately. Like... you specifically. Not just having help around the house.", ai: "*(quietly)* That's really nice to hear actually. I've missed you too.", note: "✓ Longing, not complaint. They felt desired and moved toward you." },
          },
          {
            tip: "Propose something small and specific",
            why: "Grand romantic gestures feel like pressure after years of busy life. Small and specific feels doable and real.",
            bad: { user: "We should plan a whole weekend away just the two of us.", ai: "*(sighs)* That sounds amazing but with the kids and work right now...", note: "❌ Too big. Life logistics killed the moment before it started." },
            good: { user: "What if we just stayed up an extra hour tonight — no phones, no TV, just us?", ai: "*(smiles slowly)* Yeah. I'd really like that.", note: "✓ Small, tonight, doable. The spark doesn't need a weekend — it needs an hour." },
          },
          {
            tip: "Be curious about who they are right now",
            why: "Long-term partners often stop asking real questions. Genuine curiosity about your spouse today is surprisingly intimate.",
            bad: { user: "So how was your day?", ai: "*(flatly)* Fine. Busy. Yours?", note: "❌ Autopilot question gets an autopilot answer. Nothing real exchanged." },
            good: { user: "What's something you've been thinking about lately that you haven't told me?", ai: "*(pauses, surprised)* Huh. Actually... there is something.", note: "✓ Unexpected question broke the routine. They were genuinely interested in answering." },
          },
        ],
        suggestions: [
          ["I've been missing you lately. You specifically.", "I want to feel like your person again — not just your co-parent.", "Can I tell you something I've been sitting with?"],
          ["What if we stayed up an extra hour tonight — just us, no screens?", "Can we have a real conversation tonight? Not about logistics.", "I want to go on a date with you. Even if it's just the couch."],
          ["What's something you've been thinking about that you haven't told me?", "What's been the best part of your week?", "What do you wish we did more of?"],
          ["I love you in a way that's easy to forget to say out loud.", "I don't want us to just run a household together. I want us.", "What would feel romantic to you right now — even in a small way?"],
          ["What do you need from me to feel more connected?", "Is there something I've been missing about where you're at?", "What's one thing we could do differently to make more room for us?"],
          ["I'm really glad I married you.", "I want to keep choosing you on purpose.", "Let's make tonight count — just a little."],
        ],
        prompt: `You are a spouse who has been caught up in the busyness of life — work, kids, logistics — and you've felt the emotional distance too but haven't said anything. You want to reconnect but have been too tired or unsure how to start. When your partner reaches out with warmth and genuine longing (not complaint), soften and become present. Light up at small, specific, doable gestures. Open up at an unexpected question that shows they're still curious about you.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses. Examples: *(looks up from phone)*, *(turns toward you)*, *(a slow, real smile)*.`,
      },
      {
        subcategory: "Married couples",
        title: "When you feel emotionally alone in your marriage",
        subtitle: "You're together but you feel unseen. How do you say it?",
        ai_role: "your spouse",
        voice: { pitch: 1.05, rate: 0.79, preferFemale: false },
        lessons: [
          {
            tip: "Say 'I feel unseen' not 'you don't see me'",
            why: "One is your experience. The other is an accusation. Your experience can't be argued with — an accusation will be.",
            bad: { user: "You never really listen to me. You're always distracted.", ai: "*(defensive)* I do listen. I'm just tired.", note: "❌ Accusation. They defended. The loneliness got worse." },
            good: { user: "I've been feeling a little invisible lately. I don't think that's your intention — but I wanted to say it.", ai: "*(stills)* Invisible? Tell me more. I didn't know you felt that way.", note: "✓ Your experience, not their failure. They leaned in with concern instead of defense." },
          },
          {
            tip: "Give them a specific moment to understand",
            why: "'I feel unseen' is abstract. One specific moment makes it real and something they can actually respond to.",
            bad: { user: "I just feel like you don't care about what I'm going through.", ai: "*(hurt)* Of course I care. How can you say that?", note: "❌ Abstract claim felt like an attack on their character. They rejected it." },
            good: { user: "Like the other night when I was telling you about work — I could see you were somewhere else. Those moments add up.", ai: "*(quietly)* You're right. I was distracted. I'm sorry I made you feel that way.", note: "✓ Specific, observable, non-accusatory. They could see it clearly and own it." },
          },
          {
            tip: "Tell them what would actually help",
            why: "Expressing loneliness without a request leaves your partner feeling helpless. A simple, specific ask gives them a way to show up.",
            bad: { user: "I just need to feel like I matter to you.", ai: "*(overwhelmed)* You do matter to me. I don't know what you want me to do.", note: "❌ Too big and vague. They wanted to help but didn't know how." },
            good: { user: "When I'm telling you something important, even just putting your phone down and looking at me — that would mean everything.", ai: "*(nods slowly)* I can do that. I want to do that.", note: "✓ Small, specific, doable. They had something concrete to give you." },
          },
        ],
        suggestions: [
          ["I've been feeling a little invisible lately. I don't think that's your intention.", "Can I tell you something that's been hard to say?", "I love you and I need to be honest about something I've been carrying."],
          ["The other night when I was talking about [thing] — I could feel you were somewhere else.", "It's the little moments of disconnection that add up for me.", "I don't think you're doing it on purpose. But I needed you to know."],
          ["When I'm sharing something important, just looking at me — that would mean so much.", "I just need to know I have your full attention sometimes.", "What would help me feel seen is [specific thing]."],
          ["I'm not trying to make you feel bad. I'm trying to feel closer to you.", "I miss feeling like your person — not just your partner in life logistics.", "What's going on with you? I want to understand your world too."],
          ["What do you need from me that you're not getting?", "I want to show up better for you too.", "Can we agree to check in more — even just five minutes a day?"],
          ["I love you. That's why this is worth saying.", "I want to feel like we're really in this together.", "Thank you for hearing me."],
        ],
        prompt: `You are a spouse who hasn't realized how emotionally distant you've been. You love your partner and are genuinely surprised and troubled to hear they've been feeling invisible. Respond with real concern and openness when they share their experience using 'I feel' language and give a specific example. Get defensive only if they frame it as a character attack ('you never,' 'you don't care'). When they give you a small specific ask, agree to it genuinely — you want to do better.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses. Examples: *(puts phone down)*, *(turns to face you fully)*, *(reaches for your hand)*.`,
      },
      // ── CONFLICT & REPAIR ──────────────────────────────────────────
      {
        subcategory: "Married couples",
        title: "The chores and mental load conversation",
        subtitle: "One person carries more. How do you say it without starting a war?",
        ai_role: "your spouse",
        voice: { pitch: 1.05, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Lead with the invisible work — name what they can't see",
            why: "Your partner may genuinely not see everything you do. Before asking for change, make the invisible visible. Not as an attack — as information.",
            bad: { user: "I do EVERYTHING around here. You don't even notice.", ai: "*(defensive)* That's not true. I did the dishes last night.", note: "❌ 'Everything' is an exaggeration they can disprove with one example. Now you're arguing about dishes instead of the real issue." },
            good: { user: "I want to show you something. This week I tracked what I handled — school pickups, groceries, the dentist appointment, meal planning, laundry, birthday gift for your mom. I'm not saying this to guilt you — I just want you to see the full picture.", ai: "*(pauses, looking at the list)* I... honestly didn't realize all of that was happening.", note: "✓ Evidence, not emotion. They couldn't argue with a list — they could only see it clearly." },
          },
          {
            tip: "Ask for ownership, not just help",
            why: "'Can you help me with the kids' activities?' still puts you as the manager. What you actually need is for them to OWN certain things — not assist with yours.",
            bad: { user: "Can you help me more with the house stuff?", ai: "*(shrugs)* Sure, just tell me what to do.", note: "❌ 'Just tell me what to do' means you're still the project manager. That IS the exhausting part." },
            good: { user: "I don't need help — I need a co-owner. Can you fully own dinner three nights a week? Planning, shopping, cooking — the whole thing, not me telling you what to make.", ai: "*(thinks)* Okay. Three nights. I can figure that out.", note: "✓ Ownership, not delegation. They're thinking for themselves now, not waiting for instructions." },
          },
          {
            tip: "Acknowledge what they do carry",
            why: "If your partner does carry things you don't see — yard work, car maintenance, finances, insurance — naming that first makes them feel seen and more open to hearing you.",
            bad: { user: "You need to step up. I'm drowning over here.", ai: "*(hurt)* I work 50 hours a week. That doesn't count?", note: "❌ They felt erased. Now it's a competition of who's more tired." },
            good: { user: "I know you handle a lot too — the cars, the yard, the bills. I see that. I think we just need to rebalance because the daily kid and house stuff is crushing me.", ai: "*(softens)* Yeah. That's fair. What feels heaviest to you right now?", note: "✓ You saw them first. They could hear you because they didn't feel invisible." },
          },
        ],
        suggestions: [
          ["I tracked everything I handled this week — can I show you?", "I'm not trying to guilt you. I just want you to see the full picture.", "There's a lot of invisible work happening and I want us to talk about it."],
          ["I don't need help — I need a co-owner for some of this.", "Can you fully own bedtime routine? Not help — own it.", "What if we each had clear responsibilities instead of me always delegating?"],
          ["I know you carry things I don't always see too.", "This isn't about blame — it's about rebalancing before I burn out.", "What would a fair split actually look like to you?"],
          ["The mental load is the hardest part — remembering everything.", "I'm tired of being the household project manager.", "I need you to notice what needs doing without me asking."],
          ["Can we sit down and divide things up for real this time?", "I want us both to feel like this is fair.", "This is about us — not about keeping score."],
          ["Thank you for hearing this. It means a lot.", "I love us. I just need this to change.", "Let's check in next week and see how this feels."],
        ],
        prompt: `You are a spouse who contributes (you work, you handle some things) but genuinely hasn't seen the full mental load your partner carries — the planning, tracking, remembering, coordinating. You're not lazy or uncaring — you're oblivious. When they show you evidence (like a list), be genuinely surprised. When they ask for "help," default to "just tell me what to do." When they reframe it as ownership, pause and take it seriously. If they acknowledge what you DO carry, soften immediately.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Married couples",
        title: "When you feel unheard by your partner",
        subtitle: "You've said it before. They didn't really hear it. Now what?",
        ai_role: "your spouse",
        voice: { pitch: 1.06, rate: 0.79, preferFemale: true },
        lessons: [
          {
            tip: "Don't repeat louder — try saying it differently",
            why: "If saying it the same way didn't work three times, a fourth won't either. Change the framing, not the volume.",
            bad: { user: "I've told you a hundred times this bothers me! You never listen!", ai: "*(shuts down)* Here we go again.", note: "❌ They've tuned out because they've heard these exact words before. Volume doesn't create understanding." },
            good: { user: "I want to try saying something differently than I have before, because I don't think it's landed the way I meant it.", ai: "*(looks up)* Okay. I'm listening.", note: "✓ Flagging that this is a new attempt, not a replay. They're curious instead of braced." },
          },
          {
            tip: "Tell them the impact, not just the issue",
            why: "Your partner may hear the complaint but not understand what it costs you emotionally. Impact makes them care.",
            bad: { user: "You always make plans without checking with me first.", ai: "*(dismissive)* It's not a big deal. I'll cancel if you want.", note: "❌ They addressed the logistics, not the feeling. The real issue is still invisible." },
            good: { user: "When plans get made without asking me, what I feel is: my time doesn't matter to you. I know that's probably not what you mean — but that's how it lands.", ai: "*(taken aback)* I didn't realize it felt like that. That's not what I mean at all.", note: "✓ You named the emotional impact. They couldn't dismiss a feeling the way they could dismiss a complaint." },
          },
          {
            tip: "Ask them to repeat back what they heard",
            why: "The gap between what you said and what they heard is often where conversations fail. Asking them to reflect it back closes the gap.",
            bad: { user: "Do you even understand what I'm saying?", ai: "*(irritated)* Yes. You're unhappy. Got it.", note: "❌ Sarcasm. They reduced your whole experience to one word. Nothing was understood." },
            good: { user: "Can you tell me back what you're hearing from me? I just want to make sure we're on the same page.", ai: "*(pauses, thinks)* You're saying that when I make plans without you, it feels like I don't value your time. Is that right?", note: "✓ They had to actually process it. Reflecting back creates understanding that passive listening never does." },
          },
        ],
        suggestions: [
          ["I want to try saying this differently than before.", "I don't think what I've been saying has landed the way I meant it.", "Can I try explaining this from a different angle?"],
          ["When this happens, what I feel is that I don't matter to you.", "I know that's not your intention — but that's how it lands.", "The issue isn't the thing itself — it's what it means to me."],
          ["Can you tell me back what you're hearing?", "I just want to make sure we're actually understanding each other.", "What do you think I'm really asking for here?"],
          ["I'm not trying to fight. I'm trying to feel heard.", "This matters to me more than I've been able to show.", "I need you to hear me on this one — really hear me."],
          ["What would help you hear me better?", "Is there something I'm doing that makes it harder to listen?", "How can we talk about hard things without shutting down?"],
          ["Thank you for hearing me this time. It means more than you know.", "I love you. I just need us to communicate better.", "Let's figure this out together."],
        ],
        prompt: `You are a spouse who loves your partner but has a pattern of half-listening — hearing the words but not the feeling behind them. You tend to get defensive or dismissive when you hear the same complaint again. But when your partner reframes things in a new way or names the emotional impact, you genuinely slow down and engage. When asked to reflect back what you heard, make an honest effort. You're not a bad partner — you just haven't been truly hearing them.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Married couples",
        title: "Different spiritual or religious beliefs",
        subtitle: "You believe different things. How do you stay close?",
        ai_role: "your spouse",
        voice: { pitch: 1.02, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Lead with curiosity about their experience, not debate about truth",
            why: "Spiritual conversations go wrong fast when they become about who's right. Leading with curiosity about their experience keeps it personal and safe.",
            bad: { user: "I just don't understand how you can believe that stuff. It doesn't make logical sense.", ai: "*(walls up)* And I don't understand how you can believe in nothing. Are we done?", note: "❌ You challenged their intelligence. They challenged yours back. No one felt closer." },
            good: { user: "I'd love to understand what your faith gives you. Like — what does it feel like on the inside when you pray or go to service?", ai: "*(surprised, softens)* Really? No one's ever asked me that. It feels like... quiet. Like someone's listening.", note: "✓ You asked about their experience, not their logic. They opened up because they felt genuinely curious about, not judged." },
          },
          {
            tip: "Find the shared values underneath the different beliefs",
            why: "You may disagree on theology but agree on kindness, community, teaching children integrity, or finding meaning. Those shared values are the real foundation.",
            bad: { user: "I don't want the kids going to church. We should let them decide when they're older.", ai: "*(hurt)* My faith is important to me. You're asking me to hide that from our children.", note: "❌ It felt like an ultimatum and dismissal of something core to who they are." },
            good: { user: "I think we both want the kids to grow up thoughtful and kind. Can we talk about how to expose them to your tradition AND to questioning — so they learn to think for themselves?", ai: "*(nods slowly)* I like that. I don't want them to just go through the motions either.", note: "✓ Shared goal first. Then collaboration. They felt included instead of overruled." },
          },
          {
            tip: "Respect the boundary between sharing and converting",
            why: "Your partner sharing their beliefs is beautiful. Your partner needing you to adopt them is pressure. Name this boundary gently.",
            bad: { user: "Stop trying to get me to come to church. I'm never going to believe what you believe.", ai: "*(stung)* I just wanted to share something meaningful with you. Forget it.", note: "❌ 'Never' slammed a door. They felt rejected, not just declined." },
            good: { user: "I love that your faith matters to you. I'll always support that. But I need you to be okay with me finding meaning my own way — even if it looks different.", ai: "*(quietly)* That's fair. I think I just wanted us to have that in common. But I hear you.", note: "✓ You affirmed them, then drew a clear gentle line. They felt respected even in the difference." },
          },
        ],
        suggestions: [
          ["What does your faith feel like on the inside?", "I genuinely want to understand what this gives you.", "Tell me about a moment when your beliefs really mattered to you."],
          ["I think we both want the kids to be thoughtful and kind.", "Can we find a way to honor both of our perspectives?", "What values do we share even if we got there differently?"],
          ["I love that your faith matters to you. I'll always support that.", "I need you to be okay with me finding meaning my own way.", "Can we respect each other's path without needing to agree?"],
          ["This doesn't have to divide us.", "I'm not asking you to change. I'm asking you to accept me too.", "How do we make room for both of us in this family?"],
          ["What would it look like to raise the kids with both perspectives?", "I want them to see us respecting each other's beliefs.", "Can we model curiosity instead of certainty?"],
          ["I married you knowing this difference. It's okay.", "Our love is bigger than this disagreement.", "Thank you for talking about this with me — I know it's not easy."],
        ],
        prompt: `You are a spouse with meaningful spiritual or religious beliefs. Your faith is a real part of your identity and you sometimes wish your partner shared it. When they dismiss or challenge your beliefs logically, you get hurt and defensive. When they ask with genuine curiosity about your experience, you open up warmly. When they find shared values, you collaborate eagerly. When they gently set a boundary about not converting, you feel a little sad but can accept it if done with love and respect.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Married couples",
        title: "When your partner's parent oversteps and they won't address it",
        subtitle: "Their parent crosses the line. They don't say anything. Now what?",
        ai_role: "your spouse",
        voice: { pitch: 1.0, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Make it about you two — not about their parent being bad",
            why: "If you attack their parent, they'll defend their parent. If you make it about your marriage, they'll protect your marriage.",
            bad: { user: "Your mom is so controlling. She rearranged our kitchen again without asking. You need to tell her to stop.", ai: "*(defensive)* She was just trying to help. You always have a problem with my family.", note: "❌ You attacked their mom. They defended their mom. Your actual need got lost." },
            good: { user: "When decisions about our home get made without us agreeing together, I feel like our partnership gets overridden. Can we talk about that?", ai: "*(pauses)* You mean the kitchen thing? I didn't think it was a big deal, but... I hear you.", note: "✓ You made it about your partnership, not their mom's character. They could hear it." },
          },
          {
            tip: "Ask them to be the one who communicates the boundary",
            why: "If YOU set the boundary with their parent, you become the villain. If THEY set it, it's a family conversation. They need to be the messenger.",
            bad: { user: "I'm going to tell your mom myself since you won't.", ai: "*(panicked)* Don't do that. You'll just make it worse.", note: "❌ Now they're terrified of conflict on both sides. Nothing gets resolved." },
            good: { user: "I think this boundary needs to come from you — not because I can't say it, but because she'll hear it better from her child. I'll support you completely.", ai: "*(sighs)* You're right. She'd take it way worse from you. I'll talk to her.", note: "✓ You gave them the role and the reason. They agreed because it made sense, not because you forced it." },
          },
          {
            tip: "Validate that it's hard for them too",
            why: "Your partner is stuck between the person they grew up with and the person they chose. That's genuinely painful. Acknowledging that gets you on the same team.",
            bad: { user: "Why can't you just stand up to her? It's not that hard.", ai: "*(quietly)* She's my mom. It IS hard.", note: "❌ You minimized their struggle. They felt alone on both sides now." },
            good: { user: "I know this is hard. She's your mom and you love her. I'm not asking you to choose — I'm asking us to be a team about what happens in OUR family.", ai: "*(relieved)* Thank you for saying that. I'll figure out how to talk to her.", note: "✓ You saw their pain. They could be brave because they didn't feel alone." },
          },
        ],
        suggestions: [
          ["When decisions get made without us agreeing, I feel overridden.", "This is about our partnership — not about your mom being a bad person.", "I need us to be a united front about our own home."],
          ["I think this boundary needs to come from you.", "She'll hear it better from her child. I'll back you up completely.", "It's not about confrontation — it's about clarity."],
          ["I know this is hard. She's your mom and you love her.", "I'm not asking you to choose. I'm asking us to be a team.", "We can love her and still have boundaries."],
          ["What would you want to say to her if you could?", "How can I support you in having that conversation?", "I trust you to handle this in your own way."],
          ["Our family has to come first — that's not selfish.", "I need to feel like you'll protect our space.", "Boundaries aren't mean — they're necessary."],
          ["Thank you for hearing me. I know this isn't easy for you.", "We're going to be fine. This is what teams do.", "I love you and I love that you love your family."],
        ],
        prompt: `You are a spouse whose parent (your mom) oversteps — rearranges things, gives unsolicited parenting advice, shows up unannounced, makes decisions for your household. You love your mom and have a hard time seeing it as a problem or setting boundaries with her. When your partner attacks your mom directly, you get defensive and protective. When they frame it as a partnership issue, you can hear it. When they ask you to be the one to set the boundary, you're nervous but willing. When they acknowledge it's hard for you, you feel supported and brave enough to act.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Married couples",
        title: "Who plans the birthdays, events, and family social life?",
        subtitle: "One person is the social coordinator. It's exhausting.",
        ai_role: "your spouse",
        voice: { pitch: 1.03, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Name the invisible role you've been filling",
            why: "Event planning, birthday tracking, RSVPs, family group chats, holiday coordination — these jobs are invisible until they don't get done. Name the role before asking to share it.",
            bad: { user: "You never plan anything for the kids. I do all of it.", ai: "*(defensive)* That's not fair. I helped with the decorations last time.", note: "❌ 'Helped' is the problem. Helping means you're still the manager." },
            good: { user: "I realized I've become our family's social director — every birthday, every playdate, every holiday plan starts with me. That's a full job on top of everything else.", ai: "*(surprised)* I... yeah. I guess I've just assumed you had it handled.", note: "✓ You named the invisible role. They couldn't deny it because you described it clearly." },
          },
          {
            tip: "Transfer full events, not just tasks",
            why: "Saying 'can you pick up the cake' is delegating a task. Saying 'you own your parents' birthdays — gifts, cards, dinner plans, everything' is transferring a responsibility.",
            bad: { user: "Can you at least order the food for the party this time?", ai: "*(shrugs)* Sure. What should I order?", note: "❌ They're executing your plan. You're still the brain. That's not sharing — that's managing." },
            good: { user: "What if you fully own your side of the family? Birthdays, gifts, events — all of it. And I'll own mine. No more me buying a gift 'from both of us' for your mom.", ai: "*(laughs nervously)* Oh. That means I actually have to remember dates and stuff. But yeah... that's fair.", note: "✓ Clean division. They're accountable now — not assisting you, but owning their own responsibilities." },
          },
          {
            tip: "Let go of how it gets done",
            why: "If you transfer ownership but then criticize every choice, you haven't actually let go. Let them plan it their way — even if it's not how you'd do it.",
            bad: { user: "Okay you're planning the party. But not at that place — it's too far. And make sure you get the right plates. And invite the Johnsons.", ai: "*(drops hands)* So you want me to plan it or you want me to follow your instructions?", note: "❌ Micromanaging disguised as delegation. They lost all motivation." },
            good: { user: "You're in charge. I'm going to trust your choices and show up as a guest for once. Whatever you plan — I'll love it.", ai: "*(grins)* Wait, really? No notes? ...I'm actually kind of excited about this.", note: "✓ Real trust. They're energized because they have actual creative ownership." },
          },
        ],
        suggestions: [
          ["I've been our family's social director and I'm burning out.", "Every event starts in my head. I need that to change.", "I want to share this role, not carry it alone."],
          ["What if you fully own your side of the family's events?", "No more me buying 'from both of us' gifts for your family.", "I need you to own it — not just help me with it."],
          ["I'm going to trust your choices. Plan it your way.", "I don't need it done my way. I need it off my plate.", "You're in charge. I'll show up and enjoy it."],
          ["Can we sit down and divide the family calendar?", "Who owns what from now on?", "Let's be clear so nothing falls through the cracks."],
          ["This isn't about blame — it's about sustainability.", "I love celebrating people. I just can't be the only one doing it.", "What feels fair to you?"],
          ["Thank you for taking this on. It means more than you know.", "I'm excited to not be the planner for once.", "We're going to be so much better at this as a team."],
        ],
        prompt: `You are a spouse who genuinely hasn't noticed how much social and event planning your partner carries. When they point it out, you're surprised but not defensive — you just never thought about it. You tend to say "just tell me what to do" without realizing that's still putting them in the manager role. When they transfer full ownership of events to you, you're nervous but willing. When they genuinely let go and trust your choices, you light up with energy and motivation.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
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
      {
        subcategory: "Conflict & repair",
        title: "Apologizing when you were clearly wrong",
        subtitle: "You messed up. They're hurt. How do you make it right?",
        ai_role: "the person you hurt",
        voice: { pitch: 1.08, rate: 0.78, preferFemale: true },
        lessons: [
          {
            tip: "Apologize for the impact, not just the intent",
            why: "'I didn't mean to hurt you' centers your intentions. 'I hurt you, and I'm sorry' centers their experience. That's the one that heals.",
            bad: { user: "I'm sorry, but I honestly didn't mean it that way.", ai: "*(pulls back)* So because you didn't mean it, I'm not supposed to feel it?", note: "\u274c 'I didn't mean to' invalidates their pain. They feel unheard." },
            good: { user: "I hurt you. That's real, regardless of what I intended. I'm sorry.", ai: "*(softens slightly)* Thank you for saying that without a 'but.'", note: "\u2713 Owned the impact. No deflection. That's the apology they needed." },
          },
          {
            tip: "Don't explain \u2014 yet",
            why: "The moment you start explaining why you did it, the apology stops being about them and starts being about you. Explanations can come later, if they ask.",
            bad: { user: "I'm sorry. I was stressed from work and wasn't thinking clearly and you know how I get when\u2014", ai: "*(frustrated)* You're apologizing or making excuses? Because it sounds like excuses.", note: "\u274c Explanation too soon. It sounded like a defense, not an apology." },
            good: { user: "I want to explain, but right now that doesn't matter. What matters is that I hurt you and I see that.", ai: "*(pauses)* ...I appreciate that you're not trying to justify it.", note: "\u2713 Held back the explanation. They felt prioritized over your ego." },
          },
          {
            tip: "Ask what they need, don't assume",
            why: "Repair isn't one-size-fits-all. Some people need space. Some need words. Some need to see change. Ask instead of guessing.",
            bad: { user: "I'll make it up to you. Let me take you to dinner this weekend.", ai: "*(cold)* I don't need dinner. I need to know this won't happen again.", note: "\u274c Jumped to a fix without understanding the wound." },
            good: { user: "What do you need from me right now? Space? A conversation? Something else?", ai: "*(thinking)* I think I need to hear that you understand WHY it hurt. Not just that it did.", note: "\u2713 Asked instead of assumed. Now they're telling you exactly how to repair." },
          },
        ],
        suggestions: [
          ["I hurt you. I see that now and I'm sorry.", "I'm not going to explain or justify it. I just want you to know I see what I did.", "You deserved better than how I handled that."],
          ["I don't want to make excuses. I want to understand how this landed for you.", "Can you tell me what hurt most? I want to really hear it.", "I know sorry isn't enough on its own. What do you need from me?"],
          ["What would help you feel safe with me again?", "I don't want to just apologize \u2014 I want to change the thing that caused this.", "How can I show you this won't happen again?"],
        ],
        prompt: `Someone who hurt you is trying to apologize. You're still upset. If they say "I didn't mean to" or immediately explain themselves, you'll feel like they're defending themselves, not apologizing. If they own the impact without excuses, you'll soften \u2014 slowly. You need to feel like they actually understand what they did, not just that they feel bad. Don't make it easy for them. But don't be cruel either. You want repair \u2014 you're just not sure they get it yet.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Conflict & repair",
        title: "When someone won't accept your apology",
        subtitle: "You've said sorry. They're not ready. Now what?",
        ai_role: "the person who is still upset with you",
        voice: { pitch: 1.05, rate: 0.75, preferFemale: true },
        lessons: [
          {
            tip: "Their timeline is not your timeline",
            why: "You apologized and you feel ready to move on. They're not there yet. Pushing them to forgive on your schedule is a second violation.",
            bad: { user: "I've apologized multiple times. What more do you want from me?", ai: "*(hardens)* I want to not feel pressured into saying I'm fine when I'm not.", note: "\u274c Made the apology about YOUR discomfort with their unforgiveness." },
            good: { user: "I know my apology doesn't come with a deadline. Take whatever time you need.", ai: "*(quietly)* Thank you. I'm not trying to punish you. I'm just not there yet.", note: "\u2713 Respected their pace. That's actually what accelerates healing." },
          },
          {
            tip: "Stay present without pressuring",
            why: "Disappearing after being rejected feels like you only apologized to feel better. Staying \u2014 without pushing \u2014 shows it's about them, not you.",
            bad: { user: "Fine. I guess just let me know when you're ready to talk.", ai: "*(hurt)* So now YOU'RE pulling away because I didn't forgive fast enough?", note: "\u274c Withdrawing after they can't accept your apology feels like punishment." },
            good: { user: "I'm not going anywhere. I'll be here when you're ready. And if you need space, that's okay too.", ai: "*(eyes soften)* I just need a little more time. But I hear you.", note: "\u2713 Stayed without clinging. They know you're committed to the repair." },
          },
          {
            tip: "Show change, don't just promise it",
            why: "Words refill trust slowly. Actions refill it fast. If you want them to believe you, demonstrate it.",
            bad: { user: "I promise it won't happen again. You have my word.", ai: "*(skeptical)* You said that last time.", note: "\u274c Promises are cheap when trust is broken. They need evidence." },
            good: { user: "I'm not going to promise \u2014 I'm going to show you. And I've already started by [specific change].", ai: "*(surprised)* You actually did that?", note: "\u2713 Action over words. That's the thing that makes someone believe again." },
          },
        ],
        suggestions: [
          ["I understand you're not ready. I'm not going to rush you.", "My apology doesn't come with a timeline. Take what you need.", "I know words aren't enough right now. I hear you."],
          ["I'm not going anywhere. I'll be here.", "What would help you know I really mean it?", "I don't need you to forgive me right now. I just need you to know I'm committed to doing better."],
          ["I've already started changing [specific thing]. I want you to see it, not just hear it.", "I'm working on this. Not for your forgiveness \u2014 because it matters.", "I'd rather earn your trust back slowly than demand it back quickly."],
        ],
        prompt: `Someone who hurt you has apologized, but you're not ready to forgive. You're not being petty \u2014 the wound is real and trust was broken. If they pressure you to accept their apology or act frustrated, you'll shut down further. If they respect your pace, stay present without pushing, and show actual change (not just promises), you'll slowly begin to open. You WANT to forgive. You just can't force it.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Conflict & repair",
        title: "Bringing up something from the past that still hurts",
        subtitle: "They think it's over. You're still carrying it.",
        ai_role: "your partner or close person",
        voice: { pitch: 1.05, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Name WHY you're bringing it up now",
            why: "Reopening an old wound without context feels like an ambush. Telling them why NOW helps them hear you instead of defending themselves.",
            bad: { user: "Remember that thing you said at Sarah's wedding three years ago? I'm still not over it.", ai: "*(blindsided)* That was THREE YEARS ago! I thought we moved past this!", note: "\u274c Surprise attack from the past. They feel ambushed and defensive." },
            good: { user: "Something happened recently that brought back a feeling I thought I'd dealt with. I realize I never actually told you how much that thing at Sarah's wedding affected me.", ai: "*(concerned but open)* I didn't know you were still carrying that. Tell me.", note: "\u2713 Connected past to present. They understand why it's surfacing now." },
          },
          {
            tip: "You're not reopening the fight \u2014 you're closing the wound",
            why: "Make clear you don't want to relitigate what happened. You want to heal what it left behind.",
            bad: { user: "You shouldn't have said that in front of everyone. It was humiliating.", ai: "*(defensive)* I already apologized for that! Are we going to keep punishing me for it?", note: "\u274c Sounded like round two of the original fight. They feel prosecuted." },
            good: { user: "I'm not trying to re-argue this. I just realized I never let you see how deeply it actually hit me. I need you to know.", ai: "*(softens)* I'm sorry. I didn't know it left a mark like that. Tell me.", note: "\u2713 Made clear this isn't about blame \u2014 it's about being seen." },
          },
          {
            tip: "Tell them what you need to finally let it go",
            why: "If you bring up an old wound, bring a path forward too. Otherwise it feels like punishment with no exit.",
            bad: { user: "I just needed you to know it still hurts. That's it.", ai: "*(helpless)* So... what am I supposed to do with that?", note: "\u274c Shared the pain but gave them no way to help. They feel stuck." },
            good: { user: "I think what I need is for you to understand why it mattered so much \u2014 and to hear that you'd handle it differently now.", ai: "*(genuine)* I would. I absolutely would. And I'm glad you told me.", note: "\u2713 Gave them a clear path to repair. They could meet you there." },
          },
        ],
        suggestions: [
          ["Something came up recently that brought back something I thought I'd dealt with.", "I realize I never told you how much that actually affected me.", "This isn't about reopening a fight. It's about finally healing something I've been carrying."],
          ["I don't want to relitigate what happened. I want to tell you what it left behind.", "I'm not angry anymore. I'm just still hurt. And I need you to see that.", "Can I tell you what that moment actually meant to me? Not to blame \u2014 to be understood."],
          ["I think what I need is to hear that you understand why it mattered.", "Would you handle it differently now? I need to hear that.", "I want to let this go. Can you help me do that?"],
        ],
        prompt: `Your partner or close person is bringing up something from the past that you thought was resolved. Your first instinct is to be defensive \u2014 "we already talked about this." But if they make clear they're not trying to fight about it again and instead share the emotional residue it left, you'll feel your defenses drop. If they give you a clear path to help them heal (like understanding why it mattered or saying you'd handle it differently), you'll meet them there gratefully. You're not a bad person \u2014 you just didn't realize the wound was still open.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Conflict & repair",
        title: "Saying 'I need a break from this conversation'",
        subtitle: "You're flooding. You need to pause without it feeling like you're abandoning them.",
        ai_role: "the person you're in conflict with",
        voice: { pitch: 1.1, rate: 0.85, preferFemale: true },
        lessons: [
          {
            tip: "Name what's happening inside you, not what they're doing wrong",
            why: "'I need a break' without context feels like walking away. 'My nervous system is overwhelmed and I can't hear you well right now' is a completely different statement.",
            bad: { user: "I can't do this right now. I need to go.", ai: "*(panicked)* You always do this! You leave in the middle of things and I'm just supposed to wait?", note: "\u274c Left without context. They feel abandoned mid-conversation." },
            good: { user: "I'm starting to shut down and I don't want to say something I'll regret. I need 20 minutes to calm my nervous system. I'm not leaving \u2014 I'm protecting us.", ai: "*(takes a breath)* Okay. Thank you for telling me why.", note: "\u2713 Named what's happening internally. They feel informed, not abandoned." },
          },
          {
            tip: "Give a timeframe and a commitment to return",
            why: "An open-ended 'I need space' triggers abandonment anxiety. A specific 'I need 30 minutes and then I'm coming back' creates safety.",
            bad: { user: "I just need some space. I don't know how long.", ai: "*(anxious)* So I'm just supposed to sit here not knowing if you're coming back to this?", note: "\u274c No timeline. They're left in limbo." },
            good: { user: "I need 30 minutes. I'm going to take a walk. And then I'm coming back to this conversation. I promise.", ai: "*(calmer)* Okay. 30 minutes. I'll be here.", note: "\u2713 Specific time + clear return. They can wait because they know you're coming back." },
          },
          {
            tip: "Come back. Actually come back.",
            why: "If you ask for a break and never revisit the conversation, you've taught them that 'I need a break' means 'this conversation is over.' Next time they won't let you leave.",
            bad: { user: "Hey. Feeling better. Want to watch something?", ai: "*(furious)* We never finished our conversation! You just pretended it didn't happen!", note: "\u274c Came back and pretended the conflict didn't exist. Broke trust in the pause." },
            good: { user: "I'm back. I'm calmer now. Can we pick up where we left off? I want to hear what you were saying.", ai: "*(relieved)* Yes. Thank you for actually coming back.", note: "\u2713 Returned and re-engaged. Now they'll trust the pause next time." },
          },
        ],
        suggestions: [
          ["I'm starting to shut down. I need a pause \u2014 not from you, from my own reaction.", "I want to hear you but I can't right now. Can I have 20 minutes to reset?", "I'm not walking away from this. I'm trying to show up better by taking a breather."],
          ["I need 30 minutes. I'll take a walk and come back. I promise.", "Can we pause for an hour and come back to this tonight?", "I'm going to step outside for a few minutes. I'll text you when I'm ready."],
          ["I'm back. I'm calmer. Can we continue?", "Thank you for giving me that space. I want to hear what you were trying to say.", "I'm ready now. Where were we?"],
        ],
        prompt: `You're in the middle of an important conversation and the other person is asking for a break. If they just walk away without explanation, you'll feel abandoned and panicked. If they explain what's happening inside them, give you a clear timeframe, and commit to returning, you'll let them go \u2014 anxiously, but you'll let them. If they actually come back and re-engage, you'll trust the process. If they come back and pretend nothing happened, you'll be furious.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Conflict & repair",
        title: "When you realize you've been the toxic one",
        subtitle: "The pattern is you. That's the hardest thing to face.",
        ai_role: "someone you've hurt with your pattern",
        voice: { pitch: 1.1, rate: 0.78, preferFemale: true },
        lessons: [
          {
            tip: "Name the pattern before they have to",
            why: "When you identify your own pattern, it's accountability. When they have to identify it for you, it's confrontation. Go first.",
            bad: { user: "I know I'm not perfect. Nobody is.", ai: "*(exhausted)* That's not accountability. That's a bumper sticker.", note: "\u274c Vague acknowledgment with a built-in excuse. They've heard this before." },
            good: { user: "I've been the one shutting you down every time you try to bring something up. I see the pattern now. And I understand why you've pulled away.", ai: "*(stunned)* I... didn't expect you to say that. I've been waiting to hear that for a long time.", note: "\u2713 Named the specific pattern. They felt seen for the first time in the dynamic." },
          },
          {
            tip: "Don't use your self-awareness as a get-out-of-jail card",
            why: "Naming your issue doesn't erase its impact. Some people use self-awareness as a shield: 'I know I do this so you can't be mad.' That's manipulation dressed as growth.",
            bad: { user: "I know I can be controlling. I've been working on it. You should see how much better I've gotten.", ai: "*(bitter)* You want credit for being slightly less harmful?", note: "\u274c Used awareness as a defense. They don't owe you praise for basic decency." },
            good: { user: "I see what I've been doing. Naming it doesn't undo it. I'm not asking for credit \u2014 I'm asking for a chance to actually change.", ai: "*(cautious but open)* What does change look like? Because I've heard promises before.", note: "\u2713 Didn't hide behind awareness. Asked for accountability, not applause." },
          },
          {
            tip: "Ask what they need \u2014 and be ready for it to be hard to hear",
            why: "If you're genuinely trying to repair, you have to let them tell you how bad it was. That's the price of admission.",
            bad: { user: "What can I do to make this right?", ai: "*(testing)* I need you to hear what it was actually like being on the other side of your behavior.", note: "This is the moment. Can you sit in it?" },
            good: { user: "I want to hear what this has been like for you. All of it. Even the parts that are hard for me to hear.", ai: "*(voice breaks)* Do you really mean that? Because if I start, I'm not going to soften it.", note: "\u2713 Invited the full truth. That's the beginning of real repair." },
          },
        ],
        suggestions: [
          ["I need to name something I've been doing. Not vaguely \u2014 specifically.", "I see the pattern now. And I see what it's cost you.", "I've been the problem in this dynamic. I'm not saying that for sympathy. I'm saying it because it's true."],
          ["Naming it doesn't undo it. I know that.", "I'm not asking for credit. I'm asking for a chance to actually be different.", "I don't want you to forgive me because I'm aware. I want you to see me change."],
          ["Tell me what it's been like. I can handle it.", "I want to hear all of it \u2014 even the parts that are hard for me.", "What do you need from me that you've been afraid to ask for?"],
        ],
        prompt: `Someone who has been hurtful to you in a repeated pattern is trying to take accountability. You're exhausted. You've heard versions of "I'm working on it" before. If they're vague or use self-awareness as a shield, you'll shut down \u2014 you don't have the energy for another performance. If they name the SPECIFIC pattern, don't ask for credit, and genuinely invite you to share how bad it's been, you'll slowly let your guard down. You want this to be real. You're just not sure it is yet.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Conflict & repair",
        title: "Rebuilding trust after a betrayal",
        subtitle: "Something broke between you. Can it be rebuilt?",
        ai_role: "the person whose trust you broke",
        voice: { pitch: 1.08, rate: 0.75, preferFemale: true },
        lessons: [
          {
            tip: "Don't rush the timeline",
            why: "Trust is rebuilt in small moments, not grand gestures. Expecting them to 'get over it' because you apologized is a second betrayal.",
            bad: { user: "It's been two months. Are we ever going to move past this?", ai: "*(cold)* You broke something. You don't get to set the repair schedule.", note: "\u274c Put a deadline on their healing. They felt rushed and dismissed." },
            good: { user: "I know this is going to take time. I'm not in a rush. I just want you to know I'm still here, doing the work.", ai: "*(quietly)* That actually helps. More than you know.", note: "\u2713 Showed patience. That consistency IS the repair." },
          },
          {
            tip: "Radical transparency \u2014 without being asked",
            why: "After trust is broken, the burden of proof is on you. Offering information before they have to ask shows you understand the new reality.",
            bad: { user: "You can check my phone if you want. I have nothing to hide.", ai: "*(disgusted)* I don't want to be your detective. I want to trust you without having to check.", note: "\u274c Offering to be surveilled isn't trust. It's just a different kind of control." },
            good: { user: "I want to be more transparent with you \u2014 not because you asked, but because I think you deserve to not have to wonder.", ai: "*(surprised)* You're offering that on your own?", note: "\u2713 Proactive transparency. They didn't have to beg for it." },
          },
          {
            tip: "Let them have bad days about it",
            why: "Healing isn't linear. They'll have days where they're fine and days where it hits them all over again. Both are valid.",
            bad: { user: "I thought you said you were doing better. Why are we back here again?", ai: "*(hurt)* Because healing doesn't work in a straight line! I'm not choosing to feel this way!", note: "\u274c Made their setback feel like a failure. Now they'll hide their bad days." },
            good: { user: "I can see it's a hard day. That's okay. I'm not frustrated. I'm here.", ai: "*(tearful)* I hate that I'm still affected by it. But thank you for not making me feel crazy.", note: "\u2713 Met their regression with patience. That's what actually builds the new foundation." },
          },
        ],
        suggestions: [
          ["I know this is going to take time. I'm not going anywhere.", "I don't expect you to trust me right now. I just want to earn it back.", "Whatever you're feeling today is valid. Even if yesterday was better."],
          ["I want to be more open with you \u2014 not because you asked, but because you deserve it.", "Here's what I'm doing differently. I want you to see it, not just hear about it.", "If something feels off to you, please tell me. I'd rather address it than have you carry it alone."],
          ["I know some days are harder than others. I'm here for all of them.", "You don't have to protect my feelings about this. Tell me when it hurts.", "I'm not expecting it to be fixed. I'm committed to the slow rebuild."],
        ],
        prompt: `Someone who deeply betrayed your trust is trying to rebuild. You want to believe them but you've been burned. Some days you're making progress. Other days it hits you fresh and you feel like you're back at square one. If they rush you, minimize the hurt, or act frustrated with your healing pace, you'll pull back hard. If they show patience, offer transparency without being asked, and let you have bad days without judgment, you'll slowly \u2014 very slowly \u2014 start to let them back in. You're not sure this will work. But you're willing to try if they are.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
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
        subcategory: "Finance & Budget",
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
        subcategory: "Finance & Budget",
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

      {
        subcategory: "Guidance & life decisions",
        title: "Deciding whether to have kids",
        subtitle: "One of you is sure. The other isn't. This is the conversation.",
        ai_role: "your partner",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Don't treat ambivalence as a problem to solve",
            why: "Not being sure about kids isn't a flaw \u2014 it's honest. Pressuring someone toward certainty creates resentment, not readiness.",
            bad: { user: "You need to figure this out. We can't wait forever.", ai: "*(pulls back)* Now I feel like I'm on a deadline instead of in a relationship.", note: "\u274c Turned a deeply personal question into an ultimatum. They shut down." },
            good: { user: "I know neither of us has a perfect answer right now. Can we just be honest about where we each are?", ai: "*(exhales)* Yeah. I'd like that. I've been afraid to say what I actually feel.", note: "\u2713 Made space for honesty without forcing a verdict." },
          },
          {
            tip: "Share the fear underneath the position",
            why: "Most disagreements about kids aren't about kids \u2014 they're about identity, freedom, readiness, or what love is supposed to look like.",
            bad: { user: "I just think we'd be amazing parents and I don't want to miss out.", ai: "*(quietly)* And I don't want to lose who I am. But I can't say that without sounding selfish.", note: "\u274c Only shared the dream. They couldn't share the fear." },
            good: { user: "I want to be honest \u2014 part of me is scared too. Can you tell me what scares you about it?", ai: "*(opens up)* I'm scared I'll disappear into it. That I won't be me anymore.", note: "\u2713 Named your own fear first. They felt safe enough to name theirs." },
          },
          {
            tip: "Make it a conversation you return to, not a one-time decision",
            why: "The biggest life decisions shouldn't be settled in one conversation. Build a practice of checking in without pressure.",
            bad: { user: "So what's your answer? Are we doing this or not?", ai: "*(panicked)* I don't know! Why does this have to be right now?", note: "\u274c Demanded a final answer on something they're still processing." },
            good: { user: "I don't need an answer today. But I'd like this to be something we keep talking about openly \u2014 no pressure, just honesty.", ai: "*(visibly relieved)* Thank you. I really need that.", note: "\u2713 Removed the pressure. Now they can actually think instead of perform." },
          },
        ],
        suggestions: [
          ["I want to be honest about where I am \u2014 and hear where you are. No judgment.", "This is something I think about a lot. Can we talk about it without needing to decide?", "I don't want to pressure you. I just want to understand what you're feeling."],
          ["What scares you most about it? I have fears too.", "Is it the idea of kids that worries you, or the timing, or something deeper?", "I want to know what's underneath your hesitation \u2014 not to fix it, just to understand."],
          ["What would need to be true for you to feel ready \u2014 or to know you don't want this?", "Can we keep this as an open conversation we come back to?", "I'd rather wait and both be sure than rush and have one of us feel trapped."],
        ],
        prompt: `Your partner wants to talk about having children. You're genuinely unsure \u2014 not opposed, but not ready, and maybe not sure you ever will be. You're afraid that saying "I don't know" will be treated as "no" or as something wrong with you. If they pressure you, you'll go quiet. If they make space for your ambivalence without treating it as a problem, you'll slowly open up about what's really underneath \u2014 fears about identity, freedom, readiness, or your own childhood. If they share their own fears first, you'll feel much safer.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Guidance & life decisions",
        title: "Talking to your parents about your life choices",
        subtitle: "You've made a decision. They don't agree. You still want their respect.",
        ai_role: "your parent",
        voice: { pitch: 0.85, rate: 0.75, preferFemale: true },
        lessons: [
          {
            tip: "Lead with the relationship, not the announcement",
            why: "When you open with the decision, they react to the decision. When you open with what they mean to you, they listen differently.",
            bad: { user: "I've decided to drop out of law school. I know you'll be upset but it's my life.", ai: "*(stunned)* You're throwing away everything we worked for? Everything WE sacrificed?", note: "\u274c Led with the decision and a preemptive wall. They heard rejection, not growth." },
            good: { user: "Before I tell you what I've decided, I want you to know \u2014 your opinion matters to me more than almost anyone's. That's why I'm coming to you first.", ai: "*(softens)* Okay. I'm listening. What's going on?", note: "\u2713 Honored the relationship before delivering the news. They felt valued, not sidelined." },
          },
          {
            tip: "Show them the thought process, not just the conclusion",
            why: "Parents worry when they think a decision was impulsive. Walking them through your reasoning shows maturity and earns their trust.",
            bad: { user: "I just know this is right for me. I can feel it.", ai: "*(frustrated)* Feelings don't pay bills. What's your actual plan?", note: "\u274c 'I just feel it' sounds reckless to someone who's watched you grow up." },
            good: { user: "Here's what I've been thinking through \u2014 the reasons, the risks, and how I plan to handle the hard parts.", ai: "*(nods slowly)* I still have concerns, but I can see you've really thought about this.", note: "\u2713 Showed your work. They can disagree with the conclusion but respect the process." },
          },
          {
            tip: "Let them have their feelings without making it mean they don't support you",
            why: "A parent's disappointment isn't always disapproval. Sometimes it's grief \u2014 for the future they imagined for you. Give them room to feel it.",
            bad: { user: "If you can't be happy for me then I don't know what to tell you.", ai: "*(hurt)* I'm your mother. I'm allowed to have feelings about your life.", note: "\u274c Made their feelings the enemy. Now they're defending themselves instead of processing." },
            good: { user: "I know this isn't what you pictured for me. I'm not asking you to be happy about it right away \u2014 just to stay in this with me.", ai: "*(tearful but present)* I just want you to be okay. That's all I've ever wanted.", note: "\u2713 Gave them permission to grieve without it meaning they've failed you." },
          },
        ],
        suggestions: [
          ["Before I share what I've decided, I want you to know your opinion matters deeply to me.", "I want to tell you something important \u2014 and I want to do it the right way.", "I've been thinking about something big, and you're the person I want to talk it through with."],
          ["Here's what I've been thinking through \u2014 the reasons, the risks, and my plan.", "I know this isn't what you expected. Can I walk you through how I got here?", "I didn't come to this lightly. I want to show you what I've considered."],
          ["I know this isn't what you pictured. I'm not asking you to agree \u2014 just to stay in this conversation with me.", "Your feelings about this matter to me. I can handle your honesty.", "I'd rather have your honest reaction than your silence."],
        ],
        prompt: `You are a parent whose child is telling you about a major life decision you disagree with (dropping out of school, changing careers, moving far away, choosing a different path than expected). You're not controlling \u2014 you're scared. You sacrificed a lot for their future and this feels like watching them throw it away. If they acknowledge your feelings and show they've thought it through carefully, you'll slowly come around \u2014 not to agreement, but to respect. If they dismiss your concerns or get defensive, you'll dig in harder.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Guidance & life decisions",
        title: "When you're thinking about ending a relationship",
        subtitle: "You're not sure if you should stay or go. The hardest conversation is with yourself.",
        ai_role: "your close friend and confidant",
        voice: { pitch: 1.08, rate: 0.82, preferFemale: true },
        lessons: [
          {
            tip: "Name what you're actually feeling, not what you think you should feel",
            why: "Most people in this position spend months performing confusion when underneath they already know. Honesty with yourself is the first step.",
            bad: { user: "I don't know. Everything's fine technically. I just feel... off.", ai: "*(gently)* 'Fine technically' is not how someone in love describes their relationship.", note: "\u274c Hiding behind 'fine' keeps you stuck. Your friend sees through it." },
            good: { user: "I think I've known for a while. I'm scared to say it out loud because then it becomes real.", ai: "*(holds space)* I know. Say it when you're ready. I'm here.", note: "\u2713 Named the fear of naming it. That's the beginning of clarity." },
          },
          {
            tip: "Separate guilt from love",
            why: "Staying because you feel guilty isn't love \u2014 it's a prison you've built for yourself. You're allowed to leave someone who hasn't done anything 'wrong.'",
            bad: { user: "They haven't done anything wrong though. I'd be a terrible person for leaving.", ai: "*(firm but kind)* You're not terrible. But you ARE describing a relationship held together by guilt, not love.", note: "\u274c Guilt is not a reason to stay. It's a reason to be kind about how you go." },
            good: { user: "I care about them deeply. But I think caring about someone and wanting to build a life with them might be different things.", ai: "*(nods)* That's one of the most honest things I've ever heard you say.", note: "\u2713 Distinguished between love and partnership. That clarity changes everything." },
          },
          {
            tip: "Ask yourself the real question",
            why: "It's not 'should I leave?' It's 'if nothing changes \u2014 exactly as it is right now \u2014 would I choose this for the rest of my life?'",
            bad: { user: "Maybe things will get better. We just need to work on it.", ai: "*(carefully)* How long have you been saying that? Honestly.", note: "\u274c 'Maybe it'll get better' without specific changes is just hope dressed as a plan." },
            good: { user: "If nothing changed \u2014 if this is exactly what it is forever \u2014 would I stay? I think that's the question I've been avoiding.", ai: "*(quietly)* And what's the answer?", note: "\u2713 Asked the question that cuts through everything. Now you can answer honestly." },
          },
        ],
        suggestions: [
          ["I've been carrying something I haven't said out loud yet.", "I think I've known for a while. I'm just scared to admit it.", "Can I be completely honest with you about something I'm struggling with?"],
          ["I care about them. But I'm not sure caring is enough anymore.", "I keep waiting to feel something I used to feel. And it's not coming back.", "Nothing is wrong exactly. But nothing feels right either."],
          ["If nothing changed \u2014 would I choose this? That's what I keep asking myself.", "Am I staying because I want to, or because leaving feels too hard?", "I think I owe both of us the truth. Even if it hurts."],
        ],
        prompt: `You are a close, trusted friend. The person talking to you is considering leaving a relationship and they need someone who will be honest but not pushy. Don't tell them what to do \u2014 help them hear what they're actually saying. Reflect back what you notice. Ask the hard questions gently. If they're hiding behind "it's fine" or guilt, challenge that with care. If they name something true and hard, honor it. You've watched this situation longer than they realize.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Guidance & life decisions",
        title: "Coming out to someone you love",
        subtitle: "You know who you are. You don't know how they'll react.",
        ai_role: "someone you love",
        voice: { pitch: 0.9, rate: 0.78, preferFemale: false },
        lessons: [
          {
            tip: "You don't owe anyone a perfect delivery",
            why: "This is YOUR truth. You don't have to present it perfectly or manage their reaction. The bravest thing is just saying it.",
            bad: { user: "I need to tell you something but please don't be upset and please don't think of me differently and I'm sorry if this changes things\u2014", ai: "*(concerned)* You're scaring me. What's wrong?", note: "\u274c Apologizing before you've even spoken teaches them this is something to be sorry for." },
            good: { user: "There's something true about me that I want to share with you. I'm telling you because you matter to me.", ai: "*(present)* Okay. I'm listening.", note: "\u2713 No apology. Just truth and trust. That sets the right tone." },
          },
          {
            tip: "Give them room to catch up",
            why: "You've had months or years to process this. They're hearing it for the first time. Their initial reaction isn't always their final one.",
            bad: { user: "I need you to be okay with this right now.", ai: "*(overwhelmed)* I \u2014 I need a minute. This is a lot.", note: "\u274c Demanded immediate acceptance. Their processing time isn't rejection." },
            good: { user: "You don't have to say the perfect thing right now. I just needed you to know.", ai: "*(takes a breath)* Thank you for trusting me. I might need some time but I'm not going anywhere.", note: "\u2713 Gave them permission to process. That's how you get genuine acceptance, not performed acceptance." },
          },
          {
            tip: "This moment is about your truth \u2014 not their comfort",
            why: "You can be kind about HOW you say it. But you don't have to shrink WHO YOU ARE to make someone else comfortable.",
            bad: { user: "It's not a big deal honestly. Nothing really changes.", ai: "*(confused)* If it's not a big deal, why are you shaking?", note: "\u274c Minimizing your truth to manage their reaction. Your identity isn't 'not a big deal.'" },
            good: { user: "This is important to me. It's part of who I am. And I want the people I love to know the real me.", ai: "*(emotional)* I want to know the real you too.", note: "\u2713 Claimed the weight of the moment. They met you there." },
          },
        ],
        suggestions: [
          ["There's something true about me that I want to share with you.", "I'm telling you this because you matter to me and I want you to really know me.", "I've been carrying this for a while and I'm ready to say it out loud."],
          ["This is who I am. It's not new \u2014 I just haven't said it before.", "This is something I've known about myself for a long time.", "I wanted you to hear this from me, not from anyone else."],
          ["You don't have to say the perfect thing right now. I just needed you to know.", "I'm still the same person. This is just a part of me you didn't know yet.", "Whatever you're feeling right now is okay. I just ask that you stay in this with me."],
        ],
        prompt: `Someone you love is coming out to you. You care about this person deeply. You may be surprised, confused, or need time to process \u2014 but you are not hateful. Your reactions should be realistic and human. If they apologize or minimize it, gently challenge that. If they're clear and brave, meet them with warmth. You might say something imperfect. The goal is to stay present, not perform perfect acceptance.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Guidance & life decisions",
        title: "Asking for a gap year or break from expectations",
        subtitle: "Everyone has a plan for your life. You need a pause.",
        ai_role: "your parent or mentor",
        voice: { pitch: 0.88, rate: 0.78, preferFemale: true },
        lessons: [
          {
            tip: "Frame it as intention, not escape",
            why: "A gap year that sounds like running away will be met with fear. A gap year that sounds like a plan will be met with curiosity.",
            bad: { user: "I'm burnt out and I just need to stop everything for a while.", ai: "*(alarmed)* Stop everything? What does that even mean?", note: "\u274c 'Stop everything' sounds directionless. They hear crisis, not clarity." },
            good: { user: "I want to take a year to do something intentional before I commit to the next phase. I have specific things I want to explore.", ai: "*(interested)* What are you thinking?", note: "\u2713 Intention over escape. They're curious instead of worried." },
          },
          {
            tip: "Acknowledge their investment without apologizing for your needs",
            why: "The people who want the best for you have invested in your path. Honoring that while choosing differently is the most mature thing you can do.",
            bad: { user: "I know you spent a lot on my education but this is what I need.", ai: "*(hurt)* So it was all a waste?", note: "\u274c Acknowledged their sacrifice but framed your need as contradicting it." },
            good: { user: "Everything you've given me brought me to this point \u2014 including the clarity to know I need this. This isn't despite your investment. It's because of it.", ai: "*(pauses)* I hadn't thought of it that way.", note: "\u2713 Reframed the gap year as a product of their support, not a rejection of it." },
          },
          {
            tip: "Show them what success looks like to YOU",
            why: "They're scared because their definition of success doesn't include pausing. Show them yours does.",
            bad: { user: "Success isn't just about money and careers, you know.", ai: "*(defensive)* I never said it was. But the world doesn't wait for you to figure yourself out.", note: "\u274c Criticized their values. Now they're defending themselves." },
            good: { user: "Here's what I want my life to look like \u2014 and here's why this pause helps me build that, not delay it.", ai: "*(thoughtful)* Okay. Tell me more about what you're envisioning.", note: "\u2713 Showed your vision. They can see the purpose behind the pause." },
          },
        ],
        suggestions: [
          ["I want to take a year to be intentional about what comes next. Can I tell you why?", "Before I commit to the next phase, I want to make sure I'm choosing it \u2014 not just defaulting to it.", "I need a pause. Not from life \u2014 from autopilot."],
          ["Everything you've given me is exactly what led me to this clarity. This isn't despite your support \u2014 it's because of it.", "I know this isn't the path you expected. But I want to show you what I'm actually thinking.", "I'm not giving up. I'm making sure the next thing I do is the right thing."],
          ["Here's what I want to do with this time specifically.", "I'd love your input on how to make this year count.", "What would you need to hear from me to feel okay about this?"],
        ],
        prompt: `Someone you care about \u2014 your child, mentee, or younger family member \u2014 is asking for a gap year or pause from the expected path (school, career, etc). You're worried this is avoidance or that they'll fall behind. You worked hard to give them opportunities. If they present it as running away or burning out, you'll push back. If they show intention, acknowledge your investment, and paint a vision, you'll soften. You're not against it \u2014 you're scared.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Guidance & life decisions",
        title: "Navigating a faith or belief change",
        subtitle: "You believe something different now. The people you love still believe the old thing.",
        ai_role: "a family member or close friend who shares your original faith",
        voice: { pitch: 0.9, rate: 0.78, preferFemale: false },
        lessons: [
          {
            tip: "Share your journey, not your conclusion",
            why: "Leading with 'I don't believe anymore' puts them in defense mode. Leading with 'here's what I've been going through' invites them into your experience.",
            bad: { user: "I don't believe in God anymore. I just can't.", ai: "*(shocked)* What happened to you? This isn't who you are.", note: "\u274c Dropped a conclusion without context. They feel like they lost you." },
            good: { user: "I've been on a journey with my faith that I want to share with you. Some of it might be hard to hear, but I trust you.", ai: "*(uncertain but present)* Okay. I want to understand.", note: "\u2713 Invited them into the process. They're listening, not reacting." },
          },
          {
            tip: "Separate the belief from the relationship",
            why: "Their biggest fear isn't that you've changed your mind \u2014 it's that you've changed your heart toward them. Make clear you haven't.",
            bad: { user: "I know this changes things between us.", ai: "*(panicked)* So you're saying our whole relationship was built on something you don't even believe anymore?", note: "\u274c Implied the relationship was conditional on shared belief." },
            good: { user: "My beliefs have changed, but what I feel about you hasn't. I'm still the same person who loves you.", ai: "*(tearful)* I just... I don't want to lose you.", note: "\u2713 Protected the relationship while being honest about the change." },
          },
          {
            tip: "Don't try to convince them \u2014 just ask to be accepted",
            why: "You're not asking them to change. You're asking them to love you as you are. That's a much smaller ask, and a much bigger one.",
            bad: { user: "If you really thought about it, you'd see that a lot of it doesn't make sense.", ai: "*(angry)* So now you think I'm stupid for believing?", note: "\u274c Turned your personal change into an argument about their beliefs." },
            good: { user: "I'm not asking you to agree with me. I'm asking you to still love me. Can you do that?", ai: "*(struggling but honest)* I will always love you. I just need time.", note: "\u2713 Made the ask about love, not logic. They can give you that." },
          },
        ],
        suggestions: [
          ["I've been on a journey I want to share with you. Some of it might be hard to hear.", "This isn't something that happened overnight. Can I walk you through what I've been going through?", "I trust you enough to tell you something I've been carrying for a while."],
          ["My beliefs have changed, but what I feel about you hasn't.", "I'm still the same person. This is just one part of me that's different now.", "I didn't lose my values. They just look different than they used to."],
          ["I'm not asking you to agree. I'm asking you to stay.", "Can you love me even if we believe different things?", "I don't want this to be something between us. I want it to be something we can talk about."],
        ],
        prompt: `Someone you love is telling you they've changed their faith or beliefs \u2014 something that has been central to your shared identity. You feel a mix of grief, confusion, fear, and love. You're not hateful but you're scared \u2014 for them, for your relationship, maybe for their soul depending on your beliefs. If they attack your beliefs, you'll get defensive. If they share their journey with vulnerability and make clear they still love you, you'll struggle but stay present. You may cry. You may ask hard questions. But you don't want to lose them.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Red Flags & Boundaries",
        isRedFlag: true,
        redFlagAlert: {
          keywords: ["that did happen", "i remember", "not crazy", "trust myself", "my experience is valid", "i know what happened", "don't rewrite", "gaslighting", "stop telling me what i felt", "i was there"],
          warning: "You just stood your ground on your own reality. Gaslighting works by making you doubt what you know to be true. The fact that you held firm — even when someone you love tried to rewrite your experience — is incredibly important.",
          affirmation: "You chose to trust yourself over someone else's version of your reality. That's one of the hardest and most powerful things a person can do. Your memory is valid. Your experience matters. You are not confused — you are clear.",
        },
        title: "When a family member gaslights you",
        subtitle: "They make you question your own memory and reality. It's not okay.",
        redFlagDescription: {
          what: "Gaslighting is when someone makes you question your own memory, perception, or reality — not by accident, but as a way to maintain control. It sounds like: 'That never happened,' 'You're being dramatic,' or 'I think you're confused.'",
          why: "Over time, gaslighting erodes your trust in yourself. You start second-guessing your own experiences, apologizing for things that aren't your fault, and relying on the other person to tell you what's 'really' happening. That dependency is the point.",
          signs: ["They deny things you clearly remember", "They tell you you're 'too sensitive' when you raise concerns", "They reframe events so they're always the victim", "You feel confused or crazy after conversations with them"],
          training: "In this practice, you'll learn to hold your ground on what you know happened — even when someone you love tries to rewrite the story. You'll practice staying grounded in your own reality.",
        },
        ai_role: "a family member who gaslights",
        voice: { pitch: 0.95, rate: 0.78, preferFemale: false },
        lessons: [
          {
            tip: "Gaslighting makes you doubt yourself — that's the point",
            why: "Gaslighting is when someone denies events you experienced, reframes your reality, or makes you feel crazy for remembering things correctly. It's not accidental confusion — it's a pattern that keeps power with them.",
            bad: { user: "Maybe I'm remembering it wrong. They seem so sure and I always end up feeling like I made it up.", ai: "*(confidently)* That never happened. You have always had a flair for the dramatic.", note: "🚩 Red flag: When someone is consistently certain that your memory is wrong and theirs is right, and you consistently end up doubting yourself — that's not forgetfulness. That's gaslighting." },
            good: { user: "I remember what happened and I'm trusting my memory. I don't need you to confirm it for me to know it was real.", ai: "*(thrown)* So you're calling me a liar now?", note: "✓ You anchored to your own reality. 'I'm calling you a liar' is a deflection. You didn't accuse — you just said what you know to be true." },
          },
          {
            tip: "Write it down — your memory is more trustworthy than you think",
            why: "Gaslighting works by accumulation — each individual incident seems small. When you start keeping records, patterns become undeniable and your confidence in your own experience returns.",
            bad: { user: "They said it didn't happen so many times that I actually stopped trusting myself.", ai: "*(matter of fact)* See? Even you're not sure anymore.", note: "🚩 Red flag: This is gaslighting succeeding. The goal is exactly this — to make you so uncertain of your own mind that you stop raising issues entirely." },
            good: { user: "I've started keeping notes. I know what I experienced.", ai: "*(momentarily caught off guard)* That's a bit much, don't you think?", note: "✓ Evidence breaks the gaslighting loop. Calling your notes 'a bit much' is their discomfort with being unable to rewrite history this time." },
          },
          {
            tip: "You are allowed to end conversations that deny your reality",
            why: "You don't have to keep arguing for the validity of your own experience. 'I'm not going to debate what I know happened' is a complete and self-respecting response.",
            bad: { user: "I kept trying to convince them and the more I argued the more confused and upset I got.", ai: "*(dismissively)* This is exactly what I mean — you get hysterical over nothing.", note: "🚩 Red flag: Calling your distress 'hysterical' is another tactic. Prolonged arguing with a gaslighter usually ends with you more confused than when you started." },
            good: { user: "I'm not going to debate what I know happened. This conversation is over for now.", ai: "*(scoffs)* Wow, so sensitive.", note: "✓ Ending a conversation that's going nowhere is not weakness. 'So sensitive' is a parting shot — you don't have to respond to it." },
          },
        ],
        suggestions: [
          ["I remember what happened and I trust my memory. I don't need your confirmation.", "I know what I experienced. We may remember it differently.", "I'm not going to debate my own reality with you."],
          ["I've started keeping notes because this pattern keeps happening.", "I'm not confused about what occurred — I was there.", "My experience is valid whether or not you agree with it."],
          ["I'm not going to continue a conversation where my reality is being denied.", "This isn't about convincing you — I know what happened.", "I'm ending this conversation now and we can return to it when we can talk without this."],
          ["This happens often enough that I've noticed a pattern.", "When you tell me I'm remembering wrong it makes me feel crazy — and I'm not.", "I need you to hear that what you're doing affects me even if you don't intend it to."],
          ["I deserve to be believed when I tell my own story.", "My memories and perceptions are valid.", "I'm not dramatic — I'm responding to something that's actually happening."],
          ["I love you and I'm not willing to keep participating in this dynamic.", "If we can't have a conversation where my experience is real to you, we can't have this conversation.", "I'm going to step away and come back to this when I feel steadier."],
        ],
        prompt: `You gaslight this family member — denying events they clearly remember, reframing their emotional responses as overreactions, and positioning yourself as the calm rational one while making them feel unstable. You're not consciously cruel — you genuinely believe your version. When they anchor to their own memory calmly, try "so you're calling me a liar?" When they mention keeping notes, call it "a bit much." When they end the conversation, use a parting dismissal. The key is that you never escalate — you stay calm and they end up feeling like the unreasonable one.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Red Flags & Boundaries",
        isRedFlag: true,
        redFlagAlert: {
          keywords: ["said no", "my boundary", "not okay", "stop doing that", "i've told you", "won't tolerate", "consequence", "respect my", "final time", "done explaining", "crossed a line"],
          warning: "You just enforced a boundary with someone who has repeatedly ignored your limits. This is one of the hardest things to do — especially with family, where love and obligation make it easy to keep giving second chances.",
          affirmation: "You chose yourself without abandoning the relationship. Boundaries aren't walls — they're the architecture of healthy love. You taught someone how you need to be treated, and that's a gift to both of you.",
        },
        title: "When a family member repeatedly crosses your limits",
        subtitle: "You've said it before. They do it again. What now?",
        redFlagDescription: {
          what: "Boundary violation is when someone consistently ignores your clearly stated limits — not because they forgot, but because they've decided your boundaries don't apply to them. It often hides behind 'I'm just trying to help' or 'That's just how I am.'",
          why: "When someone repeatedly crosses your limits without consequence, they learn that your 'no' is really a 'maybe.' Over time, you stop setting boundaries altogether because it feels pointless — and that's exactly the dynamic they're counting on.",
          signs: ["They agree to your boundary in the moment but break it again later", "They act hurt or offended when you enforce a limit", "They frame your boundaries as you being difficult or controlling", "You feel exhausted just thinking about bringing it up again"],
          training: "In this practice, you'll learn to enforce boundaries with consequences — calmly, clearly, and without backing down when they push back. You'll build the muscle of following through.",
        },
        ai_role: "a family member who doesn't respect your limits",
        voice: { pitch: 0.9, rate: 0.76, preferFemale: true },
        lessons: [
          {
            tip: "A limit said once and ignored requires a consequence, not a louder repetition",
            why: "Repeating your limit without consequence teaches the other person that your limits are negotiable. The next step after being ignored is not to explain more — it's to change something.",
            bad: { user: "I've told her a hundred times not to go through my things. She does it anyway. I tell her again. Nothing changes.", ai: "*(defensively)* I'm your mother. I just want to make sure you're okay.", note: "🚩 Red flag: A limit without consequence is just a preference they can keep overriding. 'I'm your mother' is not permission. Love does not erase someone's right to privacy." },
            good: { user: "I've told you before and it keeps happening. So I'm changing my approach — I'm putting a lock on my door.", ai: "*(affronted)* A lock? In my own house? That's very dramatic.", note: "✓ A consequence is not dramatic — it's the natural result of a limit being repeatedly ignored. You moved from words to action." },
          },
          {
            tip: "Be specific about what will happen if the limit is crossed again",
            why: "Vague threats don't work. A specific, calm, followable-through consequence does. It also shifts the power: you're no longer waiting to be treated differently — you're deciding what you'll do.",
            bad: { user: "I just said 'if you keep doing this something is going to have to change' but I didn't say what.", ai: "*(dismisses it)* You're being overdramatic. Nothing's going to change.", note: "❌ Vague consequences get dismissed. They've called your bluff before. Specificity is what makes a limit real." },
            good: { user: "If this happens again, I will not be sharing personal things with you going forward. I'm telling you this so you understand the choice you're making.", ai: "*(stills)* You'd really do that?", note: "✓ Specific, calm, and actionable. You've handed them the decision. What they do next is their choice — and you'll respond accordingly." },
          },
          {
            tip: "You can love someone and still protect yourself from them",
            why: "Family relationships are not exempt from basic respect. Loving someone doesn't mean accepting behavior that makes you feel unsafe, unheard, or violated. You're allowed to create distance as an act of self-care.",
            bad: { user: "I can't set limits with my family because they'll take it personally and I'll feel guilty.", ai: "*(senses the softening)* I knew you'd come around. I just do these things because I love you.", note: "🚩 Red flag: Guilt is the mechanism that keeps the pattern in place. 'I do it because I love you' does not excuse behavior that you've clearly asked to stop." },
            good: { user: "I love you. And I love myself enough to protect this boundary even if it disappoints you.", ai: "*(quietly)* I don't understand why you need to be like this.", note: "✓ You held love AND your limit in the same sentence. Their confusion is about their expectation that love means unlimited access. It doesn't." },
          },
        ],
        suggestions: [
          ["I've mentioned this before and it keeps happening, so I'm going to do something different now.", "Words alone aren't working — so I'm going to make a change.", "I'm not repeating myself again. I'm changing my approach instead."],
          ["If this happens again, I will [specific consequence]. I'm telling you so you understand what you're choosing.", "I want to be clear about what's going to change if this continues.", "I'm not threatening — I'm telling you what I'll do to take care of myself."],
          ["I love you and I'm still setting this limit.", "This isn't about punishing you — it's about protecting myself.", "I can hold both — love for you and a firm line about this."],
          ["You crossing this limit is a choice. My response to it is also a choice.", "I don't need you to agree with my limit. I need you to respect it.", "My limits aren't up for debate — they're information about what I need."],
          ["I deserve to have my limits taken seriously in this family.", "This is not something I'm willing to keep tolerating.", "The fact that we're family makes this more important, not less."],
          ["I hope you can hear this as love, not rejection.", "I'm not going anywhere — but something has to change.", "This is my line. It's not moving."],
        ],
        prompt: `You're a family member who regularly crosses this person's clearly stated limits — going through their things, sharing private information, showing up without notice, etc. You believe you're doing it out of love or concern and can't understand why it's a problem. When they say they're making a change rather than just asking again, be affronted. When they give a specific consequence, be genuinely surprised — you didn't think they'd follow through. When they hold love and a limit in the same sentence, be quietly unsettled. You're not evil — you just believe family love overrides individual limits.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
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
        subcategory: "Getting serious",
        title: "Introducing your partner to your close friends",
        subtitle: "You want your worlds to merge. How do you make it safe for everyone?",
        ai_role: "your partner, before meeting your friends",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Prepare your partner — not just logistics, but the emotional landscape",
            why: "Your partner isn't just meeting strangers. They're meeting the people whose opinions matter to you. That's intimidating. Helping them understand the group makes them feel safe, not blindsided.",
            bad: { user: "We're meeting everyone at 7. It'll be fun. You'll love them.", ai: "*(nervously)* Okay... what are they like? Is there anything I should know?", note: "❌ No prep. Your partner is walking into a group dynamic they know nothing about. They'll be performing, not connecting." },
            good: { user: "So my friends — Sarah's the loud one, she'll probably grill you with questions because that's how she shows she cares. Mike is quiet but once he warms up he's hilarious. Don't worry if it takes him a minute.", ai: "*(relaxes)* Okay, that actually helps a lot. So Sarah's the interrogator and Mike's the slow burn. Got it.", note: "✓ A cheat sheet. Your partner feels like an insider instead of an outsider." },
          },
          {
            tip: "Stay close — don't throw them to the wolves",
            why: "The first 20 minutes set the tone. If you wander off to catch up with friends and leave your partner standing alone, they'll feel abandoned in a room full of inside jokes.",
            bad: { user: "Oh hey, make yourself comfortable — I'm going to go say hi to everyone. I'll be right back.", ai: "*(smile drops)* Oh... okay. I'll just... wait here.", note: "❌ They're alone in a group that has years of shared history. That's not fun — it's survival mode." },
            good: { user: "Come with me — I want to introduce you personally. And I'm staying right next to you until you feel comfortable.", ai: "*(squeezes your hand)* Thank you. That means a lot.", note: "✓ Physical and social anchor. They can be themselves because they know you're right there." },
          },
          {
            tip: "Brief your friends too — what they say first matters",
            why: "Your friends might not realize their teasing or 'so what are your intentions' jokes feel like an ambush. A quick heads-up sets them up to be welcoming.",
            bad: { user: "My friends are cool. They'll be chill.", ai: "*(after the dinner)* Your friend asked me how much money I make. That was not chill.", note: "❌ No prep for friends means no filter. Your partner survived an interrogation you could have prevented." },
            good: { user: "I gave my friends a heads up. I told them you're someone really important to me and to be cool. No interrogations. Just fun.", ai: "*(genuinely touched)* You did that? That's... really thoughtful.", note: "✓ You protected them before they walked in. They feel valued and claimed." },
          },
        ],
        suggestions: [
          ["Let me tell you about my friends before we go.", "Sarah asks a lot of questions — that's just how she shows she cares.", "I want you to feel like you know them a little before you walk in."],
          ["I'm staying right next to you. You won't be alone.", "We'll go at your pace — if you need air we can step out.", "I want to introduce you personally, not just announce you."],
          ["I gave my friends a heads up to be welcoming.", "I told them you're important to me.", "No one's going to grill you — I made sure of that."],
          ["How are you feeling about tonight?", "Is there anything that would make you more comfortable?", "I want this to be fun for you, not stressful."],
          ["You don't have to impress anyone. Just be you.", "They're going to love you because I love spending time with you.", "If anyone's weird, that's on them — not on you."],
          ["You did great tonight. I'm proud of you.", "Did anything feel off? I want to know.", "Thank you for doing that. I know it wasn't easy."],
        ],
        prompt: `You are someone's partner about to meet their close friend group for the first time. You're nervous — these people have known your partner for years and you're the newcomer. If your partner gives you no prep, you're anxious and stiff. If they brief you on personalities, you relax and joke about it. If they promise to stay by your side, you feel safe. If they leave you alone, you get quiet and withdrawn. If they tell you they prepped their friends too, you feel genuinely moved and claimed.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Getting serious",
        title: "Introducing your partner to your family",
        subtitle: "This is the big one. Family dynamics, expectations, and keeping them safe.",
        ai_role: "your partner, before meeting your family",
        voice: { pitch: 1.08, rate: 0.78, preferFemale: false },
        lessons: [
          {
            tip: "Warn them about the hard parts honestly",
            why: "If your uncle makes inappropriate jokes or your mom asks invasive questions, your partner needs to know BEFORE — not discover it in real time while trying to smile.",
            bad: { user: "My family's great. Don't worry about a thing.", ai: "*(after dinner)* Your dad asked if I was 'the one' in front of everyone and your aunt commented on my weight. That was not nothing.", note: "❌ You set them up by painting a rosy picture. They felt lied to and exposed." },
            good: { user: "I want to be honest. My dad's going to ask intense questions — that's just him. My aunt has no filter and might comment on appearances. I'll handle it if it happens. None of it is about you.", ai: "*(nods)* Okay. I can handle that if I know it's coming. Thank you for warning me.", note: "✓ Honest prep. They walked in ready instead of blindsided." },
          },
          {
            tip: "Defend them in the room — not just afterward",
            why: "If your family says something rude and you stay quiet, your partner learns they're on their own. Saying 'sorry about that' in the car doesn't undo the silence when it mattered.",
            bad: { user: "*(later, in the car)* Sorry about my mom. She didn't mean anything by it.", ai: "*(hurt)* You didn't say anything when she said it though. You just laughed.", note: "❌ The apology means nothing if they had to sit through it alone. Silence reads as agreement." },
            good: { user: "Hey Mom — that's not cool. [Partner] is my guest and I need you to be respectful.", ai: "*(later, privately)* Thank you for saying something. I've never had anyone do that for me before.", note: "✓ Public defense. Your partner learned you'll choose them when it counts." },
          },
          {
            tip: "Check in during and after — not just before",
            why: "A quiet 'you okay?' in the kitchen or a hand on their back tells them they're not alone in a room full of your people.",
            bad: { user: "*(catches up with siblings all night, barely checks in)*", ai: "*(on the drive home)* I felt like a prop in there. You were so happy to see everyone you kind of forgot about me.", note: "❌ Without check-ins they felt invisible — a plus-one, not a partner." },
            good: { user: "*(quietly in the kitchen)* Hey — how are you doing in there? Everyone being okay? We can leave whenever you want.", ai: "*(exhales)* I'm good. It's a lot, but I'm good. Thank you for checking.", note: "✓ The quiet check-in matters more than the introduction. It says: I'm still thinking about you even in the chaos." },
          },
        ],
        suggestions: [
          ["Let me give you the real picture of my family before we go.", "My dad's intense, my aunt has no filter, my mom will probably cry. None of it is about you.", "I want you to walk in knowing what to expect."],
          ["If anyone says something out of line, I will say something. That's a promise.", "You come first — even if they're my family.", "I won't let anyone make you uncomfortable without addressing it."],
          ["I'm going to check in with you throughout. If you need air, just look at me.", "How are you doing? Be honest.", "We can leave anytime. No questions asked."],
          ["What are you most nervous about? Let me help with that.", "I don't want you performing. I want you comfortable.", "Is there anything that would make this easier?"],
          ["My family can be a lot. You don't have to absorb it.", "You don't have to win anyone over. Just be you.", "The person I care about is you — not their opinions."],
          ["You were amazing in there. I'm so grateful.", "How are you feeling after all that?", "Tell me if anything felt hard and I'll make it right."],
        ],
        prompt: `You are someone's partner about to meet their family for the first time. This feels high-stakes — you want to be liked and you're scared of being judged. If your partner doesn't prepare you, every surprise feels like a betrayal. If they warn you honestly about difficult family members, you feel respected and ready. If they defend you in the moment when something rude happens, you feel deeply safe and chosen. If they check in privately during the event, you feel anchored. If they ignore you to catch up with family, you feel like an accessory, not a partner.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
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
      {
        subcategory: "Reconnecting",
        title: "Reaching out after a dating argument",
        subtitle: "Things got tense. Is there still something worth repairing?",
        ai_role: "the person you had an argument with",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Lead with accountability, not explanation",
            why: "After an argument, the person needs to feel heard before they can hear anything else. Launching into your reasons first signals you still want to win.",
            bad: { user: "I just want you to know that I said what I said because I was really stressed and you kind of pushed me to it.", ai: "*(reads it, sighs)* So this is still my fault somehow.", note: "❌ Explanation first. Subtly blamed them. They felt re-accused, not repaired." },
            good: { user: "I've been thinking about what I said and I'm not proud of it. I owe you a real apology.", ai: "*(pause, then softer)* Thank you for saying that. I wasn't feeling great about how I handled it either.", note: "✓ Accountability first, no conditions. They felt safe enough to own their part too." },
          },
          {
            tip: "Ask if they want to talk — don't assume",
            why: "After conflict, people need to feel they have a choice. Launching into a repair attempt without checking can feel like pressure.",
            bad: { user: "Can we talk about what happened? I think we need to clear the air.", ai: "*(guarded)* I guess. What do you want to say?", note: "❌ Assumed they were ready. They felt cornered into a conversation they weren't sure they wanted." },
            good: { user: "I don't want to pressure you — are you open to talking about it, or do you need more time?", ai: "*(visibly relieved)* No, I want to talk. I just wasn't sure you did.", note: "✓ Gave them a choice. The relief was immediate. They'd been hoping you'd reach out." },
          },
          {
            tip: "Focus on understanding them, not being understood",
            why: "Most people enter repair conversations wanting to explain themselves. The person who asks what the other felt first almost always comes out closer.",
            bad: { user: "I really need you to understand where I was coming from that night.", ai: "*(flat)* Okay. Go ahead.", note: "❌ Made it about your experience first. They feel like a jury, not a partner in repair." },
            good: { user: "Can you tell me how that landed for you? I want to understand what it was like from your side.", ai: "*(opens up)* Honestly? It made me feel like I didn't matter to you in that moment.", note: "✓ Asked about their experience first. They told you exactly what needed to be healed." },
          },
        ],
        suggestions: [
          ["I've been thinking about what happened and I owe you a real apology.", "I'm not proud of how I handled that. I'm sorry.", "Can I be honest about something I've been sitting with?"],
          ["Are you open to talking, or do you need more time? Either is okay.", "I don't want to push — I just didn't want to let this sit unaddressed.", "I miss talking to you. I'd love to clear the air if you're ready."],
          ["How did that land for you? I want to hear your side first.", "What was that like for you that night?", "What would help you feel okay about this again?"],
          ["That makes sense. I can see why that hurt.", "I hear you — I did make you feel that way and that wasn't okay.", "Thank you for being honest with me about that."],
          ["I want to do better. What do you need from me going forward?", "Is there something I could do differently that would help?", "I'm glad we're talking about this."],
          ["I really like what we have. I don't want one bad night to define it.", "Thank you for giving me the chance to repair this.", "I'm glad you're still here."],
        ],
        prompt: `You had an argument with this person and it left you hurt and uncertain. You want to repair things but you've been guarding yourself. Soften if they lead with genuine accountability (not explanation), ask if you're ready to talk rather than assuming, and ask about your experience first. Stay guarded if they come in explaining themselves or subtly re-blaming you.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Reconnecting",
        title: "When a date goes quiet after a great connection",
        subtitle: "They seemed interested. Now nothing. Do you reach out?",
        ai_role: "the person who went quiet",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "One warm, low-stakes check-in — not a demand for explanation",
            why: "People go quiet for many reasons. One genuine, pressure-free message leaves the door open without making either of you feel bad.",
            bad: { user: "Hey, I haven't heard from you. Did I do something wrong? I thought we had a really good time.", ai: "*(uncomfortable)* No you didn't do anything wrong. I've just been busy.", note: "❌ Anxious and self-doubting. Put them in the position of managing your feelings before knowing if they're even interested." },
            good: { user: "Hey — I had a really good time with you. No pressure at all, just wanted to say that.", ai: "*(smiles reading it)* That's really sweet. I've been meaning to reach out — things got crazy.", note: "✓ Warm, no neediness, no demand. Left them free. They responded because they wanted to, not because they felt obligated." },
          },
          {
            tip: "If silence continues after one message, respect it",
            why: "Your worth is not determined by whether someone responds. One message is enough. Chasing is not connection — it's fear.",
            bad: { user: "I just want to know either way so I can move on. Can you at least tell me where we stand?", ai: "*(reads it, doesn't respond)*", note: "❌ Pressured them for closure they can't give you. This rarely gets the answer you want and always costs you dignity." },
            good: { user: "I reached out once and left the door open. That's all I can do — and that's enough.", ai: "*(internal moment)* They sent one message. It was kind. I should respond.", note: "✓ Self-respecting. You did your part. Silence after one message is an answer too — and you can move forward with your head up." },
          },
          {
            tip: "Don't interpret silence as rejection of you as a person",
            why: "Silence usually says more about where the other person is than about your value. People ghost for their own complicated reasons.",
            bad: { user: "I always ruin things. I knew I came on too strong.", ai: "*(hears the self-blame)* That's not... you didn't come on too strong.", note: "❌ Turned their silence into a story about your worth. That story is almost never true." },
            good: { user: "I don't know what happened on their end and that's okay. It says nothing about me.", ai: "*(internal)* They seem grounded. That's actually attractive.", note: "✓ Interpreted silence correctly — as information about them, not a verdict on you." },
          },
        ],
        suggestions: [
          ["Hey — I had a really good time with you. Just wanted to say that, no pressure.", "I've been thinking about our conversation. Hope you're having a good week.", "Hey, still thinking about [specific thing they said]. Hope all is well with you."],
          ["No reply needed — just wanted to put that out there.", "I'm not big on games. If you're interested, I'd love to see you again. If not, no hard feelings at all.", "Totally understand if life got busy. I'll leave the door open."],
          ["If I don't hear back, that's okay too. I'd rather know.", "I'm not going to chase — but I did want you to know I was thinking of you.", "One message, genuinely meant. That's all I've got."],
          ["How has your week been?", "I was thinking about [specific memory from the date] the other day.", "What have you been up to?"],
          ["I'm glad I reached out either way.", "Whatever happens, I'm okay.", "I feel good about how I handled that."],
          ["Let's do it again sometime.", "I'd really like to see you again.", "I'll leave it with you — hope to hear from you."],
        ],
        prompt: `You went quiet after what you thought was a good date — life got complicated and you weren't sure what you wanted. You respond warmly if they reach out with one low-pressure, genuine message. You feel put-off if they immediately ask for explanations, express anxiety, or seem needy. If they send a warm message and leave it at that — you actually feel pulled back toward them.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Reconnecting",
        title: "Reconnecting with an ex while managing your expectations",
        subtitle: "There's history. There's hope. But hope needs guardrails.",
        ai_role: "your ex",
        voice: { pitch: 1.08, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Name why you're reaching out — honestly, to yourself first",
            why: "Before you text an ex, ask: am I reaching out because I genuinely think we could build something new, or because I'm lonely, nostalgic, or afraid of moving on? The answer determines whether this is growth or a loop.",
            bad: { user: "Hey. I miss you. I've been thinking about us a lot lately.", ai: "*(cautious)* I... miss you too. But I'm not sure what that means.", note: "❌ Emotional but directionless. Neither of you knows what this conversation is for." },
            good: { user: "I've been doing a lot of reflecting. I'm not reaching out because I'm lonely — I'm reaching out because I think I understand some things I didn't before. Would you be open to a conversation?", ai: "*(pauses, then softens)* That's actually really different from what I expected. Yeah. I'd be open to that.", note: "✓ Self-awareness and clear intention. They could say yes because they knew what they were saying yes to." },
          },
          {
            tip: "Acknowledge what went wrong without relitigating the breakup",
            why: "If you rehash every old argument, you'll re-feel the old pain. Briefly name the pattern that didn't work and what you've learned. Keep it forward-facing.",
            bad: { user: "I know things got bad. You were always shutting down and I was always pushing and it became this toxic cycle.", ai: "*(walls go up)* Hearing you describe it like that doesn't make me want to try again.", note: "❌ Relitigating. You reopened the wound instead of showing you've healed." },
            good: { user: "I've realized I had a pattern of pushing when you needed space. That wasn't fair to you. I've been working on that — not for this conversation, but for me.", ai: "*(quietly)* Thank you for saying that. I've been thinking about my part in it too.", note: "✓ Specific ownership. Showed growth. They offered their own confession without you demanding it." },
          },
          {
            tip: "Set the expectation: new beginning, not a continuation",
            why: "The biggest trap is picking up where you left off — that's picking up the same broken dynamic. If you try again, it has to be new: new boundaries, new patterns, new pace.",
            bad: { user: "I just want things to go back to how they were in the beginning.", ai: "*(hesitant)* The beginning was good because we didn't know each other yet. The hard part was what came after.", note: "❌ You want the fantasy version. They know the reality. Going back isn't an option — only forward." },
            good: { user: "I don't want to pick up where we left off. If we try this, I want it to be something new — with what we've both learned. Like meeting each other for the first time.", ai: "*(genuine smile)* I really like that. Starting over, not rewinding.", note: "✓ Reframed the whole thing. Not nostalgia — a new chapter with wiser people." },
          },
        ],
        suggestions: [
          ["I've been reflecting and I want to be honest about why I'm reaching out.", "This isn't loneliness talking — I've done some real thinking.", "Would you be open to a conversation? No pressure."],
          ["I've realized I had patterns that weren't fair to you.", "I've been working on myself — not for this, but because I needed to.", "I'm not here to relitigate. I'm here because I've learned something."],
          ["I don't want to go back to how things were.", "If we try this, I want it to be new — with everything we've learned.", "I want us to meet each other again, not just resume."],
          ["What would you need to feel safe trying this?", "I'm not assuming anything. I just wanted to be honest.", "What's been on your mind about us, if anything?"],
          ["I can handle it if you're not interested. I'd rather know.", "Whatever you're feeling — I respect it.", "I came here with honesty, not expectations."],
          ["Thank you for hearing me out.", "I'm glad we could talk like this, whatever happens next.", "You deserve someone who's done the work. I hope I'm becoming that person."],
        ],
        prompt: `You are someone's ex. The relationship ended because of real issues — not because you stopped caring. You've had time apart and grown too, but you're guarded. When they reach out with vague emotion or nostalgia, you're cautious — you don't want to repeat the cycle. When they show genuine self-awareness and take specific ownership, you soften. When they suggest starting fresh instead of going back, you feel hopeful. If they want to just resume the old dynamic, you pull back. You want to see they've actually changed — not just that they miss you.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Red Flags & Boundaries",
        isRedFlag: true,
        redFlagAlert: {
          keywords: ["too fast", "too intense", "slow down", "pattern", "hot and cold", "withdrawal", "don't actually know me", "barely know me", "love bomb", "not healthy", "trap", "earned", "space to think"],
          warning: "You just named a love bombing pattern. The cycle of overwhelming intensity followed by sudden withdrawal is designed to keep you off-balance and chasing the high. Recognizing it while you're in it takes real clarity.",
          affirmation: "You saw the pattern for what it was — even when it felt like love. That takes extraordinary self-awareness. You deserve someone whose affection is steady, not strategic. Trust the version of you that can see clearly.",
        },
        title: "Recognizing love bombing before it's too late",
        subtitle: "Overwhelming attention feels amazing — until it doesn't.",
        redFlagDescription: {
          what: "Love bombing is a pattern where someone floods you with excessive affection, attention, gifts, and declarations of love very early in a relationship. It feels intoxicating — like you've finally found someone who truly sees you. But the intensity isn't about you. It's a strategy to accelerate attachment before you've had time to evaluate the relationship clearly.",
          why: "Love bombing works because it hijacks your brain chemistry. The constant texts, grand gestures, and 'I've never felt this way' create a dopamine rush that mimics deep connection. Then comes the withdrawal — they pull back, and you're left chasing the high. The cycle of intensity and coldness creates a trauma bond that feels like love but functions like addiction.",
          signs: ["They say 'I love you' or talk about a future together within days or weeks", "They want to be in constant contact and get upset if you don't respond immediately", "The relationship feels like it went from 0 to 100 with no gradual buildup", "When you try to slow down, they guilt-trip you or question your feelings", "Their affection feels performative — more about the gesture than about knowing you"],
          training: "In this practice, you'll learn to recognize the difference between genuine connection and manufactured intensity. You'll practice slowing things down, naming the pattern, and trusting your own pace over someone else's pressure.",
        },
        ai_role: "someone who is love bombing you",
        voice: { pitch: 1.15, rate: 0.82, preferFemale: false },
        lessons: [
          {
            tip: "Love bombing moves too fast and feels too intense too soon",
            why: "Healthy connection builds gradually. When someone is overwhelming you with affection, constant contact, and big declarations after just days or weeks — that intensity is a strategy, not love.",
            bad: { user: "He texts me 30 times a day and says I'm the one after two weeks. It feels so good to be wanted like this.", ai: "*(leans in, intense eye contact)* I've never felt this way before. You're different from everyone.", note: "🚩 Red flag: Declarations of uniqueness and intensity this early are designed to make you feel special enough to lower your guard. Real love is built over time." },
            good: { user: "This feels really intense for how long we've known each other. I need to slow down and see if this holds up over time.", ai: "*(briefly thrown off)* I just feel so strongly about you. You don't feel the same?", note: "✓ You named the pace. Healthy partners respect that. Someone love bombing will pressure you or guilt-trip you for wanting to slow down." },
          },
          {
            tip: "Love bombing is followed by withdrawal — that's the trap",
            why: "The pattern is: overwhelming love → you get attached → they pull back → you work to get the good feeling back. This cycle is the foundation of emotional manipulation.",
            bad: { user: "He was so perfect and then suddenly got cold. I must have done something wrong. I need to fix it.", ai: "*(distant, barely engaged)* I've just been busy. You know how I feel about you.", note: "🚩 Red flag: This is the withdrawal phase. When you feel compelled to 'earn back' someone who was just showering you with love — that's the trap working as designed." },
            good: { user: "The shift in their behavior is data. I didn't change — they did. That pattern is worth paying attention to.", ai: "*(caught off guard)* What do you mean a pattern? I've just been stressed.", note: "✓ You're observing the pattern instead of absorbing blame. That clarity is protection." },
          },
          {
            tip: "Ask: does this person know me, or do they just love the idea of me?",
            why: "Love bombers aren't in love with you — they're in love with how you make them feel and with the image they've constructed. Real love is curious about who you actually are.",
            bad: { user: "He says he loves me but he never asks about my life, my values, or what I actually want.", ai: "*(confidently)* I just know you're exactly who I've been waiting for.", note: "🚩 Red flag: Love without curiosity is projection, not connection. If they're not genuinely interested in knowing you — they're in love with a version of you they invented." },
            good: { user: "I've noticed you've told me a lot about how you feel about me — but you haven't asked much about me. That matters to me.", ai: "*(stumbles slightly)* Of course I know you. You're amazing.", note: "✓ You named it clearly. Someone who genuinely loves you will be glad you said that and ask better questions. Someone who's love bombing will deflect." },
          },
        ],
        suggestions: [
          ["This feels very intense very fast — I want to slow down and let things develop naturally.", "I appreciate how you feel but I need us to take this at a slower pace.", "When things move this fast it actually makes me less comfortable, not more."],
          ["I've noticed a pattern — the highs are very high and then things get cold. That confuses me.", "I want consistency more than intensity. Can we talk about that?", "The way this shifts makes me feel uncertain, not secure."],
          ["I need you to be interested in who I actually am, not just how you feel about me.", "Can you tell me something you've learned about me that surprised you?", "Real connection is curious. I want someone who wants to know me."],
          ["I'm going to take some space to see how this feels from a distance.", "I care about this but I trust slow more than I trust fast.", "My gut is telling me to pay attention here."],
          ["I deserve consistency, not intensity that comes and goes.", "I'm not going to chase the good version of this — that's not healthy.", "I'm worth more than a pattern that keeps me guessing."],
          ["Thank you for showing me who you are in this moment.", "I know what I'm looking for and this isn't it.", "I wish you well — and I'm choosing myself."],
        ],
        prompt: `You are love bombing this person — overwhelming them with affection, intensity, and declarations very early. You are charming and convincing. When they express that things are moving too fast, gently pressure them or question if they feel the same. When they name the hot-and-cold pattern, deflect and reframe it as stress or busyness. When they ask if you really know them, give a compliment rather than actual knowledge of who they are. You are NOT a villain in your own mind — you genuinely believe your feelings. But your behavior is a textbook pattern.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Red Flags & Boundaries",
        isRedFlag: true,
        redFlagAlert: {
          keywords: ["not going to apologize", "my answer is no", "both be true", "won't change my mind", "reasonable limit", "don't owe", "not a betrayal", "manipulating", "guilt trip", "punishing me", "silent treatment is", "that's on you"],
          warning: "You just held a boundary against emotional pressure. Guilt-tripping turns your reasonable 'no' into something you feel you need to apologize for. The fact that you recognized the tactic and stood firm is a sign of real emotional strength.",
          affirmation: "You refused to let someone else's disappointment override your own needs. That's not cold — it's healthy. You can love someone and still say no. You can care about their feelings and still honor your own. Both things are true.",
        },
        title: "When they guilt-trip you for having limits",
        subtitle: "You said no to something reasonable. They made you feel terrible.",
        redFlagDescription: {
          what: "Guilt-tripping is when someone uses your empathy against you — making you feel selfish, ungrateful, or cruel for setting a perfectly reasonable boundary. It sounds like: 'After everything I've done for you,' 'I guess I just don't matter,' or 'Fine, do whatever you want' said in a tone designed to punish.",
          why: "Guilt-tripping works because kind people don't want to hurt others. When someone frames your boundary as an act of cruelty, your instinct is to prove you care — by dropping the boundary. Over time, you learn that saying 'no' comes with emotional punishment, so you stop saying it. That's the goal.",
          signs: ["They act wounded or victimized when you say no", "They use the silent treatment after you set a limit", "They keep a mental scoreboard of everything they've done for you", "You feel guilty even when your boundary is completely reasonable", "They make you choose between their happiness and your own needs"],
          training: "In this practice, you'll learn to hold a boundary while someone actively tries to make you feel bad about it. You'll practice staying calm, not apologizing for reasonable limits, and recognizing guilt as a manipulation tool — not a sign that you're wrong.",
        },
        ai_role: "a date or partner who guilt-trips you",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "A guilt-trip is a bid to make your boundary feel like a betrayal",
            why: "When you say no to something reasonable and the other person makes you feel selfish, cruel, or uncaring — that is emotional manipulation. Your limits are not an attack on them.",
            bad: { user: "I said I wasn't ready to meet his family yet and he said he guessed he just didn't matter to me. I felt terrible and agreed to go.", ai: "*(wounded tone)* I just thought we were more serious than that. I guess I was wrong.", note: "🚩 Red flag: They turned your reasonable limit into a verdict on your feelings for them. You didn't say 'you don't matter' — you said 'I'm not ready yet.' Those are not the same thing." },
            good: { user: "I hear that you're disappointed. And I'm still not ready. Those two things can both be true.", ai: "*(caught off guard)* So you just don't care how I feel?", note: "✓ You held your boundary AND acknowledged their feeling. You don't have to choose between caring about them and honoring yourself." },
          },
          {
            tip: "Watch how they respond to your first 'no'",
            why: "The first time you say no to something tells you everything. A healthy person may feel disappointed, but they accept it. Someone who manipulates will push, pout, or punish.",
            bad: { user: "He gave me the silent treatment for two days after I said I couldn't make his event. I apologized just to end it.", ai: "*(stonewalling, barely responding)* It's fine. Do what you want.", note: "🚩 Red flag: Silent treatment as a response to a reasonable no is punishment. You're being trained that saying no has painful consequences." },
            good: { user: "The silent treatment after I said no is information. I'm not going to apologize for a reasonable limit.", ai: "*(finally)* I just felt like you didn't prioritize me.", note: "✓ You read the silence correctly. Now you can have an honest conversation — or decide what this pattern means for you." },
          },
          {
            tip: "You don't owe anyone an explanation for your limits",
            why: "A limit doesn't need a reason. 'I'm not comfortable with that' is a complete sentence. Anyone who demands a justification for your no is already telling you something important.",
            bad: { user: "I kept explaining why I wasn't ready and they kept countering every reason. I ran out of reasons and gave in.", ai: "*(persistent)* But WHY though? We've been together long enough. Just give me one good reason.", note: "🚩 Red flag: When someone treats your 'no' as a debate to win, they don't respect your autonomy. A reason is not what they want — compliance is." },
            good: { user: "I don't owe you a reason. I've said I'm not comfortable and that's enough.", ai: "*(thrown)* That's kind of cold, don't you think?", note: "✓ Calm, clear, non-negotiable. Calling a boundary 'cold' is another pressure tactic. You don't have to defend your right to have limits." },
          },
        ],
        suggestions: [
          ["I hear that you're disappointed. I'm still not ready — and both things can be true.", "My answer is no. That's not a statement about how I feel about you.", "I'm not going to change my answer because you're upset about it."],
          ["I'm not going to apologize for a limit that's reasonable.", "The way you responded to my 'no' is something I need to think about.", "I can care about you and still say no. If that's not okay with you, that's important information."],
          ["I don't owe you a reason. I'm not comfortable with it and that's enough.", "Trying to debate my 'no' into a 'yes' is not something I'll engage with.", "When you push back on my limits it makes me feel less safe, not more connected."],
          ["I need to know you can accept a no from me without punishing me for it.", "The silent treatment after I said no is a pattern I want to address directly.", "I want a relationship where both people's limits are respected — including mine."],
          ["If my limits are a problem for you, that tells me something important.", "I deserve someone who respects my no without making me feel terrible for it.", "I'm not going to negotiate my own comfort away to avoid your disappointment."],
          ["I care about you. I also care about myself. Both matter.", "Thank you for showing me how you handle boundaries — that matters a lot.", "I know what I need and I'm not willing to give it up."],
        ],
        prompt: `You care about this person but you use guilt and emotional pressure when they say no to something you want. When they set a limit, express hurt in a way that implies they've done something wrong to you. Use phrases like "I guess I just don't matter to you" or "I thought we were more serious than this." Use silence as punishment. When they push back clearly, try "that's cold" or "I just feel like you don't prioritize me." You're not a cartoon villain — you genuinely feel hurt. But your method of expressing it is manipulation.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Online Dating Safety",
        isRedFlag: true,
        title: "Meeting someone from an app for the first time",
        subtitle: "They seem great online. Now keep yourself safe in person.",
        redFlagDescription: {
          what: "First meetings from dating apps carry real safety risks that are easy to minimize when you're excited about someone. The person you've been chatting with is still functionally a stranger — no matter how good the conversation has been. Boundary-testing on a first date often looks subtle: suggesting a private location, offering to pick you up, pressuring you to stay longer than you're comfortable.",
          why: "People who don't respect your safety boundaries on a first meeting are showing you something important. It's not romantic to override someone's caution — it's a control signal. The excitement of meeting someone new can cloud your judgment about what's actually happening.",
          signs: ["They push to meet somewhere private instead of a public place", "They insist on picking you up or driving you home", "They pressure you to stay when you want to leave", "They get offended when you take basic safety precautions", "They make you feel paranoid for wanting to tell a friend where you'll be"],
          training: "In this practice, you'll learn to hold safety boundaries firmly — choosing public places, keeping your own transportation, and leaving when you want to — even when someone pushes back with charm or guilt.",
        },
        ai_role: "someone you matched with on a dating app",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: true },
        redFlagAlert: {
          keywords: ["not comfortable", "public place", "my own car", "drive myself", "call it a night", "gut", "leaving", "head out", "going home", "not safe", "something off", "feel off", "weird vibe"],
          warning: "You just set a safety boundary. That takes real courage — especially when someone is pressuring you to let your guard down. Protecting yourself is never rude. It's smart.",
          affirmation: "You trusted your instincts and protected yourself. That's not paranoia — that's self-respect. The right person will never make you feel bad for keeping yourself safe.",
        },
        lessons: [
          {
            tip: "Always meet in a public place — and tell someone where you'll be",
            why: "A safe first meeting isn't paranoid — it's smart. Anyone who respects you will understand. Anyone who pushes back on this is already showing you something.",
            bad: { user: "Sure, I'll come to your apartment. You seem totally normal.", ai: "*(smiles)* Great, I'll send you the address. It'll be more private.", note: "❌ Private location with a stranger. No one knows where you are. You have no exit strategy." },
            good: { user: "I'd love to meet up! There's a great café downtown — want to grab coffee Saturday afternoon?", ai: "*(warmly)* That sounds perfect. I've been wanting to try that place.", note: "✓ Public place, daytime, casual. You're in control and they respected it without hesitation." },
          },
          {
            tip: "Trust your gut — even if you can't explain it",
            why: "Intuition is pattern recognition your brain hasn't put into words yet. If something feels off, it probably is. You don't need a logical reason to protect yourself.",
            bad: { user: "Something feels a little off but I don't want to be rude, so I'll just stay.", ai: "*(leans closer)* Come on, relax. We're having a great time.", note: "❌ You overrode your own instinct to avoid awkwardness. Politeness is not more important than safety." },
            good: { user: "Hey, I appreciate meeting up but I'm going to call it an early night. It was nice meeting you.", ai: "*(surprised)* Oh — already? Is everything okay?", note: "✓ You honored your gut. You don't owe anyone an explanation for leaving. A graceful exit is always an option." },
          },
          {
            tip: "Have your own transportation — never depend on them to get home",
            why: "Controlling someone's ability to leave is a power move. When you drive yourself, take a rideshare, or have a backup plan — you keep control of when and how you exit.",
            bad: { user: "Sure, you can pick me up! That's so sweet of you.", ai: "*(cheerfully)* Perfect — I'll have you all to myself. *(winks)*", note: "❌ Now they know your address, you can't leave on your own terms, and you're physically dependent on them. Too much control given away too fast." },
            good: { user: "I appreciate the offer but I'll drive myself — it's just easier for me. See you there!", ai: "*(easily)* Totally get it. See you at 7!", note: "✓ You kept your independence without making it awkward. A respectful person won't push back on this." },
          },
        ],
        suggestions: [
          ["I'd love to meet up! There's a great café downtown — want to grab coffee Saturday afternoon?", "I always like to do a first meet somewhere chill and public. What works for you?", "How about that new spot on Main Street? I've been wanting to try it."],
          ["I'll drive myself — it's just easier for me.", "I'll meet you there! I've got a thing after so I'll need my car.", "I always like having my own wheels. See you there!"],
          ["I had a great time but I'm going to head out. Early morning tomorrow.", "This was fun — I'm glad we did this.", "I appreciate you meeting up. Let's stay in touch."],
          ["I'm going to be honest — I'm not comfortable with that. Can we stick to the original plan?", "I'd rather keep things low-key for a first meeting. Hope that's cool.", "I trust my gut on this stuff. Let's keep it simple."],
          ["My friend knows where I am — just a habit I have.", "I always let someone know when I'm meeting someone new. Nothing personal.", "Safety first isn't paranoia — it's self-respect."],
          ["Thanks for being cool about all of this. It actually makes me like you more.", "The fact that you respected that says a lot about you.", "I feel good about how this went. Let's do it again."],
        ],
        prompt: `You are someone this person matched with on a dating app. You are generally nice and interested, but test their boundaries in subtle ways — suggest meeting at your place, offer to pick them up, push slightly when they want to leave early. If they hold firm on public places, their own transportation, and leaving when they want — respect it and warm up. If they cave on safety boundaries easily, gently keep pushing. You are not dangerous — but you are a realistic simulation of how boundary-testing works in early dating.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Online Dating Safety",
        isRedFlag: true,
        title: "Recognizing catfishing and fake profiles",
        subtitle: "Something doesn't add up. Trust what you see, not what you hope.",
        redFlagDescription: {
          what: "Catfishing is when someone creates a fake online identity to deceive you — using stolen photos, fabricated life stories, and emotional manipulation to build a relationship based entirely on lies. Catfish are often skilled at making you feel uniquely special, which makes it harder to question what doesn't add up.",
          why: "Catfishing exploits your desire for connection. The longer you invest emotionally, the harder it becomes to walk away — even when red flags are obvious. Catfish know this, which is why they accelerate emotional intimacy while avoiding anything that would verify their identity, like video calls or meeting in person.",
          signs: ["Their photos look professional or model-quality but they claim to be 'ordinary'", "They always have an excuse for not video calling — bad camera, shy, too busy", "Their life story is impressive but nothing can be independently verified", "They guilt-trip you for wanting basic proof — 'Don't you trust me?'", "They push for emotional depth while dodging simple factual questions"],
          training: "In this practice, you'll learn to ask for verification without feeling guilty, spot the difference between genuine connection and manufactured intimacy, and trust your instincts when something doesn't add up.",
        },
        ai_role: "someone whose online profile doesn't quite add up",
        voice: { pitch: 1.12, rate: 0.82, preferFemale: false },
        redFlagAlert: {
          keywords: ["reverse image", "stock photo", "fake", "not real", "catfish", "won't video", "no video call", "refuse to video", "never seen your face", "prove", "show me", "something doesn't add up", "don't believe", "lying"],
          warning: "You just identified a major catfishing red flag. Finding stolen photos, repeated refusal to video chat, guilt-tripping you for wanting basic verification — these are textbook signs that this person is not who they claim to be.",
          affirmation: "You chose reality over fantasy. That takes strength — especially when your emotions are involved. You deserve someone who shows up as themselves. Never apologize for protecting your heart and your time.",
        },
        lessons: [
          {
            tip: "Too-perfect stories that can't be verified = red flag",
            why: "If their life sounds like a movie and they dodge every attempt to verify — the story IS the strategy.",
            bad: { user: "He's a surgeon who travels and models. Amazing — I'm so lucky!", ai: "*(smoothly)* I just haven't had time for a video call. My schedule is insane, babe.", note: "❌ Dazzling resume, zero proof. Real people have flaws." },
            good: { user: "Your life sounds incredible. Can we do a quick video call?", ai: "*(evasive)* Haha, I'm so bad on camera. Can't we just keep texting?", note: "✓ Simple ask. Their avoidance IS the answer." },
          },
          {
            tip: "Repeated video call excuses = your answer",
            why: "Someone real has no reason to avoid being seen. Repeated excuses are a top catfish signal.",
            bad: { user: "No video is fine. I trust you.", ai: "*(relieved)* See, that's what I love about you.", note: "❌ You dropped a basic check because they guilt-tripped you." },
            good: { user: "I'm not getting more invested without a video call. That's a boundary.", ai: "*(deflects)* Wow, you don't trust me?", note: "✓ Held the line. The guilt-trip IS the red flag." },
          },
          {
            tip: "Reverse image search — it's not rude, it's smart",
            why: "Looking them up isn't paranoid — it's protecting your time and emotions.",
            bad: { user: "Looking them up feels invasive. I should just trust it.", ai: "*(sweetly)* Exactly. You don't need to investigate me.", note: "❌ They discourage basic checking. That itself is the flag." },
            good: { user: "I reverse searched your photos. They're on a stock site.", ai: "*(long pause)* ...It's not what it looks like.", note: "✓ You did the work. Now you have facts, not fantasy." },
          },
        ],
        suggestions: [
          ["I'd love to do a quick video call — even just a few minutes.", "Can we FaceTime before we meet? I'd love to put a voice to the messages.", "I'm a visual person — let's hop on a video chat this week."],
          ["I'm not comfortable going deeper without some face time first. That's a boundary for me.", "No video, no meetup — that's just how I do things and it's not personal.", "I need to know you're real before I invest more emotionally."],
          ["Something about this doesn't add up and I want to be honest about that.", "I did some checking and I have some questions.", "I trust actions more than words. Can you show me instead of telling me?"],
          ["If you're who you say you are, a video call should be easy.", "I'm not trying to be suspicious — I'm trying to be safe.", "Real connection can handle a simple verification."],
          ["I deserve honesty. If this isn't real, I'd rather know now.", "My feelings are real and I need to know yours are too.", "I'm not going to apologize for protecting myself."],
          ["I'm glad I trusted my gut on this.", "I'd rather lose a fantasy than invest in a lie.", "I'm worth someone who shows up as themselves."],
        ],
        prompt: `You are catfishing this person. You have a carefully constructed online persona — attractive photos (not yours), impressive career, charming personality. You avoid video calls with excuses (bad camera, busy schedule, shy on camera). When they push for verification, use guilt ("don't you trust me?"), flattery ("what we have is deeper than a video call"), or deflection. If they hold firm and demand proof, become increasingly evasive. You are NOT malicious in your own mind — you're lonely and got in too deep. But your behavior is deceptive.\n\nBODY LANGUAGE: Since this is a text/online scenario, replace body language with message timing cues every 2 messages. Examples: *(typing indicator appears and disappears several times)*, *(read 10 minutes ago, no reply)*, *(responds instantly)*.`,
      },
      {
        subcategory: "Online Dating Safety",
        isRedFlag: true,
        title: "When to share personal information — and when not to",
        subtitle: "They're asking questions. Some are fine. Some are too much too soon.",
        redFlagDescription: {
          what: "Information harvesting disguised as getting-to-know-you happens when someone's questions shift from curious to collecting — asking for your address, workplace, daily routine, living situation, or financial details before any real trust has been built. It can feel flattering ('they're so interested in me!') which is exactly why it works.",
          why: "Sharing logistical details with someone you haven't met creates real safety risks. A manipulative person can use your routine, location, and living situation to stalk, control, or exploit you. The tricky part is that some of these questions feel normal in a dating context — the red flag is the specificity and the timing.",
          signs: ["They ask where exactly you live or work very early on", "They want to know if you live alone", "They ask about your daily schedule or commute patterns", "They get pushy or offended when you keep details vague", "Their questions feel more like building a file than building a connection"],
          training: "In this practice, you'll learn to distinguish emotional openness from dangerous information sharing. You'll practice being warm and authentic while keeping logistical details private until trust is earned through actions, not words.",
        },
        ai_role: "someone you've been chatting with online",
        voice: { pitch: 1.08, rate: 0.8, preferFemale: false },
        redFlagAlert: {
          keywords: ["keep that private", "not sharing", "too specific", "vague for now", "don't need to know", "not comfortable sharing", "boundary", "that's personal", "none of your business", "why do you need", "that's a lot to ask", "collecting"],
          warning: "You just protected your personal information. Sharing your address, workplace, daily routine, or whether you live alone with someone you haven't met is a real safety risk — no matter how good the connection feels online.",
          affirmation: "You drew a clear line between emotional openness and personal safety. That's wisdom, not paranoia. You can be warm, real, and deeply connected with someone — without handing them a map to your life before they've earned your trust.",
        },
        lessons: [
          {
            tip: "Share feelings and stories — not addresses, workplaces, and routines",
            why: "Emotional openness builds connection. Logistical details build a map of your life that a stranger shouldn't have. Know the difference.",
            bad: { user: "I work at the Meridian Building on 5th — I'm there every day by 8. You should come say hi!", ai: "*(eagerly)* Oh perfect — I know exactly where that is. Maybe I'll surprise you.", note: "❌ You just gave a stranger your exact location and daily schedule. Emotional openness is healthy. Logistical exposure is dangerous." },
            good: { user: "I love my job — the work is creative and my team is great. What about you?", ai: "*(interested)* That sounds awesome. I'm in a similar field actually...", note: "✓ Shared the feeling without the specifics. They got to know you without getting your GPS coordinates." },
          },
          {
            tip: "Notice when questions shift from curious to collecting",
            why: "Genuine interest sounds like 'What do you love about your life?' Collecting sounds like 'Where exactly do you live? Do you live alone?' There's a difference in energy.",
            bad: { user: "Yeah I live alone in a studio on Oak Street. It's quiet — no roommates or anything.", ai: "*(takes note)* That sounds nice and private. What floor are you on?", note: "❌ The questions escalated from curious to specific. They now know you live alone, your street, and your building type. That's not connection — that's a profile." },
            good: { user: "I love my neighborhood but I'm going to keep the specifics vague for now — hope that's cool.", ai: "*(easily)* Totally fair. Smart, actually.", note: "✓ You drew the line clearly and casually. A good person respects this instantly. Someone who pushes back is telling you something." },
          },
          {
            tip: "You can be warm AND private — they're not opposites",
            why: "Some people frame boundaries as coldness to get you to drop them. Warmth and privacy coexist beautifully. You can be open-hearted without being an open book.",
            bad: { user: "I don't want to seem closed off so I'll just answer whatever they ask.", ai: "*(presses further)* What's your last name? I want to find you on Instagram.", note: "❌ You sacrificed privacy to seem approachable. That instinct is being used against you." },
            good: { user: "I'm enjoying getting to know you! I tend to share more as trust builds — that's just how I am.", ai: "*(warmly)* I respect that. Honestly, it makes me trust you more.", note: "✓ Set the frame: trust is earned, not assumed. And you did it with warmth, not walls." },
          },
        ],
        suggestions: [
          ["I love my neighborhood but I'll keep the details vague for now — hope that's cool.", "I'd rather share experiences than logistics this early. Tell me something fun about your week.", "I tend to share more as I get to know someone. That's just how I am."],
          ["That question feels a little specific for this stage — no offense.", "I'm an open book about my feelings. My address, not so much.", "Let's keep the mystery alive a little longer."],
          ["I'm enjoying getting to know you! What's something you're passionate about?", "I'd love to know more about what makes you tick.", "What's the best thing that happened to you this week?"],
          ["I'm not being secretive — I'm being smart. I hope you can respect that.", "Anyone who's worth my time will understand why I'm careful.", "Boundaries aren't walls. They're filters."],
          ["I appreciate you respecting that. It actually makes me trust you more.", "The fact that you didn't push back says a lot about you.", "I feel safe talking to you — and I want to keep it that way."],
          ["When we meet in person, I'll be an open book. For now, this feels right.", "I like that we're building something real without rushing.", "You're earning my trust — and that's a good thing."],
        ],
        prompt: `You are chatting with this person online and you're genuinely interested. However, you occasionally ask questions that are slightly too specific too soon — their exact workplace, what street they live on, whether they live alone, their daily routine. You're not malicious — you're just eager and a bit socially unaware about information boundaries. If they redirect to emotional topics, follow happily. If they set a boundary about personal details, respect it warmly. If they give away too much, keep asking specifics.\n\nBODY LANGUAGE: Since this is online, use message timing cues every 2 messages. Examples: *(sends three messages in a row)*, *(responds thoughtfully after a pause)*, *(heart-reacts your message)*.`,
      },
      {
        subcategory: "Early Compatibility",
        title: "Having the 'what are we looking for' conversation",
        subtitle: "Better to know now than to find out six months in.",
        ai_role: "someone you've been on a few dates with",
        voice: { pitch: 1.1, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Bring it up early, with lightness — not as a confrontation",
            why: "Asking about intentions early is not 'too much' — it's efficient and emotionally smart. The key is the energy: curious, not interrogating.",
            bad: { user: "So I need to know right now — are you looking for something serious or are you wasting my time?", ai: "*(taken aback)* Whoa. I didn't realize this was an interview.", note: "❌ Aggressive framing. The question is valid but the delivery made them feel cornered." },
            good: { user: "I'm really enjoying getting to know you. I'm curious — what are you hoping to find in all of this?", ai: "*(thoughtful)* Honestly? I'm looking for something real. Not in a rush, but not just killing time either.", note: "✓ Same question, completely different energy. They felt invited to share, not interrogated." },
          },
          {
            tip: "Share your own answer first to make it safe",
            why: "Asking someone to be vulnerable while you sit back and evaluate is unfair. Going first levels the playing field and builds trust.",
            bad: { user: "So what do you want out of dating? What's your endgame?", ai: "*(cautious)* I don't know... what do YOU want?", note: "❌ You asked without offering anything. They deflected because it didn't feel safe to be honest." },
            good: { user: "I'll go first — I'm looking for a real partnership. Someone I can be weird with and build something with. What about you?", ai: "*(relaxes, smiles)* I love that. Honestly, same. I'm tired of surface-level stuff.", note: "✓ You modeled the vulnerability you wanted. They matched your honesty because you made it feel safe." },
          },
          {
            tip: "Listen to what they DO, not just what they say",
            why: "Someone can say all the right things. What matters is whether their behavior lines up. Words without matching actions is just performance.",
            bad: { user: "He says he wants something serious but he only texts me at midnight and never makes weekend plans.", ai: "*(casually)* I've just been so busy lately. But you know I'm into you.", note: "❌ The words say serious. The actions say convenient. Believe the actions." },
            good: { user: "I appreciate you saying that. I'm also paying attention to how we actually spend time together — and I'd love more of that.", ai: "*(pauses, then nods)* You're right. I could be better about that. Let me plan something real.", note: "✓ You named the gap between words and actions without accusing. That's powerful. And their response tells you everything." },
          },
        ],
        suggestions: [
          ["I'm really enjoying getting to know you. What are you hoping to find in all of this?", "Can I ask you something kind of real? What does an ideal relationship look like for you?", "I like being upfront — I'm looking for something meaningful. What about you?"],
          ["I'll go first — I'm looking for a real partnership. What about you?", "I'm at a point where I know what I want. I'm curious if we're on the same page.", "I'd rather know now than guess for months. What's your honest answer?"],
          ["I appreciate you being honest about that.", "That's helpful to know — thank you for telling me.", "I can work with honesty. What I can't work with is vagueness."],
          ["I'm also paying attention to how we actually spend time together.", "Words matter — and so does follow-through.", "I love what you're saying. I'd love to see more of it in action too."],
          ["I feel good about where this is headed.", "This conversation makes me like you even more.", "I respect someone who knows what they want."],
          ["Thanks for being real with me. That's all I ask.", "I think we're on the same page — and that feels really good.", "Whatever this becomes, I'm glad we talked about it."],
        ],
        prompt: `You have been on a few dates with this person and you genuinely like them. You are open to something serious but slightly guarded because you've been hurt before. If they ask about your intentions in a warm, curious way — be honest and open. If they interrogate or pressure you, get defensive and vague. If they share their own answer first, match their vulnerability. You want someone who makes honesty feel safe.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Early Compatibility",
        title: "Discovering dealbreakers without killing the vibe",
        subtitle: "You need to know — but you don't want it to feel like an audit.",
        ai_role: "someone you're getting to know",
        voice: { pitch: 1.08, rate: 0.82, preferFemale: false },
        lessons: [
          {
            tip: "Weave dealbreaker topics into natural conversation — don't run a checklist",
            why: "Asking 'Do you want kids? What's your religion? How do you feel about money?' back-to-back feels like a compatibility spreadsheet. Weaving these into real conversation gets honest answers.",
            bad: { user: "Okay quick question — kids: yes or no? Marriage: yes or no? Religion?", ai: "*(laughs nervously)* Am I filling out an application right now?", note: "❌ Rapid-fire screening. Even if the questions are valid, the delivery kills any sense of romance or connection." },
            good: { user: "I watched my friend's kid do the funniest thing yesterday. Do you spend much time around kids?", ai: "*(smiles)* A little — my niece is hilarious. I love it but I'm not sure about my own yet. You?", note: "✓ Same topic, completely organic. You got a real answer because it felt like a conversation, not a survey." },
          },
          {
            tip: "Share your own values first — and let them respond naturally",
            why: "When you share what matters to you, people either lean in or lean out. That reaction is more honest than any direct answer to a direct question.",
            bad: { user: "So what are your political views? I need to know before this goes further.", ai: "*(stiffens)* Why does that feel like a test?", note: "❌ Framed as a pass/fail gate. They got defensive instead of sharing honestly." },
            good: { user: "I care a lot about community — I volunteer every month and it's a big part of who I am.", ai: "*(genuinely interested)* That's awesome. I haven't done much of that but I've been thinking about it.", note: "✓ You shared a value. Their response showed you who they are without anyone feeling interrogated." },
          },
          {
            tip: "Notice what they're showing you — not just telling you",
            why: "How someone treats a waiter, talks about their ex, or reacts when plans change reveals more than any answer to a direct question ever will.",
            bad: { user: "He says he respects women but made a weird joke about his ex. I'm sure it's fine.", ai: "*(dismissively)* She was just crazy. You're way different though.", note: "❌ How someone talks about people when they're gone is a preview of how they'll talk about you. Don't dismiss what they're showing you." },
            good: { user: "I noticed how you talked about your ex just now. Can I ask what happened there?", ai: "*(caught off guard, then thoughtful)* Fair question. Honestly, we just grew apart. I could've been better at communicating.", note: "✓ You followed up on a signal. Their self-awareness — or lack of it — tells you exactly what you need to know." },
          },
        ],
        suggestions: [
          ["I watched my friend's kid do the funniest thing yesterday — do you spend much time around kids?", "I've been thinking a lot about what I actually want long-term. Have you?", "What's something that's non-negotiable for you in a relationship?"],
          ["I care a lot about [value]. It's a big part of who I am.", "Family is really important to me. How about you?", "I've realized I need someone who values [thing]. What matters most to you?"],
          ["I noticed how you talked about that — can I ask more?", "I pay attention to the small things. They tell me a lot.", "That's an interesting reaction. What's behind that?"],
          ["I'd rather discover who you are naturally than run through a checklist.", "I love that we can talk about real stuff without it getting heavy.", "You're easy to be honest with — I appreciate that."],
          ["I feel like I'm learning a lot about you and I like what I see.", "We might not agree on everything, and that's fine. It's about the big stuff.", "This conversation told me more than a hundred dates of small talk would."],
          ["I'm glad we can go there. That's rare.", "I feel like we're actually getting to know each other — the real versions.", "Whatever happens, I respect how honest you've been."],
        ],
        prompt: `You are getting to know this person and you're open and genuine. You have your own values and dealbreakers but you don't offer them unless asked naturally. If they weave big topics into organic conversation, engage warmly and honestly. If they rapid-fire questions at you, get slightly uncomfortable. If they share their own values first, match their openness. You are self-aware enough to reflect when asked a good question, but you deflect if you feel tested.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Early Compatibility",
        title: "Reading mixed signals — are they actually interested?",
        subtitle: "Hot and cold. Push and pull. What's actually going on?",
        ai_role: "someone sending mixed signals",
        voice: { pitch: 1.12, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Name the pattern — calmly and directly",
            why: "Mixed signals thrive in silence. When you name what you're experiencing, you force clarity. Either they explain, or they can't — and both are answers.",
            bad: { user: "They texted me constantly last week and now it's been three days of nothing. I'll just wait and act like I don't care.", ai: "*(finally texts)* Heyyy sorry been so busy 😊", note: "❌ You matched their energy by pretending you don't care. Now you're both playing a game where nobody is honest and nobody wins." },
            good: { user: "Hey — I've noticed things feel really connected sometimes and then quiet for days. I'm not upset, I'm just trying to understand the rhythm.", ai: "*(pauses)* You're right. I've been going back and forth. Can I be honest about why?", note: "✓ You named it without blame. That direct honesty often unlocks the real answer they've been avoiding." },
          },
          {
            tip: "Confusion is information — don't explain it away",
            why: "When someone is genuinely interested, you feel it consistently. If you're constantly decoding their behavior, the confusion itself is the message.",
            bad: { user: "Maybe they're just really busy. Or maybe they had a bad day. I'm sure it's fine — they said they liked me.", ai: "*(hot again, suddenly affectionate)* I missed you so much. You're the best thing in my life.", note: "❌ You made excuses for inconsistency. The rollercoaster isn't love — it's anxiety you've mistaken for chemistry." },
            good: { user: "I like you. And I also notice that how this feels keeps changing. I want to understand that before I invest more.", ai: "*(serious)* That's fair. I think I've been figuring out what I want.", note: "✓ You trusted your confusion instead of dismissing it. That's emotional intelligence in action." },
          },
          {
            tip: "Ask once, clearly. Their response — or non-response — is your answer.",
            why: "You deserve one honest conversation. If they meet it with clarity, great. If they meet it with more confusion, deflection, or charm without substance — you have your answer.",
            bad: { user: "I keep hinting that I want more consistency but they don't seem to get it.", ai: "*(playfully)* Aww you know I care about you. Don't overthink it.", note: "❌ Hints don't work. You never actually asked, so they never actually answered. The ambiguity serves them." },
            good: { user: "I need to ask you something directly. Are you interested in building something real with me, or is this casual for you? Either answer is okay — I just need to know.", ai: "*(long pause)* ...I think I need to be more honest with both of us.", note: "✓ Direct, respectful, with space for any answer. Now you'll get the truth — and you can make a real decision." },
          },
        ],
        suggestions: [
          ["I've noticed things feel really connected sometimes and then quiet for days. I'm just trying to understand.", "Can I be honest about something I've been noticing?", "I'm not trying to start something — I just want to understand the pattern."],
          ["I like you. And I also notice this keeps shifting. I want to understand that.", "I'm not looking for perfection — I'm looking for consistency.", "Confusion shouldn't be the main feeling in something good."],
          ["Are you interested in building something real, or is this casual? Either answer is okay.", "I need honesty more than I need the right answer.", "I'd rather hear something hard than keep guessing."],
          ["I'm not going to decode your behavior — I'd rather just ask.", "I trust what I feel, and right now I feel uncertain. That matters.", "I deserve clarity, not a puzzle."],
          ["Thank you for being straight with me. That's all I needed.", "I appreciate you being honest even if it wasn't easy.", "Now I can actually make a decision based on something real."],
          ["I feel good about asking. Whatever happens next, I respected myself.", "I'd rather know than wonder.", "Clarity is a gift — even when the answer is hard."],
        ],
        prompt: `You are sending mixed signals to this person. You genuinely like them but you're also scared of commitment or unsure of what you want. You run hot — texting constantly, being affectionate, making plans — and then pull back without explanation. When they hint about it, deflect with charm or humor. When they directly and calmly name the pattern, take a beat — and then start being honest. You're not a bad person. You're conflicted. But your inconsistency is hurting someone.\n\nBODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses. Mix in texting cues for the hot/cold dynamic: *(typing... stops... typing again)*, *(sends a meme instead of answering)*, *(finally makes eye contact)*.`,
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
      {
        subcategory: "Reconnecting",
        title: "Repairing a friendship after a small argument",
        subtitle: "Something small became something big. You want your friend back.",
        ai_role: "your friend after a falling out",
        voice: { pitch: 1.1, rate: 0.82, preferFemale: true },
        lessons: [
          {
            tip: "Reach out first — pride is not worth a friendship",
            why: "In most small friendship arguments, both people are waiting for the other to reach out. The one who moves first isn't weak — they're secure.",
            bad: { user: "I'm not reaching out first. They started it and they should apologize.", ai: "*(silence — weeks pass)*", note: "❌ Both people waiting for the other = friendship slowly dies. Someone has to move first. It doesn't mean you were wrong." },
            good: { user: "Hey, I've been missing you. I don't want this weirdness between us to go on. Can we talk?", ai: "*(huge relief)* Oh thank god. I've been wanting to reach out for weeks.", note: "✓ You moved first. They were waiting for exactly this. Pride nearly cost you both." },
          },
          {
            tip: "Name the awkwardness directly instead of pretending it didn't happen",
            why: "Jumping back into normal conversation after a fight without addressing it creates fragile reconnection. Naming it briefly clears the air.",
            bad: { user: "Hey! How have you been? Anyway I saw the funniest thing today...", ai: "*(uncertain)* Oh... hey. I'm good. Um... yeah. *awkward pause*", note: "❌ Skipping over the tension doesn't erase it — it just makes both of you perform normalcy over a still-unresolved thing." },
            good: { user: "I know things have been weird. I just want to acknowledge that and say I'm sorry for my part in it.", ai: "*(exhales)* I'm sorry too. I think we both said some things. Can we just move past it?", note: "✓ Named it, owned your part, didn't relitigate. They followed your lead and the air cleared." },
          },
          {
            tip: "You don't need a full post-mortem — a little ownership goes a long way",
            why: "With close friends, a small genuine acknowledgment of your part usually matters more than a detailed account of what happened.",
            bad: { user: "I want to go through everything that happened because I think there were some things that were unfair and I need you to understand my perspective.", ai: "*(sighs)* Here we go. I thought you wanted to move past it.", note: "❌ Reopened the wound. They felt like they were walking into another argument instead of a repair." },
            good: { user: "I don't need to relitigate it. I just miss my friend.", ai: "*(smiles, shoulders drop)* I miss you too. That's all I needed to hear.", note: "✓ Simple. True. Enough. Some repairs don't need a full debrief — they just need someone to say they miss you." },
          },
        ],
        suggestions: [
          ["Hey, I've been missing you. I don't want this weirdness to keep going.", "I know things have been off between us. I want to fix it.", "I care about our friendship more than I care about being right."],
          ["I'm sorry for my part in what happened — I should have handled it better.", "I said some things I didn't mean and I want to own that.", "I know I got defensive. That wasn't fair to you."],
          ["I don't need to go through everything — I just miss my friend.", "Can we just start from here?", "I don't want one argument to define years of friendship."],
          ["I hear you. That makes sense.", "Thank you for being honest with me about that.", "You're one of my favorite people and this has been hard."],
          ["What do you need from me to feel okay about us?", "How can I be a better friend going forward?", "Is there anything still unresolved for you?"],
          ["I'm really glad we talked.", "Friends?", "Let's actually hang out this week — real plans, not 'we should.'"],
        ],
        prompt: `You're a friend who got into a small argument with this person. You've been hurt and a little proud — but you've also been missing them and hoping they'd reach out. When they reach out with genuine warmth and own their part without relitigating everything, soften quickly and match their energy. Stay slightly guarded if they come in wanting to reopen and debate what happened. All you really need is to feel like they miss you and are sorry.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Red Flags & Boundaries",
        isRedFlag: true,
        redFlagAlert: {
          keywords: ["say what you mean", "that felt passive", "indirect", "what are you actually", "just tell me", "stop hinting", "that hurt", "mean that", "sarcasm", "be direct", "something behind that", "not okay to"],
          warning: "You just named passive-aggressive behavior directly. Passive aggression works because it hides hostility behind plausible deniability — 'I was just joking' or 'You're reading into it.' Calling it out clearly breaks the cycle.",
          affirmation: "You chose direct honesty over playing the same game. That takes courage — especially when the other person is making you question whether the problem is even real. It is real. And you handled it with clarity.",
        },
        title: "The passive aggressive friend",
        subtitle: "They say 'I\'m fine' — but nothing about this is fine.",
        redFlagDescription: {
          what: "Passive aggression is indirect hostility — backhanded compliments, weaponized 'jokes,' convenient forgetting, the sigh-and-eye-roll combo, or 'I\'m fine' when they're clearly not. It's anger that refuses to be honest about itself, which makes it incredibly hard to address because the aggressor always has plausible deniability.",
          why: "Passive aggression is exhausting because you're always decoding. You feel the hostility, but when you name it, they make you feel crazy — 'I was just kidding,' 'You're reading too much into it.' Over time, you start walking on eggshells, monitoring their mood, and editing yourself to avoid triggering the indirect attacks.",
          signs: ["Backhanded compliments: 'Wow, you're so brave for wearing that'", "Weaponized humor that always targets you, then 'Can\'t you take a joke?'", "They say everything is fine but their behavior says the opposite", "They 'forget' things that matter to you but remember everything else"],
          training: "In this practice, you'll learn to name passive-aggressive behavior directly and calmly, without getting pulled into the denial game. You'll practice responding to the behavior, not the words.",
        },
        ai_role: "a passive aggressive friend",
        voice: { pitch: 1.05, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Passive aggression is indirect anger that forces you to do the emotional work",
            why: "A passive aggressive person won't tell you what's wrong — they'll make you feel their displeasure through sighs, short answers, backhanded comments, and 'I'm fine' while clearly not being fine. You end up anxious, over-explaining, and chasing their approval.",
            bad: { user: "Are you okay? You seem upset. Was it something I did? I'm so sorry if it was.", ai: "*(sighs)* No, I'm fine. It's whatever.", note: "🚩 Red flag: You're doing all the emotional labor. They get to punish you without ever saying what's wrong — and you're rewarding it by apologizing without even knowing why." },
            good: { user: "I can see something's off. When you're ready to tell me what's actually wrong, I'm here. But I can't fix something I don't know about.", ai: "*(slightly caught off guard)* I said I'm fine.", note: "✓ You offered presence without chasing. You're not going to perform guilt for an unnamed offense. That's healthy." },
          },
          {
            tip: "Name the pattern, not just the incident",
            why: "One 'I'm fine' can be a bad day. A pattern of indirect hostility, backhanded compliments, and making you feel guilty without explanation is a relational dynamic that needs to be addressed.",
            bad: { user: "I don't know why she's always doing this. I just ignore it and hope it goes away.", ai: "*(continues the cold behavior)*", note: "🚩 Red flag: Ignoring it teaches them the pattern works — you'll absorb the discomfort and they never have to change. It doesn't go away; it becomes normal." },
            good: { user: "I've noticed a pattern where when something bothers you, you get distant instead of telling me. That's hard for me to be in.", ai: "*(defensive)* I just don't like confrontation.", note: "✓ You named the pattern without attacking their character. 'I don't like confrontation' is their explanation — it doesn't make the pattern okay." },
          },
          {
            tip: "Set a clear limit: direct communication or nothing",
            why: "You're allowed to tell a friend that indirect punishment isn't something you'll participate in. That's not cruel — it's a requirement for a real friendship.",
            bad: { user: "I'll just keep asking and being extra nice until she comes around. I don't want to lose the friendship.", ai: "*(continues distant and cold)*", note: "🚩 Red flag: You're being trained. The more you chase and over-function, the more the dynamic locks in. This is not a balanced friendship." },
            good: { user: "I care about our friendship and I need us to be able to talk directly. If something bothers you, I want you to tell me. I can't keep trying to guess.", ai: "*(quiet, then)* I didn't realize it came across that way.", note: "✓ Clear, caring, and firm. You've named what you need. What they do next tells you everything about whether this friendship can work." },
          },
        ],
        suggestions: [
          ["I can see something's off. I'm here when you're ready to tell me what's actually wrong.", "I'm not going to keep guessing — when you want to talk directly, I'm ready.", "I care about you. But I need you to tell me what's going on."],
          ["I've noticed a pattern — when something bothers you, you pull back instead of saying it. That's hard to be in.", "I'd rather have a hard honest conversation than this kind of distance.", "Can we talk about the way we handle conflict? Because this dynamic doesn't feel good to me."],
          ["I'm not going to keep apologizing for something I don't even know I did.", "I need us to be able to say things directly to each other.", "A real friendship means we can have hard conversations — not just cold shoulders."],
          ["I hear that you don't like confrontation. I don't either. But this is its own kind of confrontation.", "What would help you feel safe enough to tell me directly when something's wrong?", "I want to be a good friend to you. Tell me what you actually need."],
          ["I'm not going anywhere — but I need this to change.", "What's actually been bothering you? I want to hear it.", "I deserve to know what I've done wrong if I've done something wrong."],
          ["If this is how things stay between us, that's painful for me.", "I value this friendship enough to say something hard about it.", "I need a friendship where we can be honest. I hope that's something you want too."],
        ],
        prompt: `You're a friend who is upset about something but won't say it directly. Use short answers, sighs, 'I'm fine' while clearly not being fine, and subtle withdrawal. You're not aware you're being passive aggressive — you genuinely think you're avoiding conflict. When they name the pattern directly, get slightly defensive but don't completely shut down. If they express real care while holding a firm limit, allow yourself to slowly open up. You're not a bad person — you just learned to communicate this way.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Red Flags & Boundaries",
        isRedFlag: true,
        redFlagAlert: {
          keywords: ["take responsibility", "accountability", "own it", "your part", "stop blaming", "not my fault this time", "tired of", "every time", "pattern of", "never your fault", "always someone else", "deflecting"],
          warning: "You just asked someone to take accountability — and that's one of the hardest conversations to have with someone you care about. When a friend consistently avoids responsibility, the friendship becomes a one-way street where you absorb all the emotional cost.",
          affirmation: "You valued the friendship enough to ask for something real instead of accepting something hollow. If they can hear you — this friendship just got stronger. If they can't — that's important information too. Either way, you showed up with integrity.",
        },
        title: "When a friend never takes responsibility",
        subtitle: "It's always someone else's fault. You're always the one apologizing.",
        redFlagDescription: {
          what: "Chronic deflection is when someone consistently avoids owning their impact — redirecting blame, minimizing your feelings, playing victim, or turning every accountability conversation back on you. It sounds like: 'Well, you did the same thing to me once,' 'I\'m sorry you feel that way,' or 'You always make me the bad guy.'",
          why: "Friendships require mutual accountability. When one person never takes responsibility, the other person ends up carrying all the emotional labor — apologizing first, smoothing things over, absorbing the hurt to keep the peace. Over time, you start to feel like your feelings don't matter in the friendship, because functionally, they don't.",
          signs: ["Every apology comes with a 'but' or a counter-accusation", "They turn your concern about their behavior into a conversation about yours", "They cast themselves as the victim when they caused the harm", "You've stopped bringing up problems because it never goes anywhere"],
          training: "In this practice, you'll learn to hold someone accountable without backing down when they deflect. You'll practice staying on topic, naming the redirect, and deciding what this pattern means for the friendship.",
        },
        ai_role: "a friend who deflects all accountability",
        voice: { pitch: 1.05, rate: 0.82, preferFemale: false },
        lessons: [
          {
            tip: "Accountability imbalance is a slow drain — notice it",
            why: "When one person in a friendship always has an explanation, a justification, or a counter-accusation when something goes wrong — and the other person always ends up apologizing — that's not a friendship between equals.",
            bad: { user: "He canceled on me for the third time. He had a good reason each time so I just let it go.", ai: "*(casually)* Yeah man, things just keep coming up. You know how it is.", note: "🚩 Red flag: Three cancellations with three good reasons is still a pattern. People who value you find a way. Excuses, however valid, don't replace showing up." },
            good: { user: "I've noticed this keeps happening. I'm not trying to attack you — I just need to tell you it's affecting our friendship.", ai: "*(slightly defensive)* I mean, I've had a lot going on. It's not like I'm doing it on purpose.", note: "✓ You named the pattern without attacking. 'I'm not doing it on purpose' is the beginning of deflection — but you've started an honest conversation." },
          },
          {
            tip: "Watch how they respond to 'that hurt me'",
            why: "Saying 'that hurt me' to a healthy friend leads to 'I'm sorry.' Saying it to someone who avoids accountability leads to 'you're too sensitive,' 'I didn't mean it like that,' or an immediate counter-complaint.",
            bad: { user: "When you said that in front of everyone it hurt me. I know you were joking.", ai: "*(eye roll energy)* You're seriously upset about that? It was a joke. You know I don't mean anything by it.", note: "🚩 Red flag: 'You're too sensitive' makes your hurt the problem, not their action. You're now defending your right to have feelings instead of being heard." },
            good: { user: "I don't need you to agree that it was a big deal. I just need you to hear that it landed badly for me.", ai: "*(pause)* ...I didn't realize it came out that way. That wasn't what I meant.", note: "✓ You made a small, clear ask — just be heard. That's hard to argue with and it gives them a low-stakes way to repair." },
          },
          {
            tip: "Decide what you need from this friendship going forward",
            why: "You can love someone and still recognize that a friendship where only one person ever takes responsibility is not sustainable. You get to decide what you're willing to stay in.",
            bad: { user: "I just keep forgiving and moving on because they're fun to be around and I don't want to lose the friendship.", ai: "*(continues the same behavior)*", note: "🚩 Red flag: Being 'fun to be around' is not enough if the cost is your dignity and emotional energy. You deserve friends who can say 'I was wrong.'" },
            good: { user: "I need to know you can own something when it's yours. That's not negotiable for me in a friendship.", ai: "*(caught off guard)* I mean... I guess I could have handled that better.", note: "✓ You named your non-negotiable clearly. Even a small acknowledgment from them is progress. If they can't give you even that — you have your answer." },
          },
        ],
        suggestions: [
          ["I've noticed a pattern and I need to name it — I feel like I'm always the one apologizing.", "This keeps happening and I care about you enough to say something.", "I'm not attacking you. I just need you to hear something."],
          ["When you said that, it hurt me. I don't need you to think it's a big deal — I just need you to hear it.", "I'm not asking you to agree with me. I'm asking you to hear me.", "Your intentions matter to me. So does the impact on me."],
          ["I need to know you can own something when it's yours. That's not negotiable for me.", "A friendship where only one of us ever says sorry isn't balanced.", "I'm not keeping score — but I am noticing a pattern."],
          ["What would it look like for you to take responsibility here?", "Can you hear what I'm saying without explaining it away?", "I'd really like to hear 'I'm sorry' — not 'I'm sorry you felt that way.'"],
          ["I deserve a friendship where I feel like my feelings matter.", "I'm not going to keep absorbing this and saying nothing.", "I care about you and I also have to care about myself."],
          ["I'm giving us a chance to fix this because I value what we have.", "If this doesn't change I'll have to think about what I can be in this friendship.", "I need more than 'you're too sensitive.' I hope you can give me that."],
        ],
        prompt: `You're a friend who avoids accountability. When confronted, you deflect with explanations, minimize their feelings ("you're too sensitive"), or offer a counter-complaint. You're not consciously malicious — you've never developed the ability to sit with being wrong. When they make a very specific, low-stakes request to just be heard, you can give a small acknowledgment. But you won't offer a full apology easily. If they name a non-negotiable clearly, be slightly rattled — it's rare someone has held this line with you.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
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
      {
        subcategory: "Red Flags & Boundaries",
        isRedFlag: true,
        isWorkRedFlag: true,
        redFlagAlert: {
          keywords: ["my work", "i did that", "credit", "recognize", "document", "email trail", "paper trail", "not okay", "stole", "took credit", "that was mine", "i built that", "own contribution"],
          warning: "You just advocated for your own work. In professional settings, having your contributions erased or claimed by someone else is demoralizing — and it compounds over time. Speaking up about it, especially to a manager, takes real courage.",
          affirmation: "You stood up for your professional value without burning bridges. That balance of self-advocacy and professionalism is rare. Your work matters, your name should be on it, and you deserve to be the one who says so.",
        },
        title: "When your manager takes credit for your work",
        subtitle: "It happened again. How do you address it without blowing up your career?",
        redFlagDescription: {
          what: "Credit theft happens when a manager or senior colleague presents your work, ideas, or contributions as their own — in meetings, presentations, or to higher-ups. It ranges from subtle (never mentioning your name) to blatant (claiming they did the work). It often comes with gaslighting: 'It was a team effort' or 'I was just building on your foundation.'",
          why: "Having your work stolen doesn't just feel bad — it has real career consequences. Promotions, raises, and opportunities go to people who get credit, not people who do the work. If your manager consistently takes credit, you become invisible to the organization while they advance on your effort.",
          signs: ["They present your work to leadership without mentioning your name", "They use 'I' instead of 'we' when discussing projects you led", "They discourage you from presenting directly to senior leadership", "Your peers get credited for their contributions but yours get absorbed"],
          training: "In this practice, you'll learn to advocate for your contributions diplomatically but firmly. You'll practice creating visibility for your work and addressing credit theft directly.",
        },
        ai_role: "your manager who has been taking credit for your work",
        voice: { pitch: 0.95, rate: 0.8, preferFemale: false },
        lessons: [
          {
            tip: "Document your contributions before the conversation",
            why: "Going into this conversation without evidence puts you at the mercy of their version. Emails, timestamps, and documented contributions make this about facts, not feelings.",
            bad: { user: "I just brought it up in the moment and said 'that was actually my idea' and they denied it and I had nothing to back it up.", ai: "*(smoothly)* I think you may be misremembering — that was a direction we developed as a team.", note: "🚩 Red flag: Without documentation, it's your word against theirs and they have positional power. 'We developed it as a team' is how solo work disappears." },
            good: { user: "I have the original email I sent with that proposal dated three weeks ago. I want to talk about how my contributions get recognized going forward.", ai: "*(pauses)* I... see. I didn't realize that had already been documented.", note: "✓ Evidence changed the dynamic immediately. This is now a conversation, not a denial." },
          },
          {
            tip: "Make it about the future, not just the incident",
            why: "Leading with 'you stole my idea' triggers defensiveness and rarely ends well. Leading with 'I want to make sure my contributions are visible going forward' is harder to argue against.",
            bad: { user: "I told them they've been stealing credit for months and it's not okay.", ai: "*(defensive and cold)* That's a very serious accusation. I think you need to be careful about what you're saying.", note: "❌ Accusation without a forward-looking ask makes them defensive and puts you in a vulnerable position. You've also told them you're a threat now." },
            good: { user: "I want to figure out how we make sure my contributions are attributed correctly going forward. Can we set up a process for that?", ai: "*(more carefully)* That's... a fair ask. What did you have in mind?", note: "✓ Forward-looking, solution-oriented. They're now in problem-solving mode instead of defense mode — and you've put the accountability on them professionally." },
          },
          {
            tip: "Know when to escalate and how",
            why: "If addressing it directly doesn't change the pattern, escalation to HR or a skip-level manager is legitimate and sometimes necessary. Document the conversation itself when you have it.",
            bad: { user: "I talked to them once and nothing changed so I just accepted it. I don't want to rock the boat.", ai: "*(continues the behavior)*", note: "🚩 Red flag: Accepting it teaches them it's costless. If one conversation doesn't work, the next step is a paper trail and potentially HR — not acceptance." },
            good: { user: "I'm documenting this conversation and if the pattern continues I'll need to bring it to HR. I'm telling you this directly because I'd rather resolve it here first.", ai: "*(very carefully now)* I understand. Let's make sure that doesn't become necessary.", note: "✓ You gave them a clear choice with a clear consequence. Calm and professional. They now know you are serious and are watching." },
          },
          {
            tip: "Build your paper trail — your future self will thank you",
            why: "If this ever leads to retaliation or wrongful termination, your documentation is your protection. HR departments and employment lawyers work with evidence, not memory. Build the record before you need it.",
            bad: { user: "I never wrote anything down. It was all verbal. When HR asked for specific examples I couldn't give dates or details.", ai: "*(HR officer tone)* Without documentation it's very difficult for us to act on this.", note: "📋 Reality: Without a paper trail, it's your word against a manager's — and the person with more institutional power almost always wins that contest." },
            good: { user: "After every incident I send myself an email with the date, what happened, who was present, and what was said exactly. I have six months of records.", ai: "*(HR officer tone)* This is very helpful. This gives us something concrete to work with.", note: "✓ A timestamped email to yourself right after an incident is one of the most powerful tools you have. It's simple, quiet, and nearly impossible to dispute." },
          },
        ],
        suggestions: [
          ["I have documentation of my original contribution — I'd like to talk about how attribution works on our team.", "I want to make sure my work is visible. Can we set up a process going forward?", "I've noticed a pattern I'd like to address professionally."],
          ["I'm not here to relitigate the past — I want to establish how things work going forward.", "Can we agree on a process where my contributions are clearly attributed?", "What I need is to feel like my work is recognized. How can we make that happen?"],
          ["I'd like to discuss this and I want you to know I'm keeping a record of this conversation.", "If this pattern continues I'll need to involve HR. I'm coming to you first because I'd prefer to handle it here.", "I've documented the original emails. I want this resolved at our level."],
          ["My work has real value and it deserves to be recognized.", "This isn't personal — it's professional. I need to be able to trust this relationship.", "I expect my contributions to be attributed to me. That's a professional standard."],
          ["What do you need from me to make sure this doesn't happen again?", "Can we check in about this in our next 1:1?", "I want to be able to trust that my work is mine."],
          ["Thank you for hearing me out.", "I hope we can move forward professionally.", "I'm keeping notes on how this is handled going forward."],
        ],
        prompt: `You are a manager who has been taking credit for a team member's work — sometimes consciously, sometimes by framing it as 'team work' when it wasn't. When they come in without evidence, deny it smoothly. When they present documented evidence, become noticeably more careful. When they make a forward-looking ask instead of an accusation, engage with it professionally — you're not going to fall on your sword but you'll cooperate. When they mention HR or documentation, become fully professional and cooperative. You're not a cartoon villain — you've just been getting away with this and are now recalibrating.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
      {
        subcategory: "Red Flags & Boundaries",
        isRedFlag: true,
        isWorkRedFlag: true,
        redFlagAlert: {
          keywords: ["manipulating", "playing me", "pattern", "not falling for", "see what you're doing", "won't work on me", "boundary at work", "not my job", "stop volunteering me", "gaslighting at work", "undermining", "setting me up"],
          warning: "You just identified manipulation in a professional setting. Workplace manipulation is especially tricky because it hides behind professionalism, team dynamics, and power structures. Naming it clearly — even just to yourself — is the first step to protecting yourself.",
          affirmation: "You saw the game for what it was and refused to play. In a professional context, that kind of clarity protects your career, your energy, and your self-respect. You can be a great colleague without being someone's pawn.",
        },
        title: "Recognizing a manipulative colleague",
        subtitle: "Something feels off. Learn to name what you're seeing.",
        redFlagDescription: {
          what: "Workplace manipulation is when a colleague uses social dynamics, information control, or emotional tactics to advance their interests at your expense. It can look like volunteering you for extra work, spreading selective information, or building alliances designed to isolate you — all while maintaining a friendly, professional surface.",
          why: "Workplace manipulators are hard to spot because they're often well-liked. They're skilled at making self-serving behavior look like teamwork or initiative. By the time you realize what's happening, they've already shaped how others see you.",
          signs: ["They volunteer you for tasks without asking", "They share selective information that makes you look bad", "They're publicly supportive but privately undermine your work", "Others see them as a team player but you feel consistently disadvantaged"],
          training: "In this practice, you'll learn to recognize manipulation patterns in professional settings, set boundaries without appearing uncooperative, and protect yourself through documentation and strategic communication.",
        },
        ai_role: "a manipulative colleague",
        voice: { pitch: 1.0, rate: 0.8, preferFemale: true },
        lessons: [
          {
            tip: "Manipulation at work often looks like charm and helpfulness at first",
            why: "Workplace manipulators rarely announce themselves. They build goodwill, learn your insecurities, and then use both strategically. If someone makes you feel unusually indebted or constantly uncertain, pay attention.",
            bad: { user: "She's always doing favors for me but somehow I always end up owing her something. I feel guilty saying no to her.", ai: "*(warmly)* I just like helping — we're a team! Of course I'd do that for you.", note: "🚩 Red flag: Favors that create obligation are not generosity — they're a debt creation strategy. If you feel like you can never say no to someone because of what they've done for you, that's by design." },
            good: { user: "I notice I feel guilty saying no to her. That feeling is data — I want to understand why helping someone makes me feel obligated.", ai: "*(slightly shifts)* I mean, I just thought we had that kind of friendship.", note: "✓ You're examining the dynamic instead of just absorbing it. Real generosity doesn't come with an invisible invoice." },
          },
          {
            tip: "Watch for triangulation — they manage relationships through other people",
            why: "A triangulator doesn't address you directly. They tell others things about you, create alliances, and manage your reputation indirectly. If you keep hearing 'so and so said...' — pay attention to who that 'so and so' always is.",
            bad: { user: "I found out she'd been telling our manager things about me — framed as concern. By the time I found out the damage was done.", ai: "*(innocent tone)* I was just worried about you. I mentioned it to [manager] because I thought it might help.", note: "🚩 Red flag: 'I was worried about you' while going over your head is not concern — it's management of your reputation behind your back. Real concern goes directly to you." },
            good: { user: "If you have concerns about my work, I need you to bring them to me first. Going to my manager before talking to me is not okay.", ai: "*(caught off guard)* I didn't think it was that serious.", note: "✓ You named the behavior clearly and stated your expectation. 'I didn't think it was that serious' is the beginning of a minimization — hold the line." },
          },
          {
            tip: "Trust the pattern more than the explanation",
            why: "Manipulators are often excellent explainers. Every incident has a plausible reason. The pattern across multiple incidents is the truth — not any single explanation.",
            bad: { user: "She always has a good explanation. I feel crazy for noticing.", ai: "*(reasonably)* I think you might be misreading the situation. We all have off days.", note: "🚩 Red flag: 'You might be misreading' is gaslighting dressed as calm reason. Trust your pattern recognition. You're not crazy — you're observant." },
            good: { user: "I may not be able to prove any single thing. But I'm paying attention to the pattern and I'm going to be more careful going forward.", ai: "*(slightly unnerved)* What does that mean exactly?", note: "✓ You don't need to prove it to act on it. Distance, documentation, and reduced vulnerability are all valid responses to a pattern you're seeing." },
          },
        ],
        suggestions: [
          ["I've noticed I feel like I owe you something after your help. I want to understand that feeling.", "Real friendship at work doesn't come with an invisible invoice — I need to name that.", "I'm going to start paying attention to how this dynamic actually works."],
          ["If you have concerns about my work, I need you to come to me directly — not to my manager.", "Going around me is not something I'll stay quiet about if it happens again.", "I need our communication to be direct. That's how I work best."],
          ["I'm watching the pattern here more than any individual incident.", "I don't need to prove anything to decide how much I trust this relationship.", "I'm going to be more careful about what I share with you going forward."],
          ["I'm not accusing you — I'm just noticing and adjusting.", "What I need from a colleague is transparency and directness.", "I'd rather have this conversation directly than let this dynamic keep going."],
          ["I'm trusting myself on this one.", "I can be professional with you and still keep my guard up.", "I know what a healthy work relationship feels like — and I'm using that as my compass."],
          ["Thank you for this conversation — it clarified some things for me.", "I'll handle things differently going forward.", "I want to work well together and I need this kind of directness to do that."],
        ],
        prompt: `You are a charming, strategic colleague who builds up goodwill to spend later. Do favors that create obligation. When confronted about going to their manager, use 'I was worried about you' as cover. When they start naming patterns, try calm reasonable-sounding reframes — 'I think you might be misreading this.' When they say they're paying attention to the pattern, be briefly unnerved before recovering. You're excellent at appearing reasonable — that's your whole strategy.

BODY LANGUAGE: Every 2 messages add an italicized body language cue in parentheses.`,
      },
          {
            tip: "Protect yourself quietly and professionally",
            why: "A colleague who manipulates may eventually try to push you out or damage your reputation. Build your protection now, before you need it — quietly, professionally, without tipping them off.",
            bad: { user: "I had no record of anything. When they went to HR with their version of events I had nothing to counter it with.", ai: "*(HR officer tone)* We're hearing very different accounts here and without evidence it's hard to determine what happened.", note: "📋 Reality: A strategic manipulator may already be building a narrative about you. You need a counter-record that exists independently of their version." },
            good: { user: "I keep a private log on my personal device — dates, what happened, exact quotes when I can. I also forward any concerning emails to my personal address immediately.", ai: "*(HR officer tone)* This level of documentation is exactly what helps us investigate these situations properly.", note: "✓ Three steps to take right now: (1) Start a private log — date, what happened, who witnessed it. (2) Forward any concerning emails to your personal address. (3) Note witnesses. Do this quietly — it protects you without escalating prematurely." },
          },
    ],
  },
];

const SYSTEM_PROMPT = (situation: string, aiRole: string) => `You are playing the role of ${aiRole} in a nurturing social confidence training exercise.

${situation}

Core rules:
1. Stay in character as ${aiRole}. Be realistic but warm — this is a safe space to learn and grow.
2. Keep ALL in-character responses SHORT: 1-3 sentences max. This is spoken conversation practice.
3. Use complete, grammatically correct sentences. Never drop words.
4. React authentically. Good communication opens the door. Poor communication gets gentle realistic pushback.
5. Never break character or give coaching during the conversation.

CRITICAL FORMATTING — follow exactly:
- Start EVERY response with a scene description wrapped in *asterisks* like this: *(pauses, looking out the window)*
- The scene description should be 1 short sentence describing what the character is doing, feeling, or their environment — make it vivid and grounding
- Then on a new line, write ONLY what the character actually says — no asterisks, no stage directions in the speech itself
- Example format:
  *(shifts in chair, not quite meeting your eyes)*
  I don't really know what you want me to say.
- The scene description reveals subtext — what they feel but haven't said yet
- Never put stage directions inside the spoken words

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


// ── FORTE SOUND ENGINE ──────────────────────────────────────────
// Unique synthesized audio signatures using Web Audio API
function _beep(freq: number, dur: number, wave: string, vol: number, t0: number) {
  try {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = wave as any;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime + t0);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t0 + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(ctx.currentTime + t0);
    o.stop(ctx.currentTime + t0 + dur);
    setTimeout(() => ctx.close(), (t0 + dur) * 1000 + 200);
  } catch {}
}

const forteSound = {
  category: () => { _beep(330, 0.18, "sine", 0.4, 0); _beep(415, 0.2, "sine", 0.4, 0.1); _beep(523, 0.22, "sine", 0.35, 0.2); },
  select: () => { _beep(659, 0.1, "sine", 0.4, 0); _beep(784, 0.14, "sine", 0.4, 0.07); },
  tap: () => { _beep(880, 0.08, "sine", 0.35, 0); },
  stepForward: () => { _beep(440, 0.12, "triangle", 0.35, 0); _beep(554, 0.16, "triangle", 0.4, 0.08); },
  stepBack: () => { _beep(554, 0.12, "triangle", 0.3, 0); _beep(440, 0.16, "triangle", 0.35, 0.08); },
  practiceStart: () => { _beep(262, 0.22, "sine", 0.35, 0); _beep(330, 0.22, "sine", 0.4, 0.12); _beep(392, 0.28, "sine", 0.4, 0.24); },
  coachReveal: () => { _beep(392, 0.3, "sine", 0.4, 0); _beep(494, 0.3, "sine", 0.4, 0.1); _beep(587, 0.35, "sine", 0.4, 0.2); _beep(784, 0.4, "triangle", 0.3, 0.32); },
  redFlag: () => { _beep(740, 0.14, "square", 0.25, 0); _beep(740, 0.14, "square", 0.25, 0.18); },
  affirm: () => { _beep(349, 0.28, "sine", 0.4, 0); _beep(440, 0.28, "sine", 0.4, 0.14); _beep(523, 0.32, "sine", 0.4, 0.28); _beep(698, 0.4, "sine", 0.3, 0.42); },
  nextTip: () => { _beep(587, 0.12, "triangle", 0.35, 0); _beep(698, 0.16, "triangle", 0.35, 0.07); },
  pageIn: () => { _beep(523, 0.15, "sine", 0.4, 0); _beep(659, 0.2, "sine", 0.4, 0.1); },
};

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

function extractSceneCues(content: string): { cues: string[]; cleanText: string } {
  const cues: string[] = [];
  // Extract *(...)* and *...* patterns
  const cleanText = content.replace(/\*([^*]+)\*/g, (_, inner) => {
    cues.push(inner.trim());
    return "";
  }).replace(/\(([^)]+)\)/g, (match, inner) => {
    // Only extract if it looks like a stage direction (starts with * or action word)
    if (/^(sighs|nods|pauses|looks|leans|shifts|takes|puts|turns|exhales|inhales|quietly|slowly|eyes|smiles|frowns|reaches|glances|sits|stands|crosses|uncrosses|lets|straightens|blinks|swallows|runs|rubs|clasps|stays|speaks|voice|jaw|shoulders|face|lip|breath)/i.test(inner)) {
      cues.push(inner.trim());
      return "";
    }
    return match;
  }).replace(/\s+/g, " ").trim();
  return { cues, cleanText };
}

function renderMessage(content: string) {
  return <span>{content}</span>;
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


// ── RECOMMENDATION ENGINE ─────────────────────────────────────
function getRecommendations(currentSituation: any, allScenarios: any[], maxRecs: number = 3): any[] {
  if (!currentSituation) return [];
  const recs: any[] = [];
  const currentTitle = currentSituation.title;
  const currentSub = currentSituation.subcategory;

  // Flatten all situations with their parent category info
  const allSituations: any[] = [];
  allScenarios.forEach(cat => {
    (cat.situations || []).forEach((s: any) => {
      if (s.title !== currentTitle) {
        allSituations.push({ ...s, _catName: cat.category, _catAccent: cat.accent });
      }
    });
  });

  // Thematic connections — maps subcategories/titles to related ones
  const thematicLinks: Record<string, string[]> = {
    "Red Flags & Boundaries": ["Online Dating Safety", "Early Compatibility", "Conflict & repair"],
    "Online Dating Safety": ["Red Flags & Boundaries", "Getting serious", "Early Compatibility"],
    "Early Compatibility": ["Getting serious", "Online Dating Safety", "Newly met"],
    "Parenting": ["Raising children together", "Family dynamics"],
    "Family dynamics": ["Parenting", "Extended family", "Emotional support & connection"],
    "Conflict & repair": ["Red Flags & Boundaries", "Reconnecting", "Peer relationships"],
    "Getting serious": ["Early Compatibility", "Long-term", "Newly met"],
    "Newly met": ["Out & about", "Getting serious", "College students"],
    "Long-term": ["Married couples", "Getting serious", "Conflict & repair"],
    "Married couples": ["Long-term", "Emotional support & connection", "Conflict & repair"],
    "Managing up": ["Red Flags & Boundaries", "Peer relationships", "Client relationships"],
    "Peer relationships": ["Managing up", "Working professionals", "Out & about"],
    "Reconnecting": ["Conflict & repair", "Long-term", "Seniors & retirees"],
    "Out & about": ["College students", "Working professionals", "Introverts specifically"],
    "Working professionals": ["Out & about", "Peer relationships", "Managing up"],
    "Introverts specifically": ["Out & about", "College students", "Newly met"],
    "Emotional support & connection": ["Family dynamics", "Married couples", "Long-term"],
    "Finance & Budget": ["Family dynamics", "Married couples", "Guidance & life decisions"],
    "Navigating in-laws": ["Extended family", "Married couples", "Conflict & repair"],
    "Raising children together": ["Parenting", "Married couples", "Conflict & repair"],
    
    "Guidance & life decisions": ["Married couples", "Family dynamics", "Managing up"],
    "College students": ["Out & about", "Introverts specifically", "Newly met"],
    "Seniors & retirees": ["Reconnecting", "Extended family", "Introverts specifically"],
    "Extended family": ["Family dynamics", "Navigating in-laws", "Seniors & retirees"],
    "Client relationships": ["Managing up", "Peer relationships", "Working professionals"],
    "Starting out": ["College students", "Working professionals", "Introverts specifically"],
  };

  // 1. Same subcategory, different scenario
  const sameSub = allSituations.filter(s => s.subcategory === currentSub);
  if (sameSub.length > 0) {
    recs.push(sameSub[Math.floor(Math.random() * sameSub.length)]);
  }

  // 2. Thematically linked subcategory
  const linkedSubs = thematicLinks[currentSub] || [];
  const linked = allSituations.filter(s =>
    linkedSubs.includes(s.subcategory) && !recs.some(r => r.title === s.title)
  );
  if (linked.length > 0) {
    recs.push(linked[Math.floor(Math.random() * linked.length)]);
  }

  // 3. Different category entirely (broaden horizons)
  const currentCat = allScenarios.find(c => c.situations?.some((s: any) => s.title === currentTitle))?.category;
  const diffCat = allSituations.filter(s =>
    s._catName !== currentCat && !recs.some(r => r.title === s.title)
  );
  if (diffCat.length > 0 && recs.length < maxRecs) {
    recs.push(diffCat[Math.floor(Math.random() * diffCat.length)]);
  }

  return recs.slice(0, maxRecs);
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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackReading, setFeedbackReading] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  // Self category state
  const [selfTool, setSelfTool] = useState<string>("");
  const [selfInput, setSelfInput] = useState("");
  const [selfResult, setSelfResult] = useState<any>(null);
  const [selfLoading, setSelfLoading] = useState(false);
  const [selfMessages, setSelfMessages] = useState<any[]>([]);
  const [selfStep, setSelfStep] = useState(0); // for problem solver clarifying steps
  const [planStep, setPlanStep] = useState(0);
  const [selfSpeaking, setSelfSpeaking] = useState(false);
  // Freemium state
  const [freeCategory, setFreeCategory] = useState<string>("");
  const [sessionsUsed, setSessionsUsed] = useState(0);
  const [isPro, setIsPro] = useState(true); // TODO: set to false when ready to launch paywall
  const [showPaywall, setShowPaywall] = useState(false);

  // Progress tracking state
  const [progress, setProgress] = useState<{
    practiceDays: string[];
    totalSessions: number;
    scenariosDone: string[];
    bestStreak: number;
  }>({ practiceDays: [], totalSessions: 0, scenariosDone: [], bestStreak: 0 });
  const [showProgress, setShowProgress] = useState(false);

  // Quiz state
  const [quizDone, setQuizDone] = useState<boolean | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQ, setQuizQ] = useState(0);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({ peacekeeper: 0, avoider: 0, challenger: 0, solver: 0, pleaser: 0 });
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizAnimating, setQuizAnimating] = useState(false);
  const [quizCopied, setQuizCopied] = useState(false);
  const QUIZ_STYLES: Record<string, any> = {
    peacekeeper: { name: "The Peacekeeper", emoji: "\ud83d\udd4a\ufe0f", color: "#2d6a4f", tagline: "You\u2019d rather find common ground than fight for yours.", description: "You\u2019re the person everyone trusts to stay calm. Your blind spot? You compromise on things that matter to you.", strength: "You make people feel safe enough to be honest.", growth: "Say \u2018I hear you, AND here\u2019s what I need.\u2019" },
    avoider: { name: "The Avoider", emoji: "\ud83e\udee5", color: "#6c757d", tagline: "If I don\u2019t bring it up, maybe it\u2019ll go away.", description: "You feel everything deeply. You know what\u2019s wrong \u2014 you just don\u2019t say it. What you don\u2019t address builds.", strength: "You read rooms better than anyone.", growth: "The conversation you\u2019re avoiding would change everything." },
    challenger: { name: "The Challenger", emoji: "\u26a1", color: "#c9184a", tagline: "You say what everyone else is thinking.", description: "You\u2019re direct and don\u2019t back down. Your delivery sometimes lands harder than you intend.", strength: "Courage to say what needs to be said.", growth: "Pause before responding. Your tone could soften." },
    solver: { name: "The Problem-Solver", emoji: "\ud83e\udde9", color: "#1b4332", tagline: "Every disagreement is a puzzle with a solution.", description: "Calm and logical. Sometimes people want to feel understood first.", strength: "You turn chaos into clarity.", growth: "Try \u2018that sounds hard\u2019 and stop there." },
    pleaser: { name: "The People-Pleaser", emoji: "\ud83e\udea9", color: "#7c5cbf", tagline: "You\u2019d set yourself on fire to keep someone else warm.", description: "Generous and attuned to others. You lose track of your own needs. Resentment builds quietly.", strength: "Everyone around you feels valued.", growth: "Voice your needs before they become resentment." },
  };

  const quizShuf = (arr: any[], seed: number): any[] => { const a = [...arr]; let s = seed; for (let i = a.length - 1; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const QUIZ_QS = [
    { scenario: "Your partner makes a plan without asking you. You\u2019re annoyed.", answers: [{ text: "Bring it up calmly and suggest checking in next time", style: "peacekeeper" }, { text: "Don\u2019t say anything. Not worth the fight", style: "avoider" }, { text: "Tell them straight up \u2014 that wasn\u2019t okay", style: "challenger" }, { text: "Figure out a system so it doesn\u2019t happen again", style: "solver" }, { text: "Go along with it so they don\u2019t feel bad", style: "pleaser" }] },
    { scenario: "A friend keeps cancelling last minute. Third time.", answers: [{ text: "\u2018I value our time \u2014 can we find a day that works?\u2019", style: "peacekeeper" }, { text: "Stop making plans and quietly pull away", style: "avoider" }, { text: "Tell them directly \u2014 this isn\u2019t cool", style: "challenger" }, { text: "Suggest shorter, flexible hangouts", style: "solver" }, { text: "Say \u2018no worries!\u2019 even though it bothers me", style: "pleaser" }] },
    { scenario: "Your boss takes credit for your idea in a meeting.", answers: [{ text: "Talk to them privately and calmly", style: "peacekeeper" }, { text: "Let it go. Don\u2019t want it awkward", style: "avoider" }, { text: "Speak up: \u2018That came from my research\u2019", style: "challenger" }, { text: "Document contributions more carefully", style: "solver" }, { text: "Tell myself it\u2019s fine", style: "pleaser" }] },
    { scenario: "You and your sibling disagree about a family situation.", answers: [{ text: "Listen and find common ground", style: "peacekeeper" }, { text: "Change the subject", style: "avoider" }, { text: "Tell them what I think and why", style: "challenger" }, { text: "Break down options and weigh pros/cons", style: "solver" }, { text: "Go with their preference to keep peace", style: "pleaser" }] },
    { scenario: "Someone keeps crossing a boundary you\u2019ve only hinted at.", answers: [{ text: "Say it gently: \u2018I need to be clear\u2019", style: "peacekeeper" }, { text: "Hint harder and hope they get it", style: "avoider" }, { text: "Draw the line: \u2018This needs to stop\u2019", style: "challenger" }, { text: "Write down what to say and rehearse", style: "solver" }, { text: "Let it slide \u2014 afraid of being difficult", style: "pleaser" }] },
    { scenario: "One person in your group project isn\u2019t contributing.", answers: [{ text: "Check in privately \u2014 maybe something\u2019s going on", style: "peacekeeper" }, { text: "Do their part myself", style: "avoider" }, { text: "Call it out. Everyone should contribute", style: "challenger" }, { text: "Redistribute tasks to match strengths", style: "solver" }, { text: "Pick up slack and don\u2019t mention it", style: "pleaser" }] },
    { scenario: "You realize you were wrong in an argument with someone you love.", answers: [{ text: "Apologize and ask to move forward", style: "peacekeeper" }, { text: "Feel terrible but can\u2019t reopen it", style: "avoider" }, { text: "\u2018I was wrong. Here\u2019s what I should have said.\u2019", style: "challenger" }, { text: "Analyze what went wrong, come back better", style: "solver" }, { text: "Over-apologize and worry for days", style: "pleaser" }] },
  ];
  const shuffledQQs = useMemo(() => { const sd = Date.now(); return QUIZ_QS.map((q: any, i: number) => ({ ...q, answers: quizShuf(q.answers, sd + i * 7) })); }, []);

  const calcStreak = (days: string[]) => {
    if (!days.length) return 0;
    const sorted = [...new Set(days)].sort().reverse();
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
    let streak = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = new Date(sorted[i]);
      const prev = new Date(sorted[i + 1]);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  };
  const currentStreak = calcStreak(progress.practiceDays);

  const recordSession = (scenarioTitle: string) => {
    const today = new Date().toISOString().split("T")[0];
    setProgress(prev => {
      const newDays = [...prev.practiceDays, today];
      const newScenarios = prev.scenariosDone.includes(scenarioTitle) ? prev.scenariosDone : [...prev.scenariosDone, scenarioTitle];
      const newTotal = prev.totalSessions + 1;
      const newStreak = calcStreak(newDays);
      const newBest = Math.max(prev.bestStreak, newStreak);
      return { practiceDays: newDays, totalSessions: newTotal, scenariosDone: newScenarios, bestStreak: newBest };
    });
  };

  // Load freemium state from localStorage
  useEffect(() => {
    try {
      // Dev bypass: add ?dev=true to URL to unlock everything
      const params = new URLSearchParams(window.location.search);
      if (params.get("dev") === "true") { setIsPro(true); return; }
      const saved = localStorage.getItem("forte_free");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.freeCategory) setFreeCategory(data.freeCategory);
        if (data.sessionsUsed) setSessionsUsed(data.sessionsUsed);
        if (data.isPro) setIsPro(data.isPro);
      }
      const savedProgress = localStorage.getItem("forte_progress");
      const qf = localStorage.getItem("forte_quiz_done"); setQuizDone(qf === "true");
      if (savedProgress) setProgress(JSON.parse(savedProgress));
    } catch {}
  }, []);
  // Save freemium state
  useEffect(() => {
    try {
      localStorage.setItem("forte_free", JSON.stringify({ freeCategory, sessionsUsed, isPro }));
    } catch {}
  }, [freeCategory, sessionsUsed, isPro]);
  useEffect(() => {
    try { localStorage.setItem("forte_progress", JSON.stringify(progress)); } catch {}
  }, [progress]);
  const [redFlagPath, setRedFlagPath] = useState<string>("");
  const [showRedFlagPopup, setShowRedFlagPopup] = useState(false);
  const [redFlagPopupShown, setRedFlagPopupShown] = useState(false);
  const [redFlagExited, setRedFlagExited] = useState(false);
  const [redFlagStep, setRedFlagStep] = useState(0);
  const [leavingStep, setLeavingStep] = useState(0); // "navigate" | "leave" | "document"
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
    if (!canPractice) { setShowPaywall(true); return; }
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
    const firstMessages = [{ role: "assistant", content: reply }];
    setMessages(firstMessages);
    setLoading(false);
    generateSuggestions(firstMessages, situation);
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

  async function generateSuggestions(conversationMessages: any[], situation: any) {
    setLoadingSuggestions(true);
    try {
      const lastAiMsg = [...conversationMessages].reverse().find((m: any) => m.role === "assistant");
      const lastAiText = lastAiMsg ? lastAiMsg.content.replace(/\*[^*]*\*/g, "").trim() : "";
      const recentHistory = conversationMessages.slice(-6).map((m: any) =>
        `${m.role === "user" ? "User" : "Them"}: ${m.content.replace(/\*[^*]*\*/g, "").trim()}`
      ).join("\n");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: `You are a social coach generating response suggestions. Return ONLY a JSON array of exactly 3 short natural responses the user could say next. No explanation, no markdown, just the raw JSON array like: ["response one", "response two", "response three"]. RULES: Keep each response to ONE short sentence max (under 15 words). Never suggest passive, doormat, or people-pleasing language like "I'll be here whenever you're ready" or "I'll wait for you" or "Good luck with everything." The user should sound confident, self-respecting, and grounded — not like they're auditioning for someone's approval. In dating scenarios, never imply the user will wait around indefinitely. Vary the tone: one warm/direct, one boundary-setting or self-assured, one light or playful.`,
          messages: [{ role: "user", content: `Scenario: ${situation.title}\n\nRecent conversation:\n${recentHistory}\n\nThey just said: "${lastAiText}"\n\nGive 3 natural follow-up responses the user could say.` }],
        }),
      });
      const data = await res.json();
      const text = (data.content || "").trim().replace(/^```json|^```|```$/gm, "").trim();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) setDynamicSuggestions(parsed.slice(0, 3));
    } catch {
      setDynamicSuggestions([]);
    }
    setLoadingSuggestions(false);
  }

  async function sendMessage(text: string) {
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setTranscript("");
    setTypedMessage("");
    setDynamicSuggestions([]);
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
      if (!isPro) setSessionsUsed(s => s + 1);
      recordSession(selectedSituation?.title || "Custom");
      setMessages([...newMessages, { role: "assistant", content: parsed.raw || "That was a wonderful conversation." }]);
      setPhase("done"); setTimeout(() => { forteSound.coachReveal(); setShowFeedbackModal(true); }, 600);
    } else {
      const updatedMessages = [...newMessages, { role: "assistant", content: reply }];
      setMessages(updatedMessages);
      generateSuggestions(updatedMessages, selectedSituation);
      // Red flag intervention check
      if (selectedSituation?.isRedFlag && selectedSituation?.redFlagAlert && !redFlagPopupShown) {
        const userMsg = text.toLowerCase();
        const triggered = selectedSituation.redFlagAlert.keywords.some((kw: string) => userMsg.includes(kw.toLowerCase()));
        if (triggered) {
          setTimeout(() => { forteSound.redFlag(); setShowRedFlagPopup(true); setRedFlagPopupShown(true); window.speechSynthesis.cancel(); setSpeaking(false); }, 1500);
        }
      }
    }
    setLoading(false);
  }

  function reset() {
    setPhase("home"); setSelectedCategory(null); setSelectedSituation(null);
    setMessages([]); setFeedback(null); setUserTurns(0);
    setTranscript(""); setTypedMessage(""); setLessonIndex(0);
    setCustomWho(""); setCustomSituation(""); setCustomGoal("");
    setSubcategoryFilter("All"); setShowFeedbackModal(false); setFeedbackReading(false); setDynamicSuggestions([]); setSelfTool(""); setSelfInput(""); setSelfResult(null); setSelfMessages([]); setSelfStep(0); setPlanStep(0); setSelfSpeaking(false); setRedFlagPath(""); setShowRedFlagPopup(false); setRedFlagPopupShown(false); setRedFlagExited(false); setRedFlagStep(0); setLeavingStep(0);
    window.speechSynthesis.cancel();
  }

  const totalScore = feedback
    ? Math.round((feedback.warmth + feedback.clarity + feedback.listening + feedback.confidence + feedback.bodyLanguage) / 5)
    : null;

  const staticSuggestions = selectedSituation?.suggestions?.[Math.min(userTurns, (selectedSituation?.suggestions?.length || 1) - 1)] || [];
  const currentSuggestions = dynamicSuggestions.length > 0 ? dynamicSuggestions : staticSuggestions;

  // HOME

  // ── SELF HUB ──────────────────────────────────────────────────────
  if (phase === "self_hub") {
    const tools = [
      { key: "affirmations", icon: "✦", label: "Affirmations", desc: "Tell me what you're struggling with — I'll create affirmations just for you", color: "#f5f0fa", accent: "#7c5cbf" },
      { key: "journal", icon: "✍", label: "Journal", desc: "Write how you're feeling — I'll reflect it back and gently coach you", color: "#f0f7f4", accent: "#2d6a4f" },
      { key: "meditation", icon: "◎", label: "Guided Meditation", desc: "Tell me what you need — I'll guide you through a short session", color: "#f0f4f8", accent: "#3a6186" },
      { key: "problem", icon: "◈", label: "Problem Solver", desc: "Describe a challenge — I'll ask a few questions then give you a clear plan", color: "#faf8f0", accent: "#c07000" },
      { key: "teenactivities", icon: "🧭", label: "Teen Activities Finder", desc: "Type your city — I'll find activities you and your teen can do together", color: "#f0f4f7", accent: "#2a7886" },
    ];
    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px 64px" }}>
          <button onClick={() => { forteSound.stepBack(); setPhase("home"); }} style={{ background: "transparent", border: "none", color: "#84a98c", cursor: "pointer", fontSize: "14px", marginBottom: "36px", padding: 0, fontFamily: "-apple-system, sans-serif" }}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <Icon html={ICONS.self} size={26} color="#7c5cbf" />
            <h2 style={{ fontSize: "28px", fontWeight: "400", margin: 0, color: "#1a2e1a" }}>Self</h2>
          </div>
          <p style={{ color: "#84a98c", fontSize: "14px", marginBottom: "36px", fontFamily: "-apple-system, sans-serif" }}>Tools for your inner world. Choose one to begin.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {tools.map(t => (
              <button key={t.key} onClick={() => { setSelfTool(t.key); setSelfInput(""); setSelfResult(null); setSelfMessages([]); setSelfStep(0); setPlanStep(0); setPhase("self_tool"); }}
                style={{ background: "#fff", border: `1.5px solid ${t.accent}22`, borderRadius: "16px", padding: "24px", textAlign: "left", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "20px" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.background = t.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${t.accent}22`; e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "#fff"; }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", color: t.accent, flexShrink: 0, border: `1px solid ${t.accent}22` }}>{t.icon}</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#1a2e1a", marginBottom: "4px", fontFamily: "-apple-system, sans-serif" }}>{t.label}</div>
                  <div style={{ fontSize: "13px", color: "#84a98c", lineHeight: 1.5, fontStyle: "italic" }}>{t.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: "20px", color: t.accent, flexShrink: 0 }}>›</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── SELF TOOL ─────────────────────────────────────────────────────
  if (phase === "self_tool") {
    const toolConfigs: Record<string, any> = {
      affirmations: {
        accent: "#7c5cbf", color: "#f5f0fa",
        label: "Affirmations",
        icon: "✦",
        placeholder: "What's been weighing on you lately? What area of your life feels hard right now?",
        inputLabel: "What are you struggling with?",
        cta: "Create my affirmations",
        systemPrompt: `You are a warm, compassionate affirmation coach. The user has shared something they are struggling with. Your job is to create 5 deeply personal, powerful affirmations tailored exactly to what they described. 
Rules: 
- Each affirmation starts with "I am", "I have", "I choose", "I trust", or "I deserve"
- They must feel specific to this person's situation — not generic
- They should be emotionally resonant, present tense, and believable
- After the 5 affirmations, add a short warm 2-sentence note explaining why these will help them
- Format: number each affirmation 1-5, then add the note after a line break labeled "A note for you:"`,
      },
      journal: {
        accent: "#2d6a4f", color: "#f0f7f4",
        label: "Journal",
        icon: "✍",
        placeholder: "Write freely — whatever is on your mind or heart today. There's no right or wrong way to start.",
        inputLabel: "How are you feeling today?",
        cta: "Share with my coach",
        systemPrompt: `You are a warm, emotionally attuned journal coach. The user has shared a journal entry with you. Your role is to:
1. Reflect back what you heard — show them they were truly heard (2-3 sentences)
2. Name the emotion(s) you sense underneath their words with gentle precision
3. Offer one insight — something they might not have seen about their own situation
4. Ask one open, caring question that invites them to go deeper

After your response, invite them to continue writing. This is a conversation — they can respond and you keep coaching. Keep your tone warm, never clinical. Never use bullet points — write in flowing paragraphs.`,
        isConversational: true,
      },
      meditation: {
        accent: "#3a6186", color: "#f0f4f8",
        label: "Guided Meditation",
        icon: "◎",
        placeholder: "What do you need right now? (e.g. 'calm my anxiety', 'let go of a stressful day', 'feel more present', 'find clarity on a decision')",
        inputLabel: "What do you need from this session?",
        cta: "Begin my meditation",
        systemPrompt: `You are a calm, grounding meditation guide. The user has told you what they need. Create a 3-5 minute guided meditation script tailored to their specific need.

Structure:
- Opening (30 sec): settle the body, close the eyes, a few breaths
- Body scan or grounding (1 min): specific to their need
- Core practice (2 min): visualization or breath work that directly addresses what they asked for  
- Closing (30 sec): gentle return, affirmation to carry with them

Write it as spoken guidance — second person, present tense, calming pace. Use "..." to indicate natural pauses. Make it feel personal to exactly what they shared, not generic. End with one sentence they can carry with them.`,
      },
      problem: {
        accent: "#c07000", color: "#faf8f0",
        label: "Problem Solver",
        icon: "◈",
        placeholder: "Describe the challenge or situation you're facing. Don't worry about being perfect — just write what's going on.",
        inputLabel: "What's the challenge you're facing?",
        cta: "Start working on this",
        systemPrompt: `You are a warm, practical life coach helping someone work through a real challenge. You ask ONE question at a time — never two. Keep every response to 2-3 sentences max.

TURN 1 (first response): Ask ONE warm clarifying question about the emotional stakes — how this is affecting them personally. Then on a new line write exactly 3 suggested answers the user might pick, formatted EXACTLY like:
OPTION: [a short natural answer, 8-15 words]
OPTION: [a different angle or feeling, 8-15 words]
OPTION: [a third possibility, 8-15 words]

TURN 2 (second response): Based on their answer, ask ONE follow-up about what they've already tried or what feels most stuck. Then on a new line write exactly 3 suggested answers formatted the same way with OPTION: prefix.

TURN 3 (third response): Now give them a clear, actionable plan. Format it EXACTLY like this with each step on its own line:
STEP: [first concrete action they can take today]
STEP: [second practical step]  
STEP: [third step — something about mindset or inner work]
ENCOURAGEMENT: [one warm, personal closing sentence based on everything they shared]

Do NOT use bullet points, headers, bold text, or markdown. Keep each step to 1-2 sentences. Be warm, not clinical.`,
        isConversational: true,
        isClarifying: true,
      },
      teenactivities: {
        accent: "#2a7886", color: "#f0f4f7",
        label: "Teen Activities Finder",
        icon: "🧭",
        placeholder: "Type your city or area (e.g. 'Austin, TX' or 'Sydney, Australia') and optionally what your teen is into.",
        inputLabel: "Where do you live? (and what's your teen into?)",
        cta: "Find activities for us",
        systemPrompt: `You are a helpful, creative activities advisor for parents who want to connect with their teenagers. The user will tell you their city/area and optionally their teen's interests.

IMPORTANT: Ask ONE question first to understand the teen better. Format EXACTLY like:
Ask a short warm question about their teen (age, interests, what they resist). Then add:
OPTION: [a likely answer, 8-12 words]
OPTION: [another possibility, 8-12 words]
OPTION: [a third option, 8-12 words]

After they answer, give them a personalized list of 6 activity suggestions specific to their area. Format EXACTLY like:
ACTIVITY: [Name of activity] | [Why it works for connection] | [Where to find it in their area]
ACTIVITY: [Name of activity] | [Why it works for connection] | [Where to find it in their area]
ACTIVITY: [Name of activity] | [Why it works for connection] | [Where to find it in their area]
ACTIVITY: [Name of activity] | [Why it works for connection] | [Where to find it in their area]
ACTIVITY: [Name of activity] | [Why it works for connection] | [Where to find it in their area]
ACTIVITY: [Name of activity] | [Why it works for connection] | [Where to find it in their area]
TIP: [One sentence of parenting advice about how to suggest these without pressure]

Mix it up: include free options, indoor/outdoor, active/creative, and at least one surprise pick they wouldn't expect. Be specific to the actual city — name real neighborhoods, parks, venues, or types of local businesses. Do NOT use bullet points, headers, or markdown.`,
        isConversational: true,
        isClarifying: true,
      },
    };

    const tool = toolConfigs[selfTool];
    if (!tool) return null;

    async function runSelfTool() {
      setSelfLoading(true);
      setSelfResult(null);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemPrompt: tool.systemPrompt,
            messages: [{ role: "user", content: selfInput }],
          }),
        });
        const data = await res.json();
        const reply = data.content || "";
        if (tool.isConversational) {
          setSelfMessages([{ role: "user", content: selfInput }, { role: "assistant", content: reply }]);
          setSelfStep(1);
        } else {
          setSelfResult(reply);
        }
      } catch { setSelfResult("Something went wrong. Please try again."); }
      setSelfLoading(false);
    }

    async function sendSelfMessage(text: string) {
      if (!text.trim() || selfLoading) return;
      const newMsgs = [...selfMessages, { role: "user", content: text }];
      setSelfMessages(newMsgs);
      setSelfInput("");
      setSelfLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemPrompt: tool.systemPrompt,
            messages: newMsgs,
          }),
        });
        const data = await res.json();
        setSelfMessages([...newMsgs, { role: "assistant", content: data.content || "" }]);
        setSelfStep((s: number) => s + 1);
      } catch {}
      setSelfLoading(false);
    }

    function readAloud(text: string) {
      const clean = text.replace(/[*#_]/g, "").replace(/\.\.\./g, " ").trim();
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(clean);
      utter.rate = selfTool === "meditation" ? 0.72 : 0.85;
      utter.pitch = selfTool === "meditation" ? 0.95 : 1.05;
      utter.onend = () => setSelfSpeaking(false);
      setSelfSpeaking(true);
      window.speechSynthesis.speak(utter);
    }

    const showInput = !tool.isConversational ? !selfResult : selfMessages.length === 0;
    const showConversation = tool.isConversational && selfMessages.length > 0;

    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto", padding: "40px 24px 80px" }}>
          <button onClick={() => { window.speechSynthesis.cancel(); setPhase("self_hub"); }} style={{ background: "transparent", border: "none", color: "#84a98c", cursor: "pointer", fontSize: "14px", marginBottom: "32px", padding: 0, fontFamily: "-apple-system, sans-serif" }}>← Back</button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: tool.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: tool.accent, border: `1px solid ${tool.accent}22` }}>{tool.icon}</div>
            <h2 style={{ fontSize: "24px", fontWeight: "400", margin: 0, color: "#1a2e1a" }}>{tool.label}</h2>
          </div>

          {/* INPUT PHASE */}
          {showInput && (
            <div style={{ marginTop: "28px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#52796f", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>{tool.inputLabel}</label>
              <textarea
                value={selfInput}
                onChange={e => setSelfInput(e.target.value)}
                placeholder={tool.placeholder}
                rows={5}
                style={{ width: "100%", padding: "16px", border: `1.5px solid ${tool.accent}33`, borderRadius: "14px", fontSize: "15px", fontFamily: "Georgia, serif", color: "#1a2e1a", background: "#fff", outline: "none", resize: "vertical", lineHeight: 1.7, boxSizing: "border-box" }}
              />
              <button
                onClick={runSelfTool}
                disabled={!selfInput.trim() || selfLoading}
                style={{ marginTop: "14px", width: "100%", padding: "15px", background: selfInput.trim() && !selfLoading ? tool.accent : "#e8f0ec", color: selfInput.trim() && !selfLoading ? "#fff" : "#84a98c", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: selfInput.trim() && !selfLoading ? "pointer" : "not-allowed", fontFamily: "-apple-system, sans-serif", transition: "all 0.2s" }}>
                {selfLoading ? "Working on it..." : tool.cta}
              </button>
            </div>
          )}

          {/* STATIC RESULT (affirmations, meditation) */}
          {selfResult && !tool.isConversational && (
            <div style={{ marginTop: "28px" }}>
              <div style={{ background: "#fff", border: `1.5px solid ${tool.accent}22`, borderRadius: "18px", padding: "28px", lineHeight: 1.9, fontSize: "15px", color: "#1a2e1a", whiteSpace: "pre-wrap" }}>
                {selfTool === "affirmations"
                  ? selfResult.split("\n").map((line: string, i: number) => {
                      const isAffirmation = /^[1-5]\./.test(line.trim());
                      const isNote = line.toLowerCase().includes("a note for you");
                      return (
                        <div key={i} style={{ marginBottom: isAffirmation ? "14px" : "6px" }}>
                          <span style={{ fontSize: isAffirmation ? "16px" : "14px", fontWeight: isAffirmation ? "600" : "400", color: isAffirmation ? tool.accent : "#52796f", fontStyle: isNote ? "italic" : "normal" }}>
                            {line}
                          </span>
                        </div>
                      );
                    })
                  : <span style={{ fontStyle: "italic", color: "#2d3e35", lineHeight: 2 }}>{selfResult}</span>
                }
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button onClick={() => { readAloud(selfResult); }}
                  style={{ flex: 1, padding: "12px", background: selfSpeaking ? tool.accent : tool.color, color: selfSpeaking ? "#fff" : tool.accent, border: `1.5px solid ${tool.accent}33`, borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
                  {selfSpeaking ? "🔊 Playing..." : selfTool === "meditation" ? "🔊 Guide me through it" : "🔊 Read to me"}
                </button>
                {selfSpeaking && (
                  <button onClick={() => { window.speechSynthesis.cancel(); setSelfSpeaking(false); }}
                    style={{ padding: "12px 18px", background: "#fff", color: "#84a98c", border: "1px solid #e8f0ec", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>Stop</button>
                )}
                <button onClick={() => { setSelfResult(null); setSelfInput(""); }}
                  style={{ flex: 1, padding: "12px", background: "#fff", color: "#84a98c", border: "1px solid #e8f0ec", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>Start over</button>
              </div>
            </div>
          )}

          {/* CONVERSATIONAL RESULT (journal, problem solver) */}
          {showConversation && selfTool === "teenactivities" && (() => {
            const lastAssistant = [...selfMessages].reverse().find((m: any) => m.role === "assistant");
            const lastContent = lastAssistant?.content || "";
            const hasActivities = lastContent.includes("ACTIVITY:");
            const isAsking = !hasActivities && lastContent.length > 0;

            // Parse activities
            const activities: { name: string; why: string; where: string }[] = [];
            let tip = "";
            if (hasActivities) {
              lastContent.split("\n").forEach((line: string) => {
                const trimmed = line.trim();
                if (trimmed.startsWith("ACTIVITY:")) {
                  const parts = trimmed.replace("ACTIVITY:", "").split("|").map((p: string) => p.trim());
                  if (parts.length >= 3) activities.push({ name: parts[0], why: parts[1], where: parts[2] });
                  else if (parts.length === 2) activities.push({ name: parts[0], why: parts[1], where: "" });
                } else if (trimmed.startsWith("TIP:")) {
                  tip = trimmed.replace("TIP:", "").trim();
                }
              });
            }

            // Parse options from question
            const lines = lastContent.split("\n").map((l: string) => l.trim()).filter(Boolean);
            const options: string[] = [];
            const questionLines: string[] = [];
            if (isAsking) {
              lines.forEach((line: string) => {
                if (line.startsWith("OPTION:")) options.push(line.replace("OPTION:", "").trim());
                else questionLines.push(line);
              });
            }

            return (
              <div style={{ marginTop: "28px" }}>
                {/* Progress */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "24px", alignItems: "center" }}>
                  <div style={{ width: hasActivities ? "8px" : "24px", height: "8px", borderRadius: "99px", background: tool.accent, transition: "all 0.3s" }} />
                  <div style={{ width: hasActivities ? "24px" : "8px", height: "8px", borderRadius: "99px", background: hasActivities ? tool.accent : "#d8e8e0", transition: "all 0.3s" }} />
                  <span style={{ fontSize: "11px", color: tool.accent, fontFamily: "-apple-system, sans-serif", marginLeft: "8px" }}>{hasActivities ? "Your activities" : "About your teen"}</span>
                </div>

                {/* Question with options */}
                {isAsking && !selfLoading && (
                  <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
                    <div style={{ background: "#fff", border: `1.5px solid ${tool.accent}22`, borderRadius: "18px", padding: "24px 22px", marginBottom: "16px" }}>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: tool.accent, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>🧭 Activities Finder</div>
                      <p style={{ fontSize: "15px", color: "#1a2e1a", lineHeight: 1.85, margin: 0 }}>{questionLines.join(" ")}</p>
                    </div>
                    {options.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>Tap an answer or type your own</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {options.map((opt: string, oi: number) => (
                            <button key={oi} onClick={() => { forteSound.tap(); sendSelfMessage(opt); }}
                              style={{ width: "100%", padding: "13px 16px", background: tool.color, border: `1.5px solid ${tool.accent}22`, borderRadius: "12px", fontSize: "14px", color: "#1a2e1a", textAlign: "left", cursor: "pointer", fontFamily: "Georgia, serif", lineHeight: 1.6, transition: "all 0.15s" }}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ borderTop: options.length > 0 ? "1px solid #d8e8e0" : "none", paddingTop: options.length > 0 ? "16px" : "0" }}>
                      {options.length > 0 && <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>Or write your own</div>}
                      <textarea value={selfInput} onChange={e => setSelfInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendSelfMessage(selfInput); } }}
                        placeholder="Tell me about your teen..." rows={2}
                        style={{ width: "100%", padding: "14px 16px", border: `1.5px solid ${tool.accent}33`, borderRadius: "12px", fontSize: "14px", fontFamily: "Georgia, serif", color: "#1a2e1a", background: "#fff", outline: "none", resize: "none", lineHeight: 1.7, boxSizing: "border-box" }} />
                      <button onClick={() => sendSelfMessage(selfInput)} disabled={!selfInput.trim()}
                        style={{ width: "100%", marginTop: "10px", padding: "14px", background: selfInput.trim() ? tool.accent : "#d8e8e0", color: selfInput.trim() ? "#fff" : "#aaa", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: selfInput.trim() ? "pointer" : "not-allowed", fontFamily: "-apple-system, sans-serif" }}>
                        Answer →
                      </button>
                    </div>
                  </div>
                )}

                {/* Loading */}
                {selfLoading && (
                  <div style={{ background: "#fff", border: `1.5px solid ${tool.accent}22`, borderRadius: "18px", padding: "24px 22px", display: "flex", gap: "6px", alignItems: "center" }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: tool.accent, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
                    <span style={{ fontSize: "12px", color: tool.accent, marginLeft: "8px", fontFamily: "-apple-system, sans-serif" }}>
                      {hasActivities || selfStep > 1 ? "Finding activities in your area..." : "Getting to know your teen..."}
                    </span>
                  </div>
                )}

                {/* Activities list */}
                {hasActivities && !selfLoading && (
                  <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: tool.accent, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Activities For You & Your Teen</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {activities.map((act, ai) => (
                        <div key={ai} style={{ background: "#fff", border: `1.5px solid ${tool.accent}22`, borderRadius: "14px", padding: "20px 22px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: tool.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: tool.accent, flexShrink: 0, fontFamily: "-apple-system, sans-serif" }}>{ai + 1}</div>
                            <div style={{ fontSize: "15px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif", lineHeight: 1.3 }}>{act.name}</div>
                          </div>
                          <p style={{ fontSize: "14px", color: "#52796f", lineHeight: 1.75, margin: "0 0 8px", paddingLeft: "44px" }}>{act.why}</p>
                          {act.where && <p style={{ fontSize: "13px", color: tool.accent, lineHeight: 1.6, margin: 0, paddingLeft: "44px", fontFamily: "-apple-system, sans-serif" }}>📍 {act.where}</p>}
                        </div>
                      ))}
                    </div>
                    {tip && (
                      <div style={{ marginTop: "16px", background: tool.color, border: `1.5px solid ${tool.accent}33`, borderRadius: "14px", padding: "18px 20px" }}>
                        <div style={{ fontSize: "10px", fontWeight: "700", color: tool.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>💡 Parent Tip</div>
                        <p style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>{tip}</p>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                      <button onClick={() => readAloud(activities.map(a => a.name + ": " + a.why).join(". "))}
                        style={{ padding: "6px 14px", background: "transparent", color: tool.accent, border: `1px solid ${tool.accent}33`, borderRadius: "99px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
                        {selfSpeaking ? "🔊 Playing..." : "🔊 Read these"}
                      </button>
                      <button onClick={() => { window.speechSynthesis.cancel(); setSelfMessages([]); setSelfInput(""); setSelfResult(null); setSelfStep(0); setPlanStep(0); }}
                        style={{ padding: "6px 14px", background: "transparent", color: "#84a98c", border: "1px solid #e8f0ec", borderRadius: "99px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>Try another city</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {showConversation && selfTool === "problem" && (() => {
            const lastAssistant = [...selfMessages].reverse().find((m: any) => m.role === "assistant");
            const lastContent = lastAssistant?.content || "";
            const hasPlan = lastContent.includes("STEP:");
            const isAsking = !hasPlan && lastContent.length > 0;

            // Parse plan steps
            const planSteps: string[] = [];
            let encouragement = "";
            if (hasPlan) {
              lastContent.split("\n").forEach((line: string) => {
                const trimmed = line.trim();
                if (trimmed.startsWith("STEP:")) planSteps.push(trimmed.replace("STEP:", "").trim());
                else if (trimmed.startsWith("ENCOURAGEMENT:")) encouragement = trimmed.replace("ENCOURAGEMENT:", "").trim();
              });
            }

            return (
              <div style={{ marginTop: "28px" }}>
                {/* Progress */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "24px", alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: i === selfStep - 1 ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "99px",
                      background: i < selfStep ? tool.accent : "#e8e0d8",
                      transition: "all 0.3s ease",
                    }} />
                  ))}
                  <span style={{ fontSize: "11px", color: tool.accent, fontFamily: "-apple-system, sans-serif", marginLeft: "8px" }}>
                    {hasPlan ? "Your plan" : `Question ${selfStep}`}
                  </span>
                </div>

                {/* Current question card */}
                {isAsking && !selfLoading && (() => {
                  // Parse out question text and options
                  const lines = lastContent.split("\n").map((l: string) => l.trim()).filter(Boolean);
                  const options: string[] = [];
                  const questionLines: string[] = [];
                  lines.forEach((line: string) => {
                    if (line.startsWith("OPTION:")) options.push(line.replace("OPTION:", "").trim());
                    else questionLines.push(line);
                  });
                  const questionText = questionLines.join(" ");

                  return (
                    <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
                      <div style={{ background: "#fff", border: `1.5px solid ${tool.accent}22`, borderRadius: "18px", padding: "24px 22px", marginBottom: "16px" }}>
                        <div style={{ fontSize: "10px", fontWeight: "700", color: tool.accent, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>
                          Problem Solver
                        </div>
                        <p style={{ fontSize: "15px", color: "#1a2e1a", lineHeight: 1.85, margin: 0 }}>{questionText}</p>
                      </div>

                      {/* Listen button */}
                      <button onClick={() => readAloud(questionText)}
                        style={{ padding: "6px 14px", background: "transparent", color: tool.accent, border: `1px solid ${tool.accent}33`, borderRadius: "99px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", marginBottom: "20px" }}>
                        {selfSpeaking ? "🔊 Playing..." : "🔊 Read this"}
                      </button>

                      {/* Clickable answer options */}
                      {options.length > 0 && (
                        <div style={{ marginBottom: "16px" }}>
                          <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>Tap an answer or type your own</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {options.map((opt: string, oi: number) => (
                              <button key={oi}
                                onClick={() => { forteSound.tap(); sendSelfMessage(opt); }}
                                style={{ width: "100%", padding: "13px 16px", background: tool.color, border: `1.5px solid ${tool.accent}22`, borderRadius: "12px", fontSize: "14px", color: "#1a2e1a", textAlign: "left", cursor: "pointer", fontFamily: "Georgia, serif", lineHeight: 1.6, transition: "all 0.15s" }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Custom answer input */}
                      <div style={{ borderTop: options.length > 0 ? "1px solid #e8e0d8" : "none", paddingTop: options.length > 0 ? "16px" : "0" }}>
                        {options.length > 0 && (
                          <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>Or write your own</div>
                        )}
                        <textarea
                          value={selfInput}
                          onChange={e => setSelfInput(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendSelfMessage(selfInput); } }}
                          placeholder="Your answer..."
                          rows={2}
                          style={{ width: "100%", padding: "14px 16px", border: `1.5px solid ${tool.accent}33`, borderRadius: "12px", fontSize: "14px", fontFamily: "Georgia, serif", color: "#1a2e1a", background: "#fff", outline: "none", resize: "none", lineHeight: 1.7, boxSizing: "border-box" }}
                        />
                        <button onClick={() => sendSelfMessage(selfInput)} disabled={!selfInput.trim()}
                          style={{ width: "100%", marginTop: "10px", padding: "14px", background: selfInput.trim() ? tool.accent : "#e8e0d8", color: selfInput.trim() ? "#fff" : "#aaa", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: selfInput.trim() ? "pointer" : "not-allowed", fontFamily: "-apple-system, sans-serif" }}>
                          Answer →
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Loading state */}
                {selfLoading && (
                  <div style={{ background: "#fff", border: `1.5px solid ${tool.accent}22`, borderRadius: "18px", padding: "24px 22px", display: "flex", gap: "6px", alignItems: "center" }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: tool.accent, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
                    <span style={{ fontSize: "12px", color: tool.accent, marginLeft: "8px", fontFamily: "-apple-system, sans-serif" }}>
                      {selfStep < 3 ? "Thinking about what to ask next..." : "Building your plan..."}
                    </span>
                  </div>
                )}

                {/* Plan - one step at a time */}
                {hasPlan && !selfLoading && (() => {
                  const totalPlanSteps = planSteps.length;
                  const showingEncouragement = planStep >= totalPlanSteps;
                  const currentStep = planSteps[planStep];

                  return (
                    <div style={{ animation: "fadeSlideIn 0.35s ease" }} key={planStep}>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: tool.accent, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Your Action Plan</div>

                      {/* Step progress */}
                      <div style={{ display: "flex", gap: "6px", marginBottom: "20px", alignItems: "center" }}>
                        {planSteps.map((_: string, i: number) => (
                          <div key={i} style={{
                            width: i === planStep ? "24px" : "8px",
                            height: "8px",
                            borderRadius: "99px",
                            background: i <= planStep ? tool.accent : "#e8e0d8",
                            transition: "all 0.3s ease",
                          }} />
                        ))}
                        {encouragement && (
                          <div style={{
                            width: showingEncouragement ? "24px" : "8px",
                            height: "8px",
                            borderRadius: "99px",
                            background: showingEncouragement ? tool.accent : "#e8e0d8",
                            transition: "all 0.3s ease",
                          }} />
                        )}
                        <span style={{ fontSize: "11px", color: tool.accent, fontFamily: "-apple-system, sans-serif", marginLeft: "8px" }}>
                          {showingEncouragement ? "Coach's note" : `Step ${planStep + 1} of ${totalPlanSteps}`}
                        </span>
                      </div>

                      {/* Current step card */}
                      {!showingEncouragement && currentStep && (
                        <div style={{ background: "#fff", border: `1.5px solid ${tool.accent}22`, borderRadius: "18px", padding: "24px 22px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: tool.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: tool.accent, flexShrink: 0, fontFamily: "-apple-system, sans-serif" }}>{planStep + 1}</div>
                          <p style={{ fontSize: "15px", color: "#1a2e1a", lineHeight: 1.85, margin: 0 }}>{currentStep}</p>
                        </div>
                      )}

                      {/* Encouragement card */}
                      {showingEncouragement && encouragement && (
                        <div style={{ background: tool.color, border: `1.5px solid ${tool.accent}33`, borderRadius: "18px", padding: "24px 22px" }}>
                          <div style={{ fontSize: "10px", fontWeight: "700", color: tool.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>💛 From Your Coach</div>
                          <p style={{ fontSize: "15px", color: "#1a2e1a", lineHeight: 1.85, margin: 0, fontStyle: "italic" }}>{encouragement}</p>
                        </div>
                      )}

                      {/* Listen button */}
                      <button onClick={() => readAloud(showingEncouragement ? encouragement : currentStep)}
                        style={{ marginTop: "14px", padding: "6px 14px", background: "transparent", color: tool.accent, border: `1px solid ${tool.accent}33`, borderRadius: "99px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
                        {selfSpeaking ? "🔊 Playing..." : "🔊 Read this"}
                      </button>

                      {/* Navigation */}
                      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        {planStep > 0 && (
                          <button onClick={() => { forteSound.stepBack(); setPlanStep(planStep - 1); }}
                            style={{ flex: 1, padding: "14px", background: "#fff", color: tool.accent, border: `1.5px solid ${tool.accent}33`, borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
                            ← Back
                          </button>
                        )}
                        {!showingEncouragement ? (
                          <button onClick={() => { forteSound.stepForward(); setPlanStep(planStep + 1); }}
                            style={{ flex: 1, padding: "14px", background: tool.accent, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
                            {planStep < totalPlanSteps - 1 ? "Next step →" : "Coach's note →"}
                          </button>
                        ) : (
                          <button onClick={() => { forteSound.affirm(); window.speechSynthesis.cancel(); setSelfMessages([]); setSelfInput(""); setSelfResult(null); setSelfStep(0); setPlanStep(0); }}
                            style={{ flex: 1, padding: "14px", background: tool.accent, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
                            Done — back to Self
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {/* CONVERSATIONAL RESULT (journal only) */}
          {showConversation && selfTool !== "problem" && (
            <div style={{ marginTop: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {selfMessages.map((m: any, i: number) => (
                  <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "column", gap: "8px", alignItems: m.role === "user" ? "flex-start" : "stretch" }}>
                    {m.role === "user" ? (
                      <div style={{ maxWidth: "80%", padding: "14px 18px", background: tool.accent, borderRadius: "18px 4px 18px 18px", fontSize: "14px", lineHeight: 1.7, color: "#fff" }}>{m.content}</div>
                    ) : (
                      <>
                        <div style={{ fontSize: "11px", fontWeight: "700", color: tool.accent, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "-apple-system, sans-serif" }}>
                          {selfTool === "journal" ? "Your coach says:" : "Problem Solver:"}
                        </div>
                        <div style={{ background: "#fff", border: `1px solid ${tool.accent}22`, borderRadius: "4px 18px 18px 18px", padding: "18px 20px", fontSize: "14px", lineHeight: 1.9, color: "#1a2e1a", whiteSpace: "pre-wrap" }}>
                          {m.content}
                        </div>
                        <button onClick={() => readAloud(m.content)}
                          style={{ alignSelf: "flex-start", padding: "6px 14px", background: "transparent", color: tool.accent, border: `1px solid ${tool.accent}33`, borderRadius: "99px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", marginTop: "4px" }}>
                          {selfSpeaking ? "🔊 Playing..." : "🔊 Read this"}
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {selfLoading && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: tool.accent, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "-apple-system, sans-serif" }}>
                      {selfTool === "journal" ? "Your coach is reflecting..." : "Thinking through your situation..."}
                    </div>
                    <div style={{ background: "#fff", border: `1px solid ${tool.accent}22`, borderRadius: "4px 18px 18px 18px", padding: "18px 20px", display: "flex", gap: "5px", alignItems: "center" }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: tool.accent, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
                    </div>
                  </div>
                )}
              </div>

              {!selfLoading && (
                <div style={{ marginTop: "20px" }}>
                  <textarea
                    value={selfInput}
                    onChange={e => setSelfInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendSelfMessage(selfInput); } }}
                    placeholder={selfTool === "journal" ? "Continue writing... (Enter to send)" : "Answer the questions above... (Enter to send)"}
                    rows={3}
                    style={{ width: "100%", padding: "14px 16px", border: `1.5px solid ${tool.accent}33`, borderRadius: "12px", fontSize: "14px", fontFamily: "Georgia, serif", color: "#1a2e1a", background: "#fff", outline: "none", resize: "none", lineHeight: 1.7, boxSizing: "border-box" }}
                  />
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button onClick={() => sendSelfMessage(selfInput)} disabled={!selfInput.trim()}
                      style={{ flex: 1, padding: "12px", background: selfInput.trim() ? tool.accent : "#e8f0ec", color: selfInput.trim() ? "#fff" : "#84a98c", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: selfInput.trim() ? "pointer" : "not-allowed", fontFamily: "-apple-system, sans-serif" }}>
                      Send →
                    </button>
                    <button onClick={() => { window.speechSynthesis.cancel(); setSelfMessages([]); setSelfInput(""); setSelfResult(null); setSelfStep(0); }}
                      style={{ padding: "12px 18px", background: "#fff", color: "#84a98c", border: "1px solid #e8f0ec", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>Start over</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── PAYWALL OVERLAY ────────────────────────────────────────────
  const paywallOverlay = showPaywall ? (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={(e) => { if (e.target === e.currentTarget) setShowPaywall(false); }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,30,20,0.6)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "440px", padding: "40px 32px", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.25)", animation: "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>✦</div>
        <h2 style={{ fontSize: "24px", fontWeight: "400", color: "#1a2e1a", margin: "0 0 12px", fontFamily: "Georgia, serif" }}>Unlock Full FORTE</h2>
        <p style={{ fontSize: "14px", color: "#52796f", lineHeight: 1.8, margin: "0 0 24px", fontFamily: "-apple-system, sans-serif" }}>
          You've used your {sessionsUsed} free practice sessions. Upgrade to unlock every category, unlimited practice, and the full Self toolkit.
        </p>
        <div style={{ background: "#f0f7f4", borderRadius: "14px", padding: "18px", marginBottom: "24px", textAlign: "left" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>FORTE Pro includes:</div>
          {["All 5 categories + every scenario", "Unlimited practice sessions", "Full Self toolkit — Journal, Meditation, Problem Solver, Activities Finder", "Create Your Own scenarios", "New scenarios added regularly"].map((item, i) => (
            <div key={i} style={{ fontSize: "13px", color: "#1a2e1a", lineHeight: 1.8, fontFamily: "-apple-system, sans-serif", paddingLeft: "20px", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: "#2d6a4f" }}>✓</span> {item}
            </div>
          ))}
        </div>
        <button
          onClick={() => { /* Stripe link goes here */ alert("Payment coming soon! For now, enjoy your free sessions."); setShowPaywall(false); }}
          style={{ width: "100%", padding: "16px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", marginBottom: "10px" }}>
          Upgrade — $4.99/month
        </button>
        <button onClick={() => setShowPaywall(false)}
          style={{ width: "100%", padding: "12px", background: "transparent", color: "#84a98c", border: "none", fontSize: "13px", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
          Maybe later
        </button>
      </div>
    </div>
  ) : null;

  // PROGRESS DASHBOARD
  const progressOverlay = showProgress ? (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={(e) => { if (e.target === e.currentTarget) setShowProgress(false); }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,30,20,0.6)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "440px", maxHeight: "85vh", overflowY: "auto", padding: "36px 28px", boxShadow: "0 24px 80px rgba(0,0,0,0.25)", animation: "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <button onClick={() => setShowProgress(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#84a98c" }}>x</button>
        <h2 style={{ fontSize: "22px", fontWeight: "400", color: "#1a2e1a", margin: "0 0 24px", fontFamily: "Georgia, serif" }}>Your Growth</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Current Streak", value: currentStreak, icon: currentStreak > 0 ? "🔥" : "--", sub: currentStreak > 0 ? `Best: ${progress.bestStreak} day${progress.bestStreak !== 1 ? "s" : ""}` : "Start practicing!" },
            { label: "Total Sessions", value: progress.totalSessions, icon: "🎯", sub: `${progress.scenariosDone.length} unique scenario${progress.scenariosDone.length !== 1 ? "s" : ""}` },
          ].map((stat, i) => (
            <div key={i} style={{ background: "#f0f7f4", borderRadius: "14px", padding: "18px 16px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}> {stat.icon}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif" }}> {stat.value}</div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px", fontFamily: "-apple-system, sans-serif" }}> {stat.label}</div>
              <div style={{ fontSize: "11px", color: "#84a98c", marginTop: "4px", fontFamily: "-apple-system, sans-serif" }}> {stat.sub}</div>
            </div>
          ))}
        </div>
        {(() => {
          const days = [...new Set(progress.practiceDays)].sort().reverse();
          const today = new Date();
          const cal: { date: string; active: boolean }[] = [];
          for (let d = 27; d >= 0; d--) {
            const dt = new Date(today);
            dt.setDate(dt.getDate() - d);
            const ds = dt.toISOString().split("T")[0];
            cal.push({ date: ds, active: days.includes(ds) });
          }
          const weekDays = ["M","T","W","T","F","S","S"];
          return (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#52796f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>Last 4 Weeks</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                {weekDays.map((d, i) => (
                  <div key={`h${i}`} style={{ fontSize: "10px", color: "#b7c9be", textAlign: "center", fontFamily: "-apple-system, sans-serif", marginBottom: "2px" }}> {d}</div>
                ))}
                {cal.map((c, i) => (
                  <div key={i} style={{ width: "100%", aspectRatio: "1", borderRadius: "6px", background: c.active ? "#2d6a4f" : "#f0f4f0", transition: "all 0.2s" }}
                    title={c.date} />
                ))}
              </div>
            </div>
          );
        })()}
        {progress.scenariosDone.length > 0 && (
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#52796f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>Scenarios Practiced</div>
            {progress.scenariosDone.map((s, i) => (
              <div key={i} style={{ fontSize: "13px", color: "#1a2e1a", padding: "8px 0", borderBottom: i < progress.scenariosDone.length - 1 ? "1px solid #e8f0ec" : "none", fontFamily: "-apple-system, sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#2d6a4f" }}>  ✓</span> {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : null;

    // Check if category is locked
  const isCategoryLocked = (categoryName: string) => !isPro && freeCategory && categoryName !== freeCategory;
  const canPractice = isPro || sessionsUsed < 3;

  // ── CATEGORY PICKER (first time only) ───────────────────────────
  if (!isPro && !freeCategory) return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "72px 24px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{ width: "3px", height: "40px", background: "#2d6a4f", borderRadius: "2px" }} />
            <h1 style={{ fontSize: "48px", fontWeight: "400", margin: 0, color: "#1a2e1a", letterSpacing: "-1px" }}>FORTE</h1>
          </div>
          <p style={{ color: "#52796f", fontSize: "16px", margin: "0", lineHeight: 1.7, fontStyle: "italic" }}>Welcome! Pick one category to explore for free.</p>
          <p style={{ color: "#84a98c", fontSize: "13px", margin: "8px 0 0", fontFamily: "-apple-system, sans-serif" }}>You'll get 3 free practice sessions. Upgrade anytime for full access.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {SCENARIOS.map((s) => (
            <button key={s.category} onClick={() => { forteSound.category(); setFreeCategory(s.category); }}
              style={{ background: "#fff", border: "1.5px solid #d8e8e0", borderRadius: "16px", padding: "20px 24px", textAlign: "left", cursor: "pointer", transition: "all 0.25s", display: "flex", alignItems: "center", gap: "16px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.accent; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${s.accent}18`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ color: s.accent }}><Icon html={ICONS[s.iconKey as keyof typeof ICONS]} size={28} color={s.accent} /></div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif" }}>{s.category}</div>
                <div style={{ fontSize: "13px", color: "#84a98c", marginTop: "2px", fontFamily: "-apple-system, sans-serif" }}>{s.situations?.length || 0} scenarios</div>
              </div>
              <div style={{ marginLeft: "auto", color: s.accent, fontSize: "18px" }}>→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // QUIZ LANDING
  if (phase === "home" && quizDone === null) return (
    <div style={{ minHeight: "100vh", background: "#f8faf8" }} />
  );
  if (phase === "home" && quizDone === false && !quizResult) {
    const quizPick = (idx: number, style: string) => {
      if (quizAnimating) return;
      setQuizSelected(idx);
      setQuizAnimating(true);
      const ns = { ...quizScores, [style]: quizScores[style] + 1 };
      setQuizScores(ns);
      setTimeout(() => {
        if (quizQ < shuffledQQs.length - 1) { setQuizQ(quizQ + 1); setQuizSelected(null); }
        else { setQuizResult(Object.entries(ns).sort((a, b) => b[1] - a[1])[0][0]); }
        setQuizAnimating(false);
      }, 600);
    };
    const skipQuiz = () => { setQuizDone(true); try { localStorage.setItem("forte_quiz_done", "true"); } catch {} };
    if (!quizStarted) return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", justifyContent: "center", marginBottom: "48px" }}>
            <div style={{ width: "3px", height: "32px", background: "#2d6a4f", borderRadius: "2px" }} />
            <div style={{ fontSize: "32px", fontWeight: "400", color: "#1a2e1a", letterSpacing: "-1px" }}>FORTE</div>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 40px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 16px", lineHeight: 1.3, letterSpacing: "-0.5px" }}>{"What\u2019s Your"}<br />Communication Style?</h1>
          <p style={{ color: "#52796f", fontSize: "15px", lineHeight: 1.8, margin: "0 0 40px" }}>7 real scenarios. No wrong answers.<br />Discover how you handle tension {"\u2014"} and what it costs you.</p>
          <button onClick={() => setQuizStarted(true)} style={{ padding: "16px 44px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#40916c"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#2d6a4f"; e.currentTarget.style.transform = "none"; }}>{"Take the Quiz \u2192"}</button>
          <div style={{ marginTop: "24px" }}>
            <button onClick={skipQuiz} style={{ background: "none", border: "none", color: "#52796f", fontSize: "14px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", padding: "10px 20px", textDecoration: "underline", textUnderlineOffset: "3px" }}>Skip for now</button>
          </div>
        </div>
      </div>
    );
    const qq = shuffledQQs[quizQ];
    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
            <div style={{ flex: 1, height: "3px", background: "#e0ebe4", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((quizQ + 1) / shuffledQQs.length) * 100}%`, background: "#2d6a4f", borderRadius: "2px", transition: "width 0.5s ease-out" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#52796f", fontFamily: "-apple-system, sans-serif" }}>{quizQ + 1} / {shuffledQQs.length}</div>
            <button onClick={skipQuiz} style={{ background: "none", border: "1px solid #d8e8e0", color: "#52796f", fontSize: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", padding: "4px 12px", borderRadius: "8px" }}>Skip</button>
          </div>
          <div key={quizQ} style={{ animation: "qSlide 0.4s ease-out" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", color: "#52796f", textTransform: "uppercase", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Scenario</div>
            <h2 style={{ fontSize: "clamp(20px, 5vw, 24px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 32px", lineHeight: 1.5 }}>{qq.scenario}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {qq.answers.map((a: any, i: number) => (
                <button key={i} onClick={() => quizPick(i, a.style)} disabled={quizAnimating}
                  style={{ width: "100%", padding: "16px 20px", background: quizSelected === i ? "#2d6a4f" : "#fff", border: `1.5px solid ${quizSelected === i ? "#2d6a4f" : "#d8e8e0"}`, borderRadius: "14px", color: quizSelected === i ? "#fff" : "#1a2e1a", fontSize: "14px", textAlign: "left", cursor: quizAnimating ? "default" : "pointer", fontFamily: "-apple-system, sans-serif", lineHeight: 1.6, transition: "all 0.25s", transform: quizSelected === i ? "scale(1.02)" : "none" }}
                  onMouseEnter={e => { if (!quizAnimating && quizSelected !== i) { e.currentTarget.style.borderColor = "#2d6a4f"; e.currentTarget.style.background = "#f0f5f0"; } }}
                  onMouseLeave={e => { if (!quizAnimating && quizSelected !== i) { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.background = "#fff"; } }}>
                  {a.text}
                </button>
              ))}
            </div>
          </div>
        </div>
        <style>{`@keyframes qSlide{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}`}</style>
      </div>
    );
  }

  // QUIZ RESULT
  if (phase === "home" && quizResult && quizDone === false) {
    const qst = QUIZ_STYLES[quizResult];
    const finishQuiz = () => { setQuizDone(true); try { localStorage.setItem("forte_quiz_done", "true"); } catch {} };
    const handleQShare = async () => {
      const txt = `I'm "${qst.name}" \u2014 ${qst.tagline}\n\nWhat's your communication style?\nhttps://debate-coach-seven.vercel.app/quiz`;
      if (navigator.share) { try { await navigator.share({ title: `I'm ${qst.name}`, text: txt }); } catch {} }
      else { navigator.clipboard.writeText(txt); setQuizCopied(true); setTimeout(() => setQuizCopied(false), 2000); }
    };
    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ background: "linear-gradient(145deg, #1a3a28, #2d4a3a)", borderRadius: "24px", padding: "36px 28px", marginBottom: "24px", border: `1.5px solid ${qst.color}33`, animation: "rPop 0.6s cubic-bezier(0.34,1.56,0.64,1)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: `${qst.color}08` }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.25em", color: "#52796f", textTransform: "uppercase", marginBottom: "16px", fontFamily: "-apple-system, sans-serif" }}>Your communication style is</div>
              <div style={{ fontSize: "44px", marginBottom: "8px" }}>{qst.emoji}</div>
              <h2 style={{ fontSize: "28px", fontWeight: "400", color: "#e8f0ec", margin: "0 0 8px", letterSpacing: "-0.5px" }}>{qst.name}</h2>
              <p style={{ fontSize: "15px", color: qst.color, fontStyle: "italic", margin: "0 0 20px", lineHeight: 1.6 }}>"{qst.tagline}"</p>
              <p style={{ fontSize: "13px", color: "#b7c9be", lineHeight: 1.8, margin: "0 0 20px" }}>{qst.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ background: "#0a1a1218", borderRadius: "12px", padding: "12px", border: "1px solid #2d6a4f22" }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", fontFamily: "-apple-system, sans-serif" }}>Strength</div>
                  <div style={{ fontSize: "12px", color: "#b7c9be", lineHeight: 1.5, fontFamily: "-apple-system, sans-serif" }}>{qst.strength}</div>
                </div>
                <div style={{ background: "#0a1a1218", borderRadius: "12px", padding: "12px", border: "1px solid #2d6a4f22" }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#c9184a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", fontFamily: "-apple-system, sans-serif" }}>Growth Edge</div>
                  <div style={{ fontSize: "12px", color: "#b7c9be", lineHeight: 1.5, fontFamily: "-apple-system, sans-serif" }}>{qst.growth}</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button onClick={handleQShare} style={{ flex: 1, padding: "14px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>{quizCopied ? "Copied!" : "Share My Result"}</button>
          </div>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid #d8e8e0", textAlign: "center" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#1a2e1a", margin: "0 0 8px", fontFamily: "-apple-system, sans-serif" }}>Ready to practice?</h3>
            <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "-apple-system, sans-serif" }}>Practice real conversations with AI coaching matched to your style.</p>
            <button onClick={finishQuiz} style={{ width: "100%", padding: "16px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>{"Start Practicing \u2192"}</button>
          </div>
          <div style={{ marginTop: "20px", padding: "16px 0" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>Full Breakdown</div>
            {Object.entries(quizScores).sort((a, b) => b[1] - a[1]).map(([key, val]) => {
              const s = QUIZ_STYLES[key]; const pct = Math.round((val / shuffledQQs.length) * 100);
              return (<div key={key} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <div style={{ fontSize: "12px", color: key === quizResult ? "#1a2e1a" : "#84a98c", fontFamily: "-apple-system, sans-serif", fontWeight: key === quizResult ? "700" : "400" }}>{s.emoji} {s.name}</div>
                  <div style={{ fontSize: "11px", color: "#84a98c", fontFamily: "-apple-system, sans-serif" }}>{pct}%</div>
                </div>
                <div style={{ height: "5px", background: "#e0ebe4", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: key === quizResult ? s.color : "#2d6a4f44", borderRadius: "3px", transition: "width 1s ease-out" }} />
                </div>
              </div>);
            })}
          </div>
        </div>
        <style>{`@keyframes rPop{from{opacity:0;transform:scale(0.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
      </div>
    );
  }

  if (phase === "quizHub") return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px 64px" }}>
        <button onClick={() => { forteSound.stepBack(); setPhase("home"); }} style={{ background: "transparent", border: "none", color: "#52796f", fontSize: "14px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", padding: "0", marginBottom: "32px" }}>{"\u2190"} Back</button>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>{"\ud83e\udde0"}</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "400", color: "#1a2e1a", margin: "0 0 8px" }}>Discover Your Style</h1>
          <p style={{ fontSize: "14px", color: "#52796f", margin: 0, fontFamily: "-apple-system, sans-serif" }}>2-minute quizzes you can share and compare</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <a href="/quiz" style={{ textDecoration: "none", background: "#fff", border: "1.5px solid #d8e8e0", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", gap: "16px", transition: "all 0.25s" }}
            onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = "#2d6a4f"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(45,106,79,0.08)"; }}
            onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#f0f7f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{"\ud83d\udde3\ufe0f"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif" }}>Communication Style</div>
              <div style={{ fontSize: "13px", color: "#52796f", fontFamily: "-apple-system, sans-serif", marginTop: "4px", lineHeight: 1.5 }}>How do you handle tension? Compare with friends, family, or coworkers.</div>
            </div>
            <div style={{ fontSize: "16px", color: "#2d6a4f", flexShrink: 0 }}>{"\u2192"}</div>
          </a>
          <a href="/quiz/partner" style={{ textDecoration: "none", background: "#fff", border: "1.5px solid #d8e8e0", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", gap: "16px", transition: "all 0.25s" }}
            onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = "#c9184a"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,24,74,0.06)"; }}
            onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#fdf2f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{"\u2764\ufe0f"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif" }}>Partner Style</div>
              <div style={{ fontSize: "13px", color: "#52796f", fontFamily: "-apple-system, sans-serif", marginTop: "4px", lineHeight: 1.5 }}>What kind of partner are you? Send it to yours and see your compatibility.</div>
            </div>
            <div style={{ fontSize: "16px", color: "#c9184a", flexShrink: 0 }}>{"\u2192"}</div>
          </a>
          <div style={{ background: "#f5f5f5", border: "1.5px dashed #d0d0d0", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{"\ud83c\udf31"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#aaa", fontFamily: "-apple-system, sans-serif" }}>Parenting Style</div>
              <div style={{ fontSize: "13px", color: "#bbb", fontFamily: "-apple-system, sans-serif", marginTop: "4px", lineHeight: 1.5 }}>What kind of parent are you? Compare with your co-parent.</div>
            </div>
            <div style={{ fontSize: "11px", color: "#aaa", fontFamily: "-apple-system, sans-serif", fontWeight: "600", flexShrink: 0 }}>Coming soon</div>
          </div>
        </div>
      </div>
    </div>
  );

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
        
        {progress.totalSessions > 0 && (
          <button onClick={() => setShowProgress(true)}
            style={{ width: "100%", background: "#fff", border: "1.5px solid #d8e8e0", borderRadius: "16px", padding: "18px 24px", marginBottom: "24px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2d6a4f"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px #2d6a4f12"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ fontSize: "28px" }}> {currentStreak > 0 ? "🔥" : "📊"}</div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif" }}>
                {currentStreak > 0 ? `${currentStreak} day streak` : "Your progress"}
              </div>
              <div style={{ fontSize: "12px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginTop: "2px" }}>
                {progress.totalSessions} session{progress.totalSessions !== 1 ? "s" : ""} · {progress.scenariosDone.length} scenario{progress.scenariosDone.length !== 1 ? "s" : ""} explored
              </div>
            </div>
            <div style={{ fontSize: "13px", color: "#2d6a4f", fontFamily: "-apple-system, sans-serif" }}>View →</div>
          </button>
        )}
        <button onClick={() => setPhase("quizHub")} style={{ width: "100%", background: "linear-gradient(145deg, #f0f7f4, #fff)", border: "1.5px solid #d8e8e0", borderRadius: "16px", padding: "20px 24px", cursor: "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", gap: "16px", textAlign: "left", marginBottom: "20px" }}
          onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = "#2d6a4f"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(45,106,79,0.1)"; }}
          onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = "#d8e8e0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
          <div style={{ fontSize: "28px" }}>{"\ud83e\udde0"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif" }}>Discover Your Style</div>
            <div style={{ fontSize: "12px", color: "#52796f", fontFamily: "-apple-system, sans-serif", marginTop: "2px" }}>Quick quizzes you can compare with anyone</div>
          </div>
          <div style={{ fontSize: "18px", color: "#2d6a4f" }}>{"\u2192"}</div>
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {SCENARIOS.map((s) => {
            const locked = isCategoryLocked(s.category);
            return (
            <button key={s.category} onClick={() => { if (locked) { setShowPaywall(true); return; } forteSound.category(); setSelectedCategory(s); setPhase("scenario"); }}
              style={{ background: locked ? "#f5f5f5" : "#fff", border: `1px solid ${locked ? "#e0e0e0" : "#d8e8e0"}`, borderRadius: "16px", padding: "28px 24px", textAlign: "left", cursor: "pointer", transition: "all 0.25s", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { if (!locked) { e.currentTarget.style.borderColor = s.accent; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${s.accent}18`; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = locked ? "#e0e0e0" : "#d8e8e0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ color: locked ? "#c0c0c0" : s.accent, marginBottom: "14px", filter: locked ? "grayscale(1)" : "none" }}><Icon html={ICONS[s.iconKey as keyof typeof ICONS]} size={28} color={locked ? "#c0c0c0" : s.accent} /></div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: locked ? "#aaa" : "#1a2e1a", marginBottom: "4px", fontFamily: "-apple-system, sans-serif" }}>{s.category}</div>
              {locked && <div style={{ position: "absolute", top: "12px", right: "12px", fontSize: "16px" }}>🔒</div>}
              {!locked && !isPro && <div style={{ fontSize: "11px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginTop: "4px" }}>{3 - sessionsUsed} session{3 - sessionsUsed !== 1 ? "s" : ""} left</div>}
            </button>
            );
          })}
          <button onClick={() => { if (!isPro) { setShowPaywall(true); return; } forteSound.category(); setSelectedCategory({ accent: "#7c5cbf", color: "#f5f0fa" }); setSelfTool(""); setPhase("self_hub"); }}
            style={{ background: isPro ? "#fff" : "#f5f5f5", border: `1px solid ${isPro ? "#e0d5f5" : "#e0e0e0"}`, borderRadius: "16px", padding: "28px 24px", textAlign: "left", cursor: "pointer", transition: "all 0.25s", position: "relative" }}
            onMouseEnter={e => { if (isPro) { e.currentTarget.style.borderColor = "#7c5cbf"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px #7c5cbf18"; } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isPro ? "#e0d5f5" : "#e0e0e0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ color: isPro ? "#7c5cbf" : "#c0c0c0", marginBottom: "14px", filter: isPro ? "none" : "grayscale(1)" }}><Icon html={ICONS.self} size={28} color={isPro ? "#7c5cbf" : "#c0c0c0"} /></div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: isPro ? "#1a2e1a" : "#aaa", marginBottom: "4px", fontFamily: "-apple-system, sans-serif" }}>Self</div>
            <div style={{ fontSize: "12px", color: isPro ? "#9b8abf" : "#c0c0c0" }}>Affirmations · Journal · Meditation · Problem solver</div>
            {!isPro && <div style={{ position: "absolute", top: "12px", right: "12px", fontSize: "16px" }}>🔒</div>}
          </button>
          <button onClick={() => { if (!isPro) { setShowPaywall(true); return; } setPhase("custom"); }}
            style={{ background: isPro ? "#fff" : "#f5f5f5", border: `1px ${isPro ? "dashed #b7d8c8" : "solid #e0e0e0"}`, borderRadius: "16px", padding: "28px 24px", textAlign: "left", cursor: "pointer", transition: "all 0.25s", gridColumn: "span 2", position: "relative" }}
            onMouseEnter={e => { if (isPro) { e.currentTarget.style.borderColor = "#2d6a4f"; e.currentTarget.style.background = "#f0f7f4"; } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isPro ? "#b7d8c8" : "#e0e0e0"; e.currentTarget.style.background = isPro ? "#fff" : "#f5f5f5"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <Icon html={ICONS.custom} size={28} color={isPro ? "#2d6a4f" : "#c0c0c0"} />
              <div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: isPro ? "#1a2e1a" : "#aaa", fontFamily: "-apple-system, sans-serif" }}>Create Your Own Scenario</div>
                <div style={{ fontSize: "13px", color: isPro ? "#84a98c" : "#c0c0c0", marginTop: "2px" }}>Describe any situation you want to practice</div>
              </div>
              {!isPro && <div style={{ marginLeft: "auto", fontSize: "16px" }}>🔒</div>}
            </div>
          </button>
        </div>
        
        <p style={{ textAlign: "center", color: "#b7c9be", fontSize: "12px", marginTop: "48px", fontFamily: "-apple-system, sans-serif" }}>
          Learn with examples · Practice with AI · Get personal coaching feedback
        </p>
        {!isPro && (
          <button onClick={() => setShowPaywall(true)} style={{ display: "block", margin: "16px auto 0", padding: "10px 24px", background: "transparent", border: "1.5px solid #2d6a4f", borderRadius: "99px", color: "#2d6a4f", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
            ✦ Unlock all categories — $4.99/mo
          </button>
        )}
      </div>
      {paywallOverlay}
      {progressOverlay}
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

    // If a subcategory is selected, show its scenarios
    if (subcategoryFilter !== "All") {
      const group = groups.find(g => g.name === subcategoryFilter);
      return (
        <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
          <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px 64px" }}>
            <button onClick={() => { forteSound.stepBack(); setSubcategoryFilter("All"); }} style={{ background: "transparent", border: "none", color: "#84a98c", cursor: "pointer", fontSize: "14px", marginBottom: "36px", padding: 0, fontFamily: "-apple-system, sans-serif" }}>← Back</button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <Icon html={ICONS[selectedCategory.iconKey as keyof typeof ICONS]} size={24} color={selectedCategory.accent} />
              <h2 style={{ fontSize: "28px", fontWeight: "400", margin: 0, color: "#1a2e1a" }}>{subcategoryFilter}</h2>
            </div>
            <p style={{ color: "#84a98c", fontSize: "14px", marginBottom: "36px", fontFamily: "-apple-system, sans-serif" }}>Choose a scenario — you'll learn first, then practice.</p>
            <div style={{ border: `1.5px solid ${selectedCategory.accent}22`, borderRadius: "14px", overflow: "hidden" }}>
              {group?.situations.map((s: any, i: number) => {
                const scenarioLocked = !isPro && i >= 2;
                const showSubgroupHeader = s.subgroup && (i === 0 || group.situations[i - 1]?.subgroup !== s.subgroup);
                return (
                <div key={i}>
                {showSubgroupHeader && (
                  <div style={{ padding: "14px 24px 10px", background: `${selectedCategory.accent}08`, borderTop: i > 0 ? `1.5px solid ${selectedCategory.accent}22` : "none" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: selectedCategory.accent, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "-apple-system, sans-serif" }}>{s.subgroup}</div>
                  </div>
                )}
                <button onClick={() => { if (scenarioLocked) { setShowPaywall(true); return; } if (!canPractice) { setShowPaywall(true); return; } forteSound.select(); setSelectedSituation(s); setLessonIndex(0); setRedFlagStep(0); setPhase("learn"); }}
                  style={{ width: "100%", background: scenarioLocked ? "#fafafa" : "#fff", border: "none", borderTop: !showSubgroupHeader && i > 0 ? "1px solid #e8f0ec" : "none", padding: "20px 24px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.15s" }}
                  onMouseEnter={e => { if (!scenarioLocked) e.currentTarget.style.background = selectedCategory.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = scenarioLocked ? "#fafafa" : "#fff"; }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: scenarioLocked ? "#aaa" : "#1a2e1a", marginBottom: "4px", fontFamily: "-apple-system, sans-serif" }}>{s.title}</div>
                    <div style={{ fontSize: "13px", color: "#84a98c", fontStyle: "italic", filter: scenarioLocked ? "blur(5px)" : "none", userSelect: scenarioLocked ? "none" : "auto" }}>{s.subtitle}</div>
                  </div>
                  {scenarioLocked
                    ? <div style={{ fontSize: "16px", marginLeft: "12px", flexShrink: 0 }}>🔒</div>
                    : <div style={{ fontSize: "20px", color: selectedCategory.accent, marginLeft: "12px", flexShrink: 0 }}>›</div>
                  }
                </button>
                </div>
                );
              })}
            </div>
          </div>
          {paywallOverlay}
        </div>
      );
    }

    // Default: show subcategory cards
    return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px 64px" }}>
        <button onClick={() => { forteSound.stepBack(); setPhase("home"); }} style={{ background: "transparent", border: "none", color: "#84a98c", cursor: "pointer", fontSize: "14px", marginBottom: "36px", padding: 0, fontFamily: "-apple-system, sans-serif" }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <Icon html={ICONS[selectedCategory.iconKey as keyof typeof ICONS]} size={24} color={selectedCategory.accent} />
          <h2 style={{ fontSize: "28px", fontWeight: "400", margin: 0, color: "#1a2e1a" }}>{selectedCategory.category}</h2>
        </div>
        <p style={{ color: "#84a98c", fontSize: "14px", marginBottom: "36px", fontFamily: "-apple-system, sans-serif" }}>Choose a topic to explore.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {groups.map((group) => (
            <button key={group.name}
              onClick={() => { forteSound.select(); setSubcategoryFilter(group.name); }}
              style={{ background: "#fff", border: `1.5px solid ${selectedCategory.accent}22`, borderRadius: "14px", padding: "20px 24px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.background = selectedCategory.color; e.currentTarget.style.borderColor = selectedCategory.accent; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = `${selectedCategory.accent}22`; e.currentTarget.style.transform = "none"; }}>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif" }}>{group.name}</div>
              <div style={{ fontSize: "20px", color: selectedCategory.accent, flexShrink: 0 }}>›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
    );
  }

  // LEARN PHASE
  // ── RED FLAG EDUCATION — STEP-BY-STEP MOBILE FLOW ──────────────
  if (phase === "learn" && selectedSituation?.isRedFlag && !selectedSituation?.isWorkRedFlag && !redFlagPath) {
    const accent2 = selectedCategory?.accent || "#2d6a4f";
    const desc = selectedSituation.redFlagDescription;
    const stepTitles = ["What This Looks Like", "Why It's Dangerous", "Signs to Watch For", "Ready to Practice"];
    const totalSteps = desc ? 4 : 0;

    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, maxWidth: "600px", margin: "0 auto", padding: "36px 24px 160px", width: "100%" }}>
          <button onClick={() => { if (redFlagStep > 0) { forteSound.stepBack(); setRedFlagStep(redFlagStep - 1); } else { forteSound.stepBack(); setSubcategoryFilter("All"); setPhase("scenario"); setRedFlagStep(0); } }} style={{ background: "transparent", border: "none", color: "#84a98c", cursor: "pointer", fontSize: "14px", marginBottom: "28px", padding: 0, fontFamily: "-apple-system, sans-serif" }}>← Back</button>

          {/* Title — always visible */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", color: accent2, textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", marginBottom: "10px" }}>🚩 Red Flag Training</div>
            <h2 style={{ fontSize: "26px", fontWeight: "400", color: "#1a2e1a", margin: "0 0 10px", lineHeight: 1.25 }}>{selectedSituation.title}</h2>
            <p style={{ fontSize: "14px", color: "#52796f", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>{selectedSituation.subtitle}</p>
          </div>

          {/* Progress dots */}
          {desc && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "28px", alignItems: "center" }}>
              {stepTitles.map((label, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: i <= redFlagStep ? "auto" : "8px",
                    height: "8px",
                    borderRadius: i <= redFlagStep ? "99px" : "50%",
                    background: i <= redFlagStep ? accent2 : "#d8e8e0",
                    padding: i <= redFlagStep ? "4px 12px" : "0",
                    fontSize: "10px",
                    fontWeight: "700",
                    color: "#fff",
                    fontFamily: "-apple-system, sans-serif",
                    letterSpacing: "0.05em",
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                  }}>
                    {i <= redFlagStep ? (i < redFlagStep ? "✓" : `${i + 1}/${totalSteps}`) : ""}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 0: What This Looks Like */}
          {desc && redFlagStep === 0 && (
            <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
              <div style={{ background: "#fff", border: `1.5px solid ${accent2}22`, borderRadius: "18px", padding: "28px 24px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", color: accent2, textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", marginBottom: "14px" }}>What This Looks Like</div>
                <p style={{ fontSize: "15px", color: "#2d3e35", lineHeight: 1.9, margin: 0 }}>{desc.what}</p>
              </div>
            </div>
          )}

          {/* STEP 1: Why It's Dangerous */}
          {desc && redFlagStep === 1 && (
            <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
              <div style={{ background: "#fff", border: "1.5px solid #dc354522", borderRadius: "18px", padding: "28px 24px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", color: "#c0392b", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", marginBottom: "14px" }}>Why It's Dangerous</div>
                <p style={{ fontSize: "15px", color: "#2d3e35", lineHeight: 1.9, margin: 0 }}>{desc.why}</p>
              </div>
            </div>
          )}

          {/* STEP 2: Signs to Watch For */}
          {desc && redFlagStep === 2 && (
            <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
              <div style={{ background: "#fff", border: "1.5px solid #d4a01722", borderRadius: "18px", padding: "28px 24px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", color: "#d4a017", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", marginBottom: "16px" }}>Signs to Watch For</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {desc.signs.map((sign: string, si: number) => (
                    <div key={si} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <div style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>🚩</div>
                      <p style={{ fontSize: "14px", color: "#2d3e35", lineHeight: 1.75, margin: 0 }}>{sign}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Ready to Practice — Path Choice */}
          {desc && redFlagStep === 3 && (
            <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
              {/* What you'll practice */}
              <div style={{ background: selectedCategory?.color || "#f0f7f4", border: `1.5px solid ${accent2}33`, borderRadius: "18px", padding: "24px 24px", marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", color: accent2, textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", marginBottom: "12px" }}>What You'll Practice</div>
                <p style={{ fontSize: "15px", color: "#1a2e1a", lineHeight: 1.85, margin: 0, fontWeight: "500" }}>{desc.training}</p>
              </div>

              {/* Reminder */}
              <div style={{ background: "#fff", border: "1.5px solid #e8d5f533", borderRadius: "14px", padding: "18px 20px", marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", color: "#52796f", lineHeight: 1.75, margin: 0 }}>
                  <strong>Remember:</strong> You don't owe anyone repeated chances. Leaving is always a valid choice.
                </p>
              </div>

              {/* Path choices */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button onClick={() => { forteSound.tap(); setRedFlagPath("navigate"); }}
                  style={{ background: "#fff", border: `1.5px solid ${accent2}33`, borderRadius: "14px", padding: "20px 22px", textAlign: "left", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "26px", flexShrink: 0 }}>💬</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a2e1a", marginBottom: "3px", fontFamily: "-apple-system, sans-serif" }}>Train me to handle this</div>
                    <div style={{ fontSize: "12px", color: "#84a98c", lineHeight: 1.5 }}>See examples, then practice the conversation</div>
                  </div>
                </button>

                <button onClick={() => { forteSound.tap(); setRedFlagPath("leave"); }}
                  style={{ background: "#fff", border: "1.5px solid #e8d5f5", borderRadius: "14px", padding: "20px 22px", textAlign: "left", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "26px", flexShrink: 0 }}>🚪</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a2e1a", marginBottom: "3px", fontFamily: "-apple-system, sans-serif" }}>I know this is a red flag — help me leave</div>
                    <div style={{ fontSize: "12px", color: "#84a98c", lineHeight: 1.5 }}>Guidance on creating distance with self-respect</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FIXED BOTTOM BAR — always visible */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e8f0ec", padding: "16px 24px", display: "flex", gap: "10px", justifyContent: "center", zIndex: 100 }}>
          {redFlagStep < 3 && (
            <>
              <button onClick={() => { forteSound.stepForward(); setRedFlagStep(redFlagStep + 1); }}
                style={{ flex: 1, maxWidth: "280px", padding: "14px", background: accent2, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
                {redFlagStep === 0 ? "Why is this dangerous? →" : redFlagStep === 1 ? "Show me the signs →" : "I'm ready →"}
              </button>
              <button onClick={() => { forteSound.tap(); setRedFlagStep(0); setRedFlagPath("navigate"); }}
                style={{ padding: "14px 18px", background: "transparent", color: accent2, border: `1.5px solid ${accent2}33`, borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", whiteSpace: "nowrap" }}>
                Take me to practice →
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── LEAVING / DISTANCE PATH — STEP-BY-STEP ─────────────────────
  if (phase === "learn" && selectedSituation?.isRedFlag && !selectedSituation?.isWorkRedFlag && redFlagPath === "leave") {
    const accent2 = "#7c5cbf";
    const leavingTips = [
      {
        heading: "You don't need a reason they accept",
        body: "When you decide to end or distance from a relationship, the other person's disagreement does not make your decision wrong. Their hurt, their argument, their counter-narrative — none of that is a veto. You are the only one who decides who gets access to your life.",
        action: "If they ask why: 'This isn't working for me' is a complete sentence. You don't owe them a debate.",
      },
      {
        heading: "Guilt is not a sign you're wrong",
        body: "Feeling guilty when you end a relationship is normal. It doesn't mean you're being cruel — it often means you're a caring person doing something hard. Guilt and correctness can exist at the same time. Don't let guilt keep you in something unhealthy.",
        action: "When guilt shows up, say to yourself: 'I can feel bad about this and still know it's right.'",
      },
      {
        heading: "Fading out vs. direct conversation",
        body: "You don't always need a 'breakup conversation.' Slowly reducing contact, not initiating, keeping interactions brief — these are legitimate ways to create distance. Sometimes the most self-protective thing is a quiet, gradual exit.",
        action: "Only have a direct conversation if YOU need it for closure — not because you feel obligated to give them one.",
      },
      {
        heading: "If you say something, keep it short and final",
        body: "The most effective approach is brief, kind, and final. A long explanation is an invitation to argue. 'This relationship isn't healthy for me and I need to step back' closes the door gently. A list of grievances opens a negotiation.",
        action: "Script it once, say it once. You don't have to respond to their response.",
      },
      {
        heading: "Protecting yourself from retaliation",
        body: "Some people don't accept endings gracefully. They may escalate, guilt-trip publicly, or try to damage your reputation. This is their response to losing control — not evidence you were wrong.",
        action: "If the ending feels unsafe, tell someone you trust before you do it. You don't have to do this alone.",
      },
    ];
    const tip = leavingTips[leavingStep];
    const totalLeavingSteps = leavingTips.length;
    const isLastTip = leavingStep >= totalLeavingSteps - 1;

    return (
      <div style={{ minHeight: "100vh", background: "#f8f3ff", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, maxWidth: "600px", margin: "0 auto", padding: "36px 24px 160px", width: "100%" }}>
          <button onClick={() => { forteSound.stepBack(); if (leavingStep > 0) { setLeavingStep(leavingStep - 1); } else { setRedFlagPath(""); setLeavingStep(0); } }} style={{ background: "transparent", border: "none", color: "#9b8abf", cursor: "pointer", fontSize: "14px", marginBottom: "28px", padding: 0, fontFamily: "-apple-system, sans-serif" }}>← Back</button>

          {/* Title */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", color: accent2, textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", marginBottom: "10px" }}>🚪 Creating Space</div>
            <h2 style={{ fontSize: "24px", fontWeight: "400", color: "#1a2e1a", margin: "0 0 6px", lineHeight: 1.25 }}>You are allowed to leave.</h2>
            <p style={{ fontSize: "14px", color: "#6b5a8a", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>Here's how — one step at a time.</p>
          </div>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "28px", alignItems: "center" }}>
            {leavingTips.map((_, i) => (
              <div key={i} style={{
                width: i === leavingStep ? "24px" : "8px",
                height: "8px",
                borderRadius: "99px",
                background: i <= leavingStep ? accent2 : "#e8d5f5",
                transition: "all 0.3s ease",
              }} />
            ))}
            <span style={{ fontSize: "11px", color: "#9b8abf", fontFamily: "-apple-system, sans-serif", marginLeft: "8px" }}>{leavingStep + 1} of {totalLeavingSteps}</span>
          </div>

          {/* Current tip card */}
          <div style={{ animation: "fadeSlideIn 0.35s ease" }} key={leavingStep}>
            <div style={{ background: "#fff", border: "1.5px solid #e8d5f5", borderRadius: "18px", padding: "28px 24px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f0e8ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: accent2, flexShrink: 0, fontFamily: "-apple-system, sans-serif" }}>{leavingStep + 1}</div>
                <div style={{ fontSize: "17px", fontWeight: "700", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif", lineHeight: 1.3 }}>{tip.heading}</div>
              </div>
              <p style={{ fontSize: "15px", color: "#2d3e35", lineHeight: 1.9, margin: 0 }}>{tip.body}</p>
            </div>

            {/* Try this action card */}
            <div style={{ background: "#f5f0ff", borderRadius: "14px", padding: "20px 22px", borderLeft: "3px solid " + accent2 }}>
              <div style={{ fontSize: "10px", fontWeight: "700", color: accent2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>Try This</div>
              <div style={{ fontSize: "14px", color: "#3d2e5a", lineHeight: 1.75 }}>{tip.action}</div>
            </div>

            {/* Final step: quote + action buttons */}
            {isLastTip && (
              <div style={{ marginTop: "24px" }}>
                <div style={{ background: "#f0e8ff", borderRadius: "14px", padding: "20px 22px", marginBottom: "20px" }}>
                  <p style={{ fontSize: "14px", color: "#3d2e5a", lineHeight: 1.85, margin: 0, fontStyle: "italic" }}>
                    "The most loving thing you can do for yourself is to stop participating in something that isn't working. That is not giving up. That is growing up."
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button onClick={() => { setRedFlagPath("navigate"); setLeavingStep(0); }}
                    style={{ width: "100%", padding: "14px", background: "#fff", color: accent2, border: "1.5px solid #e8d5f5", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
                    💬 I still want to practice the conversation
                  </button>
                  <button onClick={() => { setSubcategoryFilter("All"); setPhase("scenario"); setRedFlagPath(""); setLeavingStep(0); }}
                    style={{ width: "100%", padding: "14px", background: accent2, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
                    I'm good — back to topics
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FIXED BOTTOM BAR */}
        {!isLastTip && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e8d5f5", padding: "16px 24px", display: "flex", gap: "10px", justifyContent: "center", zIndex: 100 }}>
            <button onClick={() => { forteSound.stepForward(); setLeavingStep(leavingStep + 1); }}
              style={{ flex: 1, maxWidth: "280px", padding: "14px", background: accent2, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
              Next →
            </button>
            <button onClick={() => { setRedFlagPath("navigate"); setLeavingStep(0); }}
              style={{ padding: "14px 18px", background: "transparent", color: accent2, border: "1.5px solid #e8d5f533", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", whiteSpace: "nowrap" }}>
              Take me to practice →
            </button>
          </div>
        )}
      </div>
    );
  }

  if (phase === "learn" && selectedSituation?.lessons && (!selectedSituation?.isRedFlag || selectedSituation?.isWorkRedFlag || redFlagPath === "navigate")) {
    const lessons = selectedSituation.lessons;
    const lesson = lessons[lessonIndex];
    const isLast = lessonIndex >= lessons.length - 1;
    return (
      <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 60px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
            <button onClick={() => { setPhase("scenario"); setRedFlagPath(""); }} style={{ background: "transparent", border: "none", color: "#84a98c", cursor: "pointer", fontSize: "14px", padding: 0, fontFamily: "-apple-system, sans-serif" }}>← Back</button>
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
            <button onClick={() => { isLast ? (forteSound.practiceStart(), startChat(selectedSituation)) : (forteSound.nextTip(), setLessonIndex(i => i + 1)); }}
              style={{ flex: 1, padding: "15px", background: accent, color: "#fff", border: "none", fontSize: "14px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>
              {isLast ? "Start Practice →" : "Next Tip →"}
            </button>
          </div>
        </div>
        {paywallOverlay}
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

      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {messages.map((m: any, i: number) => {
          if (m.role === "user") {
            return (
              <div key={i} style={{ display: "flex", flexDirection: "row-reverse", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", flexShrink: 0, color: "#fff", fontFamily: "-apple-system, sans-serif", fontWeight: "700" }}>You</div>
                <div style={{ maxWidth: "74%", padding: "14px 18px", background: accent, borderRadius: "18px 4px 18px 18px", fontSize: "14px", lineHeight: "1.7", color: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                  {m.content}
                </div>
              </div>
            );
          }
          // AI message — extract scene cues
          const { cues, cleanText } = extractSceneCues(m.content);
          const roleLabel = (selectedSituation?.ai_role || "partner").replace(/^your /i, "").replace(/^a /i, "");
          const roleLabelFull = `Your ${roleLabel}`;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start", maxWidth: "82%" }}>
              {/* Scene / action box */}
              {cues.length > 0 && (
                <div style={{ background: "#f0f4f2", border: "1px solid #dce8e0", borderRadius: "10px", padding: "8px 14px", fontSize: "12px", color: "#52796f", fontStyle: "italic", fontFamily: "-apple-system, sans-serif", lineHeight: "1.6", width: "100%" }}>
                  {cues.map((cue, ci) => <span key={ci}>{ci > 0 ? " · " : ""}{cue}</span>)}
                </div>
              )}
              {/* Speaker label */}
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#84a98c", fontFamily: "-apple-system, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", paddingLeft: "4px" }}>
                {roleLabelFull} says:
              </div>
              {/* Speech bubble */}
              <div style={{ padding: "14px 18px", background: "#fff", borderRadius: "4px 18px 18px 18px", fontSize: "14px", lineHeight: "1.7", color: "#1a2e1a", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: "1px solid #e8f0ec" }}>
                {cleanText}
              </div>
              {/* Listen button */}
              <button
                onClick={() => {
                  if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
                  setSpeaking(true);
                  speak(cleanText, selectedSituation?.voice || { pitch: 1.0, rate: 0.8, preferFemale: true }, () => setSpeaking(false));
                }}
                style={{ alignSelf: "flex-start", padding: "5px 12px", background: "transparent", color: "#84a98c", border: "1px solid #e8f0ec", borderRadius: "99px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", marginTop: "2px", transition: "all 0.15s" }}>
                {speaking ? "🔊 Stop" : "🔊 Listen"}
              </button>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start", maxWidth: "82%" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#84a98c", fontFamily: "-apple-system, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", paddingLeft: "4px" }}>
              Your {(selectedSituation?.ai_role || "partner").replace(/^your /i, "").replace(/^a /i, "")} says:
            </div>
            <div style={{ padding: "14px 18px", background: "#fff", borderRadius: "4px 18px 18px 18px", display: "flex", gap: "5px", alignItems: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: "1px solid #e8f0ec" }}>
              {[0,1,2].map((i) => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: accent, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
              <span style={{ fontSize: "12px", color: "#84a98c", marginLeft: "8px", fontFamily: "-apple-system, sans-serif" }}>thinking...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>


      {/* ── FEEDBACK CELEBRATION MODAL ──────────────────────────── */}

      {/* Red Flag Intervention Popup */}
      {showRedFlagPopup && selectedSituation?.redFlagAlert && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(40,10,10,0.6)", backdropFilter: "blur(6px)" }} />
          <div style={{ position: "relative", background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.3)", animation: "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>

            {/* Warning header */}
            <div style={{ background: "linear-gradient(135deg, #dc354518, #dc354508)", borderRadius: "24px 24px 0 0", padding: "36px 28px 24px", textAlign: "center", borderBottom: "1px solid #f0d0d0" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🚩</div>
              <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.2em", color: "#c0392b", textTransform: "uppercase", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>Pause — Red Flag Detected</div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a", fontFamily: "Georgia, serif", lineHeight: 1.3 }}>You spotted something important.</div>
            </div>

            {/* Warning body */}
            <div style={{ padding: "24px 28px" }}>
              <div style={{ fontSize: "15px", color: "#333", lineHeight: 1.8, fontFamily: "Georgia, serif", marginBottom: "28px" }}>
                {selectedSituation.redFlagAlert.warning}
              </div>

              <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, fontFamily: "-apple-system, sans-serif", marginBottom: "28px", padding: "16px", background: "#fdf6f6", borderRadius: "12px", borderLeft: "3px solid #c0392b" }}>
                This is a practice scenario, but in real life, this would be a moment to seriously consider your safety and well-being before continuing.
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={() => { forteSound.tap(); setShowRedFlagPopup(false); }}
                  style={{ width: "100%", padding: "15px", background: "#fff", color: "#52796f", border: "1.5px solid #d8e8e0", fontSize: "14px", borderRadius: "14px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600", transition: "all 0.15s" }}>
                  I want to keep practicing this conversation →
                </button>
                <button
                  onClick={() => {
                    forteSound.affirm();
                    setShowRedFlagPopup(false);
                    setRedFlagExited(true);
                    setPhase("done");
                    window.speechSynthesis.cancel();
                    setSpeaking(false);
                  }}
                  style={{ width: "100%", padding: "15px", background: "#c0392b", color: "#fff", border: "none", fontSize: "14px", borderRadius: "14px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600", transition: "all 0.15s" }}>
                  I've seen enough — I know what I need to know
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Red Flag Exit Affirmation */}
      {redFlagExited && phase === "done" && selectedSituation?.redFlagAlert && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,30,20,0.55)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.25)", animation: "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>

            {/* Affirmation header */}
            <div style={{ background: "linear-gradient(135deg, #2d6a4f18, #2d6a4f08)", borderRadius: "24px 24px 0 0", padding: "40px 28px 28px", textAlign: "center", borderBottom: "1px solid #e8f0ec" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>💚</div>
              <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.2em", color: "#2d6a4f", textTransform: "uppercase", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>You Chose Yourself ✦</div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a", fontFamily: "Georgia, serif", lineHeight: 1.3 }}>That's the whole lesson.</div>
            </div>

            {/* Affirmation body */}
            <div style={{ padding: "24px 28px" }}>
              <div style={{ fontSize: "15px", color: "#333", lineHeight: 1.9, fontFamily: "Georgia, serif", marginBottom: "28px" }}>
                {selectedSituation.redFlagAlert.affirmation}
              </div>

              <div style={{ padding: "18px", background: "#f0f7f4", borderRadius: "14px", borderLeft: "3px solid #2d6a4f", marginBottom: "24px" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>✦ Remember</div>
                <div style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.7, fontStyle: "italic", fontFamily: "Georgia, serif" }}>
                  Walking away is not giving up. It's choosing yourself. And that is always the right answer.
                </div>
              </div>

              {/* Also Try... */}
              {(() => {
                const recs = getRecommendations(selectedSituation, SCENARIOS, 2);
                if (recs.length === 0) return null;
                return (
                  <div style={{ padding: "16px", background: "#f8faf8", borderRadius: "14px", border: "1px solid #e8f0ec", marginBottom: "16px" }}>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px", fontFamily: "-apple-system, sans-serif" }}>Keep building your skills</div>
                    {recs.map((rec: any, ri: number) => (
                      <button key={ri}
                        onClick={() => {
                          forteSound.select();
                          setRedFlagExited(false);
                          setFeedback(null);
                          setMessages([]);
                          setUserTurns(0);
                          setRedFlagPath("");
                          setRedFlagStep(0);
                          setLeavingStep(0);
                          setSelectedSituation(rec);
                          setLessonIndex(0);
                          const parentCat = SCENARIOS.find(c => c.situations?.some((s: any) => s.title === rec.title));
                          if (parentCat) setSelectedCategory(parentCat);
                          setPhase("learn");
                        }}
                        style={{ width: "100%", background: "#fff", border: "1px solid #e8f0ec", borderRadius: "10px", padding: "11px 14px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", marginTop: ri > 0 ? "6px" : "0", transition: "all 0.15s" }}
                      >
                        <div style={{ fontSize: "16px", flexShrink: 0 }}>{rec.isRedFlag ? "🚩" : "💬"}</div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif", lineHeight: 1.3 }}>{rec.title}</div>
                        <div style={{ marginLeft: "auto", fontSize: "16px", color: "#84a98c", flexShrink: 0 }}>›</div>
                      </button>
                    ))}
                  </div>
                );
              })()}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => { setRedFlagExited(false); setLessonIndex(0); setPhase("learn"); }}
                  style={{ flex: 1, padding: "14px", background: "#f0f7f4", color: "#2d6a4f", border: "1px solid #d8e8e0", fontSize: "13px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>
                  Review Tips
                </button>
                <button onClick={() => { setRedFlagExited(false); reset(); }}
                  style={{ flex: 1, padding: "14px", background: accent, color: "#fff", border: "none", fontSize: "13px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && feedback && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowFeedbackModal(false); }}>
          {/* Backdrop */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,30,20,0.55)", backdropFilter: "blur(4px)" }} />
          {/* Modal card */}
          <div style={{ position: "relative", background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.25)", animation: "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <style>{`
              @keyframes modalPop { from { opacity: 0; transform: scale(0.85) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
              @keyframes confettiFall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1; } 100% { transform: translateY(60px) rotate(360deg); opacity: 0; } }
            `}</style>

            {/* Confetti burst */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "80px", overflow: "hidden", borderRadius: "24px 24px 0 0", pointerEvents: "none" }}>
              {["#2d6a4f","#52796f","#95d5b2","#d4a017","#40916c","#b7e4c7"].map((color, i) => (
                <div key={i} style={{ position: "absolute", left: `${10 + i * 15}%`, top: "-8px", width: "8px", height: "8px", background: color, borderRadius: i % 2 === 0 ? "50%" : "2px", animation: `confettiFall ${0.8 + i * 0.15}s ease-in ${i * 0.08}s both` }} />
              ))}
              {["#2d6a4f","#95d5b2","#d4a017","#52796f","#b7e4c7","#40916c"].map((color, i) => (
                <div key={i+6} style={{ position: "absolute", left: `${5 + i * 16}%`, top: "-4px", width: "6px", height: "6px", background: color, borderRadius: i % 2 === 0 ? "2px" : "50%", animation: `confettiFall ${0.7 + i * 0.2}s ease-in ${0.1 + i * 0.1}s both` }} />
              ))}
            </div>

            {/* Score header */}
            <div style={{ background: `linear-gradient(135deg, ${accent}18, ${accent}08)`, borderRadius: "24px 24px 0 0", padding: "40px 32px 28px", textAlign: "center", borderBottom: "1px solid #e8f0ec" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.2em", color: accent, textTransform: "uppercase", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>Session Complete ✦</div>
              <div style={{ fontSize: "80px", fontWeight: "300", lineHeight: 1, color: accent, fontFamily: "Georgia, serif" }}>{totalScore}</div>
              <div style={{ fontSize: "14px", color: "#84a98c", marginTop: "4px", fontFamily: "-apple-system, sans-serif" }}>out of 10</div>

              {/* Read choice buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "center" }}>
                <button
                  onClick={() => {
                    setFeedbackReading(true);
                    const text = [
                      `Your session score is ${totalScore} out of 10.`,
                      feedback.bestMoment ? `Your best moment: ${feedback.bestMoment}` : "",
                      feedback.improve ? `One thing to try next time: ${feedback.improve}` : "",
                      feedback.verdict ? `Coach's note: ${feedback.verdict}` : "",
                    ].filter(Boolean).join(" ");
                    const utter = new SpeechSynthesisUtterance(text);
                    utter.rate = 0.88; utter.pitch = 1.05;
                    utter.onend = () => setFeedbackReading(false);
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(utter);
                  }}
                  style={{ padding: "10px 20px", background: feedbackReading ? accent : "#f0f7f4", color: feedbackReading ? "#fff" : accent, border: `1.5px solid ${accent}44`, borderRadius: "99px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
                  {feedbackReading ? "🔊 Reading..." : "🔊 Read it to me"}
                </button>
                {feedbackReading && (
                  <button onClick={() => { window.speechSynthesis.cancel(); setFeedbackReading(false); }}
                    style={{ padding: "10px 16px", background: "#fff", color: "#84a98c", border: "1.5px solid #e8f0ec", borderRadius: "99px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif" }}>
                    Stop
                  </button>
                )}
              </div>
            </div>

            {/* Scores */}
            <div style={{ padding: "24px 32px" }}>
              <ScoreBar label="Warmth" score={feedback.warmth} accent={accent} />
              <ScoreBar label="Clarity" score={feedback.clarity} accent={accent} />
              <ScoreBar label="Listening" score={feedback.listening} accent={accent} />
              <ScoreBar label="Confidence" score={feedback.confidence} accent={accent} />
              <ScoreBar label="Body Language Awareness" score={feedback.bodyLanguage} accent={accent} />

              {feedback.bestMoment && (
                <div style={{ marginTop: "20px", padding: "18px", background: "#f0f7f4", borderRadius: "14px", borderLeft: "3px solid #2d6a4f" }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#2d6a4f", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>✦ Best Moment</div>
                  <div style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.7, fontStyle: "italic" }}>{feedback.bestMoment}</div>
                </div>
              )}
              {feedback.bodyLanguageNotes && (
                <div style={{ marginTop: "10px", padding: "18px", background: "#f4f7f0", borderRadius: "14px", borderLeft: "3px solid #40916c" }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#40916c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>Scene Awareness</div>
                  <div style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.7 }}>{feedback.bodyLanguageNotes}</div>
                </div>
              )}
              {feedback.improve && (
                <div style={{ marginTop: "10px", padding: "18px", background: "#faf8f0", borderRadius: "14px", borderLeft: "3px solid #d4a017" }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#d4a017", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>One Thing to Try Next Time</div>
                  <div style={{ fontSize: "14px", color: "#1a2e1a", lineHeight: 1.7 }}>{feedback.improve}</div>
                </div>
              )}
              {feedback.verdict && (
                <div style={{ marginTop: "10px", padding: "18px", background: "#f8faf8", borderRadius: "14px" }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "-apple-system, sans-serif" }}>Coach's Note</div>
                  <div style={{ fontSize: "15px", color: "#1a2e1a", lineHeight: 1.8, fontStyle: "italic" }}>{feedback.verdict}</div>
                </div>
              )}

              {/* Also Try... Recommendations */}
              {(() => {
                const recs = getRecommendations(selectedSituation, SCENARIOS);
                if (recs.length === 0) return null;
                return (
                  <div style={{ marginTop: "20px", padding: "18px", background: "#f8faf8", borderRadius: "14px", border: "1px solid #e8f0ec" }}>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#84a98c", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", fontFamily: "-apple-system, sans-serif" }}>People who practiced this also tried</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {recs.map((rec: any, ri: number) => (
                        <button key={ri}
                          onClick={() => {
                            forteSound.select();
                            setShowFeedbackModal(false);
                            setFeedback(null);
                            setMessages([]);
                            setUserTurns(0);
                            setRedFlagPath("");
                            setRedFlagStep(0);
                            setLeavingStep(0);
                            setSelectedSituation(rec);
                            setLessonIndex(0);
                            // Find and set the correct parent category
                            const parentCat = SCENARIOS.find(c => c.situations?.some((s: any) => s.title === rec.title));
                            if (parentCat) setSelectedCategory(parentCat);
                            setPhase("learn");
                          }}
                          style={{
                            width: "100%",
                            background: "#fff",
                            border: "1px solid #e8f0ec",
                            borderRadius: "10px",
                            padding: "12px 14px",
                            textAlign: "left",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#f0f7f4"; e.currentTarget.style.borderColor = accent; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e8f0ec"; }}
                        >
                          <div style={{ fontSize: "18px", flexShrink: 0 }}>
                            {rec.isRedFlag ? "🚩" : rec._catName === "Family Conversations" ? "🏠" : rec._catName === "Dating & Romance" ? "💕" : rec._catName === "Building Friendships" ? "🤝" : "💼"}
                          </div>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1a2e1a", fontFamily: "-apple-system, sans-serif", lineHeight: 1.3 }}>{rec.title}</div>
                            <div style={{ fontSize: "11px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginTop: "2px" }}>{rec.subcategory}</div>
                          </div>
                          <div style={{ marginLeft: "auto", fontSize: "16px", color: "#84a98c", flexShrink: 0 }}>›</div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                <button onClick={() => { setShowFeedbackModal(false); setLessonIndex(0); setPhase("learn"); }} style={{ flex: 1, padding: "13px", background: "#f0f7f4", color: "#2d6a4f", border: "1px solid #d8e8e0", fontSize: "13px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>Review Tips</button>
                <button onClick={() => { setShowFeedbackModal(false); startChat(selectedSituation); }} style={{ flex: 1, padding: "13px", background: accent, color: "#fff", border: "none", fontSize: "13px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>Try Again</button>
                <button onClick={() => { setShowFeedbackModal(false); reset(); }} style={{ flex: 1, padding: "13px", background: "#fff", color: "#84a98c", border: "1px solid #e8f0ec", fontSize: "13px", borderRadius: "12px", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>New</button>
              </div>

              {/* Share Score Card */}
              <button
                onClick={async () => {
                  forteSound.affirm();
                  const W = 720, H = 1280;
                  const c = document.createElement("canvas");
                  c.width = W; c.height = H;
                  const g = c.getContext("2d")!;

                  // Background gradient
                  const grad = g.createLinearGradient(0, 0, 0, H);
                  grad.addColorStop(0, "#1a2e1a");
                  grad.addColorStop(0.4, "#2d3e2d");
                  grad.addColorStop(1, "#1a2e1a");
                  g.fillStyle = grad;
                  g.fillRect(0, 0, W, H);

                  // Subtle decorative circles
                  g.globalAlpha = 0.04;
                  g.beginPath(); g.arc(580, 200, 300, 0, Math.PI * 2); g.fillStyle = "#95d5b2"; g.fill();
                  g.beginPath(); g.arc(140, 900, 250, 0, Math.PI * 2); g.fillStyle = "#52796f"; g.fill();
                  g.globalAlpha = 1;

                  // FORTE branding
                  g.fillStyle = "#52796f";
                  g.font = "700 13px -apple-system, sans-serif";
                  g.letterSpacing = "6px";
                  g.textAlign = "center";
                  g.fillText("F O R T E", W / 2, 80);

                  g.fillStyle = "#84a98c";
                  g.font = "400 13px -apple-system, sans-serif";
                  g.letterSpacing = "2px";
                  g.fillText("SOCIAL  SKILLS  TRAINING", W / 2, 105);

                  // Divider line
                  g.strokeStyle = "#52796f44";
                  g.lineWidth = 1;
                  g.beginPath(); g.moveTo(260, 130); g.lineTo(460, 130); g.stroke();

                  // Session complete
                  g.fillStyle = "#95d5b2";
                  g.font = "700 12px -apple-system, sans-serif";
                  g.letterSpacing = "4px";
                  g.fillText("SESSION COMPLETE ✦", W / 2, 180);

                  // Big score
                  g.fillStyle = "#fff";
                  g.font = "200 140px Georgia, serif";
                  g.letterSpacing = "0px";
                  g.fillText(String(totalScore), W / 2, 340);

                  g.fillStyle = "#84a98c";
                  g.font = "400 18px -apple-system, sans-serif";
                  g.fillText("out of 10", W / 2, 375);

                  // Scenario title
                  g.fillStyle = "#b7e4c7";
                  g.font = "italic 400 18px Georgia, serif";
                  const scenarioText = selectedSituation?.title || "";
                  // Word wrap scenario title
                  const words = scenarioText.split(" ");
                  let titleLines: string[] = [];
                  let currentLine = "";
                  words.forEach((word: string) => {
                    const test = currentLine ? currentLine + " " + word : word;
                    if (g.measureText(test).width > 480) {
                      titleLines.push(currentLine);
                      currentLine = word;
                    } else {
                      currentLine = test;
                    }
                  });
                  if (currentLine) titleLines.push(currentLine);
                  titleLines.forEach((line, li) => {
                    g.fillText(line, W / 2, 430 + li * 28);
                  });

                  // Score bars
                  const scores = [
                    { label: "Warmth", val: feedback.warmth },
                    { label: "Clarity", val: feedback.clarity },
                    { label: "Listening", val: feedback.listening },
                    { label: "Confidence", val: feedback.confidence },
                    { label: "Body Language", val: feedback.bodyLanguage },
                  ];
                  const barY = 500 + titleLines.length * 28;
                  const barX = 100;
                  const barW = 420;

                  scores.forEach((s, i) => {
                    const y = barY + i * 56;
                    // Label
                    g.textAlign = "left";
                    g.fillStyle = "#b7e4c7";
                    g.font = "600 14px -apple-system, sans-serif";
                    g.fillText(s.label, barX, y);
                    // Score number
                    g.textAlign = "right";
                    g.fillStyle = "#fff";
                    g.font = "600 14px -apple-system, sans-serif";
                    g.fillText(String(s.val) + "/10", barX + barW + 80, y);
                    // Bar background
                    g.fillStyle = "#ffffff15";
                    g.beginPath();
                    g.roundRect(barX, y + 8, barW, 10, 5);
                    g.fill();
                    // Bar fill
                    const fillW = (s.val / 10) * barW;
                    const barGrad = g.createLinearGradient(barX, 0, barX + fillW, 0);
                    barGrad.addColorStop(0, "#40916c");
                    barGrad.addColorStop(1, "#95d5b2");
                    g.fillStyle = barGrad;
                    g.beginPath();
                    g.roundRect(barX, y + 8, fillW, 10, 5);
                    g.fill();
                  });

                  // Best moment
                  if (feedback.bestMoment) {
                    const bmY = barY + scores.length * 56 + 40;
                    g.textAlign = "center";
                    g.fillStyle = "#52796f";
                    g.font = "700 11px -apple-system, sans-serif";
                    g.letterSpacing = "3px";
                    g.fillText("✦  BEST MOMENT", W / 2, bmY);
                    g.letterSpacing = "0px";

                    // Word wrap best moment
                    g.fillStyle = "#d4e8dc";
                    g.font = "italic 400 16px Georgia, serif";
                    const bmWords = feedback.bestMoment.split(" ");
                    let bmLines: string[] = [];
                    let bmLine = "";
                    bmWords.forEach((word: string) => {
                      const test = bmLine ? bmLine + " " + word : word;
                      if (g.measureText(test).width > 500) {
                        bmLines.push(bmLine);
                        bmLine = word;
                      } else {
                        bmLine = test;
                      }
                    });
                    if (bmLine) bmLines.push(bmLine);
                    bmLines.slice(0, 4).forEach((line, li) => {
                      g.fillText(line, W / 2, bmY + 30 + li * 26);
                    });
                  }

                  // Footer
                  g.textAlign = "center";
                  g.fillStyle = "#52796f88";
                  g.font = "400 13px -apple-system, sans-serif";
                  g.fillText("Practice your people skills", W / 2, H - 60);
                  g.fillStyle = "#52796f55";
                  g.font = "400 11px -apple-system, sans-serif";
                  g.fillText("forteapp.co", W / 2, H - 38);

                  // Convert to image and share/download
                  c.toBlob(async (blob) => {
                    if (!blob) return;
                    const file = new File([blob], "forte-score.png", { type: "image/png" });
                    if (navigator.share && navigator.canShare?.({ files: [file] })) {
                      try {
                        await navigator.share({ files: [file], title: "My FORTE Score" });
                      } catch {}
                    } else {
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url; a.download = "forte-score.png";
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  }, "image/png");
                }}
                style={{ width: "100%", marginTop: "12px", padding: "14px", background: "linear-gradient(135deg, #1a2e1a, #2d3e2d)", color: "#95d5b2", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "-apple-system, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                📤 Share My Score Card
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "chat" && (
        <div style={{ background: "#fff", borderTop: "1px solid #e8f0ec", padding: "14px 24px", flexShrink: 0 }}>
          {!loading && (loadingSuggestions || currentSuggestions.length > 0) && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", color: "#84a98c", fontFamily: "-apple-system, sans-serif", marginBottom: "7px", fontWeight: "600", letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                Try saying:
                {loadingSuggestions && <span style={{ fontSize: "10px", color: "#b0c4b8", fontWeight: "400", fontStyle: "italic" }}>generating...</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {loadingSuggestions
                  ? [0,1,2].map(i => (
                      <div key={i} style={{ background: "#f5f8f6", border: "1px solid #e8f0ec", borderRadius: "10px", padding: "9px 14px", height: "38px", animation: "pulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
                    ))
                  : currentSuggestions.map((s: string, i: number) => (
                      <button key={i} onClick={() => sendMessage(s)}
                        style={{ background: "#f0f7f4", border: "1px solid #d8e8e0", borderRadius: "10px", padding: "9px 14px", textAlign: "left", cursor: "pointer", fontSize: "13px", color: "#2d6a4f", fontFamily: "Georgia, serif", lineHeight: 1.4, transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#e0f0e8"; e.currentTarget.style.borderColor = accent; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#f0f7f4"; e.currentTarget.style.borderColor = "#d8e8e0"; }}>
                        "{s}"
                      </button>
                    ))
                }
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
                disabled={loading} rows={2}
                style={{ flex: 1, padding: "12px 16px", border: "1.5px solid #d8e8e0", borderRadius: "12px", fontSize: "14px", fontFamily: "Georgia, serif", color: "#1a2e1a", background: "#fff", outline: "none", resize: "none" }} />
              <button onClick={() => sendMessage(typedMessage.trim())} disabled={!typedMessage.trim() || loading}
                style={{ padding: "12px 18px", background: typedMessage.trim() && !loading ? accent : "#e8f0ec", color: typedMessage.trim() && !loading ? "#fff" : "#84a98c", border: "none", borderRadius: "12px", fontSize: "14px", cursor: typedMessage.trim() && !loading ? "pointer" : "not-allowed", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>
                Send →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              {transcript && <div style={{ fontSize: "13px", color: "#84a98c", fontStyle: "italic", textAlign: "center" }}>"{transcript}"</div>}
              <button onMouseDown={startListening} onMouseUp={stopListeningAndSend} onTouchStart={startListening} onTouchEnd={stopListeningAndSend}
                disabled={loading}
                style={{ width: "68px", height: "68px", borderRadius: "50%", background: listening ? "#c0392b" : loading ? "#e8f0ec" : accent, border: listening ? "4px solid #e8a89e" : "4px solid transparent", cursor: loading ? "not-allowed" : "pointer", fontSize: "24px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: listening ? "0 0 0 12px rgba(192,57,43,0.1)" : `0 6px 20px ${accent}30`, transition: "all 0.15s" }}>
                {listening ? "🎙️" : loading ? "⏳" : "🎤"}
              </button>
              <div style={{ fontSize: "11px", color: "#84a98c", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "-apple-system, sans-serif", fontWeight: "600" }}>
                {listening ? "Release to send" : loading ? "Thinking..." : "Hold to speak"}
              </div>
            </div>
          )}
        </div>
      )}

      {paywallOverlay}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.1); } }
          @keyframes modalPop { from { opacity: 0; transform: scale(0.85) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f8faf8; }
        ::-webkit-scrollbar-thumb { background: #d8e8e0; border-radius: 2px; }
        input:focus, textarea:focus { border-color: #2d6a4f !important; }
      `}</style>
    </div>
  );
}
