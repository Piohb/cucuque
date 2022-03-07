//=== REQUIRED
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerOptions = require('./swagg.json')
const swaggerUi = require('swagger-ui-express')
const express = require('express')
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require('cors')
require("dotenv/config")

//=== INIT
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS,
        methods: ["GET", "POST"]
    }
})
const sequelize = require('./connect')
const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use(express.json())
app.use(cors())

//=== ROUTES
app.use("/users", require('./routes/users'))
app.use("/auth", require('./routes/auth'))
app.use("/karaoke", require('./routes/karaoke'))
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

//=== SOCKET
const socket = require('./controllers/Socket')
io.on('connection', socket)

//=== RUN SERVER
const port = process.env.PORT || 5000

httpServer.listen(port, () => {
    console.log("Server up and running on " + port)
})