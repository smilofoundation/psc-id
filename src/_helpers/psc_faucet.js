const superagent = require("superagent");

const baseUrl = "https://faucet.smilo.foundation/api/request/smilo"
export class FaucetProvider {

    constructor(){

    }

    requestFunds(address) {
        console.log(`going to trigger faucet ${baseUrl}/${address}`)
        return superagent.get(`${baseUrl}/${address}`).then((data) => {
            return Promise.resolve(data);
        });
    }
}
