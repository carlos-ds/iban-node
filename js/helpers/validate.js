const bankCodes = require('./bankcodes');

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

function hasValidBban(iban) {
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

    const firstTenDigits = BigInt(bban.substring(0, 10));
    const checkDigits = BigInt(bban.substring(10, 12));
    if (firstTenDigits % BigInt(97) === checkDigits) {
        return true;
    } else {
        return false;
    }
}

module.exports = { has16Characters, startsWithBelgianPrefix, endsWithNumbers, hasValidBban };