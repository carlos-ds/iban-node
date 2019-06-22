// Import array of bank codes to exclude
const bankCodes = require('./bankcodes');

// Extend array with contain method to exclude free/invalid bank codes
// https://stackoverflow.com/questions/12623272/how-to-check-if-a-string-array-contains-one-string-in-javascript
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

// Add 2 check digits to a BBAN, equal to the remainder of a number in modulo 97
function addBbanCheckDigits(bban) {
    let bbanInt = parseInt(bban, 10);
    let checkDigits = (bbanInt % 97).toString();
    if ((bbanInt % 97) == 0) {
        return generateBban();
    } else if ((bbanInt % 97) < 10) {
        // Return the result as a string with leading zero
        return bban + "0" + checkDigits;
    } else {
        // Return the result as a string
        return bban + checkDigits;
    }    
}

// Generate a valid BBAN and add check digits
function generateBban() {
    let randomNum = Math.random() * (9999999999 - 10000000 + 1);
    let lastDigits = (Math.floor(randomNum) + 10000000).toString();
    let firstTenDigits = ("0").repeat(10 - lastDigits.length).concat(lastDigits);
    let firstThreeDigits = firstTenDigits.substr(0, 3);

    // Call the function again if the bank code generated is to be excluded (see bankcodes.js)
    if (bankCodes.toExclude.contains(firstThreeDigits)) {
        return generateBban();
    } else {
        return addBbanCheckDigits(firstTenDigits);
    }
}

function generateIbanString(ibanChecksum, bbanString) {
    let ibanCheckDigits = "BE" + ("0").repeat(2 - ibanChecksum.length).concat(ibanChecksum.toString());
    return ibanCheckDigits + " " + bbanString.substr(0, 4) + " " + bbanString.substr(4, 4) + " " + bbanString.substr(8, 4);
}

// Create random first ten digits of a BBAN/IBAN number and add check digits
function generateIban() {
    let bbanString = generateBban();
    let bbanWithBelgianCountryCode = parseInt(bbanString + "111400", 10);
    let ibanChecksum = (98 - (bbanWithBelgianCountryCode % 97)).toString();
    let ibanCheckmod = parseInt(bbanString + "1114" + ("0").repeat(2 - ibanChecksum.length) + ibanChecksum);

    if (ibanCheckmod % 97 !== 1) {
        return generateIban();
    } else {
        var iban = generateIbanString(ibanChecksum, bbanString);
        return iban;
    }
}

module.exports = { generate: generateIban };











