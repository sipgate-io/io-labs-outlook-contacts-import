const { sipgateIO, createContactsModule } = require("sipgateio");

const tokenId = process.env.SIPGATE_TOKEN_ID;
const token = process.env.SIPGATE_TOKEN;

const client = sipgateIO({ username: tokenId, password: token });
const contactsModule = createContactsModule(client);

const getContacts = async () => {
  return await contactsModule.get("SHARED");
};

module.exports = {
  getContacts,
};
