require("dotenv").config();

const qs = require("querystring");
const express = require("express");
const axios = require("axios");
const app = express();

const clientId = process.env.AZURE_APP_ID;
const authority = process.env.AZURE_AUTHORITY;
const clientSecret = process.env.AZURE_APP_SECRET;
const scopes = process.env.AZURE_SCOPES;
const redirectUri = process.env.AZURE_OAUTH_REDIRECT_URI;

const baseURL = "https://graph.microsoft.com/v1.0/"

const parameters = qs.stringify({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: scopes,
});

const URI = `${authority}oauth2/v2.0/authorize?${parameters}`;
console.log(`Please visit the following URI and allow access to your Outlook account: ${URI}`);

let outlookClient

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  const parameters = qs.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
    code,
  });
  const url = `${authority}oauth2/v2.0/token`;

  const tokenResponse = await axios.post(url, parameters, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const tokenData = tokenResponse.data;
  token = tokenData.access_token;
  outlookClient = axios.create({baseURL, headers: {Authorization: `Bearer ${token}`}})

  res.send("<h1>Authentication successful!</h1>");
});

async function getAllOutlookContacts() {
  const response = (await outlookClient.get("/me/contactFolders")).data.value
  const folderIds = response.map(folder => folder.id)
  let contacts = []

  contacts.push(...(await outlookClient.get(`/me/contacts`)).data.value)

  for (folderId of folderIds){
    contacts.push(...(await outlookClient.get(`/me/contactFolders/${folderId}/contacts`)).data.value)
  }
  return contacts
}

app.listen(3000, () => console.log("Server listening on port 3000"));