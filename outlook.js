const axios = require("axios");
const outlookAuth = require("./outlook-auth");

const baseURL = "https://graph.microsoft.com/v1.0/";

class OutlookClient {
  constructor(token) {
    this.token = token;
    this.axios = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  async getContactPhotos(contacts) {
    for (let contact of contacts) {
      try {
        await this.axios
          .get(
            `/me/contactfolders/${contact.parentFolderId}/contacts/${contact.id}/photo/$value`
          )
          .then((photo) => (contact.photo = photo.data));
      } catch (error) {
        console.log(`No photo found for contact ${contact.id}! Skipping...`);
      }
    }
    return contacts;
  }

  async getAllOutlookContacts() {
    const response = (await this.axios.get("/me/contactFolders")).data.value;
    const folderIds = response.map((folder) => folder.id);
    let contacts = [];

    contacts.push(...(await this.axios.get(`/me/contacts`)).data.value);

    for (const folderId of folderIds) {
      contacts.push(
        ...(await this.axios.get(`/me/contactFolders/${folderId}/contacts`))
          .data.value
      );
    }
    contacts = await this.getContactPhotos(contacts);
    return contacts;
  }
}

module.exports = {
  OutlookClient,
};
