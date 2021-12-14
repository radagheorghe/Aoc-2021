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

    let connnections = new Map<string, number>();

    const addConn = function(aConn: string, aFreq: number) {
      let freq = connnections.get(aConn);
      connnections.set(aConn, freq ? freq + aFreq : 1);
    }

    for(let i = 0; i < this.mSeq.length - 1; i++)
      addConn(this.mSeq[i] + this.mSeq[i+1], 1);

    for(let step = 0; step < aSteps -1; step ++) {

      console.log(step);

      let conns = Array.from(connnections.keys());
      let freqs = Array.from(connnections.values());

      for(let i = 0; i < conns.length; i++) {

        let conn = conns[i];
        let freq = freqs[i];

        addConn(conn[0] + this.mRules.get(conn), freq);
        addConn(this.mRules.get(conn) + conn[1], freq);
        
        let freq1 = connnections.get(conn);
        if(freq1 != undefined && freq1 <= 1)
          connnections.delete(conn);
        else if(freq1 != undefined)
          connnections.set(conn, freq1 - freq);
      }      
    }

    console.log(connnections);

    return 0;
  }
}

var input = new InputFile("./day14/input.txt");
var input1 = new InputFile("./day14/input1.txt");

var poly = new Polymerization(input1.getAsGroups(';'));
console.log(poly.apply(40));

