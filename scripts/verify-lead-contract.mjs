import { readFile } from "node:fs/promises";

const [demoHtml, leadSource] = await Promise.all([
  readFile(new URL("../demo.html", import.meta.url), "utf8"),
  readFile(new URL("../api/lead.js", import.meta.url), "utf8"),
]);

const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`FAIL: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

const selectMatch = demoHtml.match(
  /<select[^>]+id=["']serviceType["'][^>]*>([\s\S]*?)<\/select>/i,
);

if (!selectMatch) {
  fail("demo.html does not contain the serviceType select field");
} else {
  const options = [...selectMatch[1].matchAll(/<option(?:\s+value=["']([^"']*)["'])?[^>]*>([^<]+)<\/option>/gi)]
    .map((match) => (match[1] || match[2]).trim())
    .filter(Boolean);

  const allowedSetMatch = leadSource.match(
    /const\s+ALLOWED_SERVICES\s*=\s*new\s+Set\s*\(\s*\[([\s\S]*?)\]\s*\)/,
  );

  if (!allowedSetMatch) {
    fail("api/lead.js does not expose an ALLOWED_SERVICES set");
  } else {
    const allowed = new Set(
      [...allowedSetMatch[1].matchAll(/["']([^"']+)["']/g)].map((match) => match[1]),
    );

    for (const option of options) {
      if (!allowed.has(option)) {
        fail(`Demo workflow option is rejected by the API: ${option}`);
      }
    }

    if (failures.length === 0) {
      pass(`${options.length} demo workflow options are accepted by the API`);
    }
  }
}

for (const requiredMarker of [
  'action="/api/lead"',
  "consent_to_contact",
  "privacy_acknowledged",
  "Do not include Social Security numbers",
]) {
  if (!demoHtml.includes(requiredMarker)) {
    fail(`demo.html is missing required intake marker: ${requiredMarker}`);
  }
}

if (!leadSource.includes("THREE_MIN_API_KEY")) {
  fail("api/lead.js is not configured to require the server-side 3Min API key");
} else {
  pass("Server-side lead credential boundary is present");
}

if (failures.length > 0) {
  console.error(`\nLead contract verification failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log("\nLead contract verification passed.");
