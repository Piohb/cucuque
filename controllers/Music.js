const axios = require("axios");

module.exports = {
    AuthCron: function (){
        axios('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Authorization' : 'Basic ' + (new Buffer(process.env.APP_ID + ':' + process.env.APP_SECRET).toString('base64')) },
            data: 'grant_type=client_credentials',
            json: true

        }).then(function (response) {
            // handle success
            //console.log(response.data)
            SpotifyToken = response.data.access_token

        }).catch( (err) => {
            // handle error
            //console.log(error)
            throw err
        })

        setTimeout( () => {
            this.AuthCron()
        }, 1000 * 60 * 60)
    },

    Request: async function(url, method){
        return await axios(url, {
            method: method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + SpotifyToken
            },

        }).then(function (response) {
            // handle success
            //console.log(response.data)
            return response

        }).catch( (err) => {
            // handle error
            //console.log(err)
            throw err
        })

    }
}