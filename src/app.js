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
const deleteFile = util.promisify(fs.unlink);

async function run() {
  let outlookToken;
  let outlookContacts;

  const authenticateOutlook = util.promisify(outlookAuth.authenticateOutlook);

  try {
    const data = await readFile("token.json");
    outlookToken = JSON.parse(data).token;
  } catch (error) {
    console.error("Could not find token.json: " + error.message);
    console.log("Reauthenticating Outlook...");
    outlookToken = await authenticateOutlook();
  }

  let outlookClient = new OutlookClient(outlookToken);

  try {
    outlookContacts = await outlookClient.getAllOutlookContacts();
  } catch (error) {
    console.error("Token expired: " + error.message);
    console.log("Reauthenticating Outlook...");
    outlookToken = await authenticateOutlook();
    outlookClient = new OutlookClient(outlookToken);
    outlookContacts = await outlookClient.getAllOutlookContacts();
  }

  let mapping = {};
  if (await fileExists("mapping.json")) {
    const fileContents = await readFile("mapping.json");
    mapping = JSON.parse(fileContents);
  }

  const promises = outlookContacts.map(async (outlookContact) => {
    if (outlookContact.id in mapping) {
      let sipgateId = mapping[outlookContact.id];
      console.log(`Contact already exists: ${outlookContact.displayName}`);
      const sipgateContact = conversion.outlookContactToSipgateContact(
        outlookContact
      );
      try {
        await sipgate.updateContact(sipgateId, sipgateContact);
      } catch (error) {
        console.log(
          `failed to update contact ${sipgateContact.name}: ${error.message}`
        );
      }
    } else {
      console.log(
        `Importing new Outlook contact: ${outlookContact.displayName}`
      );
      const sipgateContact = conversion.outlookContactToSipgateContact(
        outlookContact
      );
      let sipgateId = await sipgate.createNewContact(sipgateContact);

      mapping[outlookContact.id] = sipgateId;
    }
  });
  await Promise.all(promises);

  await writeFile("mapping.json", JSON.stringify(mapping, null, 4));
}

run().catch(console.error);
