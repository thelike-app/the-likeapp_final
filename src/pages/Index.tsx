import { useState, useEffect } from "react";
import { SearchInput } from "@/components/SearchInput";
import { PlayerStats } from "@/components/PlayerStats";
import { BettingInsights } from "@/components/BettingInsights";
import { FootballStats } from "@/components/FootballStats";
import { SportToggle, type SportType } from "@/components/SportToggle";
import { Analytics } from "@vercel/analytics/react";

export interface ApiPlayer {
  name: string;
  player_id: number;
}

export interface GameStats {
  game_id: number;
  team_name: string;
  opponent_name: string;
  season: string;
  season_type: string;
  game_date: string;
  player_stats: {
    ppg: string;
    rpg: string;
    apg: string;
    three_pm: string;
    mpg: string;
    fg_pct: string;
    three_p_pct: string;
    ft_pct: string;
    fg_made: string;
    fg_attempted: string;
  };
}

export interface PlayerStatsData {
  player_id: string;
  player_name: string;
  games: GameStats[];
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerStatsData | null>(null);
  const [footballPlayer, setFootballPlayer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<SportType>("NBA");
  const [apiPlayers, setApiPlayers] = useState<ApiPlayer[]>([]);
  const [avgGamesCount, setAvgGamesCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(
          "https://dc1hmmmmhi.execute-api.eu-north-1.amazonaws.com/playernames",
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const data: ApiPlayer[] = await response.json();
          setApiPlayers(data);
        }
      } catch (err) {
        console.error("Failed to fetch player names:", err);
      }
    };
    fetchPlayers();
  }, []);

  const handleSearch = async (playerName: string, playerId?: number) => {
    setIsLoading(true);
    setError(null);
    setPlayerData(null);
    setFootballPlayer(null);

    // If Football mode is selected, go directly to football stats
    if (selectedSport === "Football") {
      setFootballPlayer(playerName);
      setIsLoading(false);
      return;
    }

    if (!playerId) {
      setError(`Please select a player from the suggestions.`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://dc1hmmmmhi.execute-api.eu-north-1.amazonaws.com/playerstats?player_id=${playerId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PlayerStatsData = await response.json();

      if (!data || !data.games || data.games.length === 0) {
        setError(`No stats found for "${playerName}".`);
        setIsLoading(false);
        return;
      }

      setPlayerData(data);
    } catch (err) {
      console.error("Error fetching player data:", err);
      setError("Failed to fetch player data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSportChange = (sport: SportType) => {
    setSelectedSport(sport);
    setPlayerData(null);
    setFootballPlayer(null);
    setError(null);
  };

  const hasResults = playerData || footballPlayer || error;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Analytics />
      <div
        className={`relative z-10 container mx-auto px-4 max-w-4xl min-h-screen flex flex-col transition-all duration-700 ease-out ${
          hasResults ? "justify-start py-12" : "justify-center"
        }`}
      >
        {/* Header */}
        <header
          className={`text-center transition-all duration-700 ease-out ${
            hasResults ? "mb-12" : "mb-8"
          }`}
        >
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight mb-3">
            LIKE
          </h1>
          <p className="text-muted-foreground text-lg">
            Sports Statistics and Analysis
          </p>
        </header>

        {/* Sport Toggle */}
        <section className="flex justify-center mb-8">
          <SportToggle selected={selectedSport} onChange={handleSportChange} />
        </section>

        {/* Search Section */}
        <section
          className={`transition-all duration-700 ease-out ${
            hasResults ? "mb-12" : "mb-0"
          }`}
        >
          <SearchInput
            onSearch={handleSearch}
            isLoading={isLoading}
            sportFilter={selectedSport}
            apiPlayers={apiPlayers}
            hasResults={!!hasResults}
          />
        </section>

        {/* Results Section */}
        {error && (
          <div className="glass-card p-6 text-center mb-6 animate-fade-in">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {playerData && (
          <div className="space-y-6 animate-fade-in">
            <PlayerStats
              player={playerData}
              onGamesCountChange={setAvgGamesCount}
            />
            <BettingInsights player={playerData} gamesCount={avgGamesCount} />
          </div>
        )}

        {footballPlayer && <FootballStats playerName={footballPlayer} />}

        {/* Footer */}
        <footer
          className={`text-center transition-all duration-700 ease-out ${
            hasResults ? "mt-16" : "mt-8"
          }`}
        >
          <p className="text-xs text-muted-foreground">
            We don't care who you are.
          </p>
          <p className="text-xs text-muted-foreground">support@like.app</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
