export default class Backend {
  static async startNewGame(details) {
    const res = await fetch('/game-start', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });
    if (!res.ok) {
      throw new Error('Failed to start a new game..');
    }
    const newGameResult = await res.json();
    return newGameResult;
  }

  static async cancelGame(gameId) {
    const res = await fetch(`/game-cancel/${gameId}`, {
      method: 'PATCH',
    });
    if (!res.ok) {
      throw new Error('Failed to persist game cancellation..');
    }
    const cancelResult = await res.json();
    return cancelResult;
  }

  static async finishGame(gameId, gameStats) {
    const res = await fetch(`/game-finish/${gameId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameStats),
    });
    console.log(res);
    if (!res.ok) {
      throw new Error('Failed to persist game finishing..');
    }
    const finishGameResult = res.json();
    return finishGameResult;
  }

  static async submitScore(gameId) {
    const res = await fetch(`/submit-score/${gameId}`, {
      method: 'PATCH',
    });
    if (!res.ok) {
      throw new Error('Failed to persist score submitting..');
    }
    const submitScoreResult = await res.json();
    return submitScoreResult;
  }

  static async getLeaderboard() {
    const res = await fetch(`/leaderboard`);
    if (!res.ok) {
      throw new Error('Failed to retrieve leaderboard..');
    }
    const leaderboardResult = await res.json();
    return leaderboardResult;
  }
}
