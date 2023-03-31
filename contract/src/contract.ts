// Find all our documentation at https://docs.near.org
import { PublicKey } from 'near-sdk-js/lib/types';
import { NearBindgen, near, call, view, NearPromise, UnorderedMap } from 'near-sdk-js';

@NearBindgen({})
class QrMaze {
  addrNick = new UnorderedMap<string>('nickname');
  // userMaze = new UnorderedMap<Maze>('maze');

  @call({})
  createSubAcnt({ pref }){
    const subaccountId = `${pref}.${near.currentAccountId()}`;
    // const subaccountId = `${pref}.testerGamer`;
    let pKey:PublicKey = new PublicKey(near.signerAccountPk());
    return NearPromise.new(subaccountId).createAccount().addFullAccessKey(pKey).transfer(BigInt(250_000_000_000_000_000));
  }

  @call({})
  createNickname({ _nickname, _spLen, _hash }){
    this.addrNick.set(near.signerAccountId(), _nickname );
    // let maze = new Maze(near.signerAccountId(), _spLen, _hash);
    // near.log(maze);
    // this.userMaze.set(_nickname, maze);
  }

  // @view({})
  // getMaze({ _nickname }):Maze{
  //   let maze = this.userMaze.get(_nickname)
  //   near.log(`Nickname : ${maze}`);
  //   return maze;
  // }

  @view({})
  getNickbyAddr({_address }){
    let nick = this.addrNick.get(_address);
    near.log(`Nickname : ${nick}`);
    return nick;
  }

  // @call({})
  // visitMaze({ _address }){
  //   // let maze = this.userMaze.get(this.getNickbyAddr(_address));
  //   // maze.visitorList.push(near.signerAccountId());
  //   // near.log(`==Visitors==visitMaze()`);
  //   // near.log(this.userMaze.get(this.getNickbyAddr(_address)).visitorList);
  //   let prevCnt = this.guestbook.get(_address);
  //   this.guestbook.set(_address, prevCnt+1);
  // }

  // @view({})
  // getVisitorsCnt({_address }){
  //   let cnt = this.guestbook.get(_address);
  //   near.log(`CNT : ${cnt}`);
  //   return cnt;
  // }
}

class Maze {
  constructor(addr, len, url) {
      this.ownerAddr = addr
      this.spLength = len
      this.hashUrl = url
      this.visitorList = new Array<string>;
      this.pets = new Array<string>;
  }
  ownerAddr : string;
  spLength : bigint;
  hashUrl : string;
  visitorList : Array<string>;
  pets : Array<string>;
}