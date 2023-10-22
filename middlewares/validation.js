const { celebrate, Joi } = require('celebrate');

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(http(s?)):\/\/(www.)?[a-zA-Z0-9\.\-\/]{1,}#?/), // прописать regex для pattern
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(http(s?)):\/\/(www.)?[a-zA-Z0-9\.\-\/]{1,}#?/), // прописать regex для pattern
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/(http(s?)):\/\/(www.)?[a-zA-Z0-9\.\-\/]{1,}#?/), // прописать regex для pattern
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

module.exports = {
  createCardValidation,
  cardIdValidation,
  createUserValidation,
  loginValidation,
  updateUserInfoValidation,
  updateUserAvatarValidation,
  userIdValidation,
};
