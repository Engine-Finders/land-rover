import { splitTag } from "@/components/variant/variantText";
import { LABEL } from "@/lib/typeScale";

// A value with its data-source tag, e.g. "£3,500–£5,800 [EM-QUOTE]": the value, then the tag as a
// small muted label (the same treatment the Era Map gives these tags). Short tags never break; long
// ones wrap with the text. `tagSize` overrides the label size in narrow mobile columns.
export default function Tagged({ value = "", tagClassName = "border-lr-line-strong text-lr-muted", tagSize = LABEL }) {
  const { text, tag } = splitTag(value);
  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: text }} />
      {tag && (
        <>
          {" "}
          <span className={`${tagSize} ${tag.length <= 14 ? "whitespace-nowrap" : ""} rounded border px-1.5 py-px align-[1px] ${tagClassName}`}>{tag}</span>
        </>
      )}
    </>
  );
}
