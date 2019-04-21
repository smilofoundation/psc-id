const superagent = require("superagent");

const baseUrl = "https://testnet-faucet.smilo.network/api/request/smilo";
export class FaucetProvider {

    constructor(){

    }

    requestFunds(address) {
        return superagent.get(`${baseUrl}/${address}`).then((data) => {
            return data;
        });
    }
}