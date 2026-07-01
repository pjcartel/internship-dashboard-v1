const axios = require("axios");
require("dotenv").config();

const ODOO_URL = process.env.ODOO_URL;
const ODOO_DB = process.env.ODOO_DB;
const ODOO_USERNAME = process.env.ODOO_USERNAME;
const ODOO_API_KEY = process.env.ODOO_API_KEY;

async function authenticate() {
  const response = await axios.post(
    `${ODOO_URL}/jsonrpc`,
    {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "common",
        method: "authenticate",
        args: [
          ODOO_DB,
          ODOO_USERNAME,
          ODOO_API_KEY,
          {}
        ]
      },
      id: 1
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.result;
}

exports.authenticate = authenticate;