// Over-time check for one Rule across a patient's visits (docs/build/rules.md, "Over time").
// Pure function, no Convex imports, so it is unit-tested directly.
// Research prototype. Not a medical device. Not for clinical use.

export type Pattern = 'single' | 'persistent' | 'recurrent' | 'worsening';

export interface OverTime {
  pattern: Pattern;
  minVisits: number;
  windowDays: number | null;
  minDurationDays: number | null;
  basis?: string;
}

/** One visit on which the Rule's question was answered yes. `date` is ISO YYYY-MM-DD. */
export interface Hit {
  visitId: string;
  date: string;
}

export interface OverTimeResult {
  matches: boolean;
  /** the hits that back the match, oldest first */
  backing: Hit[];
}

const DAY_MS = 86_400_000;

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS);
}

const NO_MATCH: OverTimeResult = { matches: false, backing: [] };

/**
 * single: one hit is enough.
 * persistent: at least minVisits hits, and the first and last hit are at least minDurationDays apart.
 * recurrent: at least minVisits hits inside one window of windowDays (hits need not be next to each other).
 * worsening: no Rule uses it yet, so it never matches (docs/build/rules.md).
 */
export function overTimeMatch(overTime: OverTime, hitsIn: Hit[]): OverTimeResult {
  const hits = [...hitsIn].sort((a, b) => a.date.localeCompare(b.date));
  if (hits.length === 0 || hits.length < overTime.minVisits) return NO_MATCH;

  switch (overTime.pattern) {
    case 'single':
      return { matches: true, backing: hits };
    case 'persistent': {
      const span = daysBetween(hits[0].date, hits[hits.length - 1].date);
      return span >= (overTime.minDurationDays ?? 0) ? { matches: true, backing: hits } : NO_MATCH;
    }
    case 'recurrent': {
      const windowDays = overTime.windowDays ?? 0;
      for (let i = 0; i < hits.length; i++) {
        const inWindow = hits.slice(i).filter((h) => daysBetween(hits[i].date, h.date) <= windowDays);
        if (inWindow.length >= overTime.minVisits) return { matches: true, backing: inWindow };
      }
      return NO_MATCH;
    }
    case 'worsening':
      return NO_MATCH;
  }
}
