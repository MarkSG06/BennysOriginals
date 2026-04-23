const sequelizeDb = require('../../models/sequelize')
const User = sequelizeDb.User
const Op = sequelizeDb.Sequelize.Op
const bcrypt = require('bcryptjs')

exports.create = async (req, res, next) => {
  try {
    const data = await User.create(req.body)
    res.status(200).send(data)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}

exports.findAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.size) || 10
    const offset = (page - 1) * limit
    const whereStatement = {}

    for (const key in req.query) {
      if (req.query[key] !== '' && req.query[key] !== 'null' && key !== 'page' && key !== 'size') {
        whereStatement[key] = { [Op.substring]: req.query[key] }
      }
    }

    const condition = Object.keys(whereStatement).length > 0
      ? { [Op.and]: [whereStatement] }
      : {}

    const result = await User.findAndCountAll({
      where: condition,
      attributes: ['id', 'name', 'password', 'createdAt', 'updatedAt'],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })

    result.meta = {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      currentPage: page,
      size: limit
    }

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await User.findByPk(id)

    if (!data) {
      const err = new Error()
      err.message = `No se puede encontrar el elemento con la id=${id}.`
      err.statusCode = 404
      throw err
    }

    res.status(200).send(data)
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id
    const [numberRowsAffected] = await User.update(req.body, { where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error()
      err.message = `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado.`
      err.statusCode = 404
      throw err
    }

    res.status(200).send({
      message: 'El elemento ha sido actualizado correctamente.'
    })
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }

    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id
    const numberRowsAffected = await User.destroy({ where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error()
      err.message = `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado.`
      err.statusCode = 404
      throw err
    }

    res.status(200).send({
      message: 'El elemento ha sido borrado correctamente.'
    })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { name, password, remember } = req.body
    const user = await User.findOne({ where: { name } })

    if (!user) {
      const err = new Error()
      err.message = `No se puede encontrar el usuario con el name=${name}.`
      err.statusCode = 404
      throw err
    }

    let isPasswordValid = false
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
      isPasswordValid = await bcrypt.compare(password, user.password)
    } else {
      isPasswordValid = password === user.password
    }

    if (!isPasswordValid) {
      const err = new Error()
      err.message = `La contraseña es inválida para el usuario=${name}.`
      err.statusCode = 401
      throw err
    }

    res.status(200).send(user)
  } catch (err) {
    next(err)
  }
}