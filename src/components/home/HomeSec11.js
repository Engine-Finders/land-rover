import Image from "next/image";

const verdictClass = {
  best: "bg-yellow-100 text-yellow-900",
  success: "bg-green-100 text-green-800",
  fire: "bg-orange-100 text-orange-900",
  watch: "bg-orange-100 text-orange-800",
  crown: "bg-yellow-100 text-yellow-800",
  diamond: "bg-purple-100 text-purple-800",
};

export default function HomeSec11({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        <div className="mb-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              Every Model. Every Generation. Honestly Rated.
            </h2>
            <p className="text-sm text-gray-600">{data.subHeadline}</p>
          </div>
          <div className="relative h-20 w-28 shrink-0 md:h-28 md:w-48">
            <Image
              src={data.headerImage.src}
              alt={data.headerImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 112px, 192px"
            />
          </div>
        </div>

        <div className="mb-2 border border-gray-200">
          <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-3 md:gap-2">
            {data.columns.map((col) => (
              <span key={col}>{col}</span>
            ))}
          </div>

          {data.rows.map((row) => (
            <div
              key={row.model}
              className="border-b border-gray-200 px-2 py-2 last:border-b-0 md:grid md:grid-cols-3 md:gap-2 md:items-center"
            >
              <p className="text-sm font-bold text-black">{row.model}</p>
              <p className="text-xs text-gray-700">
                <span className="md:hidden text-gray-500">Generations: </span>
                {row.generations}
              </p>
              <span
                className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs md:mt-0 md:justify-self-start ${verdictClass[row.verdict.type] || "bg-gray-100"}`}
              >
                {row.verdict.icon} {row.verdict.text}
              </span>
            </div>
          ))}
        </div>

        <div className="border border-blue-200 bg-blue-50 p-2">
          <p className="text-sm font-bold text-blue-700">Example Verdict — Land Rover Discovery</p>
          <p className="text-xs text-gray-700">{data.exampleVerdict}</p>
        </div>
      </div>
    </section>
  );
}
