export const modulesData = [
  {
    id: 'classical-encryption',
    title: 'Module 1: Classical Encryption',
    simulations: [
      { id: 'caesar', title: 'Caesar Cipher', path: '/modules/classical-encryption#caesar' },
      { id: 'monoalphabetic', title: 'Monoalphabetic Cipher', path: '/modules/classical-encryption#monoalphabetic' },
      { id: 'playfair', title: 'Playfair Cipher', path: '/modules/classical-encryption#playfair' },
      { id: 'hill', title: 'Hill Cipher', path: '/modules/classical-encryption#hill' },
      { id: 'vigenere', title: 'Vigenère Cipher', path: '/modules/classical-encryption#vigenere' },
      { id: 'transposition', title: 'Transposition Cipher', path: '/modules/classical-encryption#transposition' },
      { id: 'stream', title: 'Stream Cipher', path: '/modules/classical-encryption#stream' },
    ]
  },
  {
    id: 'block-ciphers',
    title: 'Module 2: Block & Symmetric',
    simulations: [
      { id: 'des', title: 'DES Animation', path: '/modules/block-ciphers#des' },
      { id: 'aes', title: 'AES State Matrix', path: '/modules/block-ciphers#aes' },
    ]
  },
  {
    id: 'public-key',
    title: 'Module 3: Public Key Crypto',
    simulations: [
      { id: 'rsa', title: 'RSA Simulation', path: '/modules/public-key#rsa' },
      { id: 'dh', title: 'Diffie-Hellman', path: '/modules/public-key#dh' },
    ]
  },
  // Placeholders for the rest
];

export const getAllSimulationsFlat = () => {
  const flat = [];
  modulesData.forEach(m => {
    m.simulations.forEach(s => {
      flat.push({ ...s, moduleTitle: m.title, moduleId: m.id });
    });
  });
  return flat;
};
