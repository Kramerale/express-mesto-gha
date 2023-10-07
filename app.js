const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const appRouter = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

// app.use(express.json()); // вместо бодипарсера
// app.use(express.urlencoded({ extended: true })); // вместо urlencoded из бодипарсера

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '651d5ec5aefa26e3639a418b'
  };

  next();
});

app.use(appRouter);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
