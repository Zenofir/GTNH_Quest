const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "../bin/version/284/data_translate.json");
const OUTPUT = path.join(__dirname, "../bin/version/284/data_translate_flat.json");

// Compte les backslashes consécutifs avant pos pour savoir si le " est vraiment échappé
function isEscaped(s, pos) {
    let count = 0;
    let p = pos - 1;
    while (p >= 0 && s[p] === "\\") { count++; p--; }
    return count % 2 === 1;
}

// Répare le JSON en échappant les guillemets non échappés qui causent des erreurs
function repairJsonIteratively(str) {
    let s = str;
    const MAX = 20000;
    for (let i = 0; i < MAX; i++) {
        try {
            return JSON.parse(s);
        } catch (e) {
            const posMatch = e.message.match(/position (\d+)/);
            if (!posMatch) return null;
            const pos = parseInt(posMatch[1]);

            if (e.message.includes("Unterminated string")) {
                // String non fermée — fermer et clore l'objet
                s = s.slice(0, pos) + '"}';
            } else {
                // Tout autre type d'erreur : guillemet non échappé → chercher le dernier " avant pos
                let p = pos - 1;
                while (p > 0 && !(s[p] === '"' && !isEscaped(s, p))) p--;
                if (p <= 0) return null;
                s = s.slice(0, p) + "\\" + s.slice(p);
            }
        }
    }
    return null;
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
        const fixed = repairJsonIteratively(cleaned);
        if (fixed && Object.keys(fixed).length > 0) {
            Object.assign(merged, fixed);
            repaired++;
        } else {
            failed++;
            console.error(`  ECHEC batch ${i} : ${e1.message.substring(0, 80)}`);
        }
    }
}

console.log(`OK: ${ok}  Réparés: ${repaired}  Échecs: ${failed}`);
console.log(`Total traductions : ${Object.keys(merged).length}`);

fs.writeFileSync(OUTPUT, JSON.stringify(merged, null, 2), "utf8");
console.log(`✅ Fichier créé : data_translate_flat.json`);
