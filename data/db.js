const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

module.exports = (async ()=>await open({
  filename: "./data/shopee.db",
  driver: sqlite3.Database
}))();
