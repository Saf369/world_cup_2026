import { Team, Match } from "./types";

export const GROUPS: Record<string, Team[]> = {
  A: [{ name: 'Mexico', flag: '🇲🇽', abbr: 'MEX' }, { name: 'South Africa', flag: '🇿🇦', abbr: 'RSA' }, { name: 'South Korea', flag: '🇰🇷', abbr: 'KOR' }, { name: 'Czechia', flag: '🇨🇿', abbr: 'CZE' }],
  B: [{ name: 'Canada', flag: '🇨🇦', abbr: 'CAN' }, { name: 'Bosnia-Herz.', flag: '🇧🇦', abbr: 'BIH' }, { name: 'Qatar', flag: '🇶🇦', abbr: 'QAT' }, { name: 'Switzerland', flag: '🇨🇭', abbr: 'SUI' }],
  C: [{ name: 'Brazil', flag: '🇧🇷', abbr: 'BRA' }, { name: 'Morocco', flag: '🇲🇦', abbr: 'MAR' }, { name: 'Haiti', flag: '🇭🇹', abbr: 'HAI' }, { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', abbr: 'SCO' }],
  D: [{ name: 'USA', flag: '🇺🇸', abbr: 'USA' }, { name: 'Paraguay', flag: '🇵🇾', abbr: 'PAR' }, { name: 'Australia', flag: '🇦🇺', abbr: 'AUS' }, { name: 'Türkiye', flag: '🇹🇷', abbr: 'TUR' }],
  E: [{ name: 'Germany', flag: '🇩🇪', abbr: 'GER' }, { name: 'Curaçao', flag: '🇨🇼', abbr: 'CUW' }, { name: 'Ivory Coast', flag: '🇨🇮', abbr: 'CIV' }, { name: 'Ecuador', flag: '🇪🇨', abbr: 'ECU' }],
  F: [{ name: 'Netherlands', flag: '🇳🇱', abbr: 'NED' }, { name: 'Japan', flag: '🇯🇵', abbr: 'JPN' }, { name: 'Sweden', flag: '🇸🇪', abbr: 'SWE' }, { name: 'Tunisia', flag: '🇹🇳', abbr: 'TUN' }],
  G: [{ name: 'Belgium', flag: '🇧🇪', abbr: 'BEL' }, { name: 'Egypt', flag: '🇪🇬', abbr: 'EGY' }, { name: 'Iran', flag: '🇮🇷', abbr: 'IRN' }, { name: 'New Zealand', flag: '🇳🇿', abbr: 'NZL' }],
  H: [{ name: 'Spain', flag: '🇪🇸', abbr: 'ESP' }, { name: 'Cape Verde', flag: '🇨🇻', abbr: 'CPV' }, { name: 'Saudi Arabia', flag: '🇸🇦', abbr: 'KSA' }, { name: 'Uruguay', flag: '🇺🇾', abbr: 'URU' }],
  I: [{ name: 'France', flag: '🇫🇷', abbr: 'FRA' }, { name: 'Senegal', flag: '🇸🇳', abbr: 'SEN' }, { name: 'Iraq', flag: '🇮🇶', abbr: 'IRQ' }, { name: 'Norway', flag: '🇳🇴', abbr: 'NOR' }],
  J: [{ name: 'Argentina', flag: '🇦🇷', abbr: 'ARG' }, { name: 'Algeria', flag: '🇩🇿', abbr: 'ALG' }, { name: 'Austria', flag: '🇦🇹', abbr: 'AUT' }, { name: 'Jordan', flag: '🇯🇴', abbr: 'JOR' }],
  K: [{ name: 'Portugal', flag: '🇵🇹', abbr: 'POR' }, { name: 'DR Congo', flag: '🇨🇩', abbr: 'COD' }, { name: 'Uzbekistan', flag: '🇺🇿', abbr: 'UZB' }, { name: 'Colombia', flag: '🇨🇴', abbr: 'COL' }],
  L: [{ name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG' }, { name: 'Croatia', flag: '🇭🇷', abbr: 'CRO' }, { name: 'Ghana', flag: '🇬🇭', abbr: 'GHA' }, { name: 'Panama', flag: '🇵🇦', abbr: 'PAN' }]
};

export function genMatches(): Match[] {
  const m: Match[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      m.push({ homeIdx: i, awayIdx: j, homeScore: '', awayScore: '' });
    }
  }
  return m;
}
