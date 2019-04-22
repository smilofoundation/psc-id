const psc_storage = require("./psc_storage");
const psc_account = require("./psc_account");
const psc_identity = require("./psc_identity");

const storage = new psc_storage.StorageProvider();
const account = new psc_account.AccountProvider(storage);

// // array in local storage for registered users
// let users = storage.readAsJSON("users") || [];
let password;

export function configureFakeBackend() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call

                // authenticate
                if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
                    // get parameters from post request
                    let params = JSON.parse(opts.body);


                    account.password = params.password;
                    const identityProvider = new psc_identity.IdentityProvider(account);
                    const identity = identityProvider.restoreIdentity(account);
                    if (!identity) {
                        return reject('password is incorrect');
                    }

                    // if login details are valid return user details and fake jwt token
                    let user = identity;
                    let responseJson = {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        token: 'fake-jwt-token'
                    };

                    //save password ?
                    window.password = params.password;

                    resolve({ok: true, text: () => Promise.resolve(JSON.stringify(responseJson))});

                    return;
                }

                // get users
                if (url.endsWith('/users') && opts.method === 'GET') {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {

                        account.password = window.password;
                        const identityProvider = new psc_identity.IdentityProvider(account);
                        const identity = identityProvider.restoreIdentity(account);
                        if (!identity) {
                            return reject('password is incorrect');
                        }

                        const users = [];
                        users.push(identity);

                        resolve({ok: true, text: () => Promise.resolve(JSON.stringify(users))});
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // get user by id
                if (url.match(/\/users\/\d+$/) && opts.method === 'GET') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {

                        account.password = window.password;
                        const identityProvider = new psc_identity.IdentityProvider(account);
                        const identity = identityProvider.restoreIdentity(account);
                        if (!identity) {
                            return reject('password is incorrect');
                        }

                        const users = [];
                        users.push(identity);

                        // find user by id in users array
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedUsers = users.filter(user => {
                            return user.id === id;
                        });
                        let user = matchedUsers.length ? matchedUsers[0] : null;

                        // respond 200 OK with user
                        resolve({ok: true, text: () => JSON.stringify(user)});
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // register user
                if (url.endsWith('/users/register') && opts.method === 'POST') {
                    // get new user object from post body
                    let newUser = JSON.parse(opts.body);

                    window.password = newUser.password

                    account.password = newUser.password;
                    const identityProvider = new psc_identity.IdentityProvider(account);
                    const identity = identityProvider.restoreIdentity(account);
                    if (identity) {
                        return reject('Could not register "' + newUser.username + '", only one user is allowed.');
                    }

                    // save new user
                    newUser.id = 1

                    identityProvider.setIdentity(newUser.username, newUser.name);

                    // respond 200 OK
                    resolve({ok: true, text: () => Promise.resolve()});

                    return;
                }

                // delete user
                if (url.match(/\/users\/\d+$/) && opts.method === 'DELETE') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {

                        account.password = window.password;
                        const identityProvider = new psc_identity.IdentityProvider(account);
                        const identity = identityProvider.restoreIdentity(account);
                        if (!identity) {
                            return reject('password is incorrect');
                        }

                        account.storageProvider.deleteEverything()

                        // respond 200 OK
                        resolve({ok: true, text: () => Promise.resolve()});
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // pass through any requests not handled above
                realFetch(url, opts).then(response => resolve(response));

        });
    }
}