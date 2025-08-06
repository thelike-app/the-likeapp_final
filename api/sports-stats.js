module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { player } = req.query;

  if (!player) {
    res.status(400).json({ error: 'Player name is required' });
    return;
  }

  try {
    // Mock NBA player data for demonstration
    const mockPlayers = {
      'lebron james': {
        name: 'LeBron James',
        team: 'Los Angeles Lakers',
        position: 'SF',
        stats: [
          { date: '2024-01-15', opponent: 'vs GSW', points: 28, rebounds: 8, assists: 11, result: 'W' },
          { date: '2024-01-12', opponent: '@ BOS', points: 25, rebounds: 7, assists: 9, result: 'L' },
          { date: '2024-01-10', opponent: 'vs MIA', points: 32, rebounds: 6, assists: 8, result: 'W' },
          { date: '2024-01-08', opponent: '@ NYK', points: 24, rebounds: 9, assists: 12, result: 'W' },
          { date: '2024-01-05', opponent: 'vs PHX', points: 30, rebounds: 5, assists: 10, result: 'L' },
          { date: '2024-01-03', opponent: '@ DAL', points: 27, rebounds: 8, assists: 7, result: 'W' },
          { date: '2024-01-01', opponent: 'vs DEN', points: 35, rebounds: 10, assists: 6, result: 'W' },
          { date: '2023-12-29', opponent: '@ UTA', points: 22, rebounds: 7, assists: 13, result: 'L' },
          { date: '2023-12-27', opponent: 'vs SAC', points: 29, rebounds: 9, assists: 8, result: 'W' },
          { date: '2023-12-25', opponent: '@ LAC', points: 31, rebounds: 6, assists: 9, result: 'L' }
        ]
      },
      'stephen curry': {
        name: 'Stephen Curry',
        team: 'Golden State Warriors',
        position: 'PG',
        stats: [
          { date: '2024-01-15', opponent: '@ LAL', points: 32, rebounds: 4, assists: 8, result: 'L' },
          { date: '2024-01-12', opponent: 'vs BOS', points: 27, rebounds: 5, assists: 9, result: 'W' },
          { date: '2024-01-10', opponent: '@ MIA', points: 35, rebounds: 3, assists: 7, result: 'W' },
          { date: '2024-01-08', opponent: 'vs NYK', points: 28, rebounds: 6, assists: 11, result: 'L' },
          { date: '2024-01-05', opponent: '@ PHX', points: 30, rebounds: 4, assists: 6, result: 'W' },
          { date: '2024-01-03', opponent: 'vs DAL', points: 25, rebounds: 5, assists: 8, result: 'L' },
          { date: '2024-01-01', opponent: '@ DEN', points: 33, rebounds: 7, assists: 9, result: 'W' },
          { date: '2023-12-29', opponent: 'vs UTA', points: 29, rebounds: 4, assists: 10, result: 'W' },
          { date: '2023-12-27', opponent: '@ SAC', points: 26, rebounds: 6, assists: 7, result: 'L' },
          { date: '2023-12-25', opponent: 'vs LAC', points: 38, rebounds: 5, assists: 8, result: 'W' }
        ]
      },
      'kevin durant': {
        name: 'Kevin Durant',
        team: 'Phoenix Suns',
        position: 'PF',
        stats: [
          { date: '2024-01-15', opponent: 'vs LAL', points: 31, rebounds: 7, assists: 5, result: 'W' },
          { date: '2024-01-12', opponent: '@ GSW', points: 28, rebounds: 6, assists: 4, result: 'L' },
          { date: '2024-01-10', opponent: 'vs MIA', points: 35, rebounds: 8, assists: 6, result: 'W' },
          { date: '2024-01-08', opponent: '@ BOS', points: 27, rebounds: 5, assists: 7, result: 'L' },
          { date: '2024-01-05', opponent: 'vs NYK', points: 33, rebounds: 9, assists: 5, result: 'W' },
          { date: '2024-01-03', opponent: '@ DAL', points: 29, rebounds: 6, assists: 8, result: 'W' },
          { date: '2024-01-01', opponent: 'vs DEN', points: 32, rebounds: 7, assists: 4, result: 'L' },
          { date: '2023-12-29', opponent: '@ UTA', points: 26, rebounds: 8, assists: 6, result: 'W' },
          { date: '2023-12-27', opponent: 'vs SAC', points: 30, rebounds: 5, assists: 7, result: 'W' },
          { date: '2023-12-25', opponent: '@ LAC', points: 34, rebounds: 9, assists: 5, result: 'L' }
        ]
      }
    };

    const playerKey = player.toLowerCase().trim();
    const playerData = mockPlayers[playerKey];

    if (!playerData) {
      res.status(404).json({ 
        error: 'Player not found',
        availablePlayers: Object.keys(mockPlayers).map(key => mockPlayers[key].name)
      });
      return;
    }

    res.status(200).json({
      success: true,
      player: playerData
    });

  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

