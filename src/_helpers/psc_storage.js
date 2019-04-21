export class StorageProvider {
    constructor(){

    }

    write(key, data) {
        localStorage.setItem(key, data);
    }

    read(key) {
        return localStorage.getItem(key);
    }

    remove(key) {
        localStorage.removeItem(key);
    }

    writeAsJSON(key, data) {
        this.write(key, JSON.stringify(data));
    }

    readAsJSON(key) {
        return JSON.parse(this.read(key));
    }

    deleteEverything() {
        localStorage.clear();
    }
}