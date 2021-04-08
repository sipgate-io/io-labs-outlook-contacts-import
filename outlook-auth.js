const fs = require("fs");
const qs = require("querystring");
const express = require("express");
const axios = require("axios");
const app = express();

const clientId = process.env.AZURE_APP_ID;
const authority = process.env.AZURE_AUTHORITY;
const clientSecret = process.env.AZURE_APP_SECRET;
const scopes = process.env.AZURE_SCOPES;
const redirectUri = process.env.AZURE_OAUTH_REDIRECT_URI;

const parameters = qs.stringify({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: scopes,
});

const URI = `${authority}oauth2/v2.0/authorize?${parameters}`;

function authenticateOutlook(callback) {
  console.log(
    `Please visit the following URI and allow access to your Outlook account: ${URI}`
  );

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

    const tokenJson = {
      token: token,
    };
    const data = JSON.stringify(tokenJson);

    fs.writeFile("token.json", data, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    });

    callback(undefined, token);
    res.send("<h1>Authentication successful!</h1>");
  });

  app.listen(3000, () => console.log("Server listening on port 3000"));
}

module.exports = { authenticateOutlook };
