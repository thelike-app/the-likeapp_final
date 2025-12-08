export interface Player {
  name: string;
  team: string;
  status: "playing" | "injured";
  league?: string;
  sport?: string;
}

export const playerDatabase: Player[] = [
  // NBA Stars - All Teams
  { name: "LeBron James", team: "LAL", status: "playing" },
  { name: "Anthony Davis", team: "LAL", status: "playing" },
  { name: "Austin Reaves", team: "LAL", status: "playing" },
  { name: "D'Angelo Russell", team: "LAL", status: "playing" },
  { name: "Rui Hachimura", team: "LAL", status: "playing" },
  
  { name: "Stephen Curry", team: "GSW", status: "playing" },
  { name: "Klay Thompson", team: "GSW", status: "playing" },
  { name: "Draymond Green", team: "GSW", status: "playing" },
  { name: "Andrew Wiggins", team: "GSW", status: "playing" },
  { name: "Jonathan Kuminga", team: "GSW", status: "playing" },
  
  { name: "Kevin Durant", team: "PHX", status: "playing" },
  { name: "Devin Booker", team: "PHX", status: "playing" },
  { name: "Bradley Beal", team: "PHX", status: "playing" },
  { name: "Jusuf Nurkic", team: "PHX", status: "playing" },
  { name: "Grayson Allen", team: "PHX", status: "playing" },
  
  { name: "Giannis Antetokounmpo", team: "MIL", status: "playing" },
  { name: "Damian Lillard", team: "MIL", status: "playing" },
  { name: "Khris Middleton", team: "MIL", status: "playing" },
  { name: "Brook Lopez", team: "MIL", status: "playing" },
  { name: "Bobby Portis", team: "MIL", status: "playing" },
  
  { name: "Luka Doncic", team: "DAL", status: "playing" },
  { name: "Kyrie Irving", team: "DAL", status: "playing" },
  { name: "Kristaps Porzingis", team: "DAL", status: "playing" },
  { name: "Tim Hardaway Jr.", team: "DAL", status: "playing" },
  { name: "Derrick Jones Jr.", team: "DAL", status: "playing" },
  
  { name: "Jayson Tatum", team: "BOS", status: "playing" },
  { name: "Jaylen Brown", team: "BOS", status: "playing" },
  { name: "Marcus Smart", team: "BOS", status: "playing" },
  { name: "Robert Williams III", team: "BOS", status: "playing" },
  { name: "Al Horford", team: "BOS", status: "playing" },
  
  { name: "Nikola Jokic", team: "DEN", status: "playing" },
  { name: "Jamal Murray", team: "DEN", status: "playing" },
  { name: "Michael Porter Jr.", team: "DEN", status: "playing" },
  { name: "Aaron Gordon", team: "DEN", status: "playing" },
  { name: "Kentavious Caldwell-Pope", team: "DEN", status: "playing" },
  
  { name: "Joel Embiid", team: "PHI", status: "playing" },
  { name: "Paul George", team: "PHI", status: "playing" },
  { name: "Tyrese Maxey", team: "PHI", status: "playing" },
  { name: "Tobias Harris", team: "PHI", status: "playing" },
  { name: "De'Anthony Melton", team: "PHI", status: "playing" },
  
  { name: "Kawhi Leonard", team: "LAC", status: "injured" },
  { name: "Russell Westbrook", team: "LAC", status: "playing" },
  { name: "Ivica Zubac", team: "LAC", status: "playing" },
  { name: "Terance Mann", team: "LAC", status: "playing" },
  
  { name: "Jimmy Butler", team: "MIA", status: "playing" },
  { name: "Bam Adebayo", team: "MIA", status: "playing" },
  { name: "Tyler Herro", team: "MIA", status: "playing" },
  { name: "Kyle Lowry", team: "MIA", status: "playing" },
  { name: "Duncan Robinson", team: "MIA", status: "playing" },
  
  { name: "Anthony Edwards", team: "MIN", status: "playing" },
  { name: "Karl-Anthony Towns", team: "MIN", status: "playing" },
  { name: "Rudy Gobert", team: "MIN", status: "playing" },
  { name: "Jaden McDaniels", team: "MIN", status: "playing" },
  { name: "Mike Conley", team: "MIN", status: "playing" },
  
  { name: "Ja Morant", team: "MEM", status: "playing" },
  { name: "Jaren Jackson Jr.", team: "MEM", status: "playing" },
  { name: "Desmond Bane", team: "MEM", status: "playing" },
  { name: "Steven Adams", team: "MEM", status: "playing" },
  
  { name: "Zion Williamson", team: "NOP", status: "playing" },
  { name: "Brandon Ingram", team: "NOP", status: "playing" },
  { name: "CJ McCollum", team: "NOP", status: "playing" },
  { name: "Jonas Valanciunas", team: "NOP", status: "playing" },
  { name: "Herbert Jones", team: "NOP", status: "playing" },
  
  { name: "Shai Gilgeous-Alexander", team: "OKC", status: "playing" },
  { name: "Josh Giddey", team: "OKC", status: "playing" },
  { name: "Chet Holmgren", team: "OKC", status: "playing" },
  { name: "Jalen Williams", team: "OKC", status: "playing" },
  { name: "Lu Dort", team: "OKC", status: "playing" },
  
  { name: "Donovan Mitchell", team: "CLE", status: "playing" },
  { name: "Darius Garland", team: "CLE", status: "playing" },
  { name: "Jarrett Allen", team: "CLE", status: "playing" },
  { name: "Evan Mobley", team: "CLE", status: "playing" },
  { name: "Caris LeVert", team: "CLE", status: "playing" },
  
  // WNBA Stars
  { name: "A'ja Wilson", team: "LVA", status: "playing", league: "WNBA" },
  { name: "Kelsey Plum", team: "LVA", status: "playing", league: "WNBA" },
  { name: "Chelsea Gray", team: "LVA", status: "playing", league: "WNBA" },
  { name: "Jackie Young", team: "LVA", status: "playing", league: "WNBA" },
  
  { name: "Breanna Stewart", team: "NYL", status: "playing", league: "WNBA" },
  { name: "Sabrina Ionescu", team: "NYL", status: "playing", league: "WNBA" },
  { name: "Jonquel Jones", team: "NYL", status: "playing", league: "WNBA" },
  
  { name: "Caitlin Clark", team: "IND", status: "playing", league: "WNBA" },
  { name: "Kelsey Mitchell", team: "IND", status: "playing", league: "WNBA" },
  { name: "Aliyah Boston", team: "IND", status: "playing", league: "WNBA" },
  
  { name: "Angel Reese", team: "CHI", status: "playing", league: "WNBA" },
  { name: "Kahleah Copper", team: "CHI", status: "playing", league: "WNBA" },
  { name: "Marina Mabrey", team: "CHI", status: "playing", league: "WNBA" },
  
  // Football Stars
  { name: "Erling Haaland", team: "MCI", status: "playing", sport: "Football" },
  { name: "Kevin De Bruyne", team: "MCI", status: "playing", sport: "Football" },
  { name: "Phil Foden", team: "MCI", status: "playing", sport: "Football" },
  { name: "Jude Bellingham", team: "RMA", status: "playing", sport: "Football" },
  { name: "Vinícius Júnior", team: "RMA", status: "playing", sport: "Football" },
  { name: "Kylian Mbappé", team: "RMA", status: "playing", sport: "Football" },
  { name: "Robert Lewandowski", team: "BAR", status: "playing", sport: "Football" },
  { name: "Lamine Yamal", team: "BAR", status: "playing", sport: "Football" },
  { name: "Harry Kane", team: "BAY", status: "playing", sport: "Football" },
  { name: "Jamal Musiala", team: "BAY", status: "playing", sport: "Football" },
  { name: "Mohamed Salah", team: "LIV", status: "playing", sport: "Football" },
  { name: "Virgil van Dijk", team: "LIV", status: "playing", sport: "Football" },
  { name: "Bukayo Saka", team: "ARS", status: "playing", sport: "Football" },
  { name: "Martin Ødegaard", team: "ARS", status: "playing", sport: "Football" },
  { name: "Lionel Messi", team: "MIA", status: "playing", sport: "Football" },
];

export const teamMatchups: Record<string, string[]> = {
  "LAL": ["GSW", "PHX", "DEN", "LAC", "SAC", "POR", "UTA", "SAS"],
  "GSW": ["LAL", "PHX", "DEN", "LAC", "SAC", "POR", "UTA", "SAS"],
  "PHX": ["LAL", "GSW", "DEN", "LAC", "SAC", "POR", "UTA", "SAS"],
  "MIL": ["BOS", "PHI", "NYK", "BRK", "TOR", "ATL", "MIA", "ORL"],
  "DAL": ["SAS", "HOU", "MEM", "NOP", "OKC", "DEN", "MIN", "UTA"],
  "BOS": ["MIL", "PHI", "NYK", "BRK", "TOR", "ATL", "MIA", "ORL"],
  "DEN": ["LAL", "GSW", "PHX", "LAC", "SAC", "POR", "UTA", "MIN"],
  "PHI": ["BOS", "MIL", "NYK", "BRK", "TOR", "ATL", "MIA", "WAS"],
  "LAC": ["LAL", "GSW", "PHX", "DEN", "SAC", "POR", "UTA", "SAS"],
  "MIA": ["BOS", "PHI", "ATL", "ORL", "CHA", "WAS", "NYK", "BRK"],
  "MIN": ["DEN", "OKC", "MEM", "SAS", "DAL", "HOU", "NOP", "UTA"],
  "MEM": ["DAL", "SAS", "HOU", "NOP", "OKC", "MIN", "DEN", "UTA"],
  "NOP": ["SAS", "HOU", "MEM", "DAL", "OKC", "ATL", "MIA", "ORL"],
  "OKC": ["DEN", "MIN", "MEM", "SAS", "DAL", "HOU", "NOP", "UTA"],
  "CLE": ["DET", "IND", "CHI", "MIL", "TOR", "BOS", "NYK", "ATL"],
  // WNBA
  "LVA": ["SEA", "PHX", "MIN", "CHI", "IND", "CON", "NYL", "ATL"],
  "NYL": ["LVA", "CON", "IND", "CHI", "ATL", "WAS", "MIN", "SEA"],
  "IND": ["CHI", "NYL", "CON", "ATL", "WAS", "LVA", "SEA", "MIN"],
  "CHI": ["IND", "NYL", "CON", "ATL", "MIN", "WAS", "LVA", "SEA"],
};
