const THREE_MIN_API_URL =
  "https://api.3minapi.com/api/v1/data/w2lpon6hf8au0g4g71siy";

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitBuckets = new Map();

const ALLOWED_CONTACT_METHODS = new Set(["email", "phone", "text"]);
const ALLOWED_SERVICES = new Set([
  "General Investigation",
  "Skip Trace",
  "Locate Services",
  "Legal Support",
  "Process Service",
  "Case Intake Workflow",
  "Custom Demo",
]);

function setSecurityHeaders(response) {
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Content-Type-Options", "nosniff");
}

function getClientIp(request) {
  const forwarded = request.headers["x-forwarded-for"];
  if (Array.isArray(forwarded)) {
    return forwarded[0] || "unknown";
  }
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return request.socket?.remoteAddress || "unknown";
}

function checkRateLimit(ipAddress) {
  const now = Date.now();
  const current = rateLimitBuckets.get(ipAddress);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(ipAddress, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  current.count += 1;
  if (current.count > RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function isSameOriginRequest(request) {
  const fetchSite = request.headers["sec-fetch-site"];
  if (fetchSite === "cross-site") {
    return false;
  }

  const origin = request.headers.origin;
  const host = request.headers.host;
  if (!origin || !host) {
    return true;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function sanitizeText(value, maximumLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maximumLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function passesLuhnCheck(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let total = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    total += digit;
    doubleDigit = !doubleDigit;
  }

  return total % 10 === 0;
}

function containsRestrictedData(value) {
  const possibleSsn = /\b\d{3}[- ]\d{2}[- ]\d{4}\b/.test(value);
  const possibleCardNumbers = value.match(/(?:\d[ -]*?){13,19}/g) || [];
  return possibleSsn || possibleCardNumbers.some(passesLuhnCheck);
}

function parseBody(request) {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }

  if (typeof request.body === "string") {
    return JSON.parse(request.body);
  }

  return null;
}

function buildSourceUrl(request) {
  const referer = request.headers.referer;
  if (typeof referer === "string" && referer.length <= 500) {
    try {
      const parsed = new URL(referer);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        return parsed.toString();
      }
    } catch {
      // Fall through to the same-origin host below.
    }
  }

  const host = sanitizeText(request.headers.host || "", 255);
  return host ? `https://${host}/demo.html` : "TraceOps demo form";
}

export default async function handler(request, response) {
  setSecurityHeaders(response);

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({
      success: false,
      error: "Only POST requests are accepted.",
    });
  }

  if (!isSameOriginRequest(request)) {
    return response.status(403).json({
      success: false,
      error: "Cross-site submissions are not accepted.",
    });
  }

  const contentType = request.headers["content-type"] || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return response.status(415).json({
      success: false,
      error: "The request must use application/json.",
    });
  }

  const contentLength = Number(request.headers["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return response.status(413).json({
      success: false,
      error: "The submission is too large.",
    });
  }

  const ipAddress = getClientIp(request);
  const rateLimit = checkRateLimit(ipAddress);
  if (!rateLimit.allowed) {
    response.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
    return response.status(429).json({
      success: false,
      error: "Too many requests. Please wait before trying again.",
    });
  }

  let body;
  try {
    body = parseBody(request);
  } catch {
    return response.status(400).json({
      success: false,
      error: "The request contains invalid JSON.",
    });
  }

  if (!body || JSON.stringify(body).length > MAX_BODY_BYTES) {
    return response.status(400).json({
      success: false,
      error: "The submission is missing or invalid.",
    });
  }

  if (sanitizeText(body.website, 200)) {
    return response.status(202).json({
      success: true,
      message: "Your request was received.",
    });
  }

  const firstName = sanitizeText(body.first_name, 60);
  const lastName = sanitizeText(body.last_name, 60);
  const email = sanitizeText(body.email, 254).toLowerCase();
  const phone = sanitizeText(body.phone, 40);
  const company = sanitizeText(body.company, 100);
  const contactMethod = sanitizeText(body.contact_method, 10).toLowerCase();
  const serviceRequested = sanitizeText(body.service_requested, 80);
  const countyState = sanitizeText(body.county_state, 100);
  const summary = sanitizeText(body.summary, 1000);
  const consentToContact = body.consent_to_contact === true;
  const privacyAcknowledged = body.privacy_acknowledged === true;

  if (!firstName || !isValidEmail(email)) {
    return response.status(400).json({
      success: false,
      error: "A valid first name and email address are required.",
    });
  }

  if (!ALLOWED_CONTACT_METHODS.has(contactMethod)) {
    return response.status(400).json({
      success: false,
      error: "Select a valid contact method.",
    });
  }

  if ((contactMethod === "phone" || contactMethod === "text") && !isValidPhone(phone)) {
    return response.status(400).json({
      success: false,
      error: "A valid phone number is required for phone or text contact.",
    });
  }

  if (!ALLOWED_SERVICES.has(serviceRequested) || !countyState) {
    return response.status(400).json({
      success: false,
      error: "Select a valid service and provide your city/county and state.",
    });
  }

  if (summary.length < 10 || containsRestrictedData(summary)) {
    return response.status(400).json({
      success: false,
      error:
        "Provide a brief non-confidential summary without Social Security or payment-card numbers.",
    });
  }

  if (!consentToContact || !privacyAcknowledged) {
    return response.status(400).json({
      success: false,
      error: "Contact consent and the privacy acknowledgment are required.",
    });
  }

  const apiKey = process.env.THREE_MIN_API_KEY;
  if (!apiKey) {
    console.error("Lead submission is unavailable: THREE_MIN_API_KEY is not configured.");
    return response.status(503).json({
      success: false,
      error: "Lead submission is temporarily unavailable. Please call or email us.",
    });
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const contactValue = contactMethod === "email" ? email : phone;
  const briefSummary = company
    ? `Company/Firm: ${company}\n${summary}`
    : summary;

  const upstreamPayload = {
    brand: "TraceOps Alpha Ai",
    full_name: fullName,
    contact_method: contactMethod,
    contact_value: contactValue,
    service_requested: serviceRequested,
    county_state: countyState,
    brief_non_confidential_summary: briefSummary,
    source_url: buildSourceUrl(request),
    consent_to_contact: true,
    privacy_acknowledged: true,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const upstreamResponse = await fetch(THREE_MIN_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "TraceOps-Lead-Proxy/1.0",
      },
      body: JSON.stringify(upstreamPayload),
      signal: controller.signal,
    });

    const responseText = await upstreamResponse.text();
    let responseData = {};
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch {
      responseData = {};
    }

    if (!upstreamResponse.ok) {
      console.error("3Min lead submission failed.", {
        status: upstreamResponse.status,
      });
      return response.status(502).json({
        success: false,
        error: "We could not save your request. Please call or email us.",
      });
    }

    return response.status(202).json({
      success: true,
      message: "Your demo request was received. We will follow up soon.",
      reference: typeof responseData.id === "string" ? responseData.id : null,
    });
  } catch (error) {
    console.error("Lead submission request failed.", {
      reason: error instanceof Error ? error.name : "UnknownError",
    });
    return response.status(502).json({
      success: false,
      error: "We could not save your request. Please call or email us.",
    });
  } finally {
    clearTimeout(timeout);
  }
}
