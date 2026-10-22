import LegalPage from "@/components/shared/LegalPage";

export const metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for using the Land Rover & Range Rover Ownership Guide.",
  alternates: {
    canonical: "https://landroverengine.uk/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage title="Terms and Conditions" updated="22 October 2026">
      <p>
        By using this website you agree to these terms. If you do not agree, please stop using the site.
      </p>

      <h2>1. About this site</h2>
      <p>
        This site provides independent editorial information about Land Rover and Range Rover ownership,
        engines, reliability, and related costs. It is not affiliated with Jaguar Land Rover.
      </p>

      <h2>2. Information only</h2>
      <p>
        Content is for general guidance. Costs, reliability notes, and recommendations can change and may
        not apply to every vehicle. Always get advice from a qualified specialist before major repairs
        or purchases.
      </p>

      <h2>3. Quotes and third parties</h2>
      <p>
        Quote requests may be shared with vetted specialists in our network. We do not control third-party
        pricing, availability, warranties, or workmanship.
      </p>

      <h2>4. Acceptable use</h2>
      <ul>
        <li>Do not misuse the site or attempt to disrupt it.</li>
        <li>Do not copy large amounts of content for commercial use without permission.</li>
        <li>Do not submit false or abusive information through forms.</li>
      </ul>

      <h2>5. Liability</h2>
      <p>
        We aim to keep information accurate, but we do not guarantee completeness or fitness for a
        particular purpose. To the fullest extent permitted by law, we are not liable for decisions made
        based on this site.
      </p>

      <h2>6. Changes</h2>
      <p>
        We may update these terms at any time. Continued use of the site after changes means you accept
        the updated terms.
      </p>

      <h2>7. Contact</h2>
      <p>Questions about these terms can be sent via the contact options on this website.</p>
    </LegalPage>
  );
}
