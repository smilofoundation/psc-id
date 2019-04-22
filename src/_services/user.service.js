const psc_storage = require("../_helpers/psc_storage");
const psc_account = require("../_helpers/psc_account");
const psc_identity = require("../_helpers/psc_identity");
const psc_wallet = require("../_helpers/psc_wallet");
const psc_faucet = require("../_helpers/psc_faucet");

const storage = new psc_storage.StorageProvider();
const account = new psc_account.AccountProvider(storage);

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};

function login(password) {
    account.password = password;
    let identityProvider = new psc_identity.IdentityProvider(account);
    let identity = identityProvider.restoreIdentity(account);
    if (!identity) {
        return Promise.reject('password is incorrect / are you registered ?');
    }

    // if login details are valid return user details and fake jwt token
    let user = identity;

    //save password ?
    window.password = password;

    identityProvider.setToken(user, 'fake-jwt-token');

    identity = identityProvider.restoreIdentity(account);

    return Promise.resolve(identity);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    account.password = window.password;
    const identityProvider = new psc_identity.IdentityProvider(account);
    const identity = identityProvider.restoreIdentity(account);
    if (!identity) {
        return Promise.reject('password is incorrect');
    }

    const users = [];
    users.push(identity);

    return Promise.resolve(users);
}

function getById(id) {
    account.password = window.password;
    const identityProvider = new psc_identity.IdentityProvider(account);
    const identity = identityProvider.restoreIdentity(account);
    if (!identity) {
        return Promise.reject('password is incorrect');
    }

    const users = [];
    users.push(identity);

    // find user by id in users array
    let matchedUsers = users.filter(user => {
        return user.id === id;
    });
    let user = matchedUsers.length ? matchedUsers[0] : null;

    // respond 200 OK with user
    return Promise.resolve(user);
}

function register(newUser) {

    account.password = newUser.password;
    const identityProvider = new psc_identity.IdentityProvider(account);
    const identity = identityProvider.restoreIdentity(account);
    if (identity) {
        return Promise.reject('Could not register "' + newUser.username + '", only one user is allowed.');
    }

    //save password globally
    window.password = newUser.password;

    // save new user
    newUser.id = 1;

    identityProvider.setIdentity(newUser.username, newUser.name);

    const wallet = new psc_wallet.WalletProvider(account);
    const faucet = new psc_faucet.FaucetProvider();

    wallet.createNew();

    return faucet.requestFunds(wallet.getPublicKey()).then(function (data) {
        console.log("Faucet response", data);
        // respond 200 OK
        return Promise.resolve(newUser);
    });


}

function update(newUser) {

    //TODO: implement update logic ?
    account.password = newUser.password;
    const identityProvider = new psc_identity.IdentityProvider(account);
    const identity = identityProvider.restoreIdentity(account);
    if (identity) {
        return Promise.reject('Could not register "' + newUser.username + '", only one user is allowed.');
    }

    //save password globally
    window.password = newUser.password;

    // save new user
    newUser.id = 1;

    identityProvider.setIdentity(newUser.username, newUser.name);

    // respond 200 OK
    return Promise.resolve(newUser);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    account.password = window.password;
    const identityProvider = new psc_identity.IdentityProvider(account);
    const identity = identityProvider.restoreIdentity(account);
    if (!identity) {
        return Promise.reject('password is incorrect');
    }

    account.storageProvider.deleteEverything();
    logout();
    location.reload(true);
    return Promise.resolve();
}