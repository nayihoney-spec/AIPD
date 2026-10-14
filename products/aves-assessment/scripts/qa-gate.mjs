#!/usr/bin/env node
/**
 * Aves Assessment non-destructive release checks.
 * Default: validate checked-in prototype integrity.
 * --external: additionally require recorded external-beta release evidence.
 *
 * No network calls, secrets, database writes, or production promotion.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, relative, sep, isAbsolute } from "node:path";
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

/**
 * The external-beta gate validates checklist completeness; it does not replay
 * security or functional tests. Only independently reviewed test evidence can
 * substantiate these fields. A PASS here never authorizes production promotion.
 */
const requiredExternalGates = [["E-001","Initial Platform Admin provisioning is restricted and single-use"],["E-002","Formal Quote issuance is authorized, server-priced, and snapshot-immutable"],["E-003","Organization, assessment, and user authorization are isolated"],["E-004","Invitation and grant effective/expiry windows are enforced"],["E-005","Session revocation, CSRF protection, and login abuse controls pass"],["E-006","SMTP invite/expiry/reminder/quote queue delivery and failure tests pass"],["E-007","Authorized installer download and fresh local-install tests pass"],["E-008","Candidate source provenance, stable alias, and rollback are verified"],["E-009","Database migration scope and approved environment are verified"],["E-010","Six-step and Admin-configurable end-to-end regression passes"],["E-011","External user access and deployment smoke tests pass"],["E-012","Persistent assessment/API and frozen quote/configuration versions pass"]];
const withinProduct = p => {
  const absolutePath = resolve(root, p);
  const rel = relative(root, absolutePath);
  return rel !== "" && rel !== ".." && !rel.startsWith(".." + sep) && !isAbsolute(rel) && existsSync(absolutePath);
};
const evidenceRefValid = ref => typeof ref === "string" && ref.trim().length >= 3 &&
  (/^https:\/\/[^\s]+$/.test(ref) || (!isAbsolute(ref) && withinProduct(ref)));

if (process.argv.includes("--external")) {
  let doc = null;
  try { doc = JSON.parse(readFileSync(gatesPath, "utf8")); }
  catch (err) { check(false, "E-000", "External-beta evidence file must exist and contain valid JSON: " + err.message); }
  if (doc) {
    check(doc.releaseTarget === "2026-10-16T04:00:00Z", "E-000", "Release target is Friday 12:00 Asia/Taipei");
    const gates = Array.isArray(doc.gates) ? doc.gates : [];
    const actualIds = gates.map(g => g?.id);
    const expectedIds = requiredExternalGates.map(g => g[0]);
    const uniqueIds = new Set(actualIds);
    check(actualIds.length === expectedIds.length && uniqueIds.size === actualIds.length &&
      expectedIds.every(id => uniqueIds.has(id)), "E-STRUCT", "All mandatory evidence gates appear exactly once");
    for (const [id, description] of requiredExternalGates) {
      const g = gates.find(entry => entry?.id === id);
      const evidence = Array.isArray(g?.evidence) ? g.evidence : [];
      const evidenceReady = evidence.length > 0 && evidence.every(evidenceRefValid);
      const reviewReady = typeof g?.reviewedBy === "string" && g.reviewedBy.trim().length >= 3 &&
        typeof g?.reviewedAt === "string" && !Number.isNaN(Date.parse(g.reviewedAt)) &&
        new Date(g.reviewedAt).getTime() <= Date.now();
      check(g?.status === "passed" && evidenceReady && reviewReady,
        id, description + " [" + (g?.status || "missing") + "]" +
        (!evidenceReady ? " (evidence missing/invalid)" : "") +
        (!reviewReady ? " (review missing/invalid)" : ""));
    }
    check(doc.decision === "GO" && typeof doc.approvedBy === "string" &&
      doc.approvedBy.trim().length >= 3 &&
      typeof doc.approvedAt === "string" && !Number.isNaN(Date.parse(doc.approvedAt)) &&
      new Date(doc.approvedAt).getTime() <= Date.now(),
      "E-APPROVAL", "Product Owner release GO decision is recorded with reviewer and timestamp");
  }
}
const failures = findings.filter(f => !f.pass);
process.stdout.write("\n" + (failures.length ? "GATE FAIL" : "GATE PASS") + " — " + failures.length + " failure(s) of " + findings.length + " checks.\n");
process.exitCode = failures.length ? 1 : 0;
