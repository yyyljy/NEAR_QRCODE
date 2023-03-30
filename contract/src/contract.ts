// Find all our documentation at https://docs.near.org
import { PublicKey } from 'near-sdk-js/lib/types';
import { NearBindgen, near, call, view, NearPromise, UnorderedMap, Vector, initialize } from 'near-sdk-js';
import { Maze } from './dataStruct';

@NearBindgen({})
class QrMaze {
  message: string = "Hello";
  addr2Nick = new Map<string, string>();
  user = new Map<string, Maze>(); // nickname -> Maze

  @initialize({ privateFunction: true })
  init({ message }: { message: string }) {
    this.message = message
  }

  @view({})
  get_greeting(): string {
    return this.message
  }

  @call({})
  set_greeting({ message }: { message: string }): void {
    near.log(`Saving greeting ${message}`)
    this.message = message
  }

  @call({})
  createSubAcnt({ prefix }){
    const subaccountId = `${prefix}.${near.currentAccountId()}`;
    // const subaccountId = `${prefix}.testerGamer`;
    let pKey:PublicKey = new PublicKey(near.signerAccountPk());
    return NearPromise.new(subaccountId).createAccount().addFullAccessKey(pKey).transfer(BigInt(250_000_000_000_000_000));
  }

  @call({})
  createNickname({ _nickname }){
    this.addr2Nick.set(near.signerAccountId() as string, _nickname);
  }

  @view({})
  getNickbyAddr({_address }){
    let nick = this.addr2Nick.get(_address);
    near.log(`Nickname : ${nick}`);
    return nick;
  }

  @call({})
  visitMaze({ _address }){
    let maze = this.user.get(this.getNickbyAddr(_address));
    maze.visitorList.push(near.signerAccountId());
    near.log(`==Visitors==visitMaze()`);
    near.log(this.user.get(this.getNickbyAddr(_address)).visitorList);
  }
}