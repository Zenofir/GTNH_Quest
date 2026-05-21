const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "../bin/version/284");

const questEn = JSON.parse(fs.readFileSync(path.join(BASE, "quest_json_en.json"), "utf8"));
const questFr = JSON.parse(fs.readFileSync(path.join(BASE, "quest_json_fr.json"), "utf8"));

// Construire la map quest_id -> description FR actuelle (pour les garder si correctes)
const frMap = {};
for (const lineKey in questFr) {
    for (const quest of (questFr[lineKey].data || [])) {
        if (quest.quest_id) frMap[quest.quest_id] = quest.data;
    }
}

// Format attendu par Split Out : { "data": [{ quest_id, data }, ...] }
const items = [];
for (const lineKey in questEn) {
    for (const quest of (questEn[lineKey].data || [])) {
        if (quest.quest_id && quest.data) {
            items.push({ quest_id: quest.quest_id, data: quest.data });
        }
    }
}

fs.writeFileSync(
    path.join(BASE, "data_en_full.json"),
    JSON.stringify({ data: items }, null, 2),
    "utf8"
);

console.log(`✅ data_en_full.json créé avec ${items.length} quêtes`);
console.log(`   Format : { "data": [{ quest_id, data }, ...] } — compatible Split Out`);
