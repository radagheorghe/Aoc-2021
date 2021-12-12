import { InputFile } from '../Common/InputFile'

class Graph {
  
  private mNodesList: Map<string, Array<string>>;

  constructor()
  {
    this.mNodesList = new Map<string, Array<string>>();
  }

  // add node to the graph if doesn't exist
  public addNode(aNode: string): Array<string>
  {
    if(this.mNodesList.has(aNode))
      return this.mNodesList.get(aNode);
    else {
      this.mNodesList.set(aNode, new Array<string>());
      return this.mNodesList.get(aNode);
    }
  }

  // add edge to the graph
  public addEdge(aNode1: string, aNode2: string)
  {
    this.addNode(aNode1).push(aNode2);
    this.addNode(aNode2).push(aNode1);
  }

  public getGraph(): Map<string, Array<string>> {
    return this.mNodesList;
  }
}

class CavePathing {
  
  private mCaves: Graph;
  
  constructor(aInput: Array<string>) {

    this.mCaves = new Graph();

    aInput.forEach(line => {
      let nodes = line.split('-');
      this.mCaves.addEdge(nodes[0], nodes[1]);
    })
  }

  public getPaths(): number {

    let caves = this.mCaves.getGraph();

    let visited = new Map<string, number>();
    Array.from(caves.keys()).forEach(cave => {
      visited.set(cave, 0);
    })
    
    const isSmallCave = function(aCave): boolean {
      return aCave != 'start' && aCave != 'end' && aCave == aCave.toLowerCase();
    }

    const visitedMultipleSmallCaves = function(aCave: string): boolean {
      if(aCave == aCave.toUpperCase())
        return false;
      let smallCaves = Array.from(caves.keys()).filter(c => isSmallCave(c));
      for(let cave of smallCaves) {
        if(cave == aCave)
          continue;
        if(visited.get(cave) >= 2)
          return true;
      }
      return false;
    }

    const allowMultipleVisits = function(aCave: string): boolean {
      if(aCave == aCave.toUpperCase())
        return true;
      if(isSmallCave(aCave) && visited.get(aCave) < 2)
        return true;
      return false;
    }

    const getAllPaths = function(aCurr:string, aEnd: string, aLocalPath: Array<string>)
    {
      if (aCurr == aEnd) {
        console.log(aLocalPath);
        allPaths++;
        return;
      }

      let visit = visited.get(aCurr);
      visited.set(aCurr, visit + 1);

      for (let cave of caves.get(aCurr)) {
        if (visited.get(cave) == 0 || 
            (allowMultipleVisits(cave) && !visitedMultipleSmallCaves(cave))) {
            
          aLocalPath.push(cave);
          getAllPaths(cave, aEnd, aLocalPath);

          aLocalPath.pop();
        }
      }

      visit = visited.get(aCurr);
      visited.set(aCurr, visit - 1);
    }
    
    let path = new Array<string>();
    path.push('start');

    let allPaths = 0;
    getAllPaths('start', 'end', path);
    
    return allPaths;
  }
}

var input = new InputFile("./day12/input.txt");
var input1 = new InputFile("./day12/input1.txt");
var input2 = new InputFile("./day12/input2.txt");

var caves = new CavePathing(input.getAsLines());
console.log(caves.getPaths());
