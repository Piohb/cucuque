const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/Auth')
const UserController = require('../controllers/User')
const { validateRegisterForm, validateLoginForm } = require("../validation/auth")
const { check, error } = require('../utils.js')
const Crypto = require("crypto");

//===
router.post("/register", validateRegisterForm(), async (req, res) => {
    try {
        let alreadyExist = await AuthController.emailExists(req.body.email)
        if (alreadyExist){
            return res.status(400).json({message:"Email already exist"})
        }

        let user = await AuthController.register(req.body)
        user = await UserController.update(user, {token: Crypto.randomBytes(64).toString('hex')})
        return res.status(201).json(user)

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
                if (user.token !== req.body.refreshToken) {
                    throw { code: 500, message: 'invalid_grant' }
                }
                break
            }

            default:
                throw { code: 500, message: 'invalid_grant_type' }
        }

        user = await UserController.update(user, {token: Crypto.randomBytes(64).toString('hex')})
        res.status(200).json({
            username: user.username,
            profile_pic: user.profile_pic,
            access_token: AuthController.generateToken(user),
            token_type: 'Bearer',
            expires_in: '900',
            refresh_token: user.token,
        });
    } catch (err) {
        error(res, err)
    }
})

module.exports = router