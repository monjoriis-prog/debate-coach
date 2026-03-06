import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Red Flag IQ Test — How Sharp Are You? | BeBoldn",
  description: "10 real dating scenarios. Can you spot the red flags before it's too late? Take the test and share your score.",
  openGraph: {
    title: "What's Your Red Flag IQ? 🚩",
    description: "10 real dating scenarios. Can you spot the red flags? Take the free test — most people miss at least 3.",
    type: "website",
    url: "https://debate-coach-seven.vercel.app/quiz/redflag",
    siteName: "BeBoldn",
    images: [
      {
        url: "https://debate-coach-seven.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "Red Flag IQ Test by BeBoldn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What's Your Red Flag IQ? 🚩",
    description: "10 real dating scenarios. Can you spot the red flags? Most people miss at least 3.",
    images: ["https://debate-coach-seven.vercel.app/api/og"],
  },
};

export default function RedFlagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
