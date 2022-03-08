const Validator = require('validator')
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

            if ( !(Validator.isEmail( req.body.email)) ) {
                errors.email = 'Email is invalid'
            }

            if (Validator.isEmpty( req.body.email)) {
                errors.email = 'Email is required'
            }

            if ('password' in req.body && Validator.isEmpty( req.body.password)) {
                errors.password = 'Password is required'
            }

            if(Object.keys(errors).length !== 0) {
                return res.status(400).json(errors)
            }

            next();
        }
    }
}