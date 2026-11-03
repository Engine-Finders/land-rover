import LegalPage from "@/components/shared/LegalPage";

export const metadata = {
  title: "Cookies Policy",
  description: "How cookies and similar technologies are used on this website.",
  alternates: {
    canonical: "https://landroverengine.uk/cookies-policy",
  },
};

export default function CookiesPolicyPage() {
  return (
    <LegalPage title="Cookies Policy" updated="22 October 2026">
      <p>
        This page explains how we use cookies and similar technologies on this website.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help the
        site work, remember preferences, and understand usage.
      </p>

      <h2>2. Cookies we may use</h2>
      <ul>
        <li>
          <strong className="text-[var(--color-text)]">Essential:</strong> needed for basic site
          functions such as security and page navigation.
        </li>
        <li>
          <strong className="text-[var(--color-text)]">Preference:</strong> remember choices such as
          theme settings.
        </li>
        <li>
          <strong className="text-[var(--color-text)]">Analytics:</strong> help us understand how
          visitors use the site so we can improve it.
        </li>
      </ul>

      <h2>3. Managing cookies</h2>
      <p>
        You can control or delete cookies through your browser settings. Blocking some cookies may
        affect how parts of the site work.
      </p>

      <h2>4. More information</h2>
      <p>
        For how we handle personal data more broadly, see our{" "}
        <a href="/privacy-policy" className="font-semibold text-[var(--color-primary)] no-underline hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </LegalPage>
  );
}
