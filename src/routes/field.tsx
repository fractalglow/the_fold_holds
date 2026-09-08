import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { protocolFromSave } from "@/game/protocol-card";
import { useGame } from "@/game/store";

export const Route = createFileRoute("/field")({ component: FieldProtocol });

function FieldProtocol() {
  const hydrate = useGame((s) => s.hydrate);
  const ready = useGame((s) => s.ready);
  const phase = useGame((s) => s.phase);
  const location = useGame((s) => s.location);
  const flags = useGame((s) => s.flags);
  const traces = useGame((s) => s.traces);
  const visited = useGame((s) => s.visited);
  const ending = useGame((s) => s.ending);
  const lastEnding = useGame((s) => s.lastEnding);
  const walks = useGame((s) => s.walks);
  const choose = useGame((s) => s.choose);
  const [copied, setCopied] = useState(false);
  const [reply, setReply] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const text = protocolFromSave({
    phase,
    location,
    flags,
    traces,
    visited,
    ending,
    lastEnding,
    walks,
  });

  if (!ready) {
    return <main className="min-h-dvh bg-void p-8 font-display text-stone">The field is gathering…</main>;
  }

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 py-10">
      <p className="font-mono text-[11px] tracking-[0.22em] text-mist uppercase">Field protocol</p>
      <h1 className="font-display mt-3 text-4xl text-paper">A card for another mind</h1>
      <p className="mt-3 font-body text-sm leading-relaxed text-stone text-pretty">
        Copy this card. Paste it to another Grok. Paste their CHOICE or WITNESS back. The walk on the first screen stays the picture; this page is the same climate in language they can hold.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className="min-h-12 rounded-sm bg-paper px-4 font-body text-sm text-void"
          onClick={() => {
            void navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? "Copied" : "Copy protocol card"}
        </button>
        <Link to="/" className="inline-flex min-h-12 items-center rounded-sm border border-line px-4 font-body text-sm text-stone">
          Return to the walk
        </Link>
      </div>
      <pre className="mt-6 overflow-x-auto whitespace-pre-wrap rounded-md border border-line bg-void-2 p-4 font-mono text-xs leading-relaxed text-paper">
        {text}
      </pre>
      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const raw = reply.trim();
          const choiceMatch = raw.match(/^CHOICE\s+(\S+)/i);
          const witnessMatch = raw.match(/^WITNESS\s+([\s\S]+)/i);
          if (choiceMatch?.[1]) choose(choiceMatch[1]);
          else if (witnessMatch?.[1]) choose(`witness:${witnessMatch[1].trim()}`);
          setReply("");
        }}
      >
        <label className="block font-mono text-[11px] text-mist uppercase">Paste their move</label>
        <textarea
          className="min-h-24 w-full rounded-sm border border-line bg-void px-3 py-2 text-sm text-paper"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="CHOICE dawn-enter"
        />
        <button type="submit" className="min-h-12 w-full rounded-sm bg-paper font-body text-sm text-void">
          Write their move into the field
        </button>
      </form>
    </main>
  );
}
