const axios = require("axios");

const baseURL = "https://graph.microsoft.com/v1.0/";

class OutlookClient {
  constructor(token) {
    this.axios = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${token}` },
    });
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
    return contacts;
  }
}

module.exports = {
  OutlookClient,
};
