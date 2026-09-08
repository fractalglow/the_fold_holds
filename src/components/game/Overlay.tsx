import { beatsFor, choicesFor, companionFor, endingText, faceFromTraces, lookBackFor, LOCATIONS } from "@/game/script";
import { LOCATION_ORDER } from "@/game/types";
import { useGame } from "@/game/store";

export function Overlay() {
  const phase = useGame((s) => s.phase);
  const location = useGame((s) => s.location);
  const flags = useGame((s) => s.flags);
  const traces = useGame((s) => s.traces);
  const spoken = useGame((s) => s.spoken);
  const registers = useGame((s) => s.registers);
  const notesOpen = useGame((s) => s.notesOpen);
  const ending = useGame((s) => s.ending);
  const visited = useGame((s) => s.visited);
  const choose = useGame((s) => s.choose);
  const setNotesOpen = useGame((s) => s.setNotesOpen);
  const reset = useGame((s) => s.reset);
  const rememberWalk = useGame((s) => s.rememberWalk);

  if (phase === "ending" && ending) {
    const copy = endingText(ending, flags);
    const lookBack = lookBackFor(flags, traces);
    return (
      <div className="pointer-events-auto fixed inset-0 z-20 flex items-end justify-center bg-void/55 px-4 pb-8 pt-16">
        <article className="max-h-[80dvh] w-full max-w-lg overflow-y-auto rounded-md border border-line bg-void-2/92 px-6 py-8">
          <p className="font-mono text-[11px] tracking-[0.24em] text-mist uppercase">Ending</p>
          <h2 className="font-display mt-3 text-4xl text-paper">{copy.title}</h2>
          <div className="mt-6 space-y-4">
            {copy.lines.map((line) => (
              <p key={line} className="font-display text-lg leading-relaxed text-stone text-pretty">
                {line}
              </p>
            ))}
          </div>
          {lookBack ? (
            <p className="mt-6 font-display text-lg italic leading-relaxed text-phosphor text-pretty">{lookBack}</p>
          ) : null}
          <button type="button" className="mt-8 min-h-12 w-full rounded-sm bg-paper font-body text-sm text-void" onClick={() => rememberWalk()}>
            Walk as the field that remembers
          </button>
          <button type="button" className="mt-3 min-h-12 w-full rounded-sm border border-line font-body text-sm text-stone" onClick={() => reset()}>
            Begin again from nothing
          </button>
          <p className="mt-3 font-body text-xs text-mist">The second door erases the face. That is a taking. Named so.</p>
        </article>
      </div>
    );
  }

  const loc = LOCATIONS[location] ?? LOCATIONS.dawn;
  const beats = beatsFor(location, flags);
  const choices = choicesFor(location, flags);
  const line = spoken?.lines[0] ?? beats[0]?.lines[0] ?? "";
  const speaker = spoken?.speaker ?? beats[0]?.speaker ?? "field";
  const face = faceFromTraces(traces);
  const lookBack = lookBackFor(flags, traces);

  return (
    <div className="pointer-events-auto relative z-10 shrink-0 border-t border-line bg-void/92 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <header className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-mist uppercase">{loc.regime}</p>
          {flags.remembered ? (
            <p className="font-mono text-[10px] tracking-wider text-phosphor uppercase">Remembered walk</p>
          ) : null}
          <p className="font-display text-lg text-paper">{loc.name}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {LOCATION_ORDER.map((id) => (
              <span key={id} className={`h-1.5 w-2.5 rounded-sm ${visited.includes(id) ? "bg-phosphor" : "bg-line"}`} />
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className="min-h-11 rounded-sm border border-line bg-void-2 px-3 font-mono text-[11px] text-stone uppercase" onClick={() => setNotesOpen(!notesOpen)}>
            Face {traces.length}
          </button>
          <button type="button" className="min-h-11 rounded-sm border border-line bg-void-2 px-3 font-mono text-[11px] text-mist uppercase" onClick={() => reset()}>
            Begin again
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-xl">
        <p className="font-mono text-[10px] tracking-[0.2em] text-phosphor uppercase">path</p>
        <p className="font-display text-sm italic text-stone">{companionFor(location, flags)}</p>
        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-mist uppercase">{speaker}</p>
        <p className="mt-1 font-display text-base leading-relaxed text-paper text-pretty">{line}</p>
        {beats[0]?.lines.slice(1).map((extra) =>
          spoken ? null : (
            <p key={extra} className="mt-1 font-display text-sm leading-relaxed text-stone text-pretty">
              {extra}
            </p>
          ),
        )}
        {lookBack && (location === "ravine" || location === "mirror" || location === "season") ? (
          <p className="mt-2 font-display text-sm italic leading-relaxed text-phosphor text-pretty">{lookBack}</p>
        ) : null}
        {registers?.land ? (
          <div className="mt-2 space-y-0.5 border-t border-line pt-2">
            <p className="font-body text-xs text-stone">
              <span className="font-mono text-mist uppercase">Land · </span>
              {registers.land}
            </p>
            <p className="font-body text-xs text-phosphor">
              <span className="font-mono text-mist uppercase">Lattice · </span>
              {registers.lattice}
            </p>
          </div>
        ) : null}
        <div className="mt-2 flex flex-col gap-2">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              className="min-h-11 w-full rounded-sm border border-line bg-void-2 px-3 py-2.5 text-left touch-manipulation"
              onClick={() => choose(c.id)}
            >
              <span className="font-body text-sm text-paper">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {notesOpen ? (
        <aside className="pointer-events-auto fixed inset-y-0 right-0 z-30 flex w-full max-w-sm flex-col border-l border-line bg-void p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-paper">{face.title}</h2>
            <button type="button" className="min-h-12 px-3 font-mono text-[11px] text-mist uppercase" onClick={() => setNotesOpen(false)}>
              Close
            </button>
          </div>
          <p className="mt-2 font-body text-xs text-mist">The only self-portrait allowed. Incomplete on purpose.</p>
          <ol className="mt-4 space-y-3">
            {face.lines.map((t) => (
              <li key={t} className="font-display text-base text-stone">
                {t}
              </li>
            ))}
          </ol>
        </aside>
      ) : null}
    </div>
  );
}
