import { LABEL } from "@/lib/typeScale";
import { BACKDROP, CARD, CAR_ART, CAR_ART_RATIO, IconChip, SERIF, modelArt, prose } from "@/components/models/modelKit";

// The editorial pull-quote card that closes section 7 (Market Intelligence), built to the approved
// reference: the quote chip, the "Editorial pull-quote" label, the serif title and the quote on the
// left; the model's car standing in the Highland backdrop on the right, behind a diagonal edge.
// Phones and tablets: the photo on top, the quote below. Art from scripts/build-model-hero-art.py.

// prose() plus typographic apostrophes and single quotes, in text only (links use single quotes)
function typeset(html = "") {
  return prose(html)
    .split(/(<[^>]+>)/)
    .map((part) =>
      part.startsWith("<")
        ? part
        : part.replace(/(^|[\s(])'([^'<>]+?)'(?=[\s.,;:!?)]|$)/g, "$1‘$2’").replace(/'/g, "’")
    )
    .join("");
}

export default function EditorialPullQuote({ data, slug = "" }) {
  if (!data?.quote && !data?.title) return null;
  const art = modelArt(slug, "dark");

  return (
    <figure className={`${CARD} mt-5 grid overflow-hidden md:mt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)]`} style={art || undefined}>
      {art && (
        <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:order-last lg:aspect-auto lg:min-h-[280px] lg:[clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]" aria-hidden="true">
          <div className={`absolute inset-0 ${BACKDROP}`} />
          <div className={`absolute bottom-[3%] left-1/2 h-[92%] max-w-[94%] -translate-x-1/2 ${CAR_ART_RATIO} ${CAR_ART}`} />
        </div>
      )}
      <div className="flex flex-col gap-4 p-5 sm:flex-row md:gap-6 md:p-7 xl:p-9">
        <IconChip name="quote" className="h-11 w-11 md:h-12 md:w-12 xl:h-14 xl:w-14" iconClass="h-5 w-5 xl:h-6 xl:w-6" />
        <div className="min-w-0">
          <p className={`${LABEL} text-lr-green`}>Editorial pull-quote</p>
          {data.title && (
            <h3 className={`${SERIF} mt-2 text-[24px] leading-tight text-lr-head md:text-[26px] xl:text-[30px]`} dangerouslySetInnerHTML={{ __html: typeset(data.title) }} />
          )}
          {data.quote && (
            <blockquote className="mt-4 text-[16px] leading-[1.6] text-lr-body md:text-[17px] xl:text-[18px] [&_a]:font-medium [&_a]:text-lr-green">
              <p dangerouslySetInnerHTML={{ __html: `“${typeset(data.quote)}”` }} />
            </blockquote>
          )}
        </div>
      </div>
    </figure>
  );
}
