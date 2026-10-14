#!/usr/bin/env node
/**
 * Aves Assessment non-destructive release checks.
 * Default: validate checked-in prototype integrity.
 * --external: additionally require recorded external-beta release evidence.
 *
 * No network calls, secrets, database writes, or production promotion.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = resolve(root, "app/index.html");
const gatesPath = resolve(root, "releases/external-beta-gates.json");
const findings = [];
const check = (pass, id, description) => {
  findings.push({ pass: Boolean(pass), id, description });
  process.stdout.write((pass ? "PASS " : "FAIL ") + id + " — " + description + "\n");
};
const html = readFileSync(htmlPath, "utf8");
const scriptBlocks = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
check(scriptBlocks.length > 0, "P-001", "Inline script blocks are present");
scriptBlocks.forEach((code, i) => {
  let error = "";
  try { new vm.Script(code, { filename: "inline-script-" + (i + 1) + ".js" }); }
  catch (e) { error = e.message; }
  check(!error, "P-002." + (i + 1), "Script " + (i + 1) + " parses" + (error ? ": " + error : ""));
});
const staticMarkup = html.slice(0, html.search(/<script(?:\s|>)/i));
const ids = [...staticMarkup.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(m => m[1]);
const duplicateIds = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
check(duplicateIds.length === 0, "P-003", "Static HTML contains no duplicate IDs" + (duplicateIds.length ? ": " + duplicateIds.join(", ") : ""));
for (const id of ["assessment", "step1", "step2", "step3", "step4", "step5", "step6", "requirementChoices", "siteForms", "processList", "equipmentRows", "adminTabs", "snapshotMsg"]) {
  check(ids.includes(id), "P-004." + id, "Required UI anchor " + id + " exists");
}
if (html.includes("q3ContextPanel")) {
  for (const key of ["q3EnsureContext", "q3CurrentLine", "q3ApplyTemplate", "q3ProcessMissing", "q3DeleteTemplate", "q3MappingCard"]) {
    check(html.includes(key), "Q3." + key, "Q3 feature entry point exists: " + key);
  }
  const m = html.match(/const Q3_UI=([\s\S]+?);\s*function q3t\(/);
  let translations;
  try { translations = m ? vm.runInNewContext("(" + m[1] + ")", Object.create(null), { timeout: 250 }) : null; }
  catch (e) { translations = null; }
  const keys = ["site", "line", "template", "apply", "addStep", "stepHelp", "mapping", "mapped", "deleteStep", "inUse"];
  for (const locale of ["en", "zh-Hant", "zh-Hans", "fr", "ja", "es", "vi", "th"]) {
    check(Boolean(translations?.[locale]) && keys.every(k => typeof translations[locale][k] === "string" && translations[locale][k].trim()), "Q3.locale." + locale, "Q3 control labels present: " + locale);
  }
}
if (process.argv.includes("--external")) {
  const doc = JSON.parse(readFileSync(gatesPath, "utf8"));
  check(doc.releaseTarget === "2026-10-16T04:00:00Z", "E-000", "Release target is Friday 12:00 Asia/Taipei");
  for (const g of doc.gates) {
    const hasEvidence = Array.isArray(g.evidence) && g.evidence.length > 0 &&
      g.evidence.every(p => typeof p === "string" && p.trim().length >= 3 && (
        /^https:\/\//.test(p) || (!isAbsolute(p) && existsSync(resolve(root, p)))
      ));
    check(g.status === "passed" && hasEvidence, g.id, g.description + " [" + g.status + "]" + (hasEvidence ? "" : " (verified evidence missing)"));
  }
}
const failures = findings.filter(f => !f.pass);
process.stdout.write("\n" + (failures.length ? "GATE FAIL" : "GATE PASS") + " — " + failures.length + " failure(s) of " + findings.length + " checks.\n");
process.exitCode = failures.length ? 1 : 0;
