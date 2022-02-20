const { Sequelize } = require('sequelize')
const sequelize = require('../connect')
const fs = require('fs');
const path = require('path');
const models = {}

// exports every models files
fs
    .readdirSync(__dirname)
    .filter((file) =>
        file !== 'index.js'
    )
    .forEach((file) => {
        let model = require(path.join(__dirname, file))(sequelize, Sequelize)
        models[model.name] = model
    })

module.exports = models