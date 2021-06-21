const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedErr = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: `Пользователь по указанному _id не найден: ${req.params.userId}` });
      }
      res.send({ message: user });
    })
    .catch((err) => {
      if (err.name === 'ObjectId' || err.name === 'CastError') {
        throw new BadRequestError('Некорректная информация');
      } else if (err.statusCode === 404) {
        next(err);
      } else {
        throw new Error('Server error');
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: `Пользователь по указанному _id не найден: ${req.params.userId}` });
      }
      res.send({ message: user });
    })
    .catch((err) => {
      if (err.name === 'ObjectId' || err.name === 'CastError') {
        throw new BadRequestError('Некорректная информация');
      } else if (err.statusCode === 404) {
        next(err);
      } else {
        throw new Error('Ошибка сервера');
      }
    })
    .catch(next);
};

module.exports.addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      data: {
        name: user.name, about: user.about, avatar, email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new UnauthorizedErr({ message: 'Пользователь с таким email уже зарегистрирован' });
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError('Некорректная информация');
      } else {
        throw new Error('Ошибка сервера');
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: `Пользователь по указанному _id не найден: ${req.params.userId}` });
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректная информация'));
      } else if (err.statusCode === 404) {
        next(err);
      } else if (err.name === 'ObjectId' || err.name === 'CastError') {
        next(new BadRequestError('Некорректная информация'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: `Пользователь по указанному _id не найден: ${req.params.userId}` });
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректная информация'));
      } else if (err.statusCode === 404) {
        next(err);
      } else if (err.name === 'ObjectId' || err.name === 'CastError') {
        next(new BadRequestError('Некорректная информация'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Успешная авторизация' });
    })
    .catch(next);
};
