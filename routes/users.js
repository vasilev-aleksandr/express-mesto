const router = require('express').Router();
const { validateUserUpdate, validateAvatar } = require('../middlewares/requestValidation');
const {
  getUsers, getUser, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/me', getCurrentUser);
router.patch('/me', validateUserUpdate, updateUser);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
