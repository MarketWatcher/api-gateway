module.exports = (verifier, secret) => {
    return (req, res, next) => {
        let token = req.body.token || req.query.token || req.headers["x-access-token"]

        if(token) {
            verifier.verify(token, secret, (err, decoded) => {
                if (err) return res.status(403).send("Token not verified")
                req.decoded = decoded
                next()
            })
        } else {
            return res.status(403).send("No token")
        }
    }
}
