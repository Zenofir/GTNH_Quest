const fs = require("fs");
const raw = fs.readFileSync("d:/VsCode/GTNH_Quest/bin/version/284/data_translate.json", "utf8");
const d = JSON.parse(raw);
const responses = d[0][""];

function clean(text) {
    return text.replace(/^```json\s*/m, "").replace(/\s*```\s*$/m, "").trim();
}

function isEscaped(s, pos) {
    let count = 0, p = pos - 1;
    while (p >= 0 && s[p] === "\\") { count++; p--; }
    return count % 2 === 1;
}

// Tester les 4 batches qui échouent
for (const batchIdx of [4, 7, 9, 13]) {
    let t = clean(responses[batchIdx].candidates[0].content.parts[0].text);
    console.log(`\n=== Batch ${batchIdx} ===`);

    let lastPos = -1;
    let sameCount = 0;

    for (let i = 0; i < 10; i++) {
        try { const r = JSON.parse(t); console.log(`OK après ${i} itérations — ${Object.keys(r).length} clés`); break; }
        catch (e) {
            const pm = e.message.match(/position (\d+)/);
            if (!pm) { console.log("Pas de position:", e.message); break; }
            const pos = parseInt(pm[1]);

            if (pos === lastPos) {
                sameCount++;
                if (sameCount >= 3) { console.log("BOUCLE INFINIE détectée à pos", pos); break; }
            } else {
                sameCount = 0;
                lastPos = pos;
            }

            let p = pos - 1;
            while (p > 0 && !(t[p] === '"' && !isEscaped(t, p))) p--;

            console.log(`iter ${i}: erreur pos ${pos}, escape à ${p}, contexte: ${JSON.stringify(t.substring(Math.max(0, p-5), p+10))}`);

            if (p <= 0) { console.log("  → Aucun guillemet trouvé avant pos", pos); break; }
            t = t.slice(0, p) + "\\" + t.slice(p);
        }
    }
}
