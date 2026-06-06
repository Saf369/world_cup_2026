export interface Team {
  n: string;
  f: string;
  seed: string;
  groupId?: string;
}

export interface GroupData {
  id: string;
  teams: { n: string; f: string; abbr: string }[];
}

export interface GroupSelection {
  selected: string[];
  confirmed: boolean;
}
