export function calculateCompoundInterest(principal: number, rate: number): number {
  return Math.floor(principal * (1 + rate));
}
