const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const gameRoutes = require('./routes/game');

const MONGODB_URI =
  // `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clusternodecomplete.jg2xr.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
  `mongodb+srv://leooonard:qwerty789@clusternodecomplete.jg2xr.mongodb.net/whackamole`;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(gameRoutes);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3000);
  });
