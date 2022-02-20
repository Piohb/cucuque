//=== REQUIRED
const express = require('express')
const { createServer } = require("http")
const cors = require('cors')
require("dotenv/config")

//=== INIT
const app = express()
const httpServer = createServer(app)
const sequelize = require('./connect')

app.use(express.json())
app.use(cors())

//=== ROUTES
app.use("/users", require('./routes/users'))
app.use("/auth", require('./routes/auth'))
app.get('/test',(req,res) => {
    res.send('zizi')
})

//=== RUN SERVER
const port = process.env.PORT || 5000

httpServer.listen(port, () => {
    console.log("Server up and running on " + port)
})