const dynastySelect = document.getElementById('dynasty-select');
const playersList = document.getElementById('players-list');
const gamesSection = document.getElementById('games');
const gameStateSelect = document.getElementById('game-status-select');
const playerGamesList = document.getElementById('player-games-list');

dynastySelect.addEventListener('input', event => {
  clearGameList();
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
  clearGameList();
  playerGamesList.insertAdjacentHTML('afterbegin', markup);
  gamesSection.classList.remove('hidden');
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

function clearGameList() {
  playerGamesList.innerHTML = '';
}
