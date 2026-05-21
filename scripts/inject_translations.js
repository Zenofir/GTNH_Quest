const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "../bin/version/284");

const rawTranslate = JSON.parse(fs.readFileSync(path.join(BASE, "data_translate.json"), "utf8"));
const questJson = JSON.parse(fs.readFileSync(path.join(BASE, "quest_json_fr.json"), "utf8"));

// Détection du format :
// Format A (ancien) : [{ "data": ["text1", "text2", ...] }]  — mapping positionnel, inutilisable sans clés
// Format B (nouveau array) : [{ quest_id: traduction, ... }]  — mapping direct dans un tableau
// Format C (nouveau flat)  : { quest_id: traduction, ... }    — mapping direct

let translationMap = {};

if (!Array.isArray(rawTranslate)) {
    // Format C
    translationMap = rawTranslate;
    console.log(`📂 Format C (objet plat) — ${Object.keys(translationMap).length} entrées`);
} else if (rawTranslate.length > 0 && typeof rawTranslate[0] === "object" && !Array.isArray(rawTranslate[0]) && !rawTranslate[0].data) {
    // Format B : tableau contenant un objet { quest_id: traduction }
    translationMap = rawTranslate[0];
    console.log(`📂 Format B (tableau d'objet) — ${Object.keys(translationMap).length} entrées`);
} else {
    console.error("❌ Format non reconnu ou ancien format positionnel — abandon.");
    console.error("   Clés de rawTranslate[0]:", Object.keys(rawTranslate[0] || {}).slice(0, 5));
    process.exit(1);
}

let updated = 0;
let notFound = 0;

for (const lineKey in questJson) {
    const quests = questJson[lineKey].data;
    if (!quests) continue;
    for (const quest of quests) {
        if (quest.quest_id && translationMap[quest.quest_id] !== undefined) {
            quest.data = translationMap[quest.quest_id];
            updated++;
        } else if (quest.quest_id) {
            notFound++;
        }
    }
}

console.log(`✅ Quêtes mises à jour : ${updated}`);
if (notFound > 0) console.warn(`⚠️  Sans traduction dans ce fichier : ${notFound}`);

fs.writeFileSync(
    path.join(BASE, "quest_json_fr.json"),
    JSON.stringify(questJson, null, 2),
    "utf8"
);
console.log("✅ quest_json_fr.json mis à jour !");
