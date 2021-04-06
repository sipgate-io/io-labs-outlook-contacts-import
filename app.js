require("dotenv").config();

const qs = require("querystring");
const express = require("express");
const axios = require("axios");
const app = express();

const clientId = process.env.OAUTH_APP_ID;
const authority = process.env.OAUTH_AUTHORITY;
const clientSecret = process.env.OAUTH_APP_SECRET;
const scopes = process.env.OAUTH_SCOPES;
const redirectUri = process.env.OAUTH_REDIRECT_URI;

const parameters = qs.stringify({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: scopes,
});

const URI = `${authority}oauth2/v2.0/authorize?${parameters}`;
console.log(`Please visit the following URI and allow access to your Outlook account: ${URI}`);

let token;

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

  const tokenData = await axios.post(url, parameters, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = tokenData.data;
  token = data.access_token;

  res.sendStatus(200);
});

app.get("/list-contacts", async (req, res) => {
  if (!token) {
    res.sendStatus(401);
    return;
  }

  const response = await axios.get(
    "https://graph.microsoft.com/v1.0/me/contacts",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(response.data);

  res.send(response.data);
});

app.listen(3000, () => console.log("Server listening on port 3000"));