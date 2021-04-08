/*
Outlook:
{
  '@odata.etag': 'W/"EQAAABYAAAC1TSefq7ydSIDS2ploUmnHAABHQxOx"',
  id: 'AQMkADAwATM0MDAAMS0yZmU4LTZhMWYtMDACLTAwCgBGAAADG3VHZOdFokquAx-WnCHcngcAtU0nn6u8nUiA0tqZaFJpxwAAAgEOAAAAtU0nn6u8nUiA0tqZaFJpxwAAAEdEw20AAAA=',
  createdDateTime: '2021-04-06T14:32:09Z',
  lastModifiedDateTime: '2021-04-06T14:32:09Z',
  changeKey: 'EQAAABYAAAC1TSefq7ydSIDS2ploUmnHAABHQxOx',
  categories: [],
  parentFolderId: 'AQMkADAwATM0MDAAMS0yZmU4LTZhMWYtMDACLTAwCgAuAAADG3VHZOdFokquAx-WnCHcngEAtU0nn6u8nUiA0tqZaFJpxwAAAgEOAAAA',
  birthday: null,
  fileAs: 'Lovelace, Ada',
  displayName: 'Ada Lovelace',
  givenName: 'Ada',
  initials: null,
  middleName: null,
  nickName: null,
  surname: 'Lovelace',
  title: null,
  yomiGivenName: null,
  yomiSurname: null,
  yomiCompanyName: null,
  generation: null,
  imAddresses: [],
  jobTitle: null,
  companyName: null,
  department: null,
  officeLocation: null,
  profession: null,
  businessHomePage: null,
  assistantName: null,
  manager: null,
  homePhones: [],
  mobilePhone: '97453132649',
  businessPhones: [],
  spouseName: null,
  personalNotes: '',
  children: [],
  emailAddresses: [
    {
      name: 'ada.lovelace@example.com',
      address: 'ada.lovelace@example.com'
    }
  ],
  homeAddress: {},
  businessAddress: {},
  otherAddress: {}
}

sipgate:
{
    "id": "b3b69ba2-3965-4370-8b92-16874537d610",
    "name": "Display Name",
    "picture": null,
    "emails": [
        {
            "email": "email@email.email",
            "type": [
                "home"
            ]
        }
    ],
    "numbers": [
        {
            "number": "+491234",
            "type": [
                "home"
            ]
        },
        {
            "number": "+491234",
            "type": [
                "work"
            ]
        },
        {
            "number": "+491234",
            "type": [
                "cell"
            ]
        },
        {
            "number": "+491234",
            "type": [
                "other"
            ]
        }
    ],
    "addresses": [],
    "organization": [],
    "scope": "SHARED"
}
*/

const TYPE_MOBILE = "cell";
const TYPE_OTHER = "other";
const TYPE_WORK = "work";
const TYPE_HOME = "home";

function outlookAddressToSipgateAddress(outlookAddress) {
  return {
    "streetAddress": outlookAddress.street,
    "postalCode": outlookAddress.postalCode,
    "locality": outlookAddress.city,
    "region": outlookAddress.state,
    "country": outlookAddress.countryOrRegion,
  }
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

  const organization = [[outlookContact.companyName || "", outlookContact.department || ""]];

  const addresses = []
  if(Object.keys(outlookContact.homeAddress).length !== 0) {
    addresses.push(outlookAddressToSipgateAddress(outlookContact.homeAddress));
  }
  if(Object.keys(outlookContact.businessAddress).length !== 0) {
    addresses.push(outlookAddressToSipgateAddress(outlookContact.businessAddress));
  }
  if(Object.keys(outlookContact.otherAddress).length !== 0) {
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
};
