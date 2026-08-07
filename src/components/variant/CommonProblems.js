export default function CommonProblems({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Common Problems</h2>
      {data.problems?.map((problem) => (
        <div key={problem.id}>
          <h3>
            {problem.id}.{" "}
            <span dangerouslySetInnerHTML={{ __html: problem.title }} />
          </h3>
          {problem.symptoms && (
            <p>
              Symptoms:{" "}
              <span dangerouslySetInnerHTML={{ __html: problem.symptoms }} />
            </p>
          )}
          {problem.typicalMileage && (
            <p>
              Typical mileage:{" "}
              <span
                dangerouslySetInnerHTML={{ __html: problem.typicalMileage }}
              />
            </p>
          )}
          {problem.repairCost && (
            <p>
              Repair cost:{" "}
              <span dangerouslySetInnerHTML={{ __html: problem.repairCost }} />
            </p>
          )}
          {problem.replacementCost && (
            <p>
              Replacement cost:{" "}
              <span
                dangerouslySetInnerHTML={{ __html: problem.replacementCost }}
              />
            </p>
          )}
          {problem.urgency && (
            <p>
              Urgency: {problem.urgency.icon}{" "}
              <span
                dangerouslySetInnerHTML={{ __html: problem.urgency.label }}
              />{" "}
              —{" "}
              <span
                dangerouslySetInnerHTML={{ __html: problem.urgency.text }}
              />
            </p>
          )}
          {problem.recommendation && (
            <p dangerouslySetInnerHTML={{ __html: problem.recommendation }} />
          )}
          {problem.failureLink && (
            <p>
              <a
                href={problem.failureLink.href}
                dangerouslySetInnerHTML={{
                  __html: problem.failureLink.label,
                }}
              />
            </p>
          )}
        </div>
      ))}
      <hr />
    </section>
  );
}
