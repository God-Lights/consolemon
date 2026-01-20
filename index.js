const readline = require("readline");
const Game = require("./game");

const creature = {
  ed: {
    name: "에드💫의 백카리오🎖️",
    hp: 50,
    atk: 8,
    def: 10,
  },
  lich: {
    name: "리치🧚‍♀️의 디안시💎",
    hp: 50,
    atk: 8,
    def: 10,
  },
};

let currentBattle = {
  p1: null,
  p2: null,
};

let currentGame = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

function help() {
  console.log(`
명령어:
  game make <name>
  game load <name>
  game info
  player add <playerName>
  player wild <playerName>
  battle
  exit
  help
  `);
}

help();
rl.prompt();

rl.on("line", (line) => {
  const input = line.trim();
  if (!input) return rl.prompt();

  const [a, b, c] = input.split(" ");

  try {
    if (input === "help") {
      help();
    } else if (input === "exit") {
      if (currentGame) currentGame.save();
      rl.close();
      return;
    } else if (a === "game" && b === "make" && c) {
      currentGame = Game.create(c);
      console.log(`✅ 게임 생성: ${currentGame.name}`);
    } else if (a === "game" && b === "load" && c) {
      currentGame = Game.load(c);
      console.log(`✅ 게임 로드: ${currentGame.name}`);
    } else if (a === "game" && b === "info") {
      if (!currentGame) throw new Error("먼저 game load/make 하세요.");
      console.log(JSON.stringify({ name: currentGame.name, players: currentGame.players }, null, 2));
    } else if(a === "game" && b === "reset" && c) {
      if (!currentGame) throw new Error("먼저 game load/make 하세요.");
      currentGame.reset();
      currentGame = null;
    } else if (a === "player" && b === "add" && c) {
      if (!currentGame) throw new Error("먼저 game load/make 하세요.");
      currentGame.addPlayer(c);
      console.log(`✅ 플레이어 추가: ${c}`);
    } else if (a === "player" && b === "wild" && c) {
      if (!currentGame) throw new Error("먼저 game load/make 하세요.");
      wildEncounter(c);
    } else if (a === "player" && b === "heal" && c) { currentGame.players[c].hp = setMaxHP(currentGame.players[c].level); console.log("피 회복 완료!"); } else if (input === "battle") {
      if (!currentBattle.p1 || !currentBattle.p2) throw new Error("먼저 player wild <playerName> 으로 야생을 만나세요.");
      wildBattle();
    } else {
      console.log("❌ 알 수 없는 명령어. help 입력해봐.");
    }
  } catch (e) {
    console.log("⚠️", e.message);
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log("bye!");
  process.exit(0);
});

function setMaxExp(lvl) {
  if (lvl <= 1) return 100;
  const base = 100;
  const growth = 1.414;
  return Math.floor(base * Math.pow(growth, lvl - 1));
}

function setMaxHP(lvl) {
  if (lvl <= 1) return 100;
  const base = 100;
  const growth = 1.141;
  return Math.floor(base * Math.pow(growth, lvl - 1));
}

function wildEncounter(playerName) {
  if (!currentGame.players[playerName]) throw new Error(`플레이어가 없음: ${playerName} (player add 먼저)`);


  const wildmon = cloneCreature(randomJSON(creature));

  console.log(`앗! 야생의 ${wildmon.name}이 출몰했다! 'battle' 을 입력해서 싸우세요!`);
  currentBattle.p1 = currentGame.players[playerName];
  currentBattle.p2 = wildmon;
}

function wildBattle() {
  const p1 = currentBattle.p1;
  const p2 = currentBattle.p2;

  const p1Damage = calcDamage(p1.atk, p2.def);
  const p2Damage = calcDamage(p2.atk, p1.def);

  console.log(`플레이어는 ${p2.name}에게 ${p1Damage} 데미지!`);
  p2.hp -= p1Damage;

  if (p2.hp <= 0) {
    console.log(`${p2.name} 격파!`);
    let upExp = Math.floor(Math.random() * 40)+10
    p1.exp += upExp;
    console.log(`${upExp}만큼의 경험치 획득!`);
      if(p1.exp >= setMaxExp(p1.level)) { 
          p1.exp -= setMaxExp(p1.level)
      p1.level++
      console.log(`레벨업! 현재 레벨:${p1.level}`)
      }
    currentBattle.p2 = null;
    currentBattle.p1 = null;
    return;
  } else {
    console.log(`상대방 HP: ${p2.hp}/50`);
  }

  console.log(`${p2.name} 반격! 플레이어에게 ${p2Damage} 데미지!`);
  p1.hp -= p2Damage;
  if (p1.hp <= 0) {
    console.log(`졌다!`);
    currentBattle.p2 = null;
    currentBattle.p1 = null;
    return;
  } else {
    console.log(`당신의 HP: ${p1.hp}/${setMaxHP(p1.level)}`);
  }
}

function calcDamage(atk, def) {

  const variance = Math.floor(Math.random() * (atk + 6)); // 0 ~ atk+5
  const raw = atk + variance - Math.floor(def * 0.6);
  return Math.max(1, raw);
}

function randomJSON(data) {
  const keys = Object.keys(data);
  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomIndex];
  return data[randomKey];
}

function cloneCreature(mon) {

  return JSON.parse(JSON.stringify(mon));
}