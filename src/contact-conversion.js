const TYPE_MOBILE = "cell";
const TYPE_OTHER = "other";
const TYPE_WORK = "work";
const TYPE_HOME = "home";

function outlookAddressToSipgateAddress(outlookAddress) {
  return {
    streetAddress: outlookAddress.street,
    postalCode: outlookAddress.postalCode,
    locality: outlookAddress.city,
    region: outlookAddress.state,
    country: outlookAddress.countryOrRegion,
  };
}

function outlookOrgContactToSipgateContact(outlookOrgContact) {
  const emails = outlookOrgContact.mail
    ? [{ email: outlookOrgContact.mail, type: [] }]
    : [];

  const organization = [
    [outlookOrgContact.companyName || "", outlookOrgContact.department || ""],
  ];

  const addresses = outlookOrgContact.addresses.map(
    outlookAddressToSipgateAddress
  );

  const outlookNumberTypeToSipgateNumberType = (type) => {
    if (type === "home") return TYPE_HOME;
    if (type === "business") return TYPE_WORK;
    if (type === "mobile") return TYPE_MOBILE;
    return TYPE_OTHER;
  };

  const numbers = outlookOrgContact.phones
    .filter(({ number, type }) => number !== null)
    .map(({ number, type }) => ({
      number,
      type: [outlookNumberTypeToSipgateNumberType(type)],
    }));

  return {
    name: outlookOrgContact.displayName,
    numbers,
    emails,
    organization,
    addresses,
    scope: "SHARED",
  };
}

function outlookContactToSipgateContact(outlookContact) {
  const numbers = [];

  if (outlookContact.mobilePhone) {
    numbers.push({ number: outlookContact.mobilePhone, type: [TYPE_MOBILE] });
  }

  for (number of outlookContact.homePhones) {
    numbers.push({ number, type: [TYPE_HOME] });
  }
  for (number of outlookContact.businessPhones) {
    numbers.push({ number, type: [TYPE_WORK] });
  }

  const emails = outlookContact.emailAddresses.map(({ address }) => ({
    email: address,
    type: [],
  }));

  const organization = [
    [outlookContact.companyName || "", outlookContact.department || ""],
  ];

  const addresses = [];
  if (Object.keys(outlookContact.homeAddress).length !== 0) {
    addresses.push(outlookAddressToSipgateAddress(outlookContact.homeAddress));
  }
  if (Object.keys(outlookContact.businessAddress).length !== 0) {
    addresses.push(
      outlookAddressToSipgateAddress(outlookContact.businessAddress)
    );
  }
  if (Object.keys(outlookContact.otherAddress).length !== 0) {
    addresses.push(outlookAddressToSipgateAddress(outlookContact.otherAddress));
  }

  return {
    name: outlookContact.displayName,
    numbers,
    emails,
    organization,
    addresses,
    scope: "SHARED",
  };
}

module.exports = {
  outlookContactToSipgateContact,
  outlookOrgContactToSipgateContact,
};
