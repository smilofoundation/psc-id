const Web3 = require("web3");
import {abi, bytecode} from "./psc_smartContract";

const superagent = require("superagent");

const CONTRACT_ADDRESS_KEY = "contract";

const baseUrlNode1 = "https://psc1.smilo.foundation";
const baseUrlNode2 = "https://psc2.smilo.foundation";
const baseUrlNode3 = "https://psc3.smilo.foundation";
const baseUrlNode4 = "https://psc4.smilo.foundation";

export class ContractProvider {

    constructor(walletProvider, identityProvider, accountProvider) {
        this.sharedWithDeploy = [
            'MD3fapkkHUn86h/W7AUhiD4NiDFkuIxtuRr0Nge27Bk=',
            'OeVDzTdR95fhLKIgpBLxqdDNXYzgozgi7dnnS125A3w=',
            'URgycWQGB6CzMvk4bzoW5xCnDZP667PyL/yKHEgJnUA=',
            'RAXIDkqHcu6yArkvXP5pNWcHPb1Iw2eKlZcYvxMU8T8=',
            'wH0/DxxUak9dIz5Uy9HH/YNPbGzk39QMymaYKkj4PCo='
        ];

        this.sharedWithUpdate = [
            'MD3fapkkHUn86h/W7AUhiD4NiDFkuIxtuRr0Nge27Bk=',
            'OeVDzTdR95fhLKIgpBLxqdDNXYzgozgi7dnnS125A3w=',
            'URgycWQGB6CzMvk4bzoW5xCnDZP667PyL/yKHEgJnUA=',
            'wH0/DxxUak9dIz5Uy9HH/YNPbGzk39QMymaYKkj4PCo='
        ];

        this.walletProvider = walletProvider;
        this.identityProvider = identityProvider;
        this.accountProvider = accountProvider;

    }

    async initContract() {
        await this.connectToWeb3Provider();
        await this.registerAccount();
        await this.unlockAccount();

        return true;
    }

    connectToWeb3Provider() {
        this.web3 = new Web3("https://node1.smilo.foundation");
    }

    async registerAccount() {
        try {
            let privateKey = this.walletProvider.getPrivateKey().substring(2);
            let accountImport = await this.web3.eth.personal.importRawKey(
                privateKey,
                privateKey
            );
        } catch (e) {
        }
    }

    async unlockAccount() {
        let publicKey = this.walletProvider.getPublicKey();
        let privateKey = this.walletProvider.getPrivateKey().substring(2);
        return await this.web3.eth.personal.unlockAccount(
            publicKey,
            privateKey,
            20000
        );
    }

    async deployContract(bookedFlight) {
        let ticket = JSON.stringify(bookedFlight);
        let flight = bookedFlight.flightId;
        let identity = this.identityProvider.getIdentity();
        let name = identity.name;
        let passport = identity.passport || "test123";
        let trustedArray = [{
            name: "KLM Server",
            trustedAddress: "0xecf7e57d01d3d155e5fc33dbc7a58355685ba39c",
            isValue: true
        },{
            name: "Gate 1",
            trustedAddress: "0xc0ce2fd65f71c6ce82d22db11fcf7ca43357f172",
            isValue: true
        },{
            name: "Gate 2",
            trustedAddress: "0x7cb791430d2461268691bfba6e35d8a8c7ea2e63",
            isValue: true
        },{
            name: "Gate 4",
            trustedAddress: "0xd54924701cd0d94d677d0a66dee75c978e175c74",
            isValue: true
        }];

        let flightpassContract = new this.web3.eth.Contract(abi);

        return new Promise((resolve, reject) => {

            flightpassContract.deploy(
                {
                    data: '0x' + bytecode,
                    arguments: [
                        name,
                        this.walletProvider.getPublicKey(),
                        ticket,
                        flight,
                        passport,
                        trustedArray
                    ]
                }
            ).send({
                from: this.walletProvider.getPublicKey(),
                gas: '4000000',
                gasPrice: '0',
                sharedWith: this.sharedWithDeploy
            }).on('error', (error) => {
                console.error(`Error deploying contract ${error}`);
                reject(`Error deploying contract ${error}`)
            }).on('transactionHash', (transactionHash) => {
                console.log(`Successfully submitted contract creation. Transaction hash: ${transactionHash}`);
            }).on('receipt', (receipt) => {
                console.log(`Receipt after mining with contract address: ${receipt.contractAddress}`);
                this.contractAddress = receipt.contractAddress;

                console.log(`Going to save contract address: ${this.contractAddress}`);
                this.save();
                return resolve(this.contractAddress);
            }).catch((error) => {
                console.error(`Error deploying contract ${error}`);
                return reject(`Error deploying contract ${error}`)
            });

        });


    }

    async setVectors(faceVectors) {
        let flightpassContract = new this.web3.eth.Contract(abi);
        flightpassContract.options.address = this.contractAddress;

        console.log("setVectors, faceVectors,",faceVectors);

        return new Promise((resolve, reject) => {

            flightpassContract.methods.setVectors(
                JSON.stringify(faceVectors)
            ).send({
                from: this.walletProvider.getPublicKey(),
                gas: '2000000',
                gasPrice: '0',
                sharedWith: this.sharedWithUpdate
            }).on('transactionHash', (transactionHash) => {

                console.log("Set vectors ok", transactionHash);
                return resolve(transactionHash);

            }).catch((error) => {
                console.error(`Error deploying setVectors ${error}`);
                return reject(`Error deploying setVectors ${error}`)
            });
        })

    }

    async getVectors() {
        let flightpassContract = new this.web3.eth.Contract(abi);
        flightpassContract.options.address = this.contractAddress;

        return flightpassContract.methods.getVectors().call({
            from: this.walletProvider.getPublicKey()
        });
    }

    async getName() {
        let flightpassContract = new this.web3.eth.Contract(abi);
        flightpassContract.options.address = this.contractAddress;

        return flightpassContract.methods.getName().call({
            from: this.walletProvider.getPublicKey()
        });
    }

    getSmartContract() {
        return this.contractAddress;
    }

    async addTrusted(trustedList) {
        let flightpassContract = new this.web3.eth.Contract(abi);
        flightpassContract.options.address = this.contractAddress;
        await flightpassContract.methods.addTrusted(
            trustedList
        ).send({
            from: this.walletProvider.getPublicKey(),
            gas: '2000000',
            gasPrice: '0',
            sharedWith: this.sharedWithUpdate
        }, (error, result) => {
            console.error('addTrusted error:', error);
        });
    }

    deleteContract() {
        let deleteArray = [
            superagent.delete(`${baseUrlNode1}/transactions/${this.contractAddress}`).then((data) => {
                return data
            }),
            superagent.delete(`${baseUrlNode2}/transactions/${this.contractAddress}`).then((data) => {
                return data
            }),
            superagent.delete(`${baseUrlNode3}/transactions/${this.contractAddress}`).then((data) => {
                return data
            }),
            superagent.delete(`${baseUrlNode4}/transactions/${this.contractAddress}`).then((data) => {
                return data
            }),
            // superagent.delete(`${baseUrlNode5}/transactions/${this.contractAddress}`).then((data) => {
            //     return data
            // })
        ];
        return Promise.all(deleteArray);
    }

    // async allowAllGates() {
    //     let trustedArray: ITrusted[] = [];
    //     trustedArray.push(<ITrusted>{name: "KLM Server", trustedAddress: "0x170ce250de1be1f83bbe5d24604538c9619bc02a", isValue: true});
    //     trustedArray.push(<ITrusted>{name: "Gate 1", trustedAddress: "0xd4e88d6eb5012a58be7db508136e955d86227353", isValue: true});
    //     trustedArray.push(<ITrusted>{name: "Gate 2", trustedAddress: "0xa984718e409cfbd2a054b411836411334bb6b625", isValue: true});
    //     trustedArray.push(<ITrusted>{name: "Gate 4", trustedAddress: "0x6e9c44496220948787ff74e715128a7e1258b5a5", isValue: true});
    //     await this.addTrusted(trustedArray);
    // }

    save() {
        this.accountProvider.encryptToStorage(CONTRACT_ADDRESS_KEY, this.contractAddress);
    }

    restore() {
        this.contractAddress = this.accountProvider.decryptFromStorage(CONTRACT_ADDRESS_KEY);
    }
}
