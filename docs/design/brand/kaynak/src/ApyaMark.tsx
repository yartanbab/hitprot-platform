import * as React from "react";

/**
 * APYA işareti — 13 ışın + pusula ibresi.
 * Tek renk: her zaman currentColor üzerinden boyanır; renk üst elemandan gelir.
 *
 * size   : px. 16 px altında otomatik olarak "micro" sürüme düşer (3 ışın, büyük ibre).
 * state  : asistan durumu. "ready" statik; "thinking" | "streaming" | "listening" hareketli;
 *          "suggest" statik kalın ışın (rozet içi); "off" %40 opaklık.
 * print  : baskı sürümü (güney ucu kontur, opaklık yok). Kaşe/gravür/PDF.
 */
export type ApyaMarkState = "ready" | "thinking" | "streaming" | "listening" | "suggest" | "off";

export interface ApyaMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  state?: ApyaMarkState;
  print?: boolean;
  micro?: boolean;
  title?: string;
}

const RAYS = 13;
const STEP = 360 / RAYS;
const EASE = "cubic-bezier(.4,0,.2,1)";

export function ApyaMark({ size = 24, state = "ready", print = false, micro, title = "APYA", ...rest }: ApyaMarkProps) {
  const isMicro = micro ?? size < 16;
  const prefersReduced = usePrefersReducedMotion();
  const animated = !prefersReduced && (state === "thinking" || state === "streaming" || state === "listening");
  const strokeWidth = state === "suggest" ? 6 : size < 32 ? 6 : 4.5;

  if (isMicro) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} style={{ display: "block", flex: "none", opacity: state === "off" ? 0.4 : 1 }} {...rest}>
        <g fill="none" stroke="currentColor" strokeWidth={9}>
          <line x1="50" y1="18" x2="50" y2="4" />
          <line x1="50" y1="18" x2="50" y2="4" transform="rotate(120 50 50)" />
          <line x1="50" y1="18" x2="50" y2="4" transform="rotate(240 50 50)" />
        </g>
        <polygon points="50,26 60,50 50,55 40,50" fill="currentColor" />
        <polygon points="50,74 40,50 50,46 60,50" fill="none" stroke="currentColor" strokeWidth={5} strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} data-state={state} style={{ display: "block", flex: "none", opacity: state === "off" ? 0.4 : 1 }} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
        {Array.from({ length: RAYS }, (_, i) => {
          const angle = i * STEP;
          const style: React.CSSProperties = {};
          if (animated && state === "thinking") {
            style.transformBox = "view-box"; style.transformOrigin = "50px 50px"; style.opacity = 0.2;
            style.animation = `apya-think 1.8s ease-in-out ${(i * 0.055).toFixed(3)}s infinite`;
          } else if (animated && state === "streaming") {
            style.opacity = 0.16;
            style.animation = `apya-chase .85s linear ${(i * 0.065).toFixed(3)}s infinite`;
          } else if (animated && state === "listening") {
            const dur = 0.62 + (Math.abs(((i * 5) % RAYS) - 6) / 6) * 0.5;
            style.transformBox = "view-box"; style.transformOrigin = "50px 20px";
            style.animation = `apya-listen ${dur.toFixed(2)}s ease-in-out ${(i * 0.04).toFixed(2)}s infinite alternate`;
          }
          return (
            <g key={i} transform={`rotate(${angle.toFixed(2)} 50 50)`}>
              <line x1="50" y1="20" x2="50" y2="4" style={style} />
            </g>
          );
        })}
      </g>
      {print ? (
        <>
          <polygon points="50,34 56,50 50,52.5 44,50" fill="currentColor" />
          <polygon points="50,60 45.5,50 50,48 54.5,50" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinejoin="round" />
        </>
      ) : (
        <>
          <polygon points="50,36 55.5,50 50,52 44.5,50" fill="currentColor" />
          <polygon points="50,64 44.5,50 50,48 55.5,50" fill="currentColor" opacity={0.38} />
        </>
      )}
    </svg>
  );
}

/** Yatay kilit: işaret + APYA. 90 px altına düşerse yalnızca işaret kullanın. */
export function ApyaLockup({ height = 40, tagline = false, color = "currentColor", ...rest }: { height?: number; tagline?: boolean; color?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const mark = Math.round(height * 1.25);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: Math.round(height * 0.5), color }} {...rest}>
      <ApyaMark size={mark} />
      <div style={{ display: "flex", flexDirection: "column", gap: Math.round(height * 0.22) }}>
        <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: height, fontWeight: 600, letterSpacing: ".12em", lineHeight: 1 }}>APYA</div>
        {tagline && (
          <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: Math.round(height * 0.27), fontWeight: 500, letterSpacing: ".2em", lineHeight: 1.4, whiteSpace: "nowrap", opacity: 0.72 }}>
            AKILLI PROJE YÖNETİM ASİSTANI
          </div>
        )}
      </div>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export { EASE as APYA_EASE };
