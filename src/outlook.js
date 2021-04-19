const axios = require("axios");
const qs = require("querystring");

const baseURL = "https://graph.microsoft.com/v1.0/";

const authority = process.env.AZURE_AUTHORITY;

class OutlookClient {
  constructor(accessToken) {
    this.token = accessToken;
    this.axios = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  async getAllOrgContacts() {
    return (await this.axios.get(`/contacts`)).data.value;
  }
}

module.exports = {
  OutlookClient,
};
