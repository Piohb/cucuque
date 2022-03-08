const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

module.exports = (sequelize, DataTypes) => {
    class User extends Model {}

    User.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            unique: true,
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profile_pic: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        token: {
            unique: true,
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        // Other model options go here
        timestamps: false,
        sequelize, // We need to pass the connection instance
        modelName: 'User' // We need to choose the model name
    })

// `sequelize.define` also returns the model
    console.log('User :', User === sequelize.models.User) // true
    return User
}
