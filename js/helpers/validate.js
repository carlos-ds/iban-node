const bankCodes = require('./bankcodes');
const bigInt = require("big-integer");

function has16Characters(iban) {
    if (iban.length === 16) {
        return true;
    } else {
        return false;
    }
}

function startsWithBelgianPrefix(iban) {
    if (iban.substring(0, 2) === "BE") {
        return true;
    } else {
        return false;
    }
}

function endsWithNumbers(iban) {
    let onlyNumbers = /^\d+$/;
    return onlyNumbers.test(iban.substring(2, 16));
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

    const firstTenDigits = bigInt(bban.substring(0, 10), 10);
    const checkDigits = bigInt(bban.substring(10, 12), 10);
    if (firstTenDigits % bigInt(97) == checkDigits) {
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
    const bbanWithCountryCodeAndZeroes = bigInt((bban + "111400"), 10);
    const ibanChecksum = 98 - (bbanWithCountryCodeAndZeroes % bigInt(97, 10));

    if (ibanChecksum === parseInt(iban.substring(2, 4))) {
        return true;
    } else {
        return false;
    }
}

module.exports = { has16Characters, startsWithBelgianPrefix, endsWithNumbers, hasValidBbanChecksum, hasValidIbanChecksum };