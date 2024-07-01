const dp = Array(100).fill(0);

export const doDp = (n: number) => {
  if (n < 2) {
    return 1;
  }
  if (dp[n] !== 0) {
    return dp[n];
  }
  dp[n] = doDp(n - 1) + doDp(n - 2);
  return dp[n];
};
const isPrime = (n: number) => {
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
};

export const solve6 = () => {
  let n = 30;
  for (n = 30; n < 100000000; n++) {
    if (isPrime(doDp(n))) {
      break;
    }
  }
  console.log(n);
  return n;
};
