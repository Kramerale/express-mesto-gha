const badRequest = 400;
const notFound = 404;
const internalServerError = 500;

const userModel = require('../models/user');

const createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  userModel.create({name, about, avatar})
  .then(user => {
    return res.status(201).send(user);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(badRequest).send({message: 'Переданы некорректные данные'})
    } else {
      return res.status(internalServerError).send({message: 'Произошла ошибка на сервере'});
    }
  })
};

const getUsers = (req, res) => {
  userModel.find({})
  .then(users => {
    return res.status(200).send(users);
  })
  .catch(err => {
    return res.status(internalServerError).send({message: 'Произошла ошибка на сервере'});
  })
};

const getUserById = (req, res) => {
  userModel.findById(req.params.userId)
  .then(user => {
    if(!user) {
      return res.status(notFound).send({message: 'Пользователь с данным id не найден'});
    }
    return res.status(200).send(user);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(badRequest).send({message: 'Переданы некорректные данные'})
    } else {
      return res.status(internalServerError).send({message: 'Произошла ошибка на сервере'});
    }
  })
};

const updateUserInfoById = (req, res) => {
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
      return res.status(notFound).send({message: 'Пользователь с данным id не найден'});
    }
    return res.status(200).send(user);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(badRequest).send({message: 'Переданы некорректные данные'})
    } else {
      return res.status(internalServerError).send({message: 'Произошла ошибка на сервере'});
    }
  })
};

const updateUserAvatarById = (req, res) => {
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
      return res.status(notFound).send({message: 'Пользователь с данным id не найден'});
    }
    return res.status(200).send(user);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(badRequest).send({message: 'Переданы некорректные данные'})
    } else {
      return res.status(internalServerError).send({message: 'Произошла ошибка на сервере'});
    }
  })
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserInfoById,
  updateUserAvatarById
};