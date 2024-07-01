const dp = Array(100).fill(0);

export const solve = (n: number) => {
  if (n < 2) {
    return 1;
  }
  if (dp[n] !== 0) {
    return dp[n];
  }
  dp[n] = solve(n - 1) + solve(n - 2);
  return dp[n];
};
