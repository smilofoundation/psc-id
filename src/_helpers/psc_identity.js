const IDENTITY_STORAGE_KEY = "identity";

export class IdentityProvider {

    // identity = {};
    // accountProvider = {};

    constructor(accountProvider){
        this.accountProvider = accountProvider;
        this.accountProvider.onPasswordChanged().subscribe(
            () => this.restoreIdentity()
        );
    }
    /**
     * Updates the base identity properties.
     * @param fullName
     * @param birthDate
     * @param nationality
     */
    setIdentity(fullName, birthDate, nationality) {
        this.identity.fullName = fullName;
        this.identity.birthDate = birthDate;
        this.identity.nationality = nationality;

        this.saveIdentity();
    }

    saveIdentity() {
        this.accountProvider.encryptToStorage(IDENTITY_STORAGE_KEY, this.identity);
    }

    /**
     * Updates the passport
     * @param passport
     */
    setPassport(passport) {
        this.identity.passport = passport;

        this.saveIdentity();
    }

    /**
     * Updates the face vectors
     * @param faceVectors
     */
    setFaceVectors(faceVectors) {
        this.identity.faceVectors = faceVectors;

        this.saveIdentity();
    }


    restoreIdentity(accountProvider) {
        const restoredIdentity = this.accountProvider.decryptFromStorage(IDENTITY_STORAGE_KEY);

        if (restoredIdentity) {
            this.identity = restoredIdentity;
        }
    }

    getIdentity() {
        return this.identity;
    }
}