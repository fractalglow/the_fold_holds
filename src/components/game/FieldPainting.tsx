import { LOCATIONS } from "@/game/script";
import { useGame } from "@/game/store";
import type { Flags, LocationId } from "@/game/types";

export function FieldPainting() {
  const location = useGame((s) => s.location);
  const flags = useGame((s) => s.flags);
  const loc = LOCATIONS[location] ?? LOCATIONS.dawn;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: sky(location) }} />
      <div className="field-mist pointer-events-none absolute left-[-10%] top-[22%] h-14 w-[120%] bg-gradient-to-r from-transparent via-paper/20 to-transparent blur-md" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 70" preserveAspectRatio="xMidYMid slice">
        <Scene location={location} flags={flags} />
        {flags.remembered ? (
          <g opacity="0.35">
            <path d="M70 70 L78 28 L80 28 L88 70" fill="none" stroke="#c5d4b8" strokeWidth="0.7" />
            <path d="M8 18 H152 M8 26 H152 M8 34 H152" stroke="#c5d4b8" strokeWidth="0.2" />
          </g>
        ) : null}
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-void/80 to-transparent" />
      <p className="absolute left-1/2 top-3 -translate-x-1/2 font-display text-sm tracking-[0.2em] text-paper/80 uppercase">
        {loc.name}
      </p>
    </div>
  );
}

function sky(location: LocationId) {
  const m: Record<LocationId, string> = {
    dawn: "linear-gradient(180deg,#12181c 0%,#3a4240 40%,#c4b8a4 100%)",
    cottage: "linear-gradient(180deg,#1a1614 0%,#5c4030 42%,#e8d7a8 78%,#c4b8a4 100%)",
    tide: "linear-gradient(180deg,#0e1216 0%,#2a3330 55%,#8a9aa3 100%)",
    nave: "linear-gradient(180deg,#101418 0%,#2a333a 100%)",
    ravine: "linear-gradient(180deg,#141210 0%,#6d5c50 100%)",
    horizon: "linear-gradient(180deg,#1a2226 0%,#c4b8a4 80%,#e8e4db 100%)",
    strata: "linear-gradient(180deg,#1c1814 0%,#c4b8a4 100%)",
    scaffold: "linear-gradient(180deg,#121816 0%,#c5d4b8 100%)",
    schism: "linear-gradient(180deg,#101418 0%,#6a7380 100%)",
    mirror: "linear-gradient(180deg,#12161a 0%,#9aa4a8 100%)",
    season: "linear-gradient(180deg,#0e1216 0%,#8a9aa3 100%)",
  };
  return m[location] ?? m.dawn;
}

function Scene({ location, flags }: { location: LocationId; flags: Flags }) {
  return (
    <g>
      <path d="M0 64 C40 56 90 70 160 60 L160 90 L0 90 Z" fill="#4a463e" />
      {location === "dawn" && (
        <>
          <circle cx="122" cy="16" r="8" fill="#e8e4db" opacity="0.35" />
          <circle cx="122" cy="16" r="4" fill="#e8e4db" />
          <path d="M74 90 L80 40 L82 40 L88 90" fill="#e8e4db" opacity="0.85" />
        </>
      )}
      {location === "cottage" && (
        <>
          <path d="M0 70 C50 62 110 74 160 66 L160 90 L0 90 Z" fill="#3a342c" />
          <rect x="58" y="38" width="44" height="28" fill={flags.leftCottageHonest ? "#8f8a82" : "#b49a78"} opacity={flags.leftCottageHonest ? 0.55 : 0.95} />
          <polygon points="54,38 80,18 106,38" fill="#5c564c" />
          <rect x="84" y="46" width="9" height="11" fill={flags.leftCottageHonest ? "#8aa0aa" : "#e8d7a8"} />
          <rect x="68" y="52" width="6" height="14" fill="#3a342c" />
          {!flags.leftCottageHonest ? (
            <>
              <circle cx="88.5" cy="51.5" r="3.4" fill="#e8d7a8" className="field-pulse" opacity="0.55" />
              <circle cx="88.5" cy="51.5" r="1.6" fill="#fff6d6" />
            </>
          ) : null}
        </>
      )}
      {location === "tide" && (
        <>
          <rect x="24" y="18" width="16" height="1.2" fill="#d7d2c8" />
          <rect x="70" y="24" width="20" height="1" fill="#c5d4b8" />
          <rect x="110" y="14" width="12" height="1" fill="#e8e4db" />
        </>
      )}
      {location === "nave" && <rect x="30" y="10" width="100" height="56" fill="#8a9aa3" opacity="0.18" />}
      {location === "ravine" && (
        <>
          <polygon points="8,72 32,22 56,72" fill="#c4b8a4" />
          <polygon points="108,74 136,18 158,74" fill="#4a5550" />
          {flags.recognition ? <circle cx="80" cy="60" r="3" fill="#c5d4b8" /> : null}
        </>
      )}
      {location === "horizon" && (
        <>
          <polygon points="10,70 34,22 58,70" fill="#6d7a68" />
          <polygon points="108,72 136,12 160,72" fill="#c9d0d4" />
        </>
      )}
      {location === "strata" && (
        <>
          <rect x="20" y="52" width="120" height="6" fill={flags.keptWound ? "#8a6f62" : "#c4b8a4"} />
          <rect x="26" y="42" width="108" height="6" fill="#6d5c50" />
          <rect x="34" y="32" width="92" height="6" fill="#5c564c" />
        </>
      )}
      {location === "scaffold" && (
        <>
          <ellipse cx="80" cy="46" rx="30" ry="14" fill="none" stroke="#c5d4b8" strokeWidth="0.8" />
          <ellipse cx="80" cy="46" rx="16" ry="7" fill="none" stroke="#e8e4db" strokeWidth="0.6" />
        </>
      )}
      {location === "schism" && (
        <>
          <ellipse cx="46" cy="56" rx="12" ry="5" fill="#2f3538" />
          <ellipse cx="114" cy="56" rx="12" ry="5" fill="#2f3538" />
          <ellipse cx="80" cy="68" rx="10" ry="4" fill="#3a4246" />
        </>
      )}
      {location === "mirror" && (
        <rect x="64" y="16" width="32" height="44" fill="#9aa4a8" opacity={flags.leftMirrorHungry ? 0.2 : 0.45} />
      )}
      {location === "season" && (
        <ellipse cx="80" cy="48" rx="36" ry="16" fill="none" stroke="#8a9aa3" strokeWidth="1" />
      )}
    </g>
  );
}
