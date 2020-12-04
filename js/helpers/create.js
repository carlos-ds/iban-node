const iban = require("../iban.js");

// Helper function to add 2 check digits to a BBAN
function addBbanCheckDigits(bban) {
  let bbanInt = BigInt(bban, 10);
  let checkDigits = bbanInt % BigInt(97, 10);

  if (checkDigits === BigInt(0, 10)) {
    return iban.generate();
  } else if (checkDigits < BigInt(10, 10)) {
    // Return the result as a string with leading zero
    return bban + "0" + checkDigits;
  } else {
    // Return the result as a string
    return bban + checkDigits;
  }
}

module.exports = { addBbanCheckDigits };
