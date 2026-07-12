import { readFile } from "node:fs/promises";

const customerPages = [
  "index.html",
  "home-v2.html",
  "pricing.html",
  "pricing-v2.html",
  "demo.html",
];

const prohibited = [
  "buy.stripe.com",
  "cNi5kDfH48jmcZA6c7fnO00",
  "paypal.me",
];

const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`FAIL: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

for (const path of customerPages) {
  const body = await readFile(path, "utf8");

  for (const value of prohibited) {
    if (body.toLowerCase().includes(value.toLowerCase())) {
      fail(`${path} contains prohibited public payment destination: ${value}`);
    }
  }

  if (!body.includes("Jessie McGhee")) {
    fail(`${path} does not identify Jessie McGhee as owner or reviewer`);
  }

  if (!body.includes("Alpha Dog P.I. &amp; Security LLC")) {
    fail(`${path} does not identify Alpha Dog P.I. & Security LLC`);
  }

  pass(`${path} payment routing and owner markers verified`);
}

const vercel = await readFile("vercel.json", "utf8");
for (const value of ["buy.stripe.com", "payment=(self)"]) {
  if (vercel.includes(value)) {
    fail(`vercel.json still permits external payment behavior: ${value}`);
  }
}

for (const value of ["form-action 'self'", "payment=()"] ) {
  if (!vercel.includes(value)) {
    fail(`vercel.json is missing required payment safeguard: ${value}`);
  }
}

pass("Vercel payment security policy verified");

if (failures.length > 0) {
  console.error(`\nPayment source verification failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log("\nPayment source verification passed.");
