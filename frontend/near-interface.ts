import {utils} from 'near-api-js'
import { Wallet } from './near-wallet';

export class Contract {
    contractId:any;
    wallet:Wallet;

    constructor({ contractId, walletToUse }:{contractId:any, walletToUse:Wallet}) {
        this.contractId = contractId;
        this.wallet = walletToUse;
    }

    async createSubAcnt(prefix:string) {
        console.log("createSubAcnt");
        let response;
        await this.wallet.callMethod({ contractId: this.contractId, method: "createSubAcnt", args:{ prefix:prefix }})
        .then(res=>{
            response = res;
            console.log("RES: ",res)
        })
        .catch(err=>{
            console.error('ERR: ',err)
        })
        console.log("RESPONSE : ", response);
    }
}