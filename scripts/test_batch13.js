const fs = require("fs");

function isEscaped(s, pos) {
    let count = 0, p = pos - 1;
    while (p >= 0 && s[p] === "\\") { count++; p--; }
    return count % 2 === 1;
}

function repairJsonIteratively(str) {
    let s = str;
    const MAX = 20000;
    for (let i = 0; i < MAX; i++) {
        try { return JSON.parse(s); }
        catch (e) {
            const posMatch = e.message.match(/position (\d+)/);
            if (!posMatch) return null;
            const pos = parseInt(posMatch[1]);
            if (e.message.includes("Expected ',' or '}'")) {
                let p = pos - 1;
                while (p > 0 && !(s[p] === '"' && !isEscaped(s, p))) p--;
                if (i < 5) console.log(`  iter ${i}: pos ${pos}, escape à ${p}, ctx: ${JSON.stringify(s.substring(p-3, p+8))}`);
                if (p <= 0) { console.log("  p<=0, return null"); return null; }
                s = s.slice(0, p) + "\\" + s.slice(p);
            } else if (e.message.includes("Unterminated string")) {
                s = s.slice(0, pos) + '"}';
            } else {
                console.log("  Autre erreur:", e.message);
                return null;
            }
        }
    }
    return null;
}

const raw = fs.readFileSync("d:/VsCode/GTNH_Quest/bin/version/284/data_translate.json", "utf8");
const d = JSON.parse(raw);
const text = d[0][""][13].candidates[0].content.parts[0].text;
const cleaned = text.replace(/^```json\s*/m, "").replace(/\s*```\s*$/m, "").trim();

try { const r = JSON.parse(cleaned); console.log("Parse direct OK:", Object.keys(r).length, "clés"); }
catch(e) { console.log("Parse direct fail:", e.message.substring(0, 60)); }

const fixed = repairJsonIteratively(cleaned);
console.log("Repair:", fixed ? Object.keys(fixed).length + " clés" : "null");
