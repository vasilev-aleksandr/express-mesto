const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const cards = require('./routes/cards');
const users = require('./routes/users');

app.use((req, res, next) => {
  req.user = {
    _id: '60abd5e2accc6f1464e7c104',
  };
  next();
});

app.use('/cards', cards);
app.use('/users', users);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
