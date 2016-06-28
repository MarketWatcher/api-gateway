const express = require("express")
const jwt = require("jsonwebtoken")
const ApiProxy = require("./api-proxy")
const request = require("request")
const Resolver = require("./resolver")
const authenticationMiddleware = require("./authentication-middleware")

module.exports = (secret, redirection) => {
    let apiRoutes = express.Router()
    let resolver = new Resolver(redirection)

    apiRoutes.post("/authenticate", (req, res) => {
        let users = require("../users")

        if(!req.body || !req.body.email || !req.body.password) return res.sendStatus(400)

        let match = users.filter(user => user.email === req.body.email && user.password === req.body.password)

        if(match.length < 1) return res.sendStatus(401)

        let {id, email} = match[0]
        let token = jwt.sign({id, email}, secret, {
            expiresIn: 86400
        })

        res.status(200).json({id, email, token})
    })

    apiRoutes.use(authenticationMiddleware(jwt, secret))

    apiRoutes.all("*", new ApiProxy(resolver, request).redirect)

    return apiRoutes
}
