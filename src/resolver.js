class Resolver {
    constructor(redirectionMap) {
        if(!redirectionMap) throw TypeError("resolver must be initialized with a redirectionMap")
        this.redirectionMap = redirectionMap
    }

    join(host, path) {
        let trimSlashes = (str) => {
            return str.replace(/^\//, "").replace(/\/$/, "")
        }
        
        return `${trimSlashes(host)}/${trimSlashes(path)}`
    }

    resolve(request) {
        for(let requestPrefix in this.redirectionMap) {
            if(request.startsWith(requestPrefix)){
                return this.join(this.redirectionMap[requestPrefix], request)
            }
        }

        return false
    }
}

module.exports = Resolver
