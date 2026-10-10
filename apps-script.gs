/**
 * Acknowledger First – data store (free, no server)
 *
 * SETUP
 * 1. Create a Google Sheet → Extensions → Apps Script → paste this file → Save
 * 2. Change ADMIN_KEY below to your own secret (used to open /data)
 * 3. Deploy → New deployment → Web app
 *      Execute as: Me      Who has access: Anyone
 * 4. Copy the /exec URL into config.js → SHEET_URL
 * If you edit this script later: Deploy → Manage deployments → Edit → Version: New version
 *
 * POST  /exec            → saves one registration (from the booth page)
 * GET   /exec?key=SECRET → returns all registrations as JSON (for /data)
 */
var ADMIN_KEY = "change-this-secret";

var HEADERS = ["timestamp","reward_code","source","name","email","phone","company","role",
  "team_size","challenges","matched","interested","rating","next_step","comment","hot_lead"];

function sheet_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, sh.getMaxRows(), HEADERS.length).setNumberFormat("@"); // keep everything as plain text
  }
  return sh;
}

function clean_(v) {
  v = v == null ? "" : String(v).slice(0, 1000);
  return /^[=+\-@]/.test(v) ? "'" + v : v; // stop "+91…" or "=…" being read as formulas
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var p = (e && e.parameter) || {};
    if (!p.name) return json_({ ok: false, error: "name required" });
    sheet_().appendRow(HEADERS.map(function (h) { return clean_(p[h]); }));
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.key !== ADMIN_KEY) return json_({ ok: false, error: "unauthorized" });
  var values = sheet_().getDataRange().getDisplayValues();
  var head = values.shift() || HEADERS;
  var rows = values.map(function (r) {
    var o = {};
    head.forEach(function (h, i) { o[h] = r[i]; });
    return o;
  });
  return json_({ ok: true, count: rows.length, rows: rows });
}
