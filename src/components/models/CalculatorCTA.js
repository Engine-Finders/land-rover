export default function CalculatorCTA({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />
      {data.intro && <p dangerouslySetInnerHTML={{ __html: data.intro }} />}
      <ul>
        {data.paths?.map((path) => (
          <li key={path.label}>
            <a href={path.href} dangerouslySetInnerHTML={{ __html: path.label }} />
            {path.note && <> (<span dangerouslySetInnerHTML={{ __html: path.note }} />)</>}
          </li>
        ))}
      </ul>
      <hr />
    </section>
  );
}
