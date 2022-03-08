const { Sequelize } = require('sequelize')
require("dotenv/config")

let dialectOptions = {
    ssl: { require: true, rejectUnauthorized: false }
}

if (process.env.DATABASE_URL.includes('localhost')){ dialectOptions = {} }

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: process.env.DB_DIALECT,
    dialectOptions : dialectOptions,
    logging: false
})

try {
    sequelize.authenticate()
    console.log('Connection has been established !')
    sequelize.sync()
    console.log("All models were synchronized successfully")

} catch (err) {
    console.error('Can\'t connect, error :', err)
}

module.exports = sequelize