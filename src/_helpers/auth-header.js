const psc_storage = require("./psc_storage");
const psc_account = require("./psc_account");
const psc_identity = require("./psc_identity");

const storage = new psc_storage.StorageProvider();
const account = new psc_account.AccountProvider(storage);

export function authHeader() {
    // return authorization header with jwt token
    // let user = storage.readAsJSON("user");
    account.password = window.password;

    const identityProvider = new psc_identity.IdentityProvider(account);
    const identity = identityProvider.restoreIdentity(account);

    if (identity && identity.token) {
        return {'Authorization': 'Bearer ' + identity.token};
    } else {
        return {};
    }
}