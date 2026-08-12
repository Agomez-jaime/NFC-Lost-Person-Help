export function VinculoSymbol({ color = "currentColor", size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6,8 C6,8 6.3,13 9,16.2 C10,17.4 10.6,17.7 11,17.7 C11.4,17.7 12.2,17.2 13.3,15.5 C14.6,13.5 15,10.8 15,9"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16.3" cy="8" r="0.85" fill={color} />
      <path d="M15.3,6.3 Q17,4.6 18.9,5.7" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M13.9,4.3 Q17,1.6 20.4,3.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function BrandHeader() {
  return (
    <a className="brand-header" href="/">
      <VinculoSymbol color="var(--v-coral)" size={26} />
      <span className="brand-wordmark">
        vínculo
        <span className="brand-sublabel">seguro</span>
      </span>
    </a>
  );
}
