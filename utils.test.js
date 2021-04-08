const { removeDuplicateContacts, compareContacts } = require("./utils");

describe("Tests for compareContacts", () => {
  test("comparesUnidenticalContacts", () => {
    const outlookContact = {
      displayName: "Eric S",
      phones: [
        {
          number: "111-1111",
          type: "businessFax",
        },
      ],
    };

    const sipgateContact = {
      name: "Ada Lovelace",
      numbers: [
        {
          number: "+4915799912345",
          type: ["string"],
        },
      ],
    };

    expect(compareContacts(outlookContact, sipgateContact)).toBe(false);
  });

  test("comparesIdenticalContacts", () => {
    const outlookContact = {
      displayName: "Eric S",
      phones: [
        {
          number: "111-1111",
          type: "businessFax",
        },
      ],
    };

    const sipgateContact = {
      name: "Eric S",
      numbers: [
        {
          number: "111-1111",
          type: ["string"],
        },
      ],
    };

    expect(compareContacts(outlookContact, sipgateContact)).toBe(true);
  });
});

describe("Tests for removeDuplicates", () => {
  test("There are no duplicates", () => {
    const outlookContacts = [
      {
        displayName: "Eric S",
        phones: [
          {
            number: "111-1111",
            type: "businessFax",
          },
        ],
      },
    ];

    const sipgateContacts = [];

    expect(removeDuplicateContacts(outlookContacts, sipgateContacts)).toEqual(
      outlookContacts
    );
  });

  test("Equal names are not count as duplicates", () => {
    const outlookContacts = [
      {
        displayName: "Eric S",
        phones: [
          {
            number: "111-1111",
            type: "businessFax",
          },
        ],
      },
    ];

    const sipgateContacts = [
      {
        name: "Eric S",
        numbers: [
          {
            number: "12343",
            type: "businessFax",
          },
        ],
      },
    ];

    expect(removeDuplicateContacts(outlookContacts, sipgateContacts)).toEqual(
      outlookContacts
    );
  });

  test("Equal numbers are not count as duplicates", () => {
    const outlookContacts = [
      {
        displayName: "Eric S",
        phones: [
          {
            number: "111-1111",
            type: "businessFax",
          },
        ],
      },
    ];

    const sipgateContacts = [
      {
        name: "Hannes",
        numbers: [
          {
            number: "111-1111",
            type: "businessFax",
          },
        ],
      },
    ];

    expect(removeDuplicateContacts(outlookContacts, sipgateContacts)).toEqual(
      outlookContacts
    );
  });

  test("Duplicate is removed", () => {
    const outlookContacts = [
      {
        displayName: "Eric S",
        phones: [
          {
            number: "111-1111",
            type: "businessFax",
          },
        ],
      },
    ];

    const sipgateContacts = [
      {
        name: "Eric S",
        numbers: [
          {
            number: "111-1111",
            type: "number",
          },
        ],
      },
    ];

    expect(removeDuplicateContacts(outlookContacts, sipgateContacts)).toEqual(
      []
    );
  });

  test("Another number was added so it is not a duplicate", () => {
    const outlookContacts = [
      {
        displayName: "Eric S",
        phones: [
          {
            number: "111-1111",
            type: "businessFax",
          },
          {
            number: "222-2222",
            type: "businessFax",
          },
        ],
      },
    ];

    const sipgateContacts = [
      {
        name: "Eric S",
        numbers: [
          {
            number: "111-1111",
            type: "number",
          },
        ],
      },
    ];

    expect(removeDuplicateContacts(outlookContacts, sipgateContacts)).toEqual(
      outlookContacts
    );
  });
});
