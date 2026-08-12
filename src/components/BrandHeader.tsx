const MARK_SRC: Record<"coral" | "white" | "ink", string> = {
  coral: "/icons/vinculo-mark-coral.png",
  white: "/icons/vinculo-mark-white.png",
  ink: "/icons/vinculo-mark-ink.png",
};

export function VinculoSymbol({
  variant = "coral",
  size = 22,
}: {
  variant?: "coral" | "white" | "ink";
  size?: number;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={MARK_SRC[variant]} alt="" width={size} height={size * 1.1} style={{ objectFit: "contain" }} />;
}

export default function BrandHeader() {
  return (
    <a className="brand-header" href="/">
      <VinculoSymbol variant="coral" size={26} />
      <span className="brand-wordmark">
        vínculo
        <span className="brand-sublabel">seguro</span>
      </span>
    </a>
  );
}
