import { InputFile } from '../Common/InputFile'

class Polymerization {
  
  private mSeq: string;
  private mRules: Map<string, string>;

  constructor(aInput: Array<string>) {

    this.mSeq = aInput[0];
    this.mRules = new Map<string, string>();
    aInput[1].split(';').forEach(pairs => {
      let pair = pairs.split("->").map(p => p.trim());
      this.mRules.set(pair[0], pair[1]);
    })
  }

  public apply(aSteps: number): number {

    let occurs = new Map<string, number>();
    let connnections = new Map<string, number>();

    const addToMap = function(aMap: Map<string, number>, aKey: string, aValue: number) {
      let value = aMap.get(aKey);
      aMap.set(aKey, value == undefined ? aValue : value + aValue);
    }

    for(let i = 0; i < this.mSeq.length - 1; i++) {
      addToMap(connnections, this.mSeq[i] + this.mSeq[i+1], 1);
      addToMap(occurs, this.mSeq[i], 1);
    }
    addToMap(occurs, this.mSeq[this.mSeq.length - 1], 1);

    for(let step = 0; step < aSteps; step ++) {

      let conns = new Array<{pair: string, freq: number}>();
      connnections.forEach((value, key) => {
        conns.push({pair: key, freq: value})
      })
      
      conns.forEach(conn => {

        let oldConnection = conn.pair;
        let newOccure = this.mRules.get(oldConnection);
        let newConnection1 = conn.pair[0] + newOccure;
        let newConnection2 = newOccure + conn.pair[1];
        
        addToMap(connnections, newConnection1, conn.freq);
        addToMap(connnections, newConnection2, conn.freq);
        addToMap(occurs, newOccure, conn.freq);

        let freq = connnections.get(oldConnection);
        if(freq - conn.freq < 1)
          connnections.delete(oldConnection);
        else
          connnections.set(oldConnection, freq - conn.freq);
      }) 
    }

    //console.log(occurs);

    let minMax = Array.from(occurs.values());
    return Math.max(...minMax) - Math.min(...minMax);
  }
}

var input = new InputFile("./day14/input.txt");
var input1 = new InputFile("./day14/input1.txt");

var poly = new Polymerization(input.getAsGroups(';'));
console.log(poly.apply(40));

