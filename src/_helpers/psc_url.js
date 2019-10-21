export class BaseUrlProvider {

    constructor() {
        this.baseUrlNode1 = "https://psc1.smilo.foundation";
        this.baseUrlNode2 = "https://psc2.smilo.foundation";
        this.baseUrlNode3 = "https://psc3.smilo.foundation";
        this.baseUrlNode4 = "https://psc4.smilo.foundation";
    }

    getBaseUrlNode1(){
        return this.baseUrlNode1;
    }

    getBaseUrlNode2(){
        return this.baseUrlNode2;
    }

    getBaseUrlNode3(){
        return this.baseUrlNode3;
    }

    getBaseUrlNode4(){
        return this.baseUrlNode4;
    }

    // getBaseUrlNode5(){
    //     return this.baseUrlNode5;
    // }
}
