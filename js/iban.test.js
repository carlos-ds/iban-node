const iban = require('./iban.js');
const generatedIban = iban.generateIban();
const ibanRegEx = /^BE\d{2}(\s\d{4}){3}$/;

test('iban is 19 characters (including spaces) long', () => {
    expect(generatedIban.length).toEqual(19);
});

test('iban is in the correct format', () => {
    expect(ibanRegEx.test(generatedIban)).toBeTruthy();
});

test('bban has the correct check digits', () => {
    const bbanString = generatedIban.replace(/\s/g, '').slice(4, 16);
    const bbanWithoutCheckDigits = bbanString.slice(0, 10);
    const checkDigits = bbanString.slice(10, 12);
    const bbanModulo97 = (bbanWithoutCheckDigits % 97).toString();
    expect(checkDigits).toEqual(bbanModulo97.length === 2 ? bbanModulo97 : ("0").concat(bbanModulo97));
});