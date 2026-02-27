"use client";
import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = (situation: string, aiRole: string) => `You are playing the role of ${aiRole}. Scenario: ${situation}. Keep responses under 30 words. After 6 user messages give feedback in format ---FEEDBACK--- WARMTH:[1-10] CLARITY:[1-10] LISTENING:[1-10] CONFIDENCE:[1-10] BEST_MOMENT:[text] IMPROVE:[text] VERDICT:[text] ---END---`;

export default function SocialCoach() {
  return <div style={{color:"white",background:"#0a0a1a",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>Loading...</div>;
}
