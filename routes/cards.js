const router = require('express').Router();
const { validateCard, validateId } = require('../middlewares/requestValidation');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateId, deleteCard);
router.put('/:cardId/likes', validateId, likeCard);
router.delete('/:cardId/likes', validateId, dislikeCard);

module.exports = router;
