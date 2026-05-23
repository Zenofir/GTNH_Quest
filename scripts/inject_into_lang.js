const fs = require("fs");
const path = require("path");

const LANG_FILE = "C:/Users/Greg/AppData/Roaming/gdlauncher_carbon/data/instances/GT New Horizons/instance/config/txloader/load/betterquesting/lang/fr_FR.lang";
const QUEST_JSON_FR = path.join(__dirname, "../bin/version/284/quest_json_fr.json");

// Charger les traductions françaises
const questFr = JSON.parse(fs.readFileSync(QUEST_JSON_FR, "utf8"));
const frMap = {};
for (const lineKey in questFr) {
    for (const quest of (questFr[lineKey].data || [])) {
        if (quest.quest_id && quest.data) {
            // Supprimer le padding base64 pour correspondre au format du lang file
            const langId = quest.quest_id.replace(/=/g, "");
            frMap[langId] = String(quest.data);
        }
    }
}
console.log(`📂 ${Object.keys(frMap).length} traductions chargées`);

// Convertir le format FR vers le format lang
// - \n → %n
// - <br/> ou <br> → %n
// - <a href="...">texte</a> → texte
// - [url]texte[/url] → texte
// - [warn]texte[/warn] → texte
function toLangFormat(text) {
    return text
        .replace(/<br\/>/g, "%n")
        .replace(/<br>/g, "%n")
        .replace(/<a[^>]*>(.*?)<\/a>/gs, "$1")
        .replace(/\[url\](.*?)\[\/url\]/gs, "$1")
        .replace(/\[warn\](.*?)\[\/warn\]/gs, "$1")
        .replace(/\n/g, "%n");
}

// Lire le lang file ligne par ligne
const raw = fs.readFileSync(LANG_FILE, "utf8");
const lines = raw.split("\n");

let updated = 0;
let notFound = 0;

const newLines = lines.map(line => {
    // Chercher les lignes de desc: betterquesting.quest.ID.desc=...
    const match = line.match(/^(betterquesting\.quest\.)([^.]+)(\.desc=)(.*)/);
    if (!match) return line;

    const prefix = match[1];
    const langId = match[2];
    const suffix = match[3];
    // const currentDesc = match[4];

    const frDesc = frMap[langId];
    if (!frDesc) {
        notFound++;
        return line;
    }

    const converted = toLangFormat(frDesc);
    updated++;
    return prefix + langId + suffix + converted;
});

console.log(`✅ Descriptions mises à jour : ${updated}`);
console.log(`⚠️  Sans traduction : ${notFound}`);

// Sauvegarde
const backupPath = LANG_FILE + ".backup";
if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(LANG_FILE, backupPath);
    console.log("💾 Sauvegarde créée : fr_FR.lang.backup");
}

fs.writeFileSync(LANG_FILE, newLines.join("\n"), "utf8");
console.log("✅ fr_FR.lang mis à jour !");
