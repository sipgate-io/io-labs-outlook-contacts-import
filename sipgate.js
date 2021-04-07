const { sipgateIO, createContactsModule } = require("sipgateio");

const client = sipgateIO("tokenid:token");
const contactsModule = createContactsModule(client);

const getContacts = async () => {
    return await contactsModule.get("SHARED");
};
