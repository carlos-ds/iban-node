const bankCodes = require('./bankcodes');

function sanitizeIban(iban) {
  return iban.trim().replace(/\s/g, '');
}

function has16Characters(iban) {
  if (iban.length === 16) {
    return true;
  } else {
    return false;
  }
}

function startsWithBelgianPrefix(iban) {
  if (iban.substring(0, 2) === 'BE') {
    return true;
  } else {
    return false;
  }
}

function endsWithNumbers(iban) {
  let onlyNumbers = /^\d+$/;
  return onlyNumbers.test(iban.substring(2, iban.length));
}

function hasValidBbanChecksum(iban) {
  if (!endsWithNumbers(iban)) {
    return false;
  }

  const bban = iban.substring(4, 16);
  const firstThreeDigits = bban.substring(0, 3);
  if (bban.length !== 12) {
    return false;
  }
  if (firstThreeDigits.length !== 3) {
    return false;
  }
  if (bankCodes.toExclude.contains(firstThreeDigits)) {
    return false;
  }

  const firstTenDigits = BigInt(parseInt(bban.substring(0, 10), 10));
  const checkDigits = BigInt(parseInt(bban.substring(10, 12), 10));
  if (firstTenDigits % BigInt(97) == checkDigits) {
    return true;
  } else {
    return false;
  }
}

function hasValidIbanChecksum(iban) {
  if (!endsWithNumbers(iban)) {
    return false;
  }

  const bban = iban.substring(4, 16);
  const bbanWithCountryCodeAndZeroes = bban + '111400';

  const n1 = BigInt(parseInt(bbanWithCountryCodeAndZeroes.substring(0, 9), 10));
  const mod1 = n1 % BigInt(97);

  const n2 = BigInt(parseInt(mod1.toString() + bbanWithCountryCodeAndZeroes.substring(9, 16), 10));
  const mod2 = n2 % BigInt(97);

  const n3 = BigInt(parseInt(mod2.toString() + bbanWithCountryCodeAndZeroes.substring(16, 18)));
  const mod3 = n3 % BigInt(97);

  if (BigInt(98) - mod3 === BigInt(parseInt(iban.substring(2, 4), 10))) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  sanitizeIban,
  has16Characters,
  startsWithBelgianPrefix,
  endsWithNumbers,
  hasValidBbanChecksum,
  hasValidIbanChecksum,
};
