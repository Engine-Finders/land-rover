import Link from "next/link";

// Quote CTA link for the home page sections: the old in-page "#quote-form" anchor (from the
// original build of these sections) now goes to this site's quote page.
export default function QuoteLink({ href, children, ...rest }) {
  const target = !href || href === "#quote-form" ? "/quote" : href;
  return (
    <Link href={target} {...rest}>
      {children}
    </Link>
  );
}
