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
  for (const directive of ["frame-ancestors 'none'", "base-uri 'self'", "form-action 'self' https://buy.stripe.com"]) {
    if (!csp.includes(directive)) {
      fail(`${path} CSP is missing ${directive}`);
    }
  }

  pass(`${path} security headers verified`);
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

await verifyPage("/", "Turn every inquiry into a controlled, trackable workflow.");
await verifyPage("/pricing", "Pricing that starts with fit, not false promises.");
await verifyPage("/demo", "Request your demo");
await verifyRedirect("/index.html", "/");
await verifyRedirect("/pricing.html", "/pricing");
await verifyRedirect("/demo.html", "/demo");
await verifyLeadEndpoint();

if (failures.length > 0) {
  console.error(`\nProduction verification failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(`\nProduction verification passed for ${baseUrl}.`);
