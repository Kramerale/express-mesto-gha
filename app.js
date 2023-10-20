const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const {errors} = require('celebrate');

const appRouter = require('./routes/index');
const {login, createUser} = require('./controllers/users');
const auth = require('./middlewares/auth');
const handleErrors = require('./middlewares/handleErrors');
const {loginValidation, createUserValidation} = require('./middlewares/validation');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use(appRouter);

app.use(errors());

app.use(handleErrors); // добавлять в самом конце основного файла!!!

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
