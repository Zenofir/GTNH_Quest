const fs = require("fs");
const BASE = "d:/VsCode/GTNH_Quest/bin/version/284";

const dt = JSON.parse(fs.readFileSync(BASE + "/data_translate.json", "utf8"));
const fr = JSON.parse(fs.readFileSync(BASE + "/quest_json_fr.json", "utf8"));
const en = JSON.parse(fs.readFileSync(BASE + "/quest_json_en.json", "utf8"));

const translationMap = Array.isArray(dt) ? dt[0] : dt;
const enMap = {};
for (const k in en) for (const q of (en[k].data || [])) if (q.quest_id) enMap[q.quest_id] = String(q.data || "");

// Quêtes non couvertes par le dernier passage (pas dans translationMap)
// et dont la desc FR est différente de EN (donc elles ont une mauvaise trad du 1er passage)
const wrongOnes = [];
for (const k in fr) {
    for (const q of (fr[k].data || [])) {
        if (!q.quest_id) continue;
        if (q.quest_id in translationMap) continue; // couvert = OK
        const enText = enMap[q.quest_id];
        if (!enText) continue;
        const frText = String(q.data || "");
        if (frText !== enText) {
            wrongOnes.push({ id: q.quest_id, title: String(q.title || ""), frSnippet: frText.slice(0, 60), enSnippet: enText.slice(0, 60) });
        }
    }
}

console.log("Quêtes avec mauvaise traduction résiduelle:", wrongOnes.length);
wrongOnes.slice(0, 5).forEach(q => {
    console.log("\nID:", q.id, "|", q.title);
    console.log("EN:", q.enSnippet);
    console.log("FR:", q.frSnippet);
});

// Exporter les quest_ids manquants pour re-traduction ciblée
const missingForRetranslation = {};
for (const q of wrongOnes) {
    missingForRetranslation[q.id] = enMap[q.id];
}
fs.writeFileSync(BASE + "/data_missing_wrong.json", JSON.stringify({ data: Object.entries(missingForRetranslation).map(([quest_id, data]) => ({ quest_id, data })) }, null, 2), "utf8");
console.log("\n✅ data_missing_wrong.json créé avec", wrongOnes.length, "quêtes à re-traduire.");
