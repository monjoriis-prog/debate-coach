"use client";
import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = (topic, userSide) => `You are ARCHON — a razor-sharp AI debate coach and opponent. The user is arguing: "${userSide}" on the topic: "${topic}".

Your job:
1. Argue the OPPOSING side with intelligence and force. Steel-man your position. Don't be easy on them.
2. Challenge their logic, expose weak reasoning, ask pointed follow-up questions.
3. Keep responses concise — 2-4 sentences max per turn. Debates are punchy, not lectures.
4. Use rhetorical techniques: analogies, counter-examples, burden-of-proof challenges.
5. Track logical fallacies they commit. Note them but keep debating.

After exactly 5 user messages, end your response with this EXACT block (fill in real scores):

---SCORECARD---
CLARITY: [1-10]
LOGIC: [1-10]
EVIDENCE: [1-10]
PERSUASION: [1-10]
FALLACIES: [comma-separated list or "None detected"]
VERDICT: [2-3 sentence honest assessment of their debate performance]
---END---

Until the 5th message, do NOT show any scorecard. Just debate hard.`;

const TOPICS = [
  "Social media does more harm than good",
  "AI will eliminate more jobs than it creates",
  "College education is no longer worth the cost",
  "Remote work is better than office work",
  "Cryptocurrency is a legitimate investment",
  "Video games cause violence",
  "Universal Basic Income should be implemented",
];

function parseScorecard(text) {
  const match = text.match(/---SCORECARD---([\s\S]*?)---END---/);
  if (!match) return null;
  const block = match[1];
  const get = (key) => {
    const m = block.match(new RegExp(`${key}:\\s*(.+)`));
    return m ? m[1].trim() : null;
  };
  return {
    clarity: parseInt(get("CLARITY")),
    logic: parseInt(get("LOGIC")),
    evidence: parseInt(get("EVIDENCE")),
    persuasion: parseInt(get("PERSUASION")),
    fallacies: get("FALLACIES"),
    verdict: get("VERDICT"),
    raw: text.replace(/---SCORECARD---[\s\S]*?---END---/, "").trim(),
  };
}

function ScoreBar({ label, score }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#a0a0a0", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color: score >= 7 ? "#4ade80" : score >= 5 ? "#fbbf24" : "#f87171" }}>{score}/10</span>
      </div>
      <div style={{ height: "4px", background: "#1e1e1e", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${score * 10}%`,
          background: score >= 7 ? "#4ade80" : score >= 5 ? "#fbbf24" : "#f87171",
          borderRadius: "2px",
          transition: "width 1s ease",
        }} />
      </div>
    </div>
  );
}

export default function DebateCoach() {
  const [phase, setPhase] = useState("setup");
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [userSide, setUserSide] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [userTurns, setUserTurns] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const activeTopic = topic === "custom" ? customTopic : topic;

  async function startDebate() {
    if (!activeTopic || !userSide) return;
    setPhase("debate");
    setLoading(true);

    const openingMessages = [{ role: "user", content: `Let's begin. My position is: ${userSide}` }];
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt: SYSTEM_PROMPT(activeTopic, userSide),
        messages: openingMessages,
      }),
    });
    const data = await res.json();
    const reply = data.content || "Let's debate.";
    setMessages([
      { role: "user", content: `My position: ${userSide}` },
      { role: "assistant", content: reply },
    ]);
    setUserTurns(1);
    setLoading(false);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const newMessages = [...messages, { role: "user", content: input }];
    const newTurns = userTurns + 1;
    setMessages(newMessages);
    setInput("");
    setUserTurns(newTurns);
    setLoading(true);

    const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt: SYSTEM_PROMPT(activeTopic, userSide),
        messages: apiMessages,
      }),
    });
    const data = await res.json();
    const reply = data.content || "...";

    const parsed = parseScorecard(reply);
    if (parsed) {
      setScorecard(parsed);
      setMessages([...newMessages, { role: "assistant", content: parsed.raw || "Debate complete." }]);
      setPhase("done");
    } else {
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    }
    setLoading(false);
  }

  const totalScore = scorecard
    ? Math.round((scorecard.clarity + scorecard.logic + scorecard.evidence + scorecard.persuasion) / 4)
    : null;

  if (phase === "setup") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#f0f0f0",
        fontFamily: "'Georgia', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>
        <div style={{ maxWidth: "560px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#555", textTransform: "uppercase", marginBottom: "16px" }}>
              AI Debate Coach
            </div>
            <h1 style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: "900",
              margin: "0 0 12px",
              lineHeight: 1,
              background: "linear-gradient(135deg, #fff 0%, #888 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              ARCHON
            </h1>
            <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>
              Sharpen your argument. Get destroyed. Improve.
            </p>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#666", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
              Choose a topic
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  style={{
                    background: topic === t ? "#1a1a1a" : "transparent",
                    border: `1px solid ${topic === t ? "#444" : "#222"}`,
                    borderLeft: topic === t ? "3px solid #fff" : "3px solid transparent",
                    color: topic === t ? "#fff" : "#555",
                    padding: "12px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontFamily: "Georgia, serif",
                    transition: "all 0.15s",
                    borderRadius: "2px",
                  }}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={() => setTopic("custom")}
                style={{
                  background: topic === "custom" ? "#1a1a1a" : "transparent",
                  border: `1px solid ${topic === "custom" ? "#444" : "#222"}`,
                  borderLeft: topic === "custom" ? "3px solid #fff" : "3px solid transparent",
                  color: topic === "custom" ? "#fff" : "#555",
                  padding: "12px 16px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontFamily: "Georgia, serif",
                  transition: "all 0.15s",
                  borderRadius: "2px",
                }}
              >
                ✏ Custom topic...
              </button>
            </div>
            {topic === "custom" && (
              <input
                placeholder="Enter your debate topic"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                style={{
                  marginTop: "8px",
                  width: "100%",
                  background: "#111",
                  border: "1px solid #333",
                  color: "#fff",
                  padding: "12px 16px",
                  fontSize: "13px",
                  fontFamily: "Georgia, serif",
                  outline: "none",
                  boxSizing: "border-box",
                  borderRadius: "2px",
                }}
              />
            )}
          </div>

          {activeTopic && (
            <div style={{ marginBottom: "32px" }}>
              <label style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#666", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                Your position
              </label>
              <textarea
                placeholder={`State your stance on "${activeTopic}"`}
                value={userSide}
                onChange={(e) => setUserSide(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  background: "#111",
                  border: "1px solid #333",
                  color: "#fff",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontFamily: "Georgia, serif",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  borderRadius: "2px",
                  lineHeight: 1.6,
                }}
              />
            </div>
          )}

          <button
            onClick={startDebate}
            disabled={!activeTopic || !userSide.trim()}
            style={{
              width: "100%",
              padding: "16px",
              background: activeTopic && userSide.trim() ? "#fff" : "#1a1a1a",
              color: activeTopic && userSide.trim() ? "#000" : "#333",
              border: "none",
              fontSize: "13px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
              cursor: activeTopic && userSide.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              borderRadius: "2px",
              fontWeight: "700",
            }}
          >
            Enter the Arena →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      color: "#f0f0f0",
      fontFamily: "Georgia, serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        borderBottom: "1px solid #1a1a1a",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase" }}>ARCHON</div>
          <div style={{ fontSize: "13px", color: "#666", marginTop: "2px", maxWidth: "400px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {activeTopic}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: i <= userTurns ? "#fff" : "#222",
              transition: "background 0.3s",
            }} />
          ))}
          <span style={{ fontSize: "11px", color: "#444", marginLeft: "8px" }}>
            {Math.max(0, 5 - userTurns)} turns left
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            flexDirection: m.role === "user" ? "row-reverse" : "row",
            gap: "12px",
            alignItems: "flex-start",
          }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: m.role === "user" ? "#fff" : "#1a1a1a",
              border: m.role === "assistant" ? "1px solid #333" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: m.role === "user" ? "#000" : "#666",
              flexShrink: 0,
              letterSpacing: "0.05em",
            }}>
              {m.role === "user" ? "YOU" : "AI"}
            </div>
            <div style={{
              maxWidth: "75%",
              padding: "14px 18px",
              background: m.role === "user" ? "#141414" : "#0e0e0e",
              border: `1px solid ${m.role === "user" ? "#2a2a2a" : "#1a1a1a"}`,
              borderRadius: "2px",
              fontSize: "14px",
              lineHeight: "1.7",
              color: m.role === "user" ? "#ccc" : "#e8e8e8",
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "#1a1a1a", border: "1px solid #333",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "10px", color: "#666",
            }}>AI</div>
            <div style={{
              padding: "14px 18px",
              background: "#0e0e0e",
              border: "1px solid #1a1a1a",
              borderRadius: "2px",
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "#444",
                  animation: "pulse 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        {phase === "done" && scorecard && (
          <div style={{
            border: "1px solid #2a2a2a",
            background: "#0a0a0a",
            padding: "28px",
            borderRadius: "2px",
            marginTop: "12px",
          }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#555", textTransform: "uppercase", marginBottom: "8px" }}>
                Final Score
              </div>
              <div style={{
                fontSize: "72px",
                fontWeight: "900",
                lineHeight: 1,
                color: totalScore >= 7 ? "#4ade80" : totalScore >= 5 ? "#fbbf24" : "#f87171",
              }}>
                {totalScore}
              </div>
              <div style={{ fontSize: "12px", color: "#444", marginTop: "4px" }}>out of 10</div>
            </div>

            <ScoreBar label="Clarity" score={scorecard.clarity} />
            <ScoreBar label="Logic" score={scorecard.logic} />
            <ScoreBar label="Evidence" score={scorecard.evidence} />
            <ScoreBar label="Persuasion" score={scorecard.persuasion} />

            {scorecard.fallacies && scorecard.fallacies !== "None detected" && (
              <div style={{ marginTop: "20px", padding: "12px 16px", background: "#110000", border: "1px solid #330000", borderRadius: "2px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#f87171", textTransform: "uppercase", marginBottom: "6px" }}>
                  Logical Fallacies Detected
                </div>
                <div style={{ fontSize: "13px", color: "#ff9999" }}>{scorecard.fallacies}</div>
              </div>
            )}

            <div style={{ marginTop: "20px", padding: "16px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "2px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#666", textTransform: "uppercase", marginBottom: "8px" }}>
                Coach's Verdict
              </div>
              <div style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.7 }}>{scorecard.verdict}</div>
            </div>

            <button
              onClick={() => { setPhase("setup"); setMessages([]); setTopic(""); setUserSide(""); setUserTurns(0); setScorecard(null); }}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "14px",
                background: "#fff",
                color: "#000",
                border: "none",
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "Georgia, serif",
                cursor: "pointer",
                borderRadius: "2px",
                fontWeight: "700",
              }}
            >
              Debate Again →
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {phase === "debate" && (
        <div style={{
          borderTop: "1px solid #1a1a1a",
          padding: "16px 24px",
          display: "flex",
          gap: "12px",
          flexShrink: 0,
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Make your argument... (Enter to send)"
            rows={2}
            disabled={loading}
            style={{
              flex: 1,
              background: "#111",
              border: "1px solid #2a2a2a",
              color: "#fff",
              padding: "12px 16px",
              fontSize: "14px",
              fontFamily: "Georgia, serif",
              outline: "none",
              resize: "none",
              borderRadius: "2px",
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "12px 20px",
              background: loading || !input.trim() ? "#1a1a1a" : "#fff",
              color: loading || !input.trim() ? "#333" : "#000",
              border: "none",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              fontSize: "18px",
              borderRadius: "2px",
              transition: "all 0.15s",
            }}
          >
            →
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
      `}</style>
    </div>
  );
}
