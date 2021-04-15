const fs = require("fs");
const qs = require("querystring");
const express = require("express");
const axios = require("axios");
const app = express();
const util = require("util");

const writeFile = util.promisify(fs.writeFile);

const clientId = process.env.AZURE_APP_ID;
const authority = process.env.AZURE_AUTHORITY;
const clientSecret = process.env.AZURE_APP_SECRET;
const scopes = process.env.AZURE_SCOPES;
const redirectUri = process.env.AZURE_OAUTH_REDIRECT_URI;

if (!clientId) {
  throw Error("Please provide a valid Application ID.");
}

if (!authority) {
  throw Error("Please provide a valid Microsoft Graph Authority.");
}

if (!clientSecret) {
  throw Error("Please provide a valid client secret.");
}

if (!scopes) {
  throw Error("Please provide a valid Microsoft Graph scope.");
}

if (!redirectUri) {
  throw Error("Please provide a valid Redirect URI.");
}

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

  const server = app.listen(3000, () =>
    console.log("Server listening on port 3000")
  );

  app.get("/auth/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
      console.error("The Microsoft API didn't respond with a `code`.");
      return;
    }

    const parameters = qs.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      scope: scopes,
      grant_type: "authorization_code",
      code,
    });
    const url = `${authority}oauth2/v2.0/token`;

    const tokenResponse = await axios.post(url, parameters, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const refreshToken = tokenResponse.data.refresh_token;

    res.send("<h1>Authentication successful!</h1>");
    server.close();

    callback(undefined, refreshToken);
  });
}

async function refreshAndSaveToken(refreshToken) {
  const parameters = qs.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const url = `${authority}oauth2/v2.0/token`;

  let tokenData;
  try {
    const tokenResponse = await axios.post(url, parameters, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    tokenData = tokenResponse.data;
  } catch (error) {
    throw Error(
      `invalid refresh token, please remove "token.json": got status code ${error.response.status}`
    );
  }

  const fileContent = JSON.stringify({ refreshToken: tokenData.refresh_token });
  await writeFile("token.json", fileContent);
  console.log("Saving token to token.json...");

  return tokenData.access_token;
}

module.exports = {
  authenticateOutlook,
  refreshAndSaveToken,
};
