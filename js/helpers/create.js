const iban = require("../iban.js");
const bigInt = require("big-integer");

// Helper function to add 2 check digits to a BBAN
function addBbanCheckDigits(bban) {
    let bbanInt = bigInt(bban);
    let checkDigits = bbanInt % bigInt(97);

    if (bbanInt % bigInt(97) === 0) {
        return iban.generate();
    } else if (bbanInt % bigInt(97) < 10) {
        // Return the result as a string with leading zero
        return bban + "0" + checkDigits;
    } else {
        // Return the result as a string
        return bban + checkDigits;
    }
}

module.exports = { addBbanCheckDigits };