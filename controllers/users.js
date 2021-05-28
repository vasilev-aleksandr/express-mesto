const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: `Пользователь по указанному _id не найден: ${req.params.userId}` });
      }
      return res.send({ message: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Пользователь с id: ${req.params.userId} не найден`,
        });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map((e) => e.message).join(', ')}` });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
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
        return res.status(404).send({ message: `Пользователь по указанному _id не найден: ${req.user._id}` });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
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
        return res.status(404).send({ message: `Пользователь по указанному _id не найден: ${req.user._id}` });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
