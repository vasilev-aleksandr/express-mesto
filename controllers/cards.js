const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link, userId } = req.body;
  Card.create({ name, link, owner: userId })
    .catch((err) => {
      throw new BadRequestError({ message: `Указаны некорректные данные при создании карточки: ${err.message}` });
    })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.userId)
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Нет карточки с таким id' });
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.userId,
    { $addToSet: { likes: req.params.userId } },
    { new: true })
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Нет карточки с таким id' });
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Нет карточки с таким id' });
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};
