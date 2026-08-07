export default function VariantHero({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      {data.tagPill && (
        <p dangerouslySetInnerHTML={{ __html: data.tagPill }} />
      )}
      <h1 dangerouslySetInnerHTML={{ __html: data.h1 }} />
      {data.subHeadline && (
        <p dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
      )}

      {data.trustBadges?.length > 0 && (
        <ul>
          {data.trustBadges.map((badge) => (
            <li key={badge} dangerouslySetInnerHTML={{ __html: badge }} />
          ))}
        </ul>
      )}

      {data.priceAnchor && (
        <p dangerouslySetInnerHTML={{ __html: data.priceAnchor }} />
      )}

      {data.registrationInput && (
        <p>
          {data.registrationInput.flag}{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: data.registrationInput.placeholder,
            }}
          />
          {data.registrationInput.cta && (
            <>
              {" — "}
              <a
                href={data.registrationInput.cta.href}
                dangerouslySetInnerHTML={{
                  __html: data.registrationInput.cta.label,
                }}
              />
            </>
          )}
        </p>
      )}

      {data.ticker && <p dangerouslySetInnerHTML={{ __html: data.ticker }} />}
      <hr />
    </section>
  );
}
