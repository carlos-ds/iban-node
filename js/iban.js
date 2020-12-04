const addBbanCheckDigits = require("./helpers/create").addBbanCheckDigits;
const validationHelpers = require("./helpers/validate");
const bankCodes = require("./helpers/bankcodes");

// Extend array with contain method to exclude free/invalid bank codes
// https://stackoverflow.com/questions/12623272/how-to-check-if-a-string-array-contains-one-string-in-javascript
Array.prototype.contains = function (element) {
  return this.indexOf(element) > -1;
};

// Generate a valid BBAN and add check digits
function generateIban() {
  const randomNum = Math.random() * (9999999999 - 10000000 + 1);
  const lastDigits = (Math.floor(randomNum) + 10000000).toString();
  const firstTenDigits = "0".repeat(10 - lastDigits.length).concat(lastDigits);
  const firstThreeDigits = firstTenDigits.substr(0, 3);

  // Call the function again if the bank code generated is to be excluded (see bankcodes.js)
  if (bankCodes.toExclude.contains(firstThreeDigits)) {
    return generateIban();
  }

  // Add 2 BBAN check digits to the first ten digits, add the country code in latin alphabet, add "00" and perform modulo 97
  const bbanString = addBbanCheckDigits(firstTenDigits).toString();
  const bbanWithCountryCodeAndZeroes = BigInt(bbanString + "111400", 10);
  const checkMod97 = bbanWithCountryCodeAndZeroes % BigInt(97, 10);

  if (checkMod97 === 0) {
    return generateIban();
  }

  // Calculate IBAN check digits (BEXX ...) and add a zero if necessary
  const ibanCheckDigits = (BigInt(98, 10) - checkMod97).toString();
  const checkDigitsWithLeadingZeroes = "0".repeat(2 - ibanCheckDigits.length) + ibanCheckDigits;

  // Return the IBAN number in BEXX XXXX XXXX XXXX format
  return `BE${checkDigitsWithLeadingZeroes} ${bbanString.substr(0, 4)} ${bbanString.substr(4, 4)} ${bbanString.substr(8, 4)}`;
}

function validate(iban) {
  let sanitizedIban = validationHelpers.sanitizeIban(iban);
  let formattedIban = `${sanitizedIban.substring(0, 4)} ${sanitizedIban.substring(4, 8)} ${sanitizedIban.substring(8, 12)} ${sanitizedIban.substring(12, 16)}`;
  let validation = {
    iban: formattedIban,
    has16Characters: validationHelpers.has16Characters(sanitizedIban),
    startsWithBelgianPrefix: validationHelpers.startsWithBelgianPrefix(sanitizedIban),
    endsWithNumbers: validationHelpers.endsWithNumbers(sanitizedIban),
    hasValidBbanChecksum: validationHelpers.hasValidBbanChecksum(sanitizedIban),
    hasValidIbanChecksum: validationHelpers.hasValidIbanChecksum(sanitizedIban),
  };
  return validation;
}

module.exports = { generateIban, validate };
