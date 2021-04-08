require("dotenv").config();
const outlookAuth = require("./outlook-auth");
const { OutlookClient } = require("./outlook");
const sipgate = require("./sipgate");
const conversion = require("./contact-conversion");

const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const fileExists = util.promisify(fs.exists);

async function run() {
  let token;

  try {
    const data = await readFile("token.json");
    token = JSON.parse(data).token;
  } catch {
    const authenticateOutlook = util.promisify(outlookAuth.authenticateOutlook);
    token = await authenticateOutlook();
  }

  const outlookClient = new OutlookClient(token);
  const outlookContacts = await outlookClient.getAllOutlookContacts();

  let mapping = {};
  if (await fileExists("mapping.json")) {
    const fileContents = await readFile("mapping.json");
    mapping = JSON.parse(fileContents);
  }

  for (outlookContact of outlookContacts) {
    if (outlookContact.id in mapping) {
      let sipgateId = mapping[outlookContact.id];
      console.log(`Contact already exists: ${sipgateId}`);
      const sipgateContact = conversion.outlookContactToSipgateContact(
        outlookContact
      );
      sipgate.updateContact(sipgateId, sipgateContact);
    } else {
      console.log(`Found new contact`);
      const sipgateContact = conversion.outlookContactToSipgateContact(
        outlookContact
      );
      let sipgateId = await sipgate.createNewContact(sipgateContact);

      mapping[outlookContact.id] = sipgateId;
    }
  }

  await writeFile("mapping.json", JSON.stringify(mapping, null, 4));
}

run().catch(console.error);
