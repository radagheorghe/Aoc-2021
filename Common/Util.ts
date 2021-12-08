
const bZero = BigInt(0);
const bOne = BigInt(1);

export function diff<T>(aArray1: Array<T>, aArray2: Array<T>): Array<T> {
  return aArray1.filter(el => !aArray2.includes(el))
                .concat(aArray2.filter(el => !aArray1.includes(el)));
}

export function includes<T>(aElem: T, ...args): boolean {
  for(let arg of args) {
    if(arg.includes(aElem))
      return true;
  }

  return false;
}

export function cloneArray<T>(aToClone: Array<T>): Array<T> {
  return JSON.parse(JSON.stringify(aToClone));
}

export function isNumber(aInput: string): boolean {
  return !isNaN(Number(aInput))
}

export function last<T>(aArray: Array<T>, aPre: number = 0): T {
  if(aArray.length == 0)
    return undefined;
    
  return aArray[aArray.length - aPre - 1];
}

export function lastIndex<T>(aArray: Array<T>): number {
  return aArray.length - 1;
}

export function isEmpty<T>(aArray: Array<T>): boolean {
  return aArray.length == 0;
}

export function setBitByPos(aNumber: bigint, aBit: number): bigint {
  aNumber |= bOne << BigInt(aBit);
  return aNumber;
}

export function changeBitByPos(aNumber: bigint, aPos: number, aBit: number): bigint {
  let mask: bigint = bOne << BigInt(aPos); 
  return (aNumber & ~mask) | ((BigInt(aBit) << BigInt(aPos)) & mask);
}

export function hasBitSet(aNumber: bigint, aBit: number): boolean {
  return (aNumber & (bOne << BigInt(aBit))) === bZero ? false : true;
}
