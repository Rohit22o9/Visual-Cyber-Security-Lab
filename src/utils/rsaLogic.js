// src/utils/rsaLogic.js
// Math engine for RSA and Extended Euclidean Algorithm visualization

export const isPrime = (num) => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

export const generateEEASteps = (e, phi) => {
  if (isNaN(e) || isNaN(phi) || e === undefined || phi === undefined) {
    return { steps: [], d: 0 };
  }
  
  let steps = [];
  let a = phi;
  let b = e;
  
  let s_prev = 1, s_curr = 0;
  let t_prev = 0, t_curr = 1;

  steps.push({
    stepCount: 0,
    a,
    b,
    q: '-',
    r: '-',
    s: s_prev,
    t: t_prev,
    isFinal: false
  });

  steps.push({
    stepCount: 1,
    a: '-',
    b: '-',
    q: '-',
    r: '-',
    s: s_curr,
    t: t_curr,
    isFinal: false
  });

  let stepCounter = 2;

  while (b !== 0) {
    let q = Math.floor(a / b);
    let r = a % b;
    let s_next = s_prev - q * s_curr;
    let t_next = t_prev - q * t_curr;

    steps.push({
      stepCount: stepCounter,
      a,
      b,
      q,
      r,
      s: s_next,
      t: t_next,
      isFinal: r === 0 // we'll flag it
    });

    a = b;
    b = r;
    s_prev = s_curr;
    s_curr = s_next;
    t_prev = t_curr;
    t_curr = t_next;
    stepCounter++;
  }

  // The inverse of e mod phi is t_prev
  // If t_prev is negative, make it positive
  let d = t_prev;
  while (d < 0) {
    d += phi;
  }

  return { steps, d };
};

export const modInverse = (a, m) => {
  if (isNaN(a) || isNaN(m)) return NaN;
  const { d } = generateEEASteps(a, m);
  return d;
};

// Simple modular exponentiation for numbers
export const modExp = (base, exp, mod) => {
  let res = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) res = (res * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return res;
};

export const generateRSATimeline = (p, q, m) => {
  p = parseInt(p);
  q = parseInt(q);
  m = parseInt(m);

  if (isNaN(p) || isNaN(q) || isNaN(m)) {
    throw new Error("Inputs must be numbers");
  }

  if (!isPrime(p) || !isPrime(q)) {
    throw new Error("P and Q must be prime");
  }

  const n = p * q;
  const phi = (p - 1) * (q - 1);

  // Pick e, standard default is 65537 but 3 is often fine for small primes
  // Let's find first valid e > 2
  let e = 3;
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  while (e < phi) {
    if (gcd(e, phi) === 1) break;
    e += 2;
  }

  if (e >= phi) throw new Error("Cannot find valid e for these primes");

  const { steps: eeaSteps, d } = generateEEASteps(e, phi);

  const c = modExp(m, e, n);
  const decryptedM = modExp(c, d, n);

  return {
    n,
    phi,
    e,
    d,
    eeaSteps,
    c,
    decryptedM
  };
};
