export interface MnemonicTip {
  tip: string;
  example?: string;
}

const TIPS: Record<number, string> = {
  1: "Anything times 1 is just itself! It's like looking in a mirror.",
  2: "The 2s are just doubles! 2, 4, 6, 8, 10... they all end in an even number.",
  3: "Try a rhythm! 3, 6, 9, 12, 15... If the digits of the answer add up to 3, 6, or 9, it's in the 3s!",
  4: "Double the double! For 4 × 5, double 5 is 10, then double 10 is 20!",
  5: "Count your fingers! They always end in 5 or 0. (5, 10, 15, 20...)",
  6: "The 6s are double the 3s. Also, 6 times an even number always ends in the same digit (6 × 4 = 24, 6 × 8 = 48)!",
  7: "The 7s are tricky, but you can build them! 7 × 8 is just (5 × 8) + (2 × 8).",
  8: "Double, double, double! For 8 × 3, double 3 is 6, double 6 is 12, double 12 is 24!",
  9: "The finger trick! Put down the finger of the number you're multiplying. Also, the digits always add up to 9!",
  10: "Just put a zero on the end! 10 × 5 is 5 with a 0: 50.",
  11: "Double digits! 11 × 3 is 33, 11 × 7 is 77. (Up to 9!)",
  12: "The 10s plus the 2s! For 12 × 5, do 10 × 5 (50) plus 2 × 5 (10). 50 + 10 = 60!",
};

const SPECIFIC_HINTS: Record<string, string> = {
  "3x4": "3, 6, 9, 12! A dozen eggs in a carton.",
  "5x5": "High five! 25!",
  "6x6": "Six times six is thirty-six! It rhymes!",
  "6x8": "Six times eight is forty-eight! Another rhyme!",
  "7x8": "5, 6, 7, 8! 56 is 7 times 8!",
  "8x8": "I ate and I ate and I fell on the floor! 8 times 8 is 64!",
  "9x9": "Nine times nine is eighty-one, math is lots of ocean fun!",
};

export function getMnemonic(tableN: number, multiplier: number): string {
  const key = `${tableN}x${multiplier}`;
  const altKey = `${multiplier}x${tableN}`;

  if (SPECIFIC_HINTS[key]) return SPECIFIC_HINTS[key];
  if (SPECIFIC_HINTS[altKey]) return SPECIFIC_HINTS[altKey];

  return TIPS[tableN] || TIPS[multiplier] || "Try counting up from the last one you know!";
}
