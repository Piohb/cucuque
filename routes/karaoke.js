const axios = require("axios");
const express = require('express')
const router = express.Router()

//===
router.get('/genres', async function(req, res) {
    let tokenResponse, catResponse
    try {
        tokenResponse = await axios('https://accounts.spotify.com/api/token',{
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Authorization' : 'Basic MjFlNWYxZjM3ZDg2NGJiOWJiNjA3YTg3NDhjYTQyYTc6OTkxN2RiNjE4ZjhkNDZmN2IyYWQyZjAzMTI5NmQyMzM='
                },
                data: 'grant_type=client_credentials',
                method:"POST"
            })

        catResponse = await axios("https://api.spotify.com/v1/browse/categories?country=FR", {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+tokenResponse.data.access_token
                },
                method:"GET"
            })

        return res.status(200).send({
            statusCode: 200,
            data: catResponse.data.categories.items
        })

    } catch(error){
        console.log(error)
        return res.status(500).json({
            statusCode: 500,
            data: null
        })
    }
})

module.exports = router