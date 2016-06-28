const express = require("express")
const bodyParser = require("body-parser")
const log = require("bunyan").createLogger({name: "marketwatcher-api-gateway"})
const expressBunyanLogger = require("express-bunyan-logger")

const configuration = require("../conf/app.json")
const apiRoutes = require("./api-routes")
const app = express()

app.use(expressBunyanLogger())

app.use("/", express.static(configuration.staticDir))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//if(!process.env.SECRET) throw new Error("$SECRET is not defined")
app.set("secret", process.env.SECRET || "keyboard cat")

app.use("/api", apiRoutes(app.get("secret"), configuration.redirection))

app.all("*", (req, res) => {
    res.redirect("/")
})

app.listen(8000, () => {
    log.info("Started listening on port " + 8000)
})
