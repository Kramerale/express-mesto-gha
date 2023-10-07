const router = require('express').Router();
const {createUser, getUsers, getUserById, updateUserInfoById, updateUserAvatarById} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.patch('/me', updateUserInfoById);
router.patch('/me/avatar', updateUserAvatarById);
router.get('/:userId', getUserById);

module.exports = router;