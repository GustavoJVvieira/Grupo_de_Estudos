var rawCnpj = process.argv[2] || '';
if (!rawCnpj) {
    console.log('Por favor, informe o CNPJ como argumento.');
    process.exit(1);
}
function sanitize(input) {
    return input.replace(/\D/g, '');
}
function isAllDigitsRepeated(value) {
    return /^(\d)\1{13}$/.test(value);
}
function calculateVerifierDigit(cnpjPart, weights) {
    var sum = cnpjPart
        .split('')
        .reduce(function (acc, digit, i) { return acc + Number(digit) * weights[i]; }, 0);
    var remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
}
function isValidCnpj(cnpj) {
    var cleanCnpj = sanitize(cnpj);
    if (cleanCnpj.length !== 14)
        return false;
    if (isAllDigitsRepeated(cleanCnpj))
        return false;
    var base = cleanCnpj.slice(0, 12);
    var firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    var secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    var firstDigit = calculateVerifierDigit(base, firstWeights);
    var secondDigit = calculateVerifierDigit(base + firstDigit, secondWeights);
    return cleanCnpj.endsWith("".concat(firstDigit).concat(secondDigit));
}
console.log("CNPJ ".concat(rawCnpj, " \u00E9 ").concat(isValidCnpj(rawCnpj) ? 'válido' : 'inválido', "."));
