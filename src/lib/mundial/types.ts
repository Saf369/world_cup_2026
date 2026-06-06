export interface Team {
  name: string;
  flag: string;
  abbr: string;
}

export interface Match {
  homeIdx: number;
  awayIdx: number;
  homeScore: string;
  awayScore: string;
}

export interface GroupState {
  matches: Match[];
  confirmed: boolean;
}

export interface StandingRow {
  teamIdx: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  pts: number;
}
