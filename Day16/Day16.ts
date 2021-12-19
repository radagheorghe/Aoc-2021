import { InputFile } from '../Common/InputFile'

class PacketDecoder {

  private mValues: Array<number>;
  private mOperations: Array<number>;

  private mVersionsSum: number;

  constructor(aInput: string) {

    this.mValues = new Array<number>();
    this.mOperations = new Array<number>();

    let binPacket = '';
    aInput.split('').forEach(hex =>{
        binPacket += this.hex2bin(hex);
    })
    this.decode(binPacket);
  }

  private hex2bin(hex: string){
    return (parseInt(hex, 16).toString(2)).padStart(4, '0');
  }

  private doOperator() {
    let op = this.mOperations.pop();

    let values = new Array<number>();
    let length = this.mValues.length;
    for(let i = 0; i < length; i ++)
      values.push(this.mValues.pop());

    let result = 0;
    switch(op) {
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
    this.mValues.push(result);
  }

  private decode(aBinPacket: string): string {
    
    while(aBinPacket.length > 0) {
      
      let ver = parseInt(aBinPacket.slice(0, 3), 2);
      let id = parseInt(aBinPacket.slice(3, 6), 2);
      
      this.mVersionsSum += ver;

      aBinPacket = aBinPacket.substring(6);

      // literal value
      if(id == 4) {
          let group = 0;
          while(aBinPacket[group] == '1') {
              group += 5;
          }
          group += 5;//end of packet
          this.mValues.push(parseInt(aBinPacket.slice(0, group), 2));
          return aBinPacket.slice(group);
      }
      else { // opperator packet
          
        this.mOperations.push(id);

        let length = 0;
        switch(aBinPacket[0]) {
          case '0':
            length = parseInt(aBinPacket.slice(1, 16), 2);
            this.decode(aBinPacket.slice(16, 16 + length));
            aBinPacket = aBinPacket.slice(16 + length);
            break;
          case '1':
            length = parseInt(aBinPacket.slice(1, 12), 2);
            let nextPacket = aBinPacket.slice(12);
            for(let i = 0; i < length; i++) {
              nextPacket = this.decode(nextPacket);
            }
            aBinPacket = nextPacket;
            break;
        }
        
        this.doOperator();
      }
    }
  }

  public getVersionSum(): number {
      return this.mVersionsSum;
  }

  public getResult(): number {
    while(this.mOperations.length > 0)
      this.doOperator();
    return this.mValues[0];
  }
}

var input = new InputFile("./day16/input.txt");

var strInput = input.getContent();
var strInput2 = '38006F45291200';

var packet = new PacketDecoder(strInput2);
console.log(packet.getVersionSum());
console.log(packet.getResult());