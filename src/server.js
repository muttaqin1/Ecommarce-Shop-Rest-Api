const path = require("path");
require('dotenv').config({ path: path.join(__dirname, `/../.env`) });
const {connection} = require('./database')
const app = require("./app");

const {
  server: { port, host },
} = require("./config");

app.listen(port, host, () => {
  console.log(`server is running on port: ${port}`);
  connection()
});
