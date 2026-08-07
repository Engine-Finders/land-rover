export default function MarketIntelligence({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />

      {data.signals?.length > 0 && (
        <table border="1" cellPadding="4" cellSpacing="0">
          <thead>
            <tr>
              <th>Signal</th>
              <th>Data</th>
              <th>Demand Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.signals.map((row) => (
              <tr key={row.signal}>
                <td dangerouslySetInnerHTML={{ __html: row.signal }} />
                <td dangerouslySetInnerHTML={{ __html: row.data }} />
                <td dangerouslySetInnerHTML={{ __html: row.demandTrend }} />
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data.insights?.length > 0 && (
        <>
          <h3>Insights from the data</h3>
          {data.insights.map((insight) => (
            <p key={insight} dangerouslySetInnerHTML={{ __html: insight }} />
          ))}
        </>
      )}

      {data.liveEnquiryFeedNote && (
        <p dangerouslySetInnerHTML={{ __html: data.liveEnquiryFeedNote }} />
      )}
      <hr />
    </section>
  );
}
