import {EncryptionHelper} from "./psc_encryptionHelper";

const ACCOUNT_KEY = "account";

export class AccountProvider {
    constructor(storageProvider) {
        this.encryptionHelper = new EncryptionHelper();
        this.storageProvider = storageProvider;

    }

    /**
     * Returns true if the user already created an account.
     */
    accountExists() {
        return !!this.storageProvider.read(ACCOUNT_KEY);
    }

    /**
     * Sets the name of this account. The changes will immediately be serialized.
     * @param name
     */
    setName(name) {
        this.account = {
            name: name
        };

        this.encryptToStorage(ACCOUNT_KEY, this.account);
    }

    getName() {
        return this.account.name;
    }


    restore() {
        this.account = this.decryptFromStorage(ACCOUNT_KEY);

    }

    /**
     * Encrypts the given data and stores it in local storage. The data can later be retrieved by the given key.
     */
    encryptToStorage(key, data) {
        if (!this.password) {
            throw new Error("Please unlock account first");
        }

        this.storageProvider.writeAsJSON(
            key,
            this.encryptionHelper.createKeyStore(JSON.stringify(data), this.password)
        );
    }

    /**
     * Decrypts and returns data previously stored encrypted in local storage.
     */
    decryptFromStorage(key) {
        if (!this.password) {
            throw new Error("Please unlock account first");
        }

        const keyStore = this.storageProvider.readAsJSON(key);
        if (keyStore) {
            return JSON.parse(this.encryptionHelper.decryptKeyStore(keyStore, this.password));
        } else {
            return null;
        }
    }

    /**
     * Returns true if the given password can be used to unlock this account.
     * @param password
     */
    isCorrectPassword(password) {
        return this.encryptionHelper.decryptKeyStore(
            this.storageProvider.readAsJSON(ACCOUNT_KEY),
            password
        ) !== null;
    }
}
