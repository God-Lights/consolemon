const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "games.json");

function readDB() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({ games: {} }, null, 2));
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}
function writeDB(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

exports.saveGame = (name, players) => {
  const db = readDB();
  db.games[name] = { name, players };
  writeDB(db);
};

exports.loadGame = (name) => {
  const db = readDB();
  return db.games[name] || null;
};

exports.exists = (name) => {
  const db = readDB();
  return !!db.games[name];
};