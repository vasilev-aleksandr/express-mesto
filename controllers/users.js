const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then(users => res.send({ data: users }))
  .catch((err) =>  res.status(500).send({ message: `Произошла ошибка при загрузке пользователей: ${err}`})
)};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
  .then((user) => {
    if (user === null) {
      return res.status(404).send({ message: `Пользователь по указанному _id не найден: ${req.params.userId}` });
    }
    return res.send({ data: user });
  })
  .catch(() => {
    return res.status(500).send({ message: 'Произошла ошибка' });
  });
};


module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  .then(user => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about, avatar  } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    { new: true }
    )
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar  } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true }
    )
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};