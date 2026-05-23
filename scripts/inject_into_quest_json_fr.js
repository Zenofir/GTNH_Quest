const fs = require("fs");
const path = require("path");

const FLAT = path.join(__dirname, "../bin/version/284/data_translate_flat.json");
const QUEST_FR = path.join(__dirname, "../bin/version/284/quest_json_fr.json");

const rawTranslations = JSON.parse(fs.readFileSync(FLAT, "utf8"));
const questFr = JSON.parse(fs.readFileSync(QUEST_FR, "utf8"));

// Normaliser les clés : ajouter le padding == manquant
const translations = {};
for (const [id, text] of Object.entries(rawTranslations)) {
    const normalized = id.endsWith("==") ? id : id.endsWith("=") ? id + "=" : id + "==";
    translations[normalized] = text;
    translations[id] = text; // garder l'original aussi
}

let updated = 0;
let notFound = 0;

for (const lineKey in questFr) {
    for (const item of (questFr[lineKey].data || [])) {
        if (!item.quest_id) continue;
        const translation = translations[item.quest_id];
        if (translation) {
            item.data = translation;
            updated++;
        } else {
            notFound++;
        }
    }
}

console.log(`✅ Mises à jour : ${updated}`);
console.log(`⚠️  Sans traduction : ${notFound}`);

fs.writeFileSync(QUEST_FR, JSON.stringify(questFr, null, 2), "utf8");
console.log("✅ quest_json_fr.json mis à jour.");
