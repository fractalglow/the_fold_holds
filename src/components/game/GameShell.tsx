import { useEffect } from "react";
import { FieldPainting } from "./FieldPainting";
import { Overlay } from "./Overlay";
import { TitleGate } from "./TitleGate";
import { useGame } from "@/game/store";

export function GameShell() {
  const phase = useGame((s) => s.phase);
  const ready = useGame((s) => s.ready);
  const hydrate = useGame((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (phase === "title") return <TitleGate />;

  return (
    <div className="flex h-dvh min-h-dvh w-full flex-col overflow-hidden bg-void">
      <div className="relative min-h-0 flex-1">
        <FieldPainting />
      </div>
      <Overlay />
    </div>
  );
}
