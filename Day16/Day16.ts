import { InputFile } from '../Common/InputFile'
import { last } from '../Common/Util'

class Paket {

  public mId: number;
  public mVersion: number;
  public mLength: number;
  public mLengthIsBits: boolean;
  public mValue: number;
  public mSubPakets: Array<Paket>;
  public mParent: Paket;
  public mInitLength: number; // debug only

  constructor(aId: number, aVersion: number, aLength: number, aIsBits: boolean) {
    this.mId = aId;
    this.mVersion = aVersion;
    this.mLength = aLength;
    this.mLengthIsBits = aIsBits;
    this.mValue = 0;
    this.mInitLength = aLength;

    this.mSubPakets = new Array<Paket>();
  }

  public readBits(aBits: number) {
    if(this.mLengthIsBits)
      this.mLength -= aBits;

    if(this.mParent)
      this.mParent.readBits(aBits);
  }

  public addSubPacket(aPacket: Paket) {
    this.mSubPakets.push(aPacket);
    aPacket.mParent = this;
  }

  public getVersion(): number {
    if(this.mSubPakets.length == 0)
      return this.mVersion;

    let chids = this.mSubPakets.map(child => child.getVersion());
    return this.mVersion + chids.reduce((a,b) => a + b);
  }

  public getValue(): number {
    if(this.mSubPakets.length == 0)
      return this.mValue;

    let result = 0;
    let values = this.mSubPakets.map(child => child.getValue());
    switch(this.mId) {
      case 0:
          result = values.reduce((a,b) => a + b);
          break;
      case 1:
          result = values.reduce((a,b) => a * b);
          break;
      case 2:
          result = Math.min(...values);
          break;   
      case 3:
          result = Math.max(...values);
          break;
      case 5:
          result = values[0] > values[1] ? 1 : 0;
          break;
      case 6:
          result = values[0] < values[1] ? 1 : 0;
          break;   
      case 7:
          result = values[0] == values[1] ? 1 : 0;
          break;             
    }
    
    return result;
  }
}

class PacketDecoder {

  private mMasterPaket: Paket;

  constructor(aInput: string) {

    let binPacket = '';
    aInput.split('').forEach(hex =>{
        binPacket += this.hex2bin(hex);
    })
    this.decode(binPacket);
  }

  private hex2bin(hex: string){
    return (parseInt(hex, 16).toString(2)).padStart(4, '0');
  }

  private decode(aBinPacket: string) {
    
    let stack = new Array<Paket>();

    while(aBinPacket.includes('1') && aBinPacket.length > 0) {

      let crPaket = last(stack);
      while(crPaket && crPaket.mLength == 0) {
        stack.pop();
        crPaket = last(stack);
      }

      let ver = parseInt(aBinPacket.slice(0, 3), 2);
      let id = parseInt(aBinPacket.slice(3, 6), 2);

      aBinPacket = aBinPacket.slice(6);

      // literal value
      if(id == 4) {

        let fiveBits: string;
        let binValue = '';
        let groups = 0;
        do {
          fiveBits = aBinPacket.slice(0, 5);
          binValue += fiveBits.slice(1);
          aBinPacket = aBinPacket.slice(5);
          groups ++;
        } while(fiveBits[0] == '1');
        //end of packet
        
        let paket = new Paket(id, ver, 0, false);
        paket.mValue = parseInt(binValue, 2);
        crPaket.addSubPacket(paket);

        // mark readed bits (or nr of subpakets) in the parent paket
        crPaket.readBits(6 + groups * 5);
        if(!crPaket.mLengthIsBits)
          crPaket.mLength --;
      }
      else { // opperator packet
          
        let length = 0;
        let lengthIsBits = false;
        switch(aBinPacket[0]) {
          case '0':
            lengthIsBits = true;
            length = parseInt(aBinPacket.slice(1, 16), 2);
            aBinPacket = aBinPacket.slice(16);
            break;
          case '1':
            length = parseInt(aBinPacket.slice(1, 12), 2);
            aBinPacket = aBinPacket.slice(12);
            break;
        }
        let paket = new Paket(id, ver, length, lengthIsBits);
        stack.push(paket);

        if(crPaket) {
          crPaket.addSubPacket(paket);

          // mark readed bits (or nr of subpakets) in the parent paket
          crPaket.readBits(lengthIsBits ? 22 : 18);
          if(!crPaket.mLengthIsBits)
            crPaket.mLength --;
        }

        if(!this.mMasterPaket)
          this.mMasterPaket = paket; //first packet
      }
    }
  }

  public getVersionSum(): number {
      return this.mMasterPaket.getVersion();
  }

  public getResult(): number {
    return this.mMasterPaket.getValue();
  }
}

var input = new InputFile("./day16/input.txt");

var strInput = input.getContent();
var strInput2 = 'A0016C880162017C3686B18A3D4780';

var packet = new PacketDecoder(strInput);
console.log(packet.getVersionSum());
console.log(packet.getResult());