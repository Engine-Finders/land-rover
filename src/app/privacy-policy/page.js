import LegalPage from "@/components/shared/LegalPage";

export const metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect personal information on this website.",
  alternates: {
    canonical: "https://landroverengine.uk/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="22 October 2026">
      <p>
        This privacy policy explains what personal information we collect and how we use it when you
        visit this website.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li>Contact details you submit (such as name, email, phone, and vehicle details).</li>
        <li>Technical data such as browser type, device, and approximate location.</li>
        <li>Usage data such as pages viewed and referring websites.</li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To respond to quote requests and enquiries.</li>
        <li>To connect you with relevant specialists where requested.</li>
        <li>To improve the website and understand how it is used.</li>
        <li>To meet legal or security requirements where needed.</li>
      </ul>

      <h2>3. Sharing</h2>
      <p>
        We may share enquiry details with vetted specialists when you ask for quotes. We do not sell
        personal data. Service providers who help us run the site may process data on our behalf.
      </p>

      <h2>4. Retention</h2>
      <p>
        We keep personal data only as long as needed for the purpose it was collected, or as required
        by law.
      </p>

      <h2>5. Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, or delete your personal
        data, or to object to certain processing. Contact us to make a request.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use cookies and similar technologies as described in our{" "}
        <a href="/cookies-policy" className="font-semibold text-[var(--color-primary)] no-underline hover:underline">
          Cookies Policy
        </a>
        .
      </p>

      <h2>7. Contact</h2>
      <p>For privacy questions, use the contact options on this website.</p>
    </LegalPage>
  );
}
