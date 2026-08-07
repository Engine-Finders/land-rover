import Image from "next/image";
import Link from "next/link";

export default function HomeSec8({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        {/* Header: text left, image right */}
        <div className="mb-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              Knowledge Centres
            </h2>
            <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
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

        {/* Desktop: 4-col grid | Mobile: stacked */}
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
          {data.centres.map((item) => (
            <article
              key={item.id}
              className="relative border border-gray-200 p-2"
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="bg-blue-700 px-1.5 py-0.5 text-xs font-semibold text-white"
                  dangerouslySetInnerHTML={{ __html: item.id }}
                />
                <span className="text-lg">{item.icon}</span>
              </div>

              <div className="relative mb-1 h-24 w-full">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>

              <h3 className="text-sm font-bold text-black" dangerouslySetInnerHTML={{ __html: item.title }} />
              <p className="mb-1 text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: item.description }} />
              <Link
                href={item.link.href}
                className="text-xs font-semibold text-blue-700"
              >
                <span dangerouslySetInnerHTML={{ __html: item.link.label }} />
              </Link>
            </article>
          ))}
        </div>

        {/* Footer verification */}
        <div className="border border-blue-200 bg-blue-50 p-2">
          <p className="text-sm font-bold text-black" dangerouslySetInnerHTML={{ __html: data.footer.title }} />
          <p className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: data.footer.text }} />
        </div>
      </div>
    </section>
  );
}
