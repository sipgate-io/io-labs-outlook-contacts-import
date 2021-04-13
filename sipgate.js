const { sipgateIO, createContactsModule } = require("sipgateio");
const uuid = require("uuid");

const tokenId = process.env.SIPGATE_TOKEN_ID;
const token = process.env.SIPGATE_TOKEN;

if (!tokenId || !token) {
  throw Error("Please provide a valid sipgate TokenID and Token.");
}

const client = sipgateIO({ username: tokenId, password: token });
const contactsModule = createContactsModule(client);

const getContacts = async () => {
  return await contactsModule.get("SHARED");
};

const createNewContact = async (sipgateContact) => {
  const id = uuid.v4();
  await updateContact(id, sipgateContact);
  return id;
};

// The `id` must be a valid UUID
const updateContact = async (id, sipgateContact) => {
  // TODO: release new library version and use `contactsModule.update`
  const contact = {
    ...sipgateContact,
    id,
  };
  await client.put(`/contacts/${id}`, contact);
};

module.exports = {
  getContacts,
  createNewContact,
  updateContact,
};
