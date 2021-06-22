const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cards = require('./routes/cards');
const users = require('./routes/users');
const { login, addUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateLogin, validateAddUser } = require('./middlewares/requestValidation');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', validateLogin, login);

app.post('/signup', validateAddUser, addUser);

app.use('/cards', auth, cards);
app.use('/users', auth, users);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка =('
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
