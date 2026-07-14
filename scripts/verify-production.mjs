const baseUrl = (process.env.PRODUCTION_URL || "https://traceops-alpha-ai.vercel.app").replace(/\/$/, "");

const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`FAIL: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    return await fetch(`${baseUrl}${path}`, {
      redirect: "manual",
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function verifySecurityHeaders(path, response) {
  const requiredHeaders = {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-resource-policy": "same-origin",
  };

  for (const [name, expected] of Object.entries(requiredHeaders)) {
    const actual = response.headers.get(name);
    if (actual !== expected) {
      fail(`${path} header ${name} was ${actual || "missing"}, expected ${expected}`);
    }
  }

  const csp = response.headers.get("content-security-policy") || "";
  for (const directive of [
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ]) {
    if (!csp.includes(directive)) {
      fail(`${path} CSP is missing ${directive}`);
    }
  }

  if (csp.includes("buy.stripe.com")) {
    fail(`${path} CSP still permits buy.stripe.com`);
  }

  const permissions = response.headers.get("permissions-policy") || "";
  if (!permissions.includes("payment=()")) {
    fail(`${path} Permissions-Policy does not disable payment`);
  }

  pass(`${path} security headers verified`);
}

async function verifyPage(path, expectedText) {
  const response = await request(path);
  if (response.status !== 200) {
    fail(`${path} returned ${response.status}, expected 200`);
    return;
  }

  const body = await response.text();
  if (!body.includes(expectedText)) {
    fail(`${path} did not contain required text: ${expectedText}`);
  } else {
    pass(`${path} content marker verified`);
  }

  for (const prohibited of ["buy.stripe.com", "cNi5kDfH48jmcZA6c7fnO00", "paypal.me"]) {
    if (body.toLowerCase().includes(prohibited.toLowerCase())) {
      fail(`${path} contains prohibited public payment destination: ${prohibited}`);
    }
  }

  verifySecurityHeaders(path, response);
}

async function verifyTextAsset(path, expectedText, expectedContentType) {
  const response = await request(path);
  if (response.status !== 200) {
    fail(`${path} returned ${response.status}, expected 200`);
    return;
  }

  const contentType = response.headers.get("content-type") || "";
  if (expectedContentType && !contentType.includes(expectedContentType)) {
    fail(`${path} content-type was ${contentType || "missing"}, expected ${expectedContentType}`);
  }

  const body = await response.text();
  if (!body.includes(expectedText)) {
    fail(`${path} did not contain required text: ${expectedText}`);
  } else {
    pass(`${path} text asset verified`);
  }

  verifySecurityHeaders(path, response);
}

async function verifyRedirect(path, destination) {
  const response = await request(path);
  if (![301, 302, 307, 308].includes(response.status)) {
    fail(`${path} returned ${response.status}, expected redirect`);
    return;
  }

  const location = response.headers.get("location") || "";
  if (!location.endsWith(destination)) {
    fail(`${path} redirected to ${location || "nowhere"}, expected ${destination}`);
  } else {
    pass(`${path} redirects to ${destination}`);
  }
}

async function verifyLeadEndpoint() {
  const getResponse = await request("/api/lead");
  if (getResponse.status !== 405 || getResponse.headers.get("allow") !== "POST") {
    fail(`/api/lead GET returned ${getResponse.status} with Allow=${getResponse.headers.get("allow")}`);
  } else {
    pass("/api/lead rejects GET and advertises POST");
  }

  if (!getResponse.headers.get("x-request-id")) {
    fail("/api/lead responses do not include X-Request-Id");
  } else {
    pass("/api/lead returns a request correlation identifier");
  }

  const invalidPost = await request("/api/lead", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: baseUrl,
    },
    body: JSON.stringify({}),
  });

  if (invalidPost.status !== 400) {
    fail(`/api/lead invalid POST returned ${invalidPost.status}, expected 400`);
  } else {
    pass("/api/lead rejects invalid payload before upstream submission");
  }

  const crossSitePost = await request("/api/lead", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.invalid",
      "sec-fetch-site": "cross-site",
    },
    body: JSON.stringify({}),
  });

  if (crossSitePost.status !== 403) {
    fail(`/api/lead cross-site POST returned ${crossSitePost.status}, expected 403`);
  } else {
    pass("/api/lead rejects cross-site submissions");
  }

  const cacheControl = getResponse.headers.get("cache-control") || "";
  if (!cacheControl.includes("no-store")) {
    fail("/api/lead response is missing no-store cache control");
  } else {
    pass("/api/lead responses are non-cacheable");
  }
}

await verifyPage("/", "checkout activation is pending owner payout verification");
await verifyPage("/pricing", "Direct payment is temporarily disabled pending payout verification");
await verifyPage("/demo", "No public Stripe or PayPal checkout is currently authorized");
await verifyPage("/platform", "Controlled demonstration environment");
await verifyPage("/privacy", "Privacy by boundary, not by promise");
await verifyPage("/terms", "Clear boundaries before access");
await verifyPage("/trust", "Intelligence that improves");

await verifyTextAsset("/robots.txt", "Sitemap: https://traceops-alpha-ai.vercel.app/sitemap.xml", "text/plain");
await verifyTextAsset("/sitemap.xml", "https://traceops-alpha-ai.vercel.app/trust", "xml");
await verifyTextAsset("/.well-known/security.txt", "Contact: mailto:jessiemcghee1984@gmail.com", "text/plain");

await verifyRedirect("/index.html", "/");
await verifyRedirect("/pricing.html", "/pricing");
await verifyRedirect("/demo.html", "/demo");
await verifyRedirect("/platform.html", "/platform");
await verifyRedirect("/privacy.html", "/privacy");
await verifyRedirect("/terms.html", "/terms");
await verifyRedirect("/trust.html", "/trust");

await verifyLeadEndpoint();

if (failures.length > 0) {
  console.error(`\nProduction verification failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(`\nProduction safeguard verification passed for ${baseUrl}.`);
