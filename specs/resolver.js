let expect = require("expect.js")
let Resolver = require("../src/resolver")

describe("Resolver", () => {
    it("should return destination url if found on the map", () => {
        let redirectionMap = {
            "path-prefix": "destination"
        }
        let resolver = new Resolver(redirectionMap)
        let requestPath = "path-prefix/path-parameters"
        let expectedDestination = "destination/path-prefix/path-parameters"

        let actualDestination = resolver.resolve(requestPath)

        expect(actualDestination).to.be(expectedDestination)
    })

    it("should eliminate extra slashes", () => {
        let redirectionMap = {
            "/path-prefix/with-trailing-slashes/": "destination/"
        }
        let resolver = new Resolver(redirectionMap)
        let requestPath = "/path-prefix/with-trailing-slashes/path-parameters"
        let expectedDestination = "destination/path-prefix/with-trailing-slashes/path-parameters"

        let actualDestination = resolver.resolve(requestPath)

        expect(actualDestination).to.be(expectedDestination)
    })

    it("should join http urls successfully", () => {
        let redirectionMap = {
            "/path-prefix/with-trailing-slashes/": "http://destination/"
        }
        let resolver = new Resolver(redirectionMap)
        let requestPath = "/path-prefix/with-trailing-slashes/path-parameters"
        let expectedDestination = "http://destination/path-prefix/with-trailing-slashes/path-parameters"

        let actualDestination = resolver.resolve(requestPath)

        expect(actualDestination).to.be(expectedDestination)
    })

    it("should return false if cannot resolve", () => {
        let redirectionMap = {}
        let resolver = new Resolver(redirectionMap)

        let request = "not-to-be-found"

        expect(resolver.resolve(request)).to.be(false)
    })
})
