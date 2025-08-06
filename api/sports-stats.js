import fetch from 'node-fetch';

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { player } = req.query;

  if (!player) {
    return res.status(400).json({ error: "Player name is required" });
  }

  try {
    const result = await searchNBAComAPI(player);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: result.error || "Athlete not found" });
    }
  } catch (error) {
    console.error("Error fetching sports stats:", error);
    return res.status(500).json({ error: "Failed to fetch athlete statistics" });
  }
}

// NBA.com API (Unofficial) - Direct calls
async function searchNBAComAPI(playerName) {
  try {
    // Step 1: Search for player ID
    const playerSearchResponse = await fetch(
      `https://stats.nba.com/stats/searchplayer?q=${encodeURIComponent(playerName)}`
    );
    
    if (!playerSearchResponse.ok) {
      console.log("NBA.com Player Search API response not ok:", playerSearchResponse.status);
      return { success: false, error: `NBA.com Player Search Error: ${playerSearchResponse.statusText}` };
    }
    
    const playerSearchData = await playerSearchResponse.json();
    
    if (!playerSearchData.results || playerSearchData.results.length === 0) {
      return { success: false, error: "Player not found on NBA.com" };
    }

    const player = playerSearchData.results[0];
    const playerId = player.player_id;

    // Step 2: Get player game logs (last 10 games)
    const gameLogsResponse = await fetch(
      `https://stats.nba.com/stats/playergamelogs?PlayerID=${playerId}&SeasonType=Regular Season&Season=2023-24&LeagueID=00`
    );
    
    if (!gameLogsResponse.ok) {
      console.log("NBA.com Game Logs API response not ok:", gameLogsResponse.status);
      return { success: false, error: `NBA.com Game Logs Error: ${gameLogsResponse.statusText}` };
    }
    
    const gameLogsData = await gameLogsResponse.json();
    
    if (!gameLogsData.resultSets || gameLogsData.resultSets.length === 0 || gameLogsData.resultSets[0].rowSet.length === 0) {
      return { success: false, error: "No game logs found for this player on NBA.com" };
    }

    const headers = gameLogsData.resultSets[0].headers;
    const rowSet = gameLogsData.resultSets[0].rowSet;

    const recentEvents = rowSet.slice(0, 10).map(row => {
      const game = {};
      headers.forEach((header, index) => {
        game[header.toLowerCase()] = row[index];
      });
      return {
        date: game.game_date,
        opponent: game.matchup.includes('@') ? `vs ${game.matchup.split('@')[1]}` : `vs ${game.matchup.split('vs.')[1]}`, // Basic opponent parsing
        points: game.pts,
        rebounds: game.reb,
        assists: game.ast,
        steals: game.stl,
        blocks: game.blk,
        minutes: game.min,
        result: game.wl // Win/Loss
      };
    });

    return {
      success: true,
      athlete: {
        name: `${player.player_name}`,
        team: player.team_name || "N/A",
        position: player.position || "N/A",
        sport: "Basketball"
      },
      statistics: {
        recent_events: recentEvents
      }
    };

  } catch (error) {
    console.error("NBA.com API error:", error);
    return { success: false, error: error.message };
  }
}


