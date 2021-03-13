# Whackerston

_Whack-A-Mole inspired game_

There's no mole in this game but there's also no fun in naming it "Tap-The-Tile". Whackerston is a simple web game served by a stand alone Node.js application built during my [learning journey](https://github.com/FilipLeonard/FilipLeonard/blob/main/pivoting.md). It is powered by Express and EJS. The UI was developed with plain JavaScript and Sass.

![Game Preview](https://i.imgur.com/PLVE8Kp.png)

---

## How To Play

- Tap an active (differently coloured) square before it becomes inactive
- 5 consecutive hits increase the multiplier, a miss resets the counter
- _Survival_ mode begins with 3 lives (3 misses end the game )
- _Battle_ mode starts a 1-minute timer (game's over when time's up)
- Score submittal is optional
- Simple leaderboard available

---

## Demo

Here is a working live demo: https://whackerston.herokuapp.com/

---

## General Info

_I allocated roughly two weeks for building this app so I decided to build a single, hybrid deployment that would both serve a handful of views and also provide different REST endpoints._

- The project structure follows the MVC pattern.
- Domain object models _Player_, _Game_, _Scoring_ and _Dynasty_ interface with MongoDB via `mongoose`.
  - a game is played by a player, a player has a high-score game, a player belongs to a dynasty, a dynasty has a scoring method
- Views are rendered server-side
  - `index.ejs` is served on a GET `/` request and contains most of the HTML structure
  - `404.ejs` and `500.ejs` are fallbacks for unregistered routes and server errors
- REST endpoints expect and return json format:
  - GET `/leaderboard`
  - PUT `/game-start`,
  - PATCH `/game-cancel/:gameId`, `/game-finish/:gameId` and `/submit-score/:gameId`
- The game logic runs in the browser and is statically served along with the styles

---

## Technologies

- Express w. [EJS templating engine](https://ejs.co/)
- [mongoose](https://ejs.co/)
- Other 'standard' middleware
- Sass, CSS Grid and Flexbox
