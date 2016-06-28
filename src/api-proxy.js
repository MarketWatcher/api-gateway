class ApiProxy {
    constructor(resolver, client){
        if(!resolver) throw new TypeError("ApiProxy must be initialized with a resolver")
        if(!client) throw new TypeError("ApiProxy must be initialized with a requestjs instance")

        this.resolver = resolver
        this.client = client

        this.redirect = this.redirect.bind(this)

    }

    redirect(req, res) {
        let destination = this.resolver.resolve(req.originalUrl)
        if(!destination) return res.sendStatus(404)

        try {
            this.client({method: req.method, url: destination, json: req.body})
            .on("error", (error) => {
                req.log.error(error)
                return res.status(500).json({message: "Unexpected Error", id: req.id})
            })
            .pipe(res)
        } catch (e) {
            req.log.error(e)
            return res.status(500).json({message: "Unexpected Error", id: req.id})
        }
    }
}

module.exports = ApiProxy
