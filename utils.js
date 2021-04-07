const removeDuplicateContacts = (outlookContacts, sipgateContacts) => {
    const uniqueContacts = [];
    for (const outlookContact of outlookContacts) {
        let isDuplicate = false;
        for (const sipgateContact of sipgateContacts) {
            if (compareContacts(outlookContact, sipgateContact)) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) {
            uniqueContacts.push(outlookContact);
        }
    }
    return uniqueContacts;
};

const compareContacts = (outlookContact, sipgateContact) => {
    if (outlookContact.displayName !== sipgateContact.name) {
        return false;
    }

    for (const outlookNumber of outlookContact.phones) {
        for (const sipgateNumber of sipgateContact.numbers) {
            if (outlookNumber.number === sipgateNumber.number) {
                return true;
            }
        }
    }
    return false;
};

module.exports = { compareContacts, removeDuplicateContacts };
