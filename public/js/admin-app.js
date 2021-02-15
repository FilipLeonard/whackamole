const dynastySelect = document.getElementById('dynasty-select');
const playersList = document.getElementById('players-list');

dynastySelect.addEventListener('input', event => {
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
  const games = await res.json();
  console.log(games);
});
