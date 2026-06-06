import { Match, StandingRow, GroupState, Team } from "./types";
import { GROUPS } from "./data";

export function calcStandings(groupKey: string, groupState: GroupState): StandingRow[] {
  const table: StandingRow[] = Array.from({ length: 4 }, (_, i) => ({
    teamIdx: i, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0
  }));

  const h2h = (iA: number, iB: number) => {
    for (const m of groupState.matches) {
      if (m.homeScore === '' || m.awayScore === '') continue;
      const hs = parseInt(m.homeScore), as = parseInt(m.awayScore);
      if (m.homeIdx === iA && m.awayIdx === iB) { if (hs > as) return -1; if (as > hs) return 1; }
      if (m.homeIdx === iB && m.awayIdx === iA) { if (hs > as) return 1; if (as > hs) return -1; }
    }
    return 0;
  };

  groupState.matches.forEach(m => {
    if (m.homeScore === '' || m.awayScore === '') return;
    const hs = parseInt(m.homeScore);
    const as = parseInt(m.awayScore);
    
    table[m.homeIdx].played++;
    table[m.awayIdx].played++;
    table[m.homeIdx].gf += hs;
    table[m.homeIdx].ga += as;
    table[m.awayIdx].gf += as;
    table[m.awayIdx].ga += hs;

    if (hs > as) {
      table[m.homeIdx].won++;
      table[m.homeIdx].pts += 3;
      table[m.awayIdx].lost++;
    } else if (as > hs) {
      table[m.awayIdx].won++;
      table[m.awayIdx].pts += 3;
      table[m.homeIdx].lost++;
    } else {
      table[m.homeIdx].drawn++;
      table[m.awayIdx].drawn++;
      table[m.homeIdx].pts++;
      table[m.awayIdx].pts++;
    }
  });

  table.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const gdA = a.gf - a.ga, gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return h2h(a.teamIdx, b.teamIdx);
  });

  return table;
}

export function getQualifiedTeams(allGroupStates: Record<string, GroupState>) {
  const top2: (Team & { group: string, pos: string })[] = [];
  const third3: (Team & { group: string, pos: string, pts: number, gd: number, gf: number })[] = [];

  Object.keys(GROUPS).forEach(k => {
    const st = calcStandings(k, allGroupStates[k]);
    const teams = GROUPS[k];
    
    top2.push({ ...teams[st[0].teamIdx], group: k, pos: '1st' });
    top2.push({ ...teams[st[1].teamIdx], group: k, pos: '2nd' });
    
    third3.push({ 
      ...teams[st[2].teamIdx], 
      group: k, 
      pos: '3rd',
      pts: st[2].pts,
      gd: st[2].gf - st[2].ga,
      gf: st[2].gf
    });
  });

  third3.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });

  const best8 = third3.slice(0, 8);
  return [...top2, ...best8];
}
