import {userConstants} from '../_constants';

const psc_storage = require("../_helpers/psc_storage");
const psc_account = require("../_helpers/psc_account");
const psc_identity = require("../_helpers/psc_identity");


const storage = new psc_storage.StorageProvider();
const account = new psc_account.AccountProvider(storage);
account.password = window.password;
const identityProvider = new psc_identity.IdentityProvider(account);
let identity;
try {
    identity = identityProvider.restoreIdentity(account);
}catch(e){}

// let user = JSON.parse(localStorage.getItem('user'));
const initialState = identity ? {loggedIn: true, user:identity} : {};

export function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: action.user
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.user
            };
        case userConstants.LOGIN_FAILURE:
            return {};
        case userConstants.LOGOUT:
            return {};
        default:
            return state
    }
}