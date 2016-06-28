const ApiProxy = require("../src/api-proxy")
const Resolver = require("../src/resolver")
const client = require("request")
const express = require("express")
const request = require("supertest")
const bunyan = require("bunyan")

describe("ApiProxy", () => {
    it("should make a request to resolved destination", (done) => {
        let redirectionMap = {
            "/test": "http://localhost:10001"
        }

        let local = createLocal(redirectionMap)
        let remote = createRemote()

        request(local)
            .get("/test")
            .expect(200, {
                status: "ok"
            })
            .end((err)=> {
                remote.close()
                if(err) done(err)
                else done()
            })

    })

    it("should return error status from remote server if any", (done) => {
        let redirectionMap = {
            "/bad-request": "http://localhost:10001"
        }

        let local = createLocal(redirectionMap)
        let remote = createRemote()

        request(local)
            .get("/bad-request")
            .expect(400)
            .end((err) => {
                remote.close()
                if(err) done(err)
                else done()
            })
    })

    it("should report internal server error if redirectionMap is malformed", (done) => {
        let redirectionMap = {
            "/any": "malformed"
        }

        let local = createLocal(redirectionMap)
        let remote = createRemote()

        request(local)
            .get("/any")
            .expect(500)
            .end((err)=> {
                remote.close()
                if(err) done(err)
                else done()
            })
    })
})

const createLocal = (redirectionMap) => {
    let app = express()

    app.use(require("express-bunyan-logger")({
        name: "reqLogger",
        streams: [{
            level: "debug",
            stream: new bunyan.RingBuffer({limit: 100})
        }]
    }))

    let resolver = new Resolver(redirectionMap)
    let apiProxy = new ApiProxy(resolver, client)

    app.all("*", apiProxy.redirect)

    return app
}

const createRemote = () => {
    let app = express()

    app.get("/test", (req, res) => {
        res.json({status: "ok"})
    })
    app.get("/bad-request", (req, res) => {
        res.sendStatus(400)
    })

    return app.listen(10001)
}
