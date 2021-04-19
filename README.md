# Import Outlook contacts to your sipgate account

In this example project we will import contacts from Outlook using the [sipgateio](https://github.com/sipgate-io/sipgateio-node) library as shown on our [Outlook import solutions page](https://www.sipgate.io/solutions/outlook).

This README is a brief setup. For a more in-depth description take a look at our [blog post on Outlook contact imports](https://www.sipgate.io/blog/outlook-contacts-import).

## What is sipgate.io?

[sipgate.io](https://www.sipgate.io/) is a collection of APIs, which enables sipgate's customers to build flexible integrations matching their individual needs.
Among other things, it provides interfaces for sending and receiving text messages or faxes, monitoring the call history, as well as initiating and manipulating calls.
In this tutorial we will use sipgate.io's contact API to import contacts from your company's Microsoft Outlook address book.

## In this example

The script in this repository imports your shared Microsoft Outlook contacts into your sipgate account.

Keep in mind that this is a one-way sync. It will only import your contacts to sipgate, not the other way around.

The _Microsoft Graph API_ is used to fetch all existing contacts which can then be mapped to the format required by sipgate. Afterwards those contacts are imported into sipgate using the [sipgate.io REST Api](https://www.sipgate.io/rest-api).

**Prerequisite:** You need `npm` and Node.js installed on your machine and an Office 365 business account. 

## Getting started

To be able to launch this example, navigate to a directory where you want the example service to be stored. In a terminal, you can clone this repository from GitHub and install all required dependencies using `npm install`.

```bash
git clone https://github.com/sipgate-io/io-labs-outlook-contacts-import.git
cd io-labs-outlook-contacts-import
npm install
```

## Execution

Make sure to set the Microsoft Azure OAuth2 credentials and the credentials of your sipgate account (token and token ID. See [Personal Access Token documentation](https://www.sipgate.io/rest-api/authentication#personalAccessToken) on sipgate.io) either in a `.env` file or by providing them as temporary environment variables at program execution:

```bash
SIPGATE_TOKEN=<token> \
SIPGATE_TOKEN_ID=<tokenId> \
AZURE_APP_ID=... \
AZURE_AUTHORITY=... \
AZURE_APP_SECRET=... \
AZURE_SCOPES=... \
AZURE_OAUTH_REDIRECT_URI=... \
npm start
```

You should now be able to import your contacts from your Outlook contact book into your sipgate account.
