const badRequestError = require('../utils/BadRequestError');
const notFoundError = require('../utils/NotFoundError');
const conflictError = require('../utils/ConflictError');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user');

const createUser = (req, res, next) => {
  const {name, about, avatar, email} = req.body;

  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    userModel.create({name, about, avatar, email, password: hash})
    .then(user => {
      return res.status(201).send(user);
    })
    .catch(err => {
      if(err.name === 'ValidationError' || err.name === 'CastError') {
        throw new badRequestError('Переданы некорректные данные');
      } else if (err.code === 11000) {
        throw new conflictError('Пользователь с таким email существует');
      }
    })
  })
  .catch(next);
};

const getUsers = (req, res, next) => {
  userModel.find({})
  .then(users => {
    return res.status(200).send(users);
  })
  .catch(next);
};

const getUserById = (req, res, next) => {
  const {userId} = req.params;

  userModel.findById(userId)
  .then(user => {
    if(!user) {
      throw new notFoundError('Пользователь с данным id не найден');
    }
    return res.status(200).send(user);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      throw new badRequestError('Переданы некорректные данные');
    }
  })
  .catch(next);
};

const getUserInfo = (req, res, next) => {
  userModel.findById(req.user._id)
  .then(user => {
    if(!user) {
      throw new notFoundError('Пользователь с данным id не найден');
    }
    return res.status(200).send(user);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      throw new badRequestError('Переданы некорректные данные');
    }
  })
  .catch(next);
};

const updateUserInfoById = (req, res, next) => {
  const {name, about} = req.body;

  userModel.findByIdAndUpdate(
    req.user._id,
    {name, about},
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true // если пользователь не найден, он будет создан
    }
  )
  .then(user => {
    if(!user) {
      throw new notFoundError('Пользователь с данным id не найден');
    }
    return res.status(200).send(user);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      throw new badRequestError('Переданы некорректные данные');
    }
  })
  .catch(next);
};

const updateUserAvatarById = (req, res, next) => {
  const {avatar} = req.body;

  userModel.findByIdAndUpdate(
    req.user._id,
    {avatar},
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true // если пользователь не найден, он будет создан
    }
  )
  .then(user => {
    if(!user) {
      throw new notFoundError('Пользователь с данным id не найден');
    }
    return res.status(200).send(user);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      throw new badRequestError('Переданы некорректные данные');
    }
  })
  .catch(next);
};

const login = (req, res, next) => {
  const {email, password} = req.body;

  return userModel.findUserByCredentials(email, password)
  .then(user => {
    const token = jwt.sign({_id: user._id}, 'some-secret-key', {expiresIn: '7d'});

    res.send({token});
  })
  .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserInfo,
  updateUserInfoById,
  updateUserAvatarById,
  login
};