const rawCnpj = process.argv[2] || '';

if (!rawCnpj) {
  console.log('Por favor, informe o CNPJ como argumento.');
  process.exit(1);
}

function sanitize(input: string): string {
  return input.replace(/\D/g, '');
}

function isAllDigitsRepeated(value: string): boolean {
  return /^(\d)\1{13}$/.test(value);
}

function calculateVerifierDigit(cnpjPart: string, weights: number[]): number {
  const sum = cnpjPart
    .split('')
    .reduce((acc, digit, i) => acc + Number(digit) * weights[i], 0);

  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function isValidCnpj(cnpj: string): boolean {
  const cleanCnpj = sanitize(cnpj);
  if (cleanCnpj.length !== 14) return false;
  if (isAllDigitsRepeated(cleanCnpj)) return false;

  const base = cleanCnpj.slice(0, 12);
  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const firstDigit = calculateVerifierDigit(base, firstWeights);
  const secondDigit = calculateVerifierDigit(base + firstDigit, secondWeights);

  return cleanCnpj.endsWith(`${firstDigit}${secondDigit}`);
}

console.log(`CNPJ ${rawCnpj} é ${isValidCnpj(rawCnpj) ? 'válido' : 'inválido'}.`);
