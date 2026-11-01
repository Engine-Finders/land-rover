import { splitTag } from "@/components/variant/variantText";

// A value with its data-source tag, e.g. "£3,500–£5,800 [EM-QUOTE]": the value, then the tag as a
// small muted label (the same treatment the Era Map gives these tags).
export default function Tagged({ value = "", tagClassName = "border-white/15 text-white/45" }) {
  const { text, tag } = splitTag(value);
  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: text }} />
      {tag && (
        <>
          {" "}
          <span className={`whitespace-nowrap rounded border px-1 py-px align-[1px] text-[10px] font-medium uppercase tracking-[0.06em] ${tagClassName}`}>{tag}</span>
        </>
      )}
    </>
  );
}
