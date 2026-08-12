const MARK_SRC: Record<"coral" | "white" | "ink" | "lavender" | "green", string> = {
  coral: "/icons/vinculo-mark-coral.png",
  white: "/icons/vinculo-mark-white.png",
  ink: "/icons/vinculo-mark-ink.png",
  lavender: "/icons/vinculo-mark-lavender.png",
  green: "/icons/vinculo-mark-green.png",
};

export function VinculoSymbol({
  variant = "coral",
  size = 22,
}: {
  variant?: "coral" | "white" | "ink" | "lavender" | "green";
  size?: number;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={MARK_SRC[variant]} alt="" width={size} height={size * 1.1} style={{ objectFit: "contain" }} />;
}

export default function BrandHeader({
  sub = "seguro",
  variant = "coral",
}: {
  sub?: string;
  variant?: "coral" | "white" | "ink" | "lavender" | "green";
}) {
  return (
    <a className="brand-header" href="/">
      <VinculoSymbol variant={variant} size={26} />
      <span className="brand-wordmark">
        vínculo
        <span className="brand-sublabel">{sub}</span>
      </span>
    </a>
  );
}
