require("dotenv").config();
const outlookAuth = require("./outlook-auth");
const { OutlookClient } = require("./outlook");
const sipgate = require("./sipgate");

const fs = require("fs");
const util = require("util");

async function run() {
  const readFile = util.promisify(fs.readFile);
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
}

run().catch(console.error);
