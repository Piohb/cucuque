const { Sequelize } = require('sequelize')
require("dotenv/config")

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
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