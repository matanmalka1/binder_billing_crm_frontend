export const validatePositiveAmount = (amount: string): number | null => {
  const parsed = parseFloat(amount);
  return isNaN(parsed) || parsed <= 0 ? null : parsed;
};

export const validatePercentage = (value: string): number | null => {
  const parsed = parseFloat(value);
  return isNaN(parsed) || parsed < 0 || parsed > 100 ? null : parsed;
};
