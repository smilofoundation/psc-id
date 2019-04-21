const psc_storage = require("./psc_storage");
const storage = new psc_storage.StorageProvider();

export function authHeader() {
    // return authorization header with jwt token
    let user = storage.readAsJSON("user");
    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}