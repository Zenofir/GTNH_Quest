const fs = require("fs");
const path = require("path");

const QUEST_JSON_FR = path.join(__dirname, "../bin/version/284/quest_json_fr.json");
const QUESTS_DIR = "C:/Users/Greg/AppData/Roaming/gdlauncher_carbon/data/instances/GT New Horizons/instance/config/betterquesting/DefaultQuests/Quests";

// Construire la map quest_id -> description FR
const questFr = JSON.parse(fs.readFileSync(QUEST_JSON_FR, "utf8"));
const frMap = {};
for (const lineKey in questFr) {
    for (const quest of (questFr[lineKey].data || [])) {
        if (quest.quest_id && quest.data) {
            frMap[quest.quest_id] = String(quest.data);
        }
    }
}
console.log(`📂 ${Object.keys(frMap).length} traductions chargées`);

// Convertir HTML du web viewer vers format BetterQuesting
function convertDesc(text) {
    return text
        .replace(/<br\/>/g, "\n")
        .replace(/<br>/g, "\n")
        .replace(/<a[^>]*>(.*?)<\/a>/gs, "$1")
        .replace(/\[url\](.*?)\[\/url\]/gs, "$1")
        .replace(/\[warn\](.*?)\[\/warn\]/gs, "$1");
}

let updated = 0;
let notFound = 0;
let skipped = 0;

// Parcourir tous les dossiers de lignes de quêtes
const questLineDirs = fs.readdirSync(QUESTS_DIR);
for (const questLineDir of questLineDirs) {
    const questLinePath = path.join(QUESTS_DIR, questLineDir);
    if (!fs.statSync(questLinePath).isDirectory()) continue;

    const files = fs.readdirSync(questLinePath);
    for (const file of files) {
        if (!file.endsWith(".json")) continue;

        // Extraire le quest_id depuis le nom de fichier (après le premier -)
        const base = file.replace(".json", "");
        const dashIdx = base.indexOf("-");
        if (dashIdx === -1) { skipped++; continue; }
        const questId = base.slice(dashIdx + 1);

        const frDesc = frMap[questId];
        if (!frDesc) { notFound++; continue; }

        const filePath = path.join(questLinePath, file);
        const questData = JSON.parse(fs.readFileSync(filePath, "utf8"));

        // Vérifier que la structure est celle attendue
        const bq = questData?.["properties:10"]?.["betterquesting:10"];
        if (!bq || !("desc:8" in bq)) { skipped++; continue; }

        bq["desc:8"] = convertDesc(frDesc);
        fs.writeFileSync(filePath, JSON.stringify(questData, null, 2), "utf8");
        updated++;
    }
}

console.log(`✅ Quêtes mises à jour dans l'instance : ${updated}`);
if (notFound > 0) console.log(`⚠️  Sans traduction : ${notFound}`);
if (skipped > 0) console.log(`ℹ️  Ignorés (pas de desc) : ${skipped}`);
