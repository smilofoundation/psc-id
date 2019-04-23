const psc_storage = require("../_helpers/psc_storage");
const psc_account = require("../_helpers/psc_account");
const psc_identity = require("../_helpers/psc_identity");
const psc_booking = require("../_helpers/psc_booking");
const psc_wallet = require("../_helpers/psc_wallet");
const psc_contract = require("../_helpers/psc_contract");

const storage = new psc_storage.StorageProvider();
const account = new psc_account.AccountProvider(storage);

export const bookService = {
    register,
    getAll,
    checkin,
};


function register(booking) {
    account.password = window.password;
    const identityProvider = new psc_identity.IdentityProvider(account);
    const identity = identityProvider.restoreIdentity(account);
    if (!identity) {
        return Promise.reject('Could not register "' + booking.flightId + '", user is not allowed.');
    }

    const bookingProvider = new psc_booking.BookedFlightsProvider(account);
    bookingProvider.setBookedFlight(booking);

    // respond 200 OK
    return Promise.resolve(booking);
}


function checkin(booking, facevectors) {
    account.password = window.password;
    const identityProvider = new psc_identity.IdentityProvider(account);
    const identity = identityProvider.restoreIdentity(account);
    if (!identity) {
        return Promise.reject('Could not register "' + booking.flightId + '", user is not allowed.');
    }

    const bookingProvider = new psc_booking.BookedFlightsProvider(account);
    const bookedFlight = bookingProvider.restore();
    if(!bookedFlight){
        return Promise.reject('Could not get booking from the database');
    }

    facevectors = Array.prototype.slice.call(facevectors);

    bookingProvider.markBookedFlightAsCheckedIn();

    identityProvider.setFaceVectors(identity, facevectors);

    // create wallet instance
    const wallet = new psc_wallet.WalletProvider(account)

    // check if wallet already exists ?
    const isWalletValid = wallet.restoreWallet();
    if (!isWalletValid) {
        // // create new wallet
        // wallet.createNew()
        return Promise.reject('Could not restoreWallet "' + booking.flightId + '", user does not have a wallet ?.');

    }
    // get money from faucet

    const contract = new psc_contract.ContractProvider(wallet, identityProvider, account);

    return contract.initContract().then(function () {
        // deploy private smart contract

        return contract.deployContract(bookedFlight).then(function () {

            console.log("Deployment ok, going to set vectors, ", facevectors);
            return contract.setVectors(facevectors).then(function () {
                console.log("setVectors, YEY!");
                // respond 200 OK
                return Promise.resolve(booking);
            }).catch(function (error) {
                console.log("Could not set vectors on contract, ", error);
                return Promise.reject("Could not set vectors on the private smart contract");
            });

        }).catch(function (error) {
            console.log("Could not deploy this contract, ", error);
            return Promise.reject("Could not deploy this contract");
        });


    }).catch(function (error) {
        console.log("Could not init contract, ", error);
        return Promise.reject("Could not init contract");
    });


}


function getAll() {
    account.password = window.password;
    const provider = new psc_booking.BookedFlightsProvider(account);
    const booking = provider.restore(account);
    if (!booking) {
        return Promise.reject('password is incorrect');
    }

    const items = [];
    items.push(booking);

    return Promise.resolve(items);
}