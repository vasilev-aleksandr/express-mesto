const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000, BASE_PATH } = process.env;
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}); 

const cards = require('./routes/cards');
const users = require('./routes/users');

app.use('/cards', cards);
app.use('/users', users);

app.use((req, res, next) => {
  req.user = {
    _id: '60abd5e2accc6f1464e7c104' 
  };
  next();
}); 

app.listen(PORT, () => {
  console.log('Сервер запущен')
})


