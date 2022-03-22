const Validator = require('validator')
const AuthController = require('../controllers/Auth')
const jwt = require('jsonwebtoken')
require("dotenv/config")

module.exports = {

    validateRegisterForm : function () {
        return(req, res, next) => {
            let errors = {}

            if (Validator.isEmpty(req.body.username)) {
                errors.username = 'Username is required'
            }

            if ( !(Validator.isEmail(req.body.email)) ) {
                errors.email = 'Email is invalid'
            }

            if (Validator.isEmpty(req.body.email)) {
                errors.email = 'Email is required'
            }

            if (Validator.isEmpty(req.body.password)) {
                errors.password = 'Password is required'
            }

            if(Object.keys(errors).length !== 0) {
                return res.status(400).json(errors)
            }

            next();
        }
    },

    validateLoginForm: function () {
        return(req, res, next) => {
            let errors = {}

            if ('email' in req.body && req.body.email){
                if (!(Validator.isEmail( req.body.email)) ) {
                    errors.email = 'Email is invalid'
                }

                if (Validator.isEmpty( req.body.email)) {
                    errors.email = 'Email is required'
                }
            }

            if ('password' in req.body && Validator.isEmpty( req.body.password)) {
                errors.password = 'Password is required'
            }

            if(Object.keys(errors).length !== 0) {
                return res.status(400).json(errors)
            }

            next();
        }
    },

    certificateAccess: function (){
        return(req, res, next) => {
            let token = req.headers.authorization.split(' ');
            console.log('certificateAccess', req.headers.authorization, token[1])
            jwt.verify(token[1], process.env.PRIVATE_KEY, function(err, decoded) {
                console.log(decoded)
                if (err) {
                    return res.status(401).json(err)
                } else {
                    next()
                }
            });
        }
    }
}