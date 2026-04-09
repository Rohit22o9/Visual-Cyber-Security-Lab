export const SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

export const RCON = [
  0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36
];

// Helper: Convert hex string to 1D byte array
const hexToBytes = (hexStr) => {
  let bytes = [];
  for (let i = 0; i < hexStr.length; i += 2) {
    bytes.push(parseInt(hexStr.substr(i, 2), 16));
  }
  return bytes;
};

// Helper: Convert 1D byte array to 4x4 matrix (column-major)
const bytesToMatrix = (bytes) => {
  let matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      matrix[r][c] = bytes[c * 4 + r];
    }
  }
  return matrix;
};

const copyMatrix = (m) => m.map(row => [...row]);

// GF(2^8) multiplication by 2
const gfMul2 = (b) => {
  let res = b << 1;
  if (b & 0x80) res ^= 0x11b; // XOR with irreducible polynomial
  return res & 0xff;
};

// GF(2^8) multiplication by 3
const gfMul3 = (b) => gfMul2(b) ^ b;

// === AES Core Operations ===

const subBytes = (state) => {
  let next = copyMatrix(state);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      next[r][c] = SBOX[state[r][c]];
    }
  }
  return next;
};

const shiftRows = (state) => {
  let next = copyMatrix(state);
  // Shift row 1 by 1
  next[1][0] = state[1][1]; next[1][1] = state[1][2]; next[1][2] = state[1][3]; next[1][3] = state[1][0];
  // Shift row 2 by 2
  next[2][0] = state[2][2]; next[2][1] = state[2][3]; next[2][2] = state[2][0]; next[2][3] = state[2][1];
  // Shift row 3 by 3
  next[3][0] = state[3][3]; next[3][1] = state[3][0]; next[3][2] = state[3][1]; next[3][3] = state[3][2];
  return next;
};

const mixColumns = (state) => {
  let next = copyMatrix(state);
  for (let c = 0; c < 4; c++) {
    let s0 = state[0][c], s1 = state[1][c], s2 = state[2][c], s3 = state[3][c];
    next[0][c] = gfMul2(s0) ^ gfMul3(s1) ^ s2 ^ s3;
    next[1][c] = s0 ^ gfMul2(s1) ^ gfMul3(s2) ^ s3;
    next[2][c] = s0 ^ s1 ^ gfMul2(s2) ^ gfMul3(s3);
    next[3][c] = gfMul3(s0) ^ s1 ^ s2 ^ gfMul2(s3);
  }
  return next;
};

const addRoundKey = (state, roundKeyMatrix) => {
  let next = copyMatrix(state);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      next[r][c] ^= roundKeyMatrix[r][c];
    }
  }
  return next;
};

// === Key Expansion ===
const expandKey = (keyBytes) => {
  let words = []; // 44 words for AES-128
  let keyExpTimeline = []; // For rendering the sidebar

  for (let i = 0; i < 4; i++) {
    const w = [keyBytes[4*i], keyBytes[4*i+1], keyBytes[4*i+2], keyBytes[4*i+3]];
    words.push(w);
  }

  for (let i = 4; i < 44; i++) {
    let prev = [...words[i - 1]];
    let preRot = [...prev];
    
    if (i % 4 === 0) {
      // RotWord
      prev.push(prev.shift());
      let rotOut = [...prev];
      // SubWord
      prev = prev.map(b => SBOX[b]);
      // RCON
      prev[0] ^= RCON[i / 4];
      
      keyExpTimeline.push({
        wordIdx: i,
        preRot,
        rotOut,
        subOut: prev.slice(),
        rcon: RCON[i / 4]
      });
    }

    words.push([
      words[i - 4][0] ^ prev[0],
      words[i - 4][1] ^ prev[1],
      words[i - 4][2] ^ prev[2],
      words[i - 4][3] ^ prev[3]
    ]);
  }

  let roundKeys = [];
  for (let r = 0; r <= 10; r++) {
    let rkBytes = [];
    for (let c = 0; c < 4; c++) {
      rkBytes.push(...words[r * 4 + c]);
    }
    roundKeys.push(bytesToMatrix(rkBytes));
  }

  return { roundKeys, keyExpTimeline };
};

// Main Export
export const generateAESTimeline = (hexText, hexKey) => {
  const pBytes = hexToBytes(hexText.padEnd(32, '0').substring(0, 32));
  const kBytes = hexToBytes(hexKey.padEnd(32, '0').substring(0, 32));

  const { roundKeys, keyExpTimeline } = expandKey(kBytes);
  let state = bytesToMatrix(pBytes);
  
  const timeline = [];

  // Round 0: Initial AddRoundKey
  state = addRoundKey(state, roundKeys[0]);
  timeline.push({
     round: 0,
     desc: 'Initial AddRoundKey',
     state: copyMatrix(state),
     roundKey: roundKeys[0]
  });

  // Rounds 1 to 9
  for (let r = 1; r < 10; r++) {
    let s1 = subBytes(state);
    let s2 = shiftRows(s1);
    let s3 = mixColumns(s2);
    let s4 = addRoundKey(s3, roundKeys[r]);

    state = s4;

    timeline.push({
      round: r,
      desc: `Round ${r}`,
      states: {
        pre: copyMatrix(state), // Note: state from previous round
        sub: s1,
        shift: s2,
        mix: s3,
        add: s4
      },
      roundKey: roundKeys[r]
    });
  }

  // Round 10: Final
  let f1 = subBytes(state);
  let f2 = shiftRows(f1);
  let f3 = addRoundKey(f2, roundKeys[10]);

  timeline.push({
    round: 10,
    desc: 'Final Round',
    states: {
      sub: f1,
      shift: f2,
      add: f3
    },
    roundKey: roundKeys[10]
  });

  return { timeline, keyExpTimeline, roundKeys };
};

// Helper to count bits that differ between two matrices
export const getBitDifferences = (matA, matB) => {
  let diffCount = 0;
  let mapMatrix = []; // same 4x4 array storing boolean for differences

  for(let r=0; r<4; r++){
    let rowDiffs = [];
    for(let c=0; c<4; c++){
      let v1 = matA[r][c];
      let v2 = matB[r][c];
      let xor = v1 ^ v2;
      
      let localBits = 0;
      while(xor) {
        if(xor & 1) localBits++;
        xor >>>= 1;
      }

      diffCount += localBits;
      rowDiffs.push(localBits > 0);
    }
    mapMatrix.push(rowDiffs);
  }
  return { count: diffCount, mapMatrix };
};
