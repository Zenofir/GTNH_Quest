const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "../bin/version/284/data_translate.json");
const OUTPUT = path.join(__dirname, "../bin/version/284/data_translate_flat.json");

// Extraction basée sur les positions des clés base64 — résiste aux guillemets non échappés
function extractByKeyPositions(str) {
    // Les clés sont toujours des base64 URL-safe : A-Za-z0-9+/=_-
    const KEY_RE = /"([A-Za-z0-9+/=_\-]{10,})"[ \t]*:[ \t]*"/g;
    const result = {};
    const matches = [];
    let m;
    while ((m = KEY_RE.exec(str)) !== null) {
        matches.push({ key: m[1], valueStart: m.index + m[0].length });
    }
    for (let i = 0; i < matches.length; i++) {
        const start = matches[i].valueStart;
        const end = i + 1 < matches.length
            ? matches[i + 1].index  // avant la prochaine clé
            : str.length;
        // La valeur brute va de start jusqu'à end, on cherche la dernière " avant end
        let raw = str.substring(start, end);
        // Retirer le suffixe : `",` ou `"\n` ou `"}` ou `"` final
        raw = raw.replace(/"\s*[,}]?\s*$/, "").replace(/"$/, "");
        result[matches[i].key] = raw;
    }
    return result;
}

const raw = fs.readFileSync(INPUT, "utf8");
const d = JSON.parse(raw);
const responses = d[0][""];
console.log(`Responses Gemini : ${responses.length}`);

const merged = {};
let ok = 0, repaired = 0, failed = 0;

for (let i = 0; i < responses.length; i++) {
    const resp = responses[i];
    const text = resp.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = text
        .replace(/^```json\s*/m, "")
        .replace(/\s*```\s*$/m, "")
        .trim();

    try {
        Object.assign(merged, JSON.parse(cleaned));
        ok++;
    } catch (e1) {
        try {
            const extracted = extractByKeyPositions(cleaned);
            const count = Object.keys(extracted).length;
            if (count === 0) throw new Error("Aucune clé extraite");
            Object.assign(merged, extracted);
            repaired++;
        } catch (e2) {
            failed++;
            console.error(`  ECHEC batch ${i} : ${e2.message.substring(0, 80)}`);
        }
    }
}

console.log(`OK: ${ok}  Réparés: ${repaired}  Échecs: ${failed}`);
console.log(`Total traductions : ${Object.keys(merged).length}`);

fs.writeFileSync(OUTPUT, JSON.stringify(merged, null, 2), "utf8");
console.log(`✅ Fichier créé : data_translate_flat.json`);
