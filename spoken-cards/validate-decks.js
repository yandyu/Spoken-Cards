#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;
const dataDir = path.join(root, "data");
const context = { window: {} };
vm.createContext(context);

function loadScript(file) {
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
}

loadScript(path.join(dataDir, "toc.js"));
for (let topic = 1; topic <= 96; topic += 1) {
  loadScript(path.join(dataDir, `deck-topic-${String(topic).padStart(2, "0")}.js`));
}

const errors = [];
const decks = context.window.SEED_DECKS || [];
const tocTopics = (context.window.BOOK_TOC || []).flatMap((part) => part.topics);
const required = ["scene", "prompt", "chunk", "note", "example"];
const teachingText = /问对方|别说|别用|不要说|句尾补|开口铺垫|只重读|翻译成|评价某事/;

if (tocTopics.length !== 96) errors.push(`目录应有 96 个 Topic，实际为 ${tocTopics.length}`);
if (decks.length !== 96) errors.push(`卡组应有 96 个 Topic，实际为 ${decks.length}`);

const deckByTopic = new Map();
for (const deck of decks) {
  if (deckByTopic.has(deck.topic)) errors.push(`Topic ${deck.topic} 重复`);
  deckByTopic.set(deck.topic, deck);

  if (!Array.isArray(deck.cards) || !deck.cards.length) {
    errors.push(`Topic ${deck.topic} 没有卡片`);
    continue;
  }

  const chunks = new Set();
  deck.cards.forEach((card, index) => {
    const label = `Topic ${deck.topic} / Card ${index + 1}`;
    for (const field of required) {
      if (typeof card[field] !== "string" || !card[field].trim()) {
        errors.push(`${label} 缺少 ${field}`);
      }
    }
    if (teachingText.test(card.prompt || "")) errors.push(`${label} 的 prompt 含教学指令`);
    const chunkKey = (card.chunk || "").trim().toLocaleLowerCase("en");
    if (chunks.has(chunkKey)) errors.push(`${label} 的 chunk 在本 Topic 内重复`);
    chunks.add(chunkKey);
  });
}

for (let topic = 1; topic <= 96; topic += 1) {
  if (!deckByTopic.has(topic)) errors.push(`缺少 Topic ${topic} 卡组`);
}

const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const indexDeckRefs = [...indexHtml.matchAll(/data\/deck-topic-(\d{2})\.js\?v=(\d+)/g)];
const cacheDeckRefs = [...serviceWorker.matchAll(/data\/deck-topic-(\d{2})\.js\?v=(\d+)/g)];

if (indexDeckRefs.length !== 96) errors.push(`index.html 应加载 96 个卡组，实际为 ${indexDeckRefs.length}`);
if (cacheDeckRefs.length !== 96) errors.push(`sw.js 应缓存 96 个卡组，实际为 ${cacheDeckRefs.length}`);

const indexTopics = indexDeckRefs.map((match) => Number(match[1]));
const cacheTopics = cacheDeckRefs.map((match) => Number(match[1]));
const expectedTopics = Array.from({ length: 96 }, (_, index) => index + 1);
if (JSON.stringify(indexTopics) !== JSON.stringify(expectedTopics)) errors.push("index.html 的卡组顺序或编号不完整");
if (JSON.stringify(cacheTopics) !== JSON.stringify(expectedTopics)) errors.push("sw.js 的卡组顺序或编号不完整");

const indexVersions = new Set(indexDeckRefs.map((match) => match[2]));
const cacheVersions = new Set(cacheDeckRefs.map((match) => match[2]));
const cacheNameVersion = serviceWorker.match(/spoken-cards-v(\d+)/)?.[1];
if (indexVersions.size !== 1 || cacheVersions.size !== 1) errors.push("卡组资源版本号不一致");
if (indexVersions.values().next().value !== cacheNameVersion || cacheVersions.values().next().value !== cacheNameVersion) {
  errors.push("index.html、sw.js 资源参数与缓存版本号不一致");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const cardCount = decks.reduce((total, deck) => total + deck.cards.length, 0);
console.log(`校验通过：${decks.length} 个 Topic，${cardCount} 张卡片，网页与离线缓存均已完整接入。`);
