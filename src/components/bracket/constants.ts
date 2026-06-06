import { GroupData, Team } from './types';

export const GROUPS_DATA: GroupData[] = [
  { id: 'A', teams: [{ n: 'Mexico', f: '🇲🇽', abbr: 'MEX' }, { n: 'South Africa', f: '🇿🇦', abbr: 'RSA' }, { n: 'South Korea', f: '🇰🇷', abbr: 'KOR' }, { n: 'Czechia', f: '🇨🇿', abbr: 'CZE' }] },
  { id: 'B', teams: [{ n: 'Canada', f: '🇨🇦', abbr: 'CAN' }, { n: 'Bosnia-Herz.', f: '🇧🇦', abbr: 'BIH' }, { n: 'Qatar', f: '🇶🇦', abbr: 'QAT' }, { n: 'Switzerland', f: '🇨🇭', abbr: 'SUI' }] },
  { id: 'C', teams: [{ n: 'Brazil', f: '🇧🇷', abbr: 'BRA' }, { n: 'Morocco', f: '🇲🇦', abbr: 'MAR' }, { n: 'Haiti', f: '🇭🇹', abbr: 'HAI' }, { n: 'Scotland', f: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', abbr: 'SCO' }] },
  { id: 'D', teams: [{ n: 'USA', f: '🇺🇸', abbr: 'USA' }, { n: 'Paraguay', f: '🇵🇾', abbr: 'PAR' }, { n: 'Australia', f: '🇦🇺', abbr: 'AUS' }, { n: 'Türkiye', f: '🇹🇷', abbr: 'TUR' }] },
  { id: 'E', teams: [{ n: 'Germany', f: '🇩🇪', abbr: 'GER' }, { n: 'Curaçao', f: '🇨🇼', abbr: 'CUW' }, { n: 'Ivory Coast', f: '🇨🇮', abbr: 'CIV' }, { n: 'Ecuador', f: '🇪🇨', abbr: 'ECU' }] },
  { id: 'F', teams: [{ n: 'Netherlands', f: '🇳🇱', abbr: 'NED' }, { n: 'Japan', f: '🇯🇵', abbr: 'JPN' }, { n: 'Sweden', f: '🇸🇪', abbr: 'SWE' }, { n: 'Tunisia', f: '🇹🇳', abbr: 'TUN' }] },
  { id: 'G', teams: [{ n: 'Belgium', f: '🇧🇪', abbr: 'BEL' }, { n: 'Egypt', f: '🇪🇬', abbr: 'EGY' }, { n: 'Iran', f: '🇮🇷', abbr: 'IRN' }, { n: 'New Zealand', f: '🇳🇿', abbr: 'NZL' }] },
  { id: 'H', teams: [{ n: 'Spain', f: '🇪🇸', abbr: 'ESP' }, { n: 'Cape Verde', f: '🇨🇻', abbr: 'CPV' }, { n: 'Saudi Arabia', f: '🇸🇦', abbr: 'KSA' }, { n: 'Uruguay', f: '🇺🇾', abbr: 'URU' }] },
  { id: 'I', teams: [{ n: 'France', f: '🇫🇷', abbr: 'FRA' }, { n: 'Senegal', f: '🇸🇳', abbr: 'SEN' }, { n: 'Iraq', f: '🇮🇶', abbr: 'IRQ' }, { n: 'Norway', f: '🇳🇴', abbr: 'NOR' }] },
  { id: 'J', teams: [{ n: 'Argentina', f: '🇦🇷', abbr: 'ARG' }, { n: 'Algeria', f: '🇩🇿', abbr: 'ALG' }, { n: 'Austria', f: '🇦🇹', abbr: 'AUT' }, { n: 'Jordan', f: '🇯🇴', abbr: 'JOR' }] },
  { id: 'K', teams: [{ n: 'Portugal', f: '🇵🇹', abbr: 'POR' }, { n: 'DR Congo', f: '🇨🇩', abbr: 'COD' }, { n: 'Uzbekistan', f: '🇺🇿', abbr: 'UZB' }, { n: 'Colombia', f: '🇨🇴', abbr: 'COL' }] },
  { id: 'L', teams: [{ n: 'England', f: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG' }, { n: 'Croatia', f: '🇭🇷', abbr: 'CRO' }, { n: 'Ghana', f: '🇬🇭', abbr: 'GHA' }, { n: 'Panama', f: '🇵🇦', abbr: 'PAN' }] }
];

export const EMPTY_TEAM: Team = { n: "TBD", f: "", seed: "" };
export const TBD_3: Team = { n: "3rd Place TBD", f: "", seed: "3rd" };

export const INITIAL_ROUNDS: (Team | null)[][] = [
  Array(16).fill(null), // R32 winners (8 left, 8 right)
  Array(8).fill(null), // R16 winners (4 left, 4 right)
  Array(4).fill(null), // QF winners (2 left, 2 right)
  Array(2).fill(null), // SF winners (1 left, 1 right)
  Array(1).fill(null), // Final winner (1)
];

export const LS_KEY = "mundial2026";
