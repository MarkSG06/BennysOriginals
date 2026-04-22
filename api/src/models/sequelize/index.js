'use strict'

const fs = require('fs')
const Sequelize = require('sequelize')
const path = require('path')
const basename = path.basename(__filename)
const sequelizeDb = {}

// establecer conexion a bbDD
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {

  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

// cargar los modelos de sequelize
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    )
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    sequelizeDb[model.name] = model
  })

// cargar las relaciones de los modelos de sequelize
Object.keys(sequelizeDb).forEach(modelName => {
  if (sequelizeDb[modelName].associate) {
    sequelizeDb[modelName].associate(sequelizeDb)
  }
})

// exportar modelos a controladores
sequelizeDb.sequelize = sequelize
sequelizeDb.Sequelize = Sequelize

module.exports = sequelizeDb
