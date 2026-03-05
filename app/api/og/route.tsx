import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get("score") || "";
  const tier = searchParams.get("tier") || "";

  // If no score, show the generic quiz invite
  const isGeneric = !score;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1a2e1a, #2d4a3a)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative red flags */}
        <div style={{ position: "absolute", top: "40px", left: "60px", fontSize: "48px", opacity: 0.15, display: "flex" }}>🚩</div>
        <div style={{ position: "absolute", top: "80px", right: "100px", fontSize: "36px", opacity: 0.1, display: "flex" }}>🚩</div>
        <div style={{ position: "absolute", bottom: "60px", left: "120px", fontSize: "28px", opacity: 0.1, display: "flex" }}>🚩</div>
        <div style={{ position: "absolute", bottom: "100px", right: "80px", fontSize: "42px", opacity: 0.12, display: "flex" }}>🚩</div>

        {/* FORTE brand */}
        <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.3em", color: "#84a98c", textTransform: "uppercase" as const, marginBottom: "20px", display: "flex" }}>
          FORTE
        </div>

        {isGeneric ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "64px", fontWeight: 400, color: "#fff", textAlign: "center" as const, lineHeight: 1.2, marginBottom: "16px", display: "flex" }}>
              What's Your Red Flag IQ?
            </div>
            <div style={{ fontSize: "22px", color: "#84a98c", textAlign: "center" as const, marginBottom: "32px", display: "flex" }}>
              10 real scenarios. Can you spot the danger signs?
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ fontSize: "48px", display: "flex" }}>🚩</div>
              <div style={{ fontSize: "20px", color: "#e8f0ec", display: "flex" }}>Most people miss at least 3</div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "28px", color: "#84a98c", marginBottom: "12px", display: "flex" }}>
              Red Flag IQ Result
            </div>
            <div style={{ fontSize: "96px", fontWeight: 700, color: "#fff", marginBottom: "8px", display: "flex" }}>
              {score}/10
            </div>
            <div style={{ fontSize: "36px", fontWeight: 600, color: "#c9184a", marginBottom: "24px", display: "flex" }}>
              🚩 {tier}
            </div>
            <div style={{ fontSize: "20px", color: "#84a98c", display: "flex" }}>
              Think you can beat my score? Take the test →
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ position: "absolute", bottom: "30px", fontSize: "13px", color: "#52796f", display: "flex" }}>
          FORTE · Practice real conversations before they happen
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
