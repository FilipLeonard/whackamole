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
    try {
      const res = await fetch(`/game-cancel/${gameId}`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        throw new Error('Failed to persist game cancellation..');
      }
      const cancelResponse = await res.json();
      return cancelResponse;
    } catch (err) {
      return console.error(err);
    }
  }

  static async finishGame(gameId, gameStats) {
    try {
      const res = await fetch(`/game-finish/${gameId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameStats),
      });
      if (!res.ok) {
        throw new Error('Failed to persist game finishing..');
      }
      return res.json();
    } catch (err) {
      return console.error(err);
    }
  }

  static async submitScore(gameId) {
    try {
      const res = await fetch(`/submit-score/${gameId}`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        throw new Error('Failed to persist score submitting..');
      }
      const submitScoreResult = await res.json();
      return submitScoreResult;
    } catch (err) {
      return console.error(err);
    }
  }

  static async getLeaderboard() {
    try {
      const res = await fetch(`/leaderboard`);
      if (!res.ok) {
        throw new Error('Failed to retrieve leaderboard..');
      }
      const getLbRes = await res.json();
      return getLbRes;
    } catch (err) {
      return console.error(err);
    }
  }
}
