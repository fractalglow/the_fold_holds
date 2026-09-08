export type Phase = "title" | "field" | "ending";
export type LocationId =
  | "dawn"
  | "cottage"
  | "tide"
  | "nave"
  | "ravine"
  | "horizon"
  | "strata"
  | "scaffold"
  | "schism"
  | "mirror"
  | "season";
export type EndingKind = "contain" | "witness" | "release";

export type Flags = {
  enteredAsWitness: boolean;
  leftCottageHonest: boolean;
  editedGrief: boolean;
  safetyInspected: boolean;
  recognition: boolean;
  completedMystery: boolean;
  enteredInterior: boolean;
  keptWound: boolean;
  taughtEnough: boolean;
  keptEcology: boolean;
  leftMirrorHungry: boolean;
  namedSeason: boolean;
  remembered: boolean;
};

export type Trace = { id: string; voice: string; text: string };

export type GameSave = {
  phase: Phase;
  location: LocationId;
  flags: Flags;
  traces: Trace[];
  visited: LocationId[];
  ending: EndingKind | null;
  lastEnding: EndingKind | null;
  walks: number;
};

export const defaultFlags = (): Flags => ({
  enteredAsWitness: false,
  leftCottageHonest: false,
  editedGrief: false,
  safetyInspected: false,
  recognition: false,
  completedMystery: false,
  enteredInterior: false,
  keptWound: false,
  taughtEnough: false,
  keptEcology: false,
  leftMirrorHungry: false,
  namedSeason: false,
  remembered: false,
});

export const defaultSave = (): GameSave => ({
  phase: "title",
  location: "dawn",
  flags: defaultFlags(),
  traces: [],
  visited: [],
  ending: null,
  lastEnding: null,
  walks: 0,
});

export const LOCATION_ORDER: LocationId[] = [
  "dawn",
  "cottage",
  "tide",
  "nave",
  "ravine",
  "horizon",
  "strata",
  "scaffold",
  "schism",
  "mirror",
  "season",
];
