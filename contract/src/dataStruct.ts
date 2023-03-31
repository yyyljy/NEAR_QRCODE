export class Maze {
    constructor(addr, len, url) {
        this.ownerAddr = addr
        this.spLength = len
        this.hashUrl = url
        this.visitorList = new Array<string>;
        this.pets = new Array<string>;
    }
    ownerAddr : string;
    spLength : number;
    hashUrl : string;
    visitorList : Array<string>;
    pets : Array<string>;
}