const { Sequelize } = require('sequelize')
require("dotenv/config")

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: process.env.DB_DIALECT,
    dialectOptions : {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
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