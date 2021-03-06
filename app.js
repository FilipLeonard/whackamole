const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');

const errorController = require('./controllers/error');

const gameRoutes = require('./routes/game');
const adminRoutes = require('./routes/admin');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clusternodecomplete.jg2xr.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(({ method, url }, res, next) => {
  console.log({ method, url });
  next();
});

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(gameRoutes);
app.use('/potato', adminRoutes);

app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use(errorController.masterErrorHandler);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3000);
  });
