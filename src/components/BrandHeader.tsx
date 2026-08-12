export function VinculoSymbol({ color = "currentColor", size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4,9
           C2,7 3,4.4 5.6,4.3
           C8.2,4.2 9.6,6.1 8.5,7.9
           C8,8.7 6.6,8.4 7.1,9.6
           C7.4,10.3 8.6,10.1 9.1,11.1
           C6.8,13.6 6.1,15.2 6.3,17.6
           C6.4,18.9 7.1,18 7.9,17
           C11,13.2 14.7,9 17.2,5.6"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18.5" cy="6" r="0.85" fill={color} />
      <path d="M17.4,4.4 Q19,2.8 20.8,3.8" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M15.8,2.6 Q19,0.3 22.2,2" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
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
