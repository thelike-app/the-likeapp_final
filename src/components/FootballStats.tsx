import { Lightbulb } from "lucide-react";

interface FootballTotals {
  shots: number;
  sot: number;
  passes: number;
  red: number;
  yellow: number;
  goals: number;
  assists: number;
  cs: number;
  games: number;
}

interface RecentMatch {
  label: string;
  shots: number;
  sot: number;
  passes: number;
  red: number;
  yellow: number;
  goals: number;
  assists: number;
  cs: number;
}

interface FootballStatsProps {
  playerName: string;
}

function synthFootballStats(name: string): { totals: FootballTotals; recent: RecentMatch[] } | null {
  const fw = ["Haaland", "Mbappé", "Messi", "Ronaldo", "Kane", "Vinícius", "Rodrygo", "Lewandowski", "Yamal", "Osimhen", "Salah", "Rashford", "Lautaro"];
  const mf = ["Bellingham", "De Bruyne", "Foden", "Saka", "Ødegaard", "Pedri", "Musiala", "Wirtz"];
  const df = ["Van Dijk", "Dias", "Alaba", "Araújo", "Gvardiol", "Davies"];
  const gk = ["Alisson", "Courtois", "Oblak", "ter Stegen", "Maignan", "Ederson"];
  
  let pos = "MF";
  if (fw.some(s => name.includes(s))) pos = "FW";
  if (df.some(s => name.includes(s))) pos = "DF";
  if (gk.some(s => name.includes(s))) pos = "GK";

  function vary(x: number, v: number): number {
    return Math.max(0, Math.round(x * (1 + (Math.random() - 0.5) * 2 * v)));
  }

  const base = {
    shots: pos === "FW" ? 110 : (pos === "MF" ? 70 : (pos === "DF" ? 25 : 5)),
    sot: pos === "FW" ? 60 : (pos === "MF" ? 30 : (pos === "DF" ? 8 : 3)),
    passes: pos === "GK" ? 800 : (pos === "DF" ? 1500 : (pos === "MF" ? 2100 : 900)),
    red: pos === "DF" ? 1 : 0,
    yellow: pos === "DF" ? 6 : (pos === "MF" ? 4 : 2),
    goals: pos === "FW" ? 28 : (pos === "MF" ? 12 : (pos === "DF" ? 4 : 0)),
    assists: pos === "MF" ? 14 : (pos === "FW" ? 8 : 3),
    cs: pos === "GK" ? 16 : (pos === "DF" ? 15 : 6),
    games: 34
  };

  const totals: FootballTotals = {
    shots: vary(base.shots, 0.15),
    sot: vary(base.sot, 0.15),
    passes: vary(base.passes, 0.12),
    red: vary(base.red, 0.6),
    yellow: vary(base.yellow, 0.3),
    goals: vary(base.goals, 0.18),
    assists: vary(base.assists, 0.2),
    cs: vary(base.cs, 0.25),
    games: base.games
  };

  const opponents = ["MCI", "RMA", "BAR", "BAY", "LIV", "ARS", "INT", "MUN", "ATM", "MIL", "NAP", "CHE", "TOT", "NEW"];
  const recent: RecentMatch[] = [];
  
  for (let i = 0; i < 10; i++) {
    const opp = opponents[Math.floor(Math.random() * opponents.length)];
    const label = (Math.random() > 0.5 ? "vs " : "@ ") + opp;
    const gShots = Math.max(0, Math.round(totals.shots / totals.games * (0.8 + Math.random() * 0.8)));
    const gSOT = Math.min(gShots, Math.max(0, Math.round(totals.sot / totals.games * (0.8 + Math.random() * 0.8))));
    const gPass = Math.max(5, Math.round(totals.passes / totals.games * (0.8 + Math.random() * 0.8)));
    const gYellow = Math.random() < 0.12 ? 1 : 0;
    const gRed = gYellow && Math.random() < 0.08 ? 1 : (Math.random() < 0.02 ? 1 : 0);
    const gGoals = Math.random() < (pos === 'FW' ? 0.55 : (pos === 'MF' ? 0.3 : 0.07)) ? (Math.random() < 0.15 ? 2 : 1) : 0;
    const gAst = Math.random() < (pos === 'MF' ? 0.5 : (pos === 'FW' ? 0.25 : 0.12)) ? 1 : 0;
    const gCS = (pos === 'GK' || pos === 'DF') && Math.random() < 0.45 ? 1 : 0;
    
    recent.push({ label, shots: gShots, sot: gSOT, passes: gPass, red: gRed, yellow: gYellow, goals: gGoals, assists: gAst, cs: gCS });
  }

  return { totals, recent };
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="confidence-bar flex-1 h-1">
        <div className="confidence-fill" style={{ width: `${confidence}%` }} />
      </div>
      <span className="text-foreground font-bold text-sm w-12">{confidence}%</span>
    </div>
  );
}

export function FootballStats({ playerName }: FootballStatsProps) {
  const stats = synthFootballStats(playerName);
  
  if (!stats) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-muted-foreground">Player "{playerName}" not found.</p>
      </div>
    );
  }

  const { totals, recent } = stats;
  const avgGoals = totals.goals / totals.games;
  const avgAssists = totals.assists / totals.games;
  const avgShots = totals.shots / totals.games;
  const avgSOT = totals.sot / totals.games;
  const avgPasses = totals.passes / totals.games;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Player Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gradient">{playerName}</h2>
            <p className="text-muted-foreground mt-1">Season: 2024-25</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="pulse-dot" />
            <span className="text-sm text-muted-foreground">{totals.games} matches</span>
          </div>
        </div>
      </div>

      {/* Season Totals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="stat-card">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Goals</span>
          <span className="text-2xl font-bold">{totals.goals}</span>
        </div>
        <div className="stat-card">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Assists</span>
          <span className="text-2xl font-bold">{totals.assists}</span>
        </div>
        <div className="stat-card">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Shots</span>
          <span className="text-2xl font-bold">{totals.shots}</span>
        </div>
        <div className="stat-card">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">SOT</span>
          <span className="text-2xl font-bold">{totals.sot}</span>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Season Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Passes</span>
            <span className="text-lg font-bold">{totals.passes}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Yellow Cards</span>
            <span className="text-lg font-bold">{totals.yellow}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Red Cards</span>
            <span className="text-lg font-bold">{totals.red}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Clean Sheets</span>
            <span className="text-lg font-bold">{totals.cs}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Matches</span>
            <span className="text-lg font-bold">{totals.games}</span>
          </div>
        </div>
      </div>

      {/* Recent Matches Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Matches
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Match</th>
                <th>Shots</th>
                <th>SOT</th>
                <th>Goals</th>
                <th>Assists</th>
                <th>Cards</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((match, index) => (
                <tr key={index} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="text-foreground">{match.label}</td>
                  <td>{match.shots}</td>
                  <td>{match.sot}</td>
                  <td className="font-semibold text-foreground">{match.goals}</td>
                  <td>{match.assists}</td>
                  <td>
                    {match.yellow > 0 && <span className="text-warning">⚠️</span>}
                    {match.red > 0 && <span className="text-destructive">🔴</span>}
                    {match.yellow === 0 && match.red === 0 && "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Betting Insights */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-5 h-5 text-foreground animate-flash" />
          <h3 className="text-lg font-semibold">Betting Insights</h3>
        </div>
        
        <div className="space-y-4">
          {avgGoals >= 0.3 && (
            <div className="betting-card">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Goals</span>
              </div>
              <ConfidenceBar confidence={Math.min(90, Math.max(60, 75 + (avgGoals - 0.5) * 20))} />
              <p className="text-sm text-muted-foreground mt-2">
                Over {Math.floor(avgGoals * 0.6)}.5 goals | Anytime goalscorer
              </p>
            </div>
          )}
          
          {avgAssists >= 0.2 && (
            <div className="betting-card">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Assists</span>
              </div>
              <ConfidenceBar confidence={Math.min(85, Math.max(55, 70 + (avgAssists - 0.3) * 15))} />
              <p className="text-sm text-muted-foreground mt-2">
                Over {Math.floor(avgAssists * 0.7)}.5 assists
              </p>
            </div>
          )}
          
          {avgShots >= 1.5 && (
            <div className="betting-card">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Total Shots</span>
              </div>
              <ConfidenceBar confidence={Math.min(88, Math.max(65, 78 + (avgShots - 2) * 2))} />
              <p className="text-sm text-muted-foreground mt-2">
                Over {Math.floor(avgShots * 0.7)}.5 total shots
              </p>
            </div>
          )}
          
          {avgSOT >= 1 && (
            <div className="betting-card">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Shots on Target</span>
              </div>
              <ConfidenceBar confidence={Math.min(85, Math.max(60, 75 + (avgSOT - 1.5) * 3))} />
              <p className="text-sm text-muted-foreground mt-2">
                Over {Math.floor(avgSOT * 0.6)}.5 shots on target
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            * Analysis based on current season performance • Always gamble responsibly
          </p>
        </div>
      </div>
    </div>
  );
}
