require("dotenv").config();
const outlook = require("./outlook-auth");
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
    const authenticateOutlook = util.promisify(outlook.authenticateOutlook);

    token = await authenticateOutlook();
  }

  console.log(token);

  // outlookClient = axios.create({baseURL, headers: {Authorization: `Bearer ${token}`}})
}

async function getAllOutlookContacts() {
  const response = (await outlookClient.get("/me/contactFolders")).data.value;
  const folderIds = response.map((folder) => folder.id);
  let contacts = [];

  contacts.push(...(await outlookClient.get(`/me/contacts`)).data.value);

  for (folderId of folderIds) {
    contacts.push(
      ...(await outlookClient.get(`/me/contactFolders/${folderId}/contacts`))
        .data.value
    );
  }
  return contacts;
}

run().catch();
