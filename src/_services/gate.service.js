const psc_gate = require("../_helpers/psc_gate");


export const gateService = {
    auth,
};


function auth(gateStr, facevectors) {

    const gate = new psc_gate.AuthProvider(gateStr);

    return gate.isAllowed(facevectors).then(function (isAllowed) {
        if (isAllowed) {
            return Promise.resolve();
        } else {
            return Promise.reject('Person not allowed on gate');

        }
    })

}
