import express from 'express';
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io';
import path from 'path'

const app = express();
const httpServer = app.listen(8080,() => console.log("Listening on PORT 8080"))

const io = new Server(httpServer)

app.engine('handlebars',handlebars.engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine','handlebars')
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', viewsRouter)

let messages = [];
io.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    socket.on('authenticated', (user) => {
        if (user){
            socket.broadcast.emit('newUserConnected', user)
            socket.emit('messageLogs', messages);
        }
    })

    socket.on('message', data => {
        messages.push(data)
        io.emit('messageLogs', messages)
    })
})