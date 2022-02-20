const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/Auth')
const UserController = require('../controllers/User')
const { validateRegisterForm, validateLoginForm } = require("../validation/auth");
const { check, error } = require('../utils.js') ;

//===
router.post("/register", validateRegisterForm(), async (req, res) => {
    try {
        await AuthController.emailExists(req.body.email, res)
        let user = await AuthController.register(req.body)
        res.status(201).json(user)

    } catch (err) {
        error(res, err)
    }
})

router.post("/login", validateLoginForm(), async (req,res) => {
    try {
        let user;
        check(req.body.grant_type, 'invalid_request')
        switch (req.body.grant_type) {
            case 'password': {
                user = await UserController.findUserByEmail(req.body.email)
                check(user, 'unknown_user', 404)
                const result = await AuthController.comparePassword(req.body.password, user.password)
                check(result, 'invalid_grant', 400)
                break
            }

            case 'refresh_token': {
                check(req.body.refreshToken, 'invalid_request');
                user = await UserController.findUserByEmail(req.body.email)
                if (user.refresh_token !== req.body.refreshToken) {
                    throw { code: 500, message: 'invalid_grant' }
                }
                break
            }

            default:
                throw { code: 500, message: 'invalid_grant_type' }
        }

        res.status(200).json({
            access_token: AuthController.generateAccessToken(user),
            token_type: 'Bearer',
            expires_in: '900',
            refresh_token: user.refresh_token,
        });
    } catch (err) {
        error(res, err)
    }
})

module.exports = router