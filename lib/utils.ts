/* eslint-disable @typescript-eslint/no-explicit-any */

export const round2 = (num: number) => Math.round(num * 100) / 100;

export function convertDocToObj(doc: any) {
    return {
      ...doc,
      _id: doc._id.toString(),
    };
  }
  
  