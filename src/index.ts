import express from "express"
import http from "http"
import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

interface INotificationSchema {
    recipentArr: string[],
    readUsers: string[],
    unreadUsers: string[],
    sender: string,
    about: string,
    link: string,
    createdAt: Date,
    senderName: string
}

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("a user connected")
})

app.set("io", io)
app.use(express.json())

app.post("/notification", async (req, res) => {
    const notification: INotificationSchema = req.body
    console.log("notification", notification)
    var newPromise = new Promise((resolve, reject) => {
        notification.recipentArr.forEach((value, index) => {
            req.app.get("io").emit(value, notification)
            if (notification.recipentArr.length - 1 === index) resolve("done")
        })
    })
    const data = await newPromise
    if (data) {
        res.send({ status: 200, message: "successfully sent" })
    }
    else {
        res.send({ status: 400, message: "couldn't successfully sent" })
    }
})

server.listen(8080, () => {
    console.log("listening on http://localhost:8080")
})