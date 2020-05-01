const iban = require("../iban.js");

// Helper function to add 2 check digits to a BBAN
function addBbanCheckDigits(bban) {
    let bbanInt = BigInt(bban);
    let checkDigits = bbanInt % BigInt(97);

    if (bbanInt % BigInt(97) === 0) {
        return iban.generate();
    } else if (bbanInt % BigInt(97) < 10) {
        // Return the result as a string with leading zero
        return bban + "0" + checkDigits;
    } else {
        // Return the result as a string
        return bban + checkDigits;
    }
}

module.exports = { addBbanCheckDigits };