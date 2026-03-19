// src/utils/validation.ts

/**
 * Israeli ID / Company number (ח.פ) checksum validation.
 * Both use the same Luhn-based algorithm.
 */
export const validateIsraeliIdChecksum = (id: string): boolean => {
  if (id.length !== 9 || !/^\d+$/.test(id)) return false;
  let total = 0;
  for (let i = 0; i < 9; i++) {
    let n = Number(id[i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    total += n;
  }
  return total % 10 === 0;
};