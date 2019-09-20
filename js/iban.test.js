const iban = require('./iban.js');
const generatedIban = iban.generate();
const ibanRegEx = /^BE\d{2}(\s\d{4}){3}$/;

 test('iban is 19 characters (including spaces) long', () => {
     expect(generatedIban.length).toEqual(19);
 });

 test('iban is in the correct format', () => {
     expect(ibanRegEx.test(generatedIban)).toBeTruthy();
 });