require("dotenv").config();

const sipgate = require("./sipgate");

const fs = require("fs");
const util = require("util");

const deleteFile = util.promisify(fs.unlink);
const fileExists = util.promisify(fs.exists);

async function run() {
  if (await fileExists("./mapping.json")) {
    console.log("Deleting mapping.json.");
    await deleteFile("./mapping.json");
  }
  await sipgate.deleteAllSharedContacts();
}

run().catch(console.error);
