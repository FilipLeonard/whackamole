# Whackerston

_Whack-A-Mole inspired game_

There's no mole in this game but there's also no fun in naming it "Tap-The-Tile". Whackerston is a simple web game served by a stand alone Node.js application built during my learning [journey](https://github.com/FilipLeonard/FilipLeonard/blob/main/pivoting.md). It is powered by Express and EJS. The UI was developed with plain JavaScript and Sass.

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

_I allocated roughly two weeks for building this app so I decided to build one deployment that would serve the views but also provide all the necessary REST endpoints_

- The project is built as a stand alone node server, without a separate frontend deployment.
- Every view is rendered server-side while style and browser-logic files are served statically.
- The project structure follows the MVC pattern and is conceptually organized around three areas: _auth_, _admin_ and _shop_ (e.g. user authentication, own products administration and general web shop).
- Domain object models _User_, _Product_ and _Order_ interface with noSQL database MongoDB.
- Sessions are used to authenticate requests for protected resources and these are also stored on MongoDB, in the same database.
- Product images are stored on the server and image paths on the database
- Invoice PDFs are generated and stored on the server

---

## Features

- Authentication
  - simple email & password signup/login
  - password reset
  - auto login with sessions
- Administration
  - Own products browse
  - Product add, edit or delete
- General Shop
  - Products browse/detail
  - Shopping cart
  - Past orders with simple, downloadable PDF invoices
- Mobile friendly

---

## Technologies

- Express w. [EJS templating engine](https://ejs.co/)
- [mongoose](https://ejs.co/)
- express-session w. connect-mongo-db-session
- bcrypt & express-validator
- other 'standard' middleware
