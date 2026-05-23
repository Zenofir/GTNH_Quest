const fs = require("fs");
const path = require("path");

const QUEST_DB = "C:/Users/Greg/AppData/Roaming/gdlauncher_carbon/data/instances/GT New Horizons/instance/saves/Nouveau monde/betterquesting/QuestDatabase.json";
const QUEST_JSON_FR = path.join(__dirname, "../bin/version/284/quest_json_fr.json");

// Chargement des traductions françaises
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

// Convertit questIDHigh + questIDLow (en chaînes) en quest_id base64 URL-safe
function toQuestId(highStr, lowStr) {
    try {
        const buf = Buffer.alloc(16);
        buf.writeBigUInt64BE(BigInt.asUintN(64, BigInt(highStr)), 0);
        buf.writeBigUInt64BE(BigInt.asUintN(64, BigInt(lowStr)), 8);
        return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_");
    } catch (e) {
        return null;
    }
}

// Convertit le HTML du web viewer vers le format BetterQuesting
function convertDesc(text) {
    return text
        .replace(/<br\/>/g, "\n")
        .replace(/<br>/g, "\n")
        .replace(/<a[^>]*>(.*?)<\/a>/gs, "$1")
        .replace(/\[url\](.*?)\[\/url\]/gs, "$1")
        .replace(/\[warn\](.*?)\[\/warn\]/gs, "$1");
}

// Lecture brute du fichier (pour préserver la précision des grands entiers)
console.log("Lecture de QuestDatabase.json...");
const raw = fs.readFileSync(QUEST_DB, "utf8");
console.log(`Fichier chargé : ${(raw.length / 1024 / 1024).toFixed(1)} Mo`);

// Marque les valeurs entières de questIDHigh/Low comme chaînes avant JSON.parse
// pour éviter la perte de précision (nombres > 2^53 corrompus par JS Number)
const MARKER = "__BI__";
const preprocessed = raw
    .replace(/"questIDHigh:4":\s*(-?\d+)/g, `"questIDHigh:4":"${MARKER}$1${MARKER}"`)
    .replace(/"questIDLow:4":\s*(-?\d+)/g, `"questIDLow:4":"${MARKER}$1${MARKER}"`);

console.log("Parsing JSON...");
const db = JSON.parse(preprocessed);

const questDb = db["questDatabase:9"];
if (!questDb) {
    console.error("❌ Clé 'questDatabase:9' introuvable dans le fichier !");
    process.exit(1);
}

let updated = 0;
let notFound = 0;
let noDesc = 0;

for (const key in questDb) {
    const entry = questDb[key];
    const highRaw = entry["questIDHigh:4"];
    const lowRaw = entry["questIDLow:4"];
    if (typeof highRaw !== "string" || typeof lowRaw !== "string") continue;

    const highStr = highRaw.replace(new RegExp(MARKER, "g"), "");
    const lowStr = lowRaw.replace(new RegExp(MARKER, "g"), "");

    const questId = toQuestId(highStr, lowStr);
    if (!questId) continue;

    const frDesc = frMap[questId];
    if (!frDesc) { notFound++; continue; }

    const bq = entry["properties:10"]?.["betterquesting:10"];
    if (!bq || !("desc:8" in bq)) { noDesc++; continue; }

    bq["desc:8"] = convertDesc(frDesc);
    updated++;
}

console.log(`✅ Quêtes mises à jour : ${updated}`);
if (notFound > 0) console.log(`⚠️  Sans traduction : ${notFound}`);
if (noDesc > 0) console.log(`ℹ️  Sans desc : ${noDesc}`);

// Sauvegarde avant écrasement
const backupPath = QUEST_DB + ".backup";
if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(QUEST_DB, backupPath);
    console.log("💾 Sauvegarde créée : QuestDatabase.json.backup");
} else {
    console.log("ℹ️  Sauvegarde existante conservée");
}

// Sérialisation + restauration des grands entiers comme nombres bruts
console.log("Sérialisation...");
let output = JSON.stringify(db, null, 2);
const markerRegex = new RegExp(`"${MARKER}(-?\\d+)${MARKER}"`, "g");
output = output.replace(markerRegex, "$1");

fs.writeFileSync(QUEST_DB, output, "utf8");
console.log(`✅ QuestDatabase.json mis à jour (${(output.length / 1024 / 1024).toFixed(1)} Mo)`);
