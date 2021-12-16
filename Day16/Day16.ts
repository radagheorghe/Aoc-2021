import { arrayBuffer } from 'stream/consumers';
import { InputFile } from '../Common/InputFile'

enum Operations {
    Sum = 0,
    Mul,
    Min,
    Max,
    Greter,
    Less,
    Equal
}

class PacketDecoder {

  private mVersions: Array<number>;
  private mValues: Array<number>;
  //private mOperation: Operations;

  constructor(aInput: string) {

    this.mVersions = new Array<number>();
    this.mValues = new Array<number>();

    let binPacket = '';
    aInput.split('').forEach(hex =>{
        binPacket += this.hex2bin(hex);
    })
    //console.log(binPacket);
    this.decode(binPacket);
  }

  private hex2bin(hex: string){
    return (parseInt(hex, 16).toString(2)).padStart(4, '0');
  }

  private decode(aBinPacket: string) {
    
    if(aBinPacket.length == 0)
        return;

    this.mVersions.push(parseInt(aBinPacket.slice(0, 3), 2));
    let id = parseInt(aBinPacket.slice(3, 6), 2);
    
    aBinPacket = aBinPacket.substring(6);
    
    // literal value
    if(id == 4) {
        let group = 0;
        while(aBinPacket[group] == '1') {
            group += 5;
        }
        group += 5;//end of packet
        this.mValues.push(parseInt(aBinPacket.slice(0, group), 2));
        // get next
        this.decode(aBinPacket.substring(group));
    }
    else { // opperator packet
        /*switch(id) {
            case 0:
                this.mOperation = Operations.Sum;
                break;
            case 1:
                this.mOperation = Operations.Mul;
                break;
            case 2:
                this.mOperation = Operations.Min;
                break;   
            case 3:
                this.mOperation = Operations.Max;
                break;
            case 5:
                this.mOperation = Operations.Greter;
                break;
            case 6:
                this.mOperation = Operations.Less;
                break;   
            case 7:
                this.mOperation = Operations.Less;
                break;             
        }*/
        switch(aBinPacket[0]) {
            case '0':
                //length = parseInt(aBinPacket.slice(1, 16), 2);
                this.decode(aBinPacket.slice(16));
                break;
            case '1':
                //length = parseInt(aBinPacket.slice(1, 12), 2);
                this.decode(aBinPacket.slice(12));
                break;
        }
    }
  }

  public getVersionSum(): number {
      return this.mVersions.reduce((a, b) => a + b);
  }

  /*public execOperation(): number {
    switch(this.mOperation) {
        case Operations.Sum:
            this.mOperation = ;
            break;
        case Operations.Mul:
            this.mOperation = ;
            break;
        case Operations.Min:
            this.mOperation = ;
            break;   
        case Operations.Max:
            this.mOperation = ;
            break;
        case Operations.Greter:
            this.mOperation = ;
            break;
        case Operations.Less:
            this.mOperation = ;
            break;   
        case Operations.Less:
            this.mOperation = ;
            break;             
    }
  }*/
}

var input = new InputFile("./day16/input.txt");
var input1 = new InputFile("./day16/input1.txt");

var strInput = input.getContent();
var strInput1 = input1.getContent();
var strInput2 = 'C200B40A82';

var packet = new PacketDecoder(strInput1);
console.log(packet.getVersionSum());