export default function CommonProblems({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Common Problems</h2>
      {data.problems?.map((problem) => (
        <div key={problem.id}>
          <h3>
            {problem.id}. <span dangerouslySetInnerHTML={{ __html: problem.title }} />
          </h3>
          {problem.affectedModels && (
            <p>
              Affected models: <span dangerouslySetInnerHTML={{ __html: problem.affectedModels }} />
            </p>
          )}
          {problem.typicalFailureMileage && (
            <p>
              Typical failure mileage: <span dangerouslySetInnerHTML={{ __html: problem.typicalFailureMileage }} />
            </p>
          )}
          {problem.rootCause && (
            <p>
              Root cause: <span dangerouslySetInnerHTML={{ __html: problem.rootCause }} />
            </p>
          )}

          {problem.tieredCosts?.length > 0 && (
            <table border="1" cellPadding="4" cellSpacing="0">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Dealer</th>
                  <th>Specialist</th>
                  <th>Work</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {problem.tieredCosts.map((tier) => (
                  <tr key={tier.tier}>
                    <td dangerouslySetInnerHTML={{ __html: tier.tier }} />
                    <td dangerouslySetInnerHTML={{ __html: tier.dealer }} />
                    <td dangerouslySetInnerHTML={{ __html: tier.specialist }} />
                    <td dangerouslySetInnerHTML={{ __html: tier.work }} />
                    <td dangerouslySetInnerHTML={{ __html: tier.note }} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {problem.recommendation && <p dangerouslySetInnerHTML={{ __html: problem.recommendation }} />}
          {problem.cta && (
            <p>
              <a href={problem.cta.href} dangerouslySetInnerHTML={{ __html: problem.cta.label }} />
            </p>
          )}
        </div>
      ))}
      <hr />
    </section>
  );
}
