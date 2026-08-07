export default function Overview({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />
      {data.intro && <p dangerouslySetInnerHTML={{ __html: data.intro }} />}
      {data.keyFacts && <p dangerouslySetInnerHTML={{ __html: data.keyFacts }} />}
      {data.marketIntelligenceLine && <p dangerouslySetInnerHTML={{ __html: data.marketIntelligenceLine }} />}
      <hr />
    </section>
  );
}
