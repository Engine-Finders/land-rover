export default function CostGuide({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Cost Guide</h2>
      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            {data.columns?.map((col) => (
              <th key={col} dangerouslySetInnerHTML={{ __html: col }} />
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows?.map((row) => (
            <tr key={row.condition}>
              <td dangerouslySetInnerHTML={{ __html: row.condition }} />
              <td dangerouslySetInnerHTML={{ __html: row.supplyOnly }} />
              <td dangerouslySetInnerHTML={{ __html: row.fittedIndie }} />
              <td dangerouslySetInnerHTML={{ __html: row.warranty }} />
            </tr>
          ))}
        </tbody>
      </table>
      {data.labourEstimate && (
        <p dangerouslySetInnerHTML={{ __html: data.labourEstimate }} />
      )}
      {data.sharedCostNote && (
        <p dangerouslySetInnerHTML={{ __html: data.sharedCostNote }} />
      )}
      {data.cta && (
        <p>
          <a
            href={data.cta.href}
            dangerouslySetInnerHTML={{ __html: data.cta.label }}
          />
        </p>
      )}
      <hr />
    </section>
  );
}
