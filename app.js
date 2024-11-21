const express = require("express")
const entrepriseRouter = require("./router/entrepriseRouter")
const ordinateurRouter = require("./router/ordinateurRouter")
const employeRouter = require("./router/employeRouter")
const taskRouter = require('./router/taskRouter');

const session = require("express-session")
require("dotenv").config()


const app = express()
// appeller avant le middleware userRouter
app.use(express.static("./public"))
app.use(session({
    secret: "Azertyuiop",
    resave: true,
    saveUninitialized: true,
}))

app.use(express.urlencoded({ extended: true }))

app.use(entrepriseRouter)
app.use(ordinateurRouter)
app.use(employeRouter)
app.use(taskRouter)

app.listen(process.env.PORT, () => {
    console.log("Connecté sur le port 3011");
})