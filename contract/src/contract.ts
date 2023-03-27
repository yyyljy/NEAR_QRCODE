// Find all our documentation at https://docs.near.org
import { PublicKey } from 'near-sdk-js/lib/types';
import { NearBindgen, near, call, view, NearPromise } from 'near-sdk-js';

@NearBindgen({})
class HelloNear {
  message: string = "Hello";

  @view({}) // This method is read-only and can be called for free
  get_greeting(): string {
    return this.message;
  }

  @call({}) // This method changes the state, for which it cost gas
  set_greeting({ message }: { message: string }): void {
    near.log(`Saving greeting ${message}`);
    this.message = message;
  }

  @call({})
  createSubAcnt({ prefix }){
    const subaccountId = `${prefix}.${near.currentAccountId()}`;
    // const subaccountId = `${prefix}.testerGamer`;
    let pKey:PublicKey = new PublicKey(near.signerAccountPk());
    return NearPromise.new(subaccountId).createAccount().addFullAccessKey(pKey).transfer(BigInt(250_000_000_000_000_000));
  }
}