export class BaseUrlProvider {

    constructor() {
        this.baseUrlNode1 = "https://node0.klm.smilo.network:444";
        this.baseUrlNode2 = "https://node1.klm.smilo.network:444";
        this.baseUrlNode3 = "https://node2.klm.smilo.network:444";
        this.baseUrlNode4 = "https://node3.klm.smilo.network:444";
        this.baseUrlNode5 = "https://node4.klm.smilo.network:444";
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

    getBaseUrlNode5(){
        return this.baseUrlNode5;
    }
}