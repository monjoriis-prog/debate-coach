export default function Privacy() {
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px", fontFamily: "Georgia, serif", color: "#1a2e1a", lineHeight: 1.8 }}>
      <h1 style={{ fontSize: "28px", fontWeight: "400", marginBottom: "8px" }}>Privacy Policy</h1>
      <p style={{ color: "#84a98c", fontSize: "14px", marginBottom: "36px" }}>Last updated: March 13, 2026</p>

      <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: "32px" }}>What BeBoldn Does</h2>
      <p>BeBoldn is a conversation practice app. You type or speak responses in simulated scenarios, and an AI responds in character to help you build confidence.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: "32px" }}>What Data We Collect</h2>
      <p>When you use a practice scenario, the text of your conversation (what you type or say) is sent to our AI provider to generate a response. We also store your quiz results and practice history locally on your device.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: "32px" }}>Who We Share Data With</h2>
      <p>Your conversation text is processed by <strong>Anthropic</strong> (anthropic.com), a third-party AI service, to generate realistic responses. Anthropic processes this data according to their own privacy policy. No other third parties receive your data.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: "32px" }}>What We Do NOT Collect</h2>
      <p>We do not collect your name, email address, phone number, or any account information. We do not require you to create an account. We do not use analytics or tracking tools. We do not store your conversations on our servers.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: "32px" }}>Voice Input</h2>
      <p>If you use the voice input feature (available on supported browsers), your speech is converted to text on your device using your browsers built-in speech recognition. The audio itself is not sent to our servers or to Anthropic only the resulting text is sent.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: "32px" }}>Local Storage</h2>
      <p>Quiz results, practice session history, and your preferences are stored locally on your device using browser storage. This data never leaves your device.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: "32px" }}>Data Protection</h2>
      <p>All communication between the app and our servers uses HTTPS encryption. We do not sell, rent, or trade your data to anyone.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: "32px" }}>Childrens Privacy</h2>
      <p>BeBoldn is not intended for children under 13. We do not knowingly collect data from children.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: "32px" }}>Changes to This Policy</h2>
      <p>If we update this policy, we will post the changes on this page with a new Last updated date.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: "32px" }}>Contact</h2>
      <p>Questions about this policy? Reach us at the Support link in the App Store listing.</p>
    </div>
  );
}
