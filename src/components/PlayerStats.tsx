import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { PlayerStatsData, GameStats } from "@/pages/Index";

interface PlayerStatsProps {
  player: PlayerStatsData;
  onGamesCountChange?: (count: number) => void;
}
function calculateAverages(games: GameStats[]) {
  if (games.length === 0) return { ppg: 0, rpg: 0, apg: 0, threePm: 0, mpg: 0, fgPct: 0, threePct: 0, ftPct: 0 };
  
  let totalPts = 0, totalReb = 0, totalAst = 0, totalThrees = 0, totalMin = 0;
  let fgPctSum = 0, threePctSum = 0, ftPctSum = 0;
  let fgPctCount = 0, threePctCount = 0, ftPctCount = 0;
  
  games.forEach((game) => {
    totalPts += parseFloat(game.player_stats.ppg) || 0;
    totalReb += parseFloat(game.player_stats.rpg) || 0;
    totalAst += parseFloat(game.player_stats.apg) || 0;
    totalThrees += parseFloat(game.player_stats.three_pm) || 0;
    totalMin += parseFloat(game.player_stats.mpg) || 0;
    
    const fgPct = parseFloat(game.player_stats.fg_pct);
    const threePct = parseFloat(game.player_stats.three_p_pct);
    const ftPct = parseFloat(game.player_stats.ft_pct);
    
    if (!isNaN(fgPct) && fgPct > 0) { fgPctSum += fgPct; fgPctCount++; }
    if (!isNaN(threePct) && threePct > 0) { threePctSum += threePct; threePctCount++; }
    if (!isNaN(ftPct) && ftPct > 0) { ftPctSum += ftPct; ftPctCount++; }
  });
  
  const count = games.length;
  return {
    ppg: totalPts / count,
    rpg: totalReb / count,
    apg: totalAst / count,
    threePm: totalThrees / count,
    mpg: totalMin / count,
    fgPct: fgPctCount > 0 ? fgPctSum / fgPctCount : 0,
    threePct: threePctCount > 0 ? threePctSum / threePctCount : 0,
    ftPct: ftPctCount > 0 ? ftPctSum / ftPctCount : 0,
  };
}

export function PlayerStats({ player, onGamesCountChange }: PlayerStatsProps) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [avgGamesCount, setAvgGamesCount] = useState(player.games.length);
  const sortedGames = [...player.games].sort((a, b) => 
    new Date(b.game_date).getTime() - new Date(a.game_date).getTime()
  );
  const gamesForAverages = sortedGames.slice(0, Math.min(avgGamesCount, sortedGames.length));
  const averages = calculateAverages(gamesForAverages);
  const visibleGames = sortedGames.slice(0, visibleCount);
  const hasMore = visibleCount < sortedGames.length;
  const latestGame = sortedGames[0];
  const teamName = latestGame?.team_name || "N/A";

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Player Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gradient">{player.player_name}</h2>
            <p className="text-muted-foreground mt-1">
              {teamName} • {player.games.length} games
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="pulse-dot" />
            <span className="text-sm text-muted-foreground">
              2025-26 Season
            </span>
          </div>
        </div>
      </div>

      {/* Season Averages Header */}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Season Averages
          </h3>
          <div className="flex items-center gap-4 flex-1 sm:flex-initial sm:min-w-[280px]">
            <span className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap">Last</span>
            <Slider
              value={[avgGamesCount]}
              onValueChange={(value) => {
                setAvgGamesCount(value[0]);
                onGamesCountChange?.(value[0]);
              }}
              min={1}
              max={player.games.length}
              step={1}
              className="flex-1"
            />
            <span className="text-sm font-bold min-w-[60px] text-right">{avgGamesCount} Games</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-border border border-border -mt-px">
        <div className="bg-card p-4 flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">PPG</span>
          <span className="text-2xl font-bold">{averages.ppg.toFixed(1)}</span>
        </div>
        <div className="bg-card p-4 flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">RPG</span>
          <span className="text-2xl font-bold">{averages.rpg.toFixed(1)}</span>
        </div>
        <div className="bg-card p-4 flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">APG</span>
          <span className="text-2xl font-bold">{averages.apg.toFixed(1)}</span>
        </div>
        <div className="bg-card p-4 flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">3PM</span>
          <span className="text-2xl font-bold">{averages.threePm.toFixed(1)}</span>
        </div>
        <div className="bg-card p-4 flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">MPG</span>
          <span className="text-2xl font-bold">{averages.mpg.toFixed(1)}</span>
        </div>
      </div>

      {/* Shooting Stats */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Shooting Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs text-muted-foreground">FG%</span>
            <span className="text-lg font-bold">{averages.fgPct.toFixed(1)}%</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-xs text-muted-foreground">3P%</span>
            <span className="text-lg font-bold">{averages.threePct.toFixed(1)}%</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-xs text-muted-foreground">FT%</span>
            <span className="text-lg font-bold">{averages.ftPct.toFixed(1)}%</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-xs text-muted-foreground">Games</span>
            <span className="text-lg font-bold">{player.games.length}</span>
          </div>
        </div>
      </div>

      {/* Recent Games Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Games
          </h3>
        </div>
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Game</th>
                <th>PTS</th>
                <th>REB</th>
                <th>AST</th>
                <th>3PM</th>
              </tr>
            </thead>
            <tbody>
              {visibleGames.map((game) => {
                const gameDate = parseISO(game.game_date);
                const formattedDate = format(gameDate, 'MMM d');
                
                  return (
                    <tr key={game.game_id}>
                      <td>
                        <span className="text-foreground">{formattedDate}</span>
                        <span className="text-muted-foreground ml-2">
                          {game.team_name} vs {game.opponent_name}
                        </span>
                      </td>
                    <td className="text-foreground font-semibold">{game.player_stats.ppg}</td>
                    <td>{game.player_stats.rpg}</td>
                    <td>{game.player_stats.apg}</td>
                    <td>{game.player_stats.three_pm}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sortedGames.length > 10 && (
          <div className="p-4 border-t border-border/50 flex gap-2">
            {hasMore && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setVisibleCount(prev => prev + 5)}
              >
                Show More ({sortedGames.length - visibleCount} remaining)
              </Button>
            )}
            {visibleCount > 10 && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setVisibleCount(10)}
              >
                Show Less
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}