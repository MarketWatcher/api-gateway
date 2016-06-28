const request = require("supertest")
const jwt = require("jsonwebtoken")
const express = require("express")
const authenticationMiddleware = require("../src/authentication-middleware")
const bodyParser = require("body-parser")

describe("Authentication middleware", () => {
    it("should pass request through with a valid token", (done) => {
        let secret = "secret"
        let token = jwt.sign({}, secret, {})
        let server = express()

        server.use(bodyParser.json())
        server.use(authenticationMiddleware(jwt, secret))
        server.get("/", (req, res) => {
            res.send("ok")
        })

        request(server)
            .get("/")
            .set("x-access-token", token)
            .expect(200, "ok", done)
    })

    it("should return forbidden if the token is invalid", (done) => {
        let secret = "secret"
        let server = express()

        server.use(bodyParser.json())
        server.use(authenticationMiddleware(jwt, secret))
        server.get("/", (req, res) => {
            res.send("ok")
        })

        request(server)
            .get("/")
            .set("x-access-token", "invalid-token")
            .expect(403, done)
    })

    it("should return forbidden if there is no token", (done) => {
        let secret = "secret"
        let server = express()

        server.use(bodyParser.json())
        server.use(authenticationMiddleware(jwt, secret))
        server.get("/", (req, res) => {
            res.send("ok")
        })

        request(server)
            .get("/")
            .expect(403, done)
    })
})
