const axios = require("axios");
const express = require('express')
const router = express.Router()
const Music = require('../controllers/Music')
const { error } = require('../utils.js')
require("dotenv/config")

//===
router.get('/genres', async function(req, res) {
    try {
        let response = await Music.Request("https://api.spotify.com/v1/browse/categories?country=FR", 'GET')
        return res.status(200).send({
            statusCode: 200,
            data: response.data.categories.items
        })

    } catch(err){
        error(res, err)
    }
})

module.exports = router