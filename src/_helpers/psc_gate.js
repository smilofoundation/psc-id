const superagent = require("superagent");

export class AuthProvider {

    constructor(endpoint, distanceTreshold) {
        this.endpoint = endpoint;
        this.distanceTreshold = distanceTreshold || 0.6
    }

    setEndpoint(endpoint) {
        this.endpoint = endpoint;
    }

    setDistanceTreshold(distanceTreshold) {
        this.distanceTreshold = distanceTreshold;
    }

    async isAllowed(faceVectors) {
        console.log("Will POST gate for access request", faceVectors);
        return superagent.post(
            `https://${ this.endpoint }/identities/biometrics`,
            {
                biometrics: Array.prototype.slice.call(faceVectors)
            }
        ).then(function (result) {
            console.log(result);
            if (result.identity && result._label === "unknown") {
                console.log("Identity unknown, ", result);
                return false;
            } else if (result.identity && result.identity._distance < this.distanceTreshold) {
                // Gate knows about this identity meaning it was shared with this gate.
                // So: it is allowed to access!
                console.log("Identity ok, ", result);
                return true
            } else {
                console.log("Identity error, ", result);
                return false;
            }
        }).catch(function (error) {
            console.log("Could not talk to gate, ", error);
            return false;
        });
    }
}