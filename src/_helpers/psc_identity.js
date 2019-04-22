const IDENTITY_STORAGE_KEY = "identity";

export class IdentityProvider {

    constructor(accountProvider) {
        this.identity = {};
        this.accountProvider = accountProvider;
    }

    /**
     * Updates the base identity properties.
     * @param fullName
     * @param birthDate
     * @param nationality
     */
    setIdentity(username, name) {
        this.identity.username = username;
        this.identity.name = name;

        this.saveIdentity();
    }

    saveIdentity() {
        this.accountProvider.encryptToStorage(IDENTITY_STORAGE_KEY, this.identity);
    }

    /**
     * Updates the passport
     * @param passport
     */
    setPassport(identity, passport) {
        this.identity = identity;

        this.identity.passport = passport;

        this.saveIdentity();
    }

    /**
     * Updates the face vectors
     * @param faceVectors
     */
    setFaceVectors(identity, faceVectors) {
        this.identity = identity;

        this.identity.faceVectors = faceVectors;

        this.saveIdentity();
    }


    /**
     * Updates the token
     * @param token
     */
    setToken(identity, token) {
        this.identity = identity;

        this.identity.token = token;

        this.saveIdentity();
    }


    restoreIdentity(accountProvider) {
        const restoredIdentity = accountProvider.decryptFromStorage(IDENTITY_STORAGE_KEY);

        if (restoredIdentity) {
            this.identity = restoredIdentity;
            return this.identity;
        } else {
            return null;
        }
    }

    getIdentity() {
        return this.identity;
    }
}