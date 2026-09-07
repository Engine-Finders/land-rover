/**
 * Gold eyebrow label + short two-tone rule.
 * align="left" (default): rule under label only (~38% gold / ~62% grey).
 * align="center": label centered with flanking two-tone rules.
 * Place above every H1 / H2.
 */
export default function HeadingEyebrow({ text, align = "left", className = "" }) {
  if (!text) return null;

  if (align === "center") {
    return (
      <div className={`flex w-full items-center gap-3 ${className}`}>
        <span
          className="h-px min-w-0 flex-1"
          style={{
            background:
              "linear-gradient(to right, var(--color-border) 0 62%, var(--color-accent) 62% 100%)",
          }}
          aria-hidden="true"
        />
        <p className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)] md:text-[0.72rem]">
          {text}
        </p>
        <span
          className="h-px min-w-0 flex-1"
          style={{
            background:
              "linear-gradient(to right, var(--color-accent) 0 38%, var(--color-border) 38% 100%)",
          }}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className={`w-fit max-w-full ${className}`}>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)] md:text-[0.72rem]">
        {text}
      </p>
      <span
        className="mt-2 block h-px w-full"
        style={{
          background:
            "linear-gradient(to right, var(--color-accent) 0 38%, var(--color-border) 38% 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
