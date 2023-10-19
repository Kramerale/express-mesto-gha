const router = require('express').Router();
const {getUsers, getUserById, getUserInfo, updateUserInfoById, updateUserAvatarById} = require('../controllers/users');
const {updateUserInfoValidation, updateUserAvatarValidation, userIdValidation} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.patch('/me', updateUserInfoValidation, updateUserInfoById);
router.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatarById);
router.get('/:userId', userIdValidation, getUserById);

module.exports = router;