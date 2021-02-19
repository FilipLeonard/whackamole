const dynastySelect = document.getElementById('dynasty-select');
const playersList = document.getElementById('players-list');

const playerGamesSection = document.getElementById('player-games');
const gameStateSelect = document.getElementById('game-status-select');
const playerGamesList = document.getElementById('player-games-list');

const gamesSection = document.getElementById('games');
const inputDateStart = document.getElementById('game-date-start');
const inputDateEnd = document.getElementById('game-date-end');
const gamesList = document.getElementById('games-list');

[inputDateStart, inputDateEnd].forEach(
  dateInput => (dateInput.valueAsDate = new Date())
);

dynastySelect.addEventListener('input', event => {
  clearPlayerGamesList();
  const selectedDynasty = dynastySelect.value;

  const players = playersList.children;
  for (const player of players) {
    if (selectedDynasty === 'all') {
      player.classList.remove('hidden');
    } else if (selectedDynasty === player.dataset.dynasty) {
      player.classList.remove('hidden');
    } else {
      player.classList.add('hidden');
    }
  }
});

playersList.addEventListener('click', async e => {
  const player = e.target.closest('.players__player');
  if (!player) return console.log('Not a player');
  const { id: name } = player;

  const res = await fetch(`/potato/games/${name}`);

  if (!res.ok) return console.log('fetch games failed');
  const { data } = await res.json();
  const { games } = data;

  const markup = `${games
    .map(
      g =>
        `<li data-state=${g.state}>${g.state} | ${g.whacks} | ${g.partialPoints}</li>`
    )
    .join('')}`;
  clearPlayerGamesList();
  playerGamesList.insertAdjacentHTML('afterbegin', markup);
  playerGamesSection.classList.remove('hidden');
});

gameStateSelect.addEventListener('input', event => {
  const selectedState = gameStateSelect.value;

  const games = playerGamesList.children;
  for (const game of games) {
    console.log({ selectedState, currentState: game.dataset.state });
    if (selectedState === 'all') {
      game.classList.remove('hidden');
    } else if (selectedState === game.dataset.state) {
      game.classList.remove('hidden');
    } else {
      game.classList.add('hidden');
    }
  }
});

function clearPlayerGamesList() {
  playerGamesList.innerHTML = '';
}

function clearGamesList() {
  gamesList.innerHTML = '';
}

[inputDateStart, inputDateEnd].forEach(dateInput =>
  dateInput.addEventListener('change', async e => {
    const startDate = inputDateStart.value;
    const endDate = inputDateEnd.value;

    const res = await fetch(`/potato/games?start=${startDate}&end=${endDate}`);

    if (!res.ok) return console.log('fetch games failed');
    const { data } = await res.json();
    const { games } = data;

    const markup = `${games
      .map(
        g =>
          `<li data-player=${g.player}>${new Date(
            g.createdAt
          ).toDateString()} | ${g.player} | ${g.state} | ${g.whacks} | ${
            g.partialPoints
          }</li>`
      )
      .join('')}`;

    clearGamesList();
    gamesList.insertAdjacentHTML('afterbegin', markup);
  })
);
