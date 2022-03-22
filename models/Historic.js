const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

module.exports = (sequelize, DataTypes) => {
    class Historic extends Model {}

    Historic.init({
        // Model attributes are defined here

    }, {
        // Other model options go here
        timestamps: false,
        sequelize, // We need to pass the connection instance
        modelName: 'Historic' // We need to choose the model name
    })

// `sequelize.define` also returns the model
    console.log('Historic :', Historic === sequelize.models.Historic) // true
    return Historic
}
