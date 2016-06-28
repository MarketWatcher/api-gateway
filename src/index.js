const express = require("express")
const log = require("bunyan").createLogger({name: "marketwatcher-api-gateway"})
const configuration = require("../conf/app.json")
const request = require("request")
const bodyParser = require("body-parser")
const expressBunyanLogger = require("express-bunyan-logger")

const Resolver = require("./resolver")
const ApiProxy = require("./api-proxy")

let resolver = new Resolver(configuration.redirection)

const app = express()

app.use(expressBunyanLogger())

app.use("/", express.static(configuration.staticDir))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/api/login", (req, res) => {

})

app.all("/api*", new ApiProxy(resolver, request).redirect)

app.all("*", (req, res) => {
    res.redirect("/")
})

app.listen(8000, () => {
    log.info("Started listening on port " + 8000)
})
