const iban = require("./iban.js");
const validationHelpers = require("./helpers/validate");

// Generate new IBAN and validate it

describe("Generate new iban and validate it", () => {
  const generatedIban = iban.generateIban();
  const ibanRegEx = /^BE\d{2}(\s\d{4}){3}$/;
  const validation = iban.validate(generatedIban);

  test("New iban has 16 characters (sanitized)", () => {
    expect(validationHelpers.sanitizeIban(generatedIban).length).toEqual(16);
  });

  test("New iban has 19 characters (formatted)", () => {
    expect(validation.iban.length).toEqual(19);
  });

  test("New iban has the correct format", () => {
    expect(ibanRegEx.test(generatedIban)).toBeTruthy();
  });

  test("5 validation object values are true", () => {
    const validationObjectValues = Object.values(validation);
    expect(validationObjectValues.length === 5);
    expect(validationObjectValues.filter((value) => !value).length === 0);
    expect(validationObjectValues.filter((value) => value === true).length === validationObjectValues.length);
  });
});

// Validate IBAN

describe("Validate 'BE19'", () => {
  test("Validation object values match the expected values", () => {
    const ibanToValidate = "BE19";
    const validation = iban.validate(ibanToValidate);
    expect(validation.has16Characters).toEqual(false);
    expect(validation.startsWithBelgianPrefix).toEqual(true);
    expect(validation.endsWithNumbers).toEqual(true);
    expect(validation.hasValidBbanChecksum).toEqual(false);
    expect(validation.hasValidIbanChecksum).toEqual(false);
  });
});

describe("Validate 'BE12 3456 7890 1234'", () => {
  test("Validation object values match the expected values", () => {
    const ibanToValidate = "BE12345678901234";
    const validation = iban.validate(ibanToValidate);
    expect(validation.iban).toEqual("BE12 3456 7890 1234");
    expect(validation.has16Characters).toEqual(true);
    expect(validation.startsWithBelgianPrefix).toEqual(true);
    expect(validation.endsWithNumbers).toEqual(true);
    expect(validation.hasValidBbanChecksum).toEqual(false);
    expect(validation.hasValidIbanChecksum).toEqual(false);
  });
});

describe("Validate 'BE35 0013 5840 1538'", () => {
  test("Validation object values match the expected values", () => {
    const ibanToValidate = "BE35001358401538";
    const validation = iban.validate(ibanToValidate);
    expect(validation.iban).toEqual("BE35 0013 5840 1538");
    expect(validation.has16Characters).toEqual(true);
    expect(validation.startsWithBelgianPrefix).toEqual(true);
    expect(validation.endsWithNumbers).toEqual(true);
    expect(validation.hasValidBbanChecksum).toEqual(true);
    expect(validation.hasValidIbanChecksum).toEqual(false);
  });
});

describe("Validate 'BE19 0000 0000 1212'", () => {
  test("Validation object values match the expected values", () => {
    const ibanToValidate = "BE19000000001212";
    const validation = iban.validate(ibanToValidate);
    expect(validation.iban).toEqual("BE19 0000 0000 1212");
    expect(validation.has16Characters).toEqual(true);
    expect(validation.startsWithBelgianPrefix).toEqual(true);
    expect(validation.endsWithNumbers).toEqual(true);
    expect(validation.hasValidBbanChecksum).toEqual(true);
    expect(validation.hasValidIbanChecksum).toEqual(true);
  });
});

describe("Validate 'BE30 0000 0000 1111'", () => {
  test("Validation object values match the expected values", () => {
    const ibanToValidate = "BE30000000001111";
    const validation = iban.validate(ibanToValidate);
    expect(validation.iban).toEqual("BE30 0000 0000 1111");
    expect(validation.has16Characters).toEqual(true);
    expect(validation.startsWithBelgianPrefix).toEqual(true);
    expect(validation.endsWithNumbers).toEqual(true);
    expect(validation.hasValidBbanChecksum).toEqual(true);
    expect(validation.hasValidIbanChecksum).toEqual(true);
  });
});
