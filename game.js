const storage = require("./storage");

class Game {
  constructor(name, players = {}) {
    this.name = name;
    this.players = players;
  }

  static create(name) {
    if (storage.exists(name)) throw new Error(`이미 존재하는 게임: ${name}`);
    const g = new Game(name, {});
    g.save();
    return g;
  }

  static load(name) {
    const data = storage.loadGame(name);
    if (!data) throw new Error(`게임 '${name}' 을 찾을 수 없습니다.`);
    return new Game(data.name, data.players);
  }

  save() {
    storage.saveGame(this.name, this.players);
  }
  
  reset() {
    
  }

  addPlayer(playerName) {
    if (this.players[playerName]) throw new Error(`이미 존재하는 플레이어: ${playerName}`);
    this.players[playerName] = { level: 1, hp: 100, exp: 0, atk: 10, def: 15 };
    this.save();
  }
}

module.exports = Game;