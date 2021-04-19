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
const authenticateOutlook = util.promisify(outlookAuth.authenticateOutlook);

async function run() {
  let outlookRefreshToken;

  try {
    const data = await readFile("token.json");
    const tokenData = JSON.parse(data);
    outlookRefreshToken = tokenData.refreshToken;
  } catch (error) {
    console.error("Could not find token.json: " + error.message);
    console.log("Authenticating Outlook...");
    outlookRefreshToken = await authenticateOutlook();
  }

  const accessToken = await outlookAuth.refreshAndSaveToken(
    outlookRefreshToken
  );
  let outlookClient = new OutlookClient(accessToken);

  let mapping = {};
  if (await fileExists("mapping.json")) {
    const fileContents = await readFile("mapping.json");
    mapping = JSON.parse(fileContents);
  }

  let nContactsUpdated = 0;
  let nContactsImported = 0;

  let outlookContacts = await outlookClient.getAllOrgContacts();

  const promises = outlookContacts.map(async (outlookContact) => {
    const sipgateContact = conversion.outlookOrgContactToSipgateContact(outlookContact);

    if (outlookContact.id in mapping) {
      let sipgateId = mapping[outlookContact.id];
      console.log(`Contact already exists: ${outlookContact.displayName}`);
      try {
        await sipgate.updateContact(sipgateId, sipgateContact);
      } catch (error) {
        console.log(
          `failed to update contact ${sipgateContact.name}: ${error.message}`
        );
      }

      nContactsUpdated += 1;
    } else {
      console.log(
        `Importing new Outlook contact: ${outlookContact.displayName}`
      );
      let sipgateId = await sipgate.createNewContact(sipgateContact);

      mapping[outlookContact.id] = sipgateId;
      nContactsImported += 1;
    }
  });
  await Promise.all(promises);

  console.log();
  console.log(`${nContactsImported} contacts were imported.`);
  console.log(`${nContactsUpdated} contacts already existed, updated them.`);

  await writeFile("mapping.json", JSON.stringify(mapping, null, 4));
}

run().catch(console.error);
