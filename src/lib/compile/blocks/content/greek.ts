export default (character: string) => {
  return greek[character] ?? character;
};

const greek: Record<string, string> = {
  a: "α", // alpha
  b: "β", // beta
  g: "γ", // gamma
  d: "δ", // delta
  e: "ε", // epsilon
  z: "ζ", // zeta
  h: "η", // eta
  j: "θ", // theta
  i: "ι", // iota
  k: "κ", // kappa
  l: "λ", // lambda
  m: "μ", // mu
  n: "ν", // nu
  x: "ξ", // xi
  o: "ο", // omicron
  p: "π", // pi
  r: "ρ", // rho
  q: "ς", // sigma (end of word)
  s: "σ", // sigma (start or middle of word)
  t: "τ", // tau
  u: "υ", // upsilon
  f: "φ", // phi
  c: "χ", // chi
  y: "ψ", // psi
  w: "ω", // omega
  A: "Α", // Alpha
  B: "Β", // Beta
  G: "Γ", // Gamma
  D: "Δ", // Delta
  E: "Ε", // Epsilon
  Z: "Ζ", // Zeta
  H: "Η", // Eta
  J: "Θ", // Theta
  I: "Ι", // Iota
  K: "Κ", // Kappa
  L: "Λ", // Lambda
  M: "Μ", // Mu
  N: "Ν", // Nu
  X: "Ξ", // Xi
  O: "Ο", // Omicron
  P: "Π", // Pi
  R: "Ρ", // Rho
  Q: "Σ", // Sigma (end of word)
  S: "Σ", // Sigma (start or middle of word)
  T: "Τ", // Tau
  U: "Υ", // Upsilon
  F: "Φ", // Phi
  C: "Χ", // Chi
  Y: "Ψ", // Psi
  W: "Ω", // Omega
};
