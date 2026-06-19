const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function buildEdenUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_EDEN_API_URL ?? "";
  return path.startsWith("http") ? path : `${baseUrl}${path}`;
}

/**
 * Client-side Eden API fetch. Sends first-party session cookies on www.eden.co.uk.
 * For mutating requests, forwards the csrft cookie as a header (consume only — never mint).
 */
export function edenFetchClient(path: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);

  if (MUTATING_METHODS.has(method)) {
    const csrft = getCookieValue("csrft");
    if (csrft) {
      headers.set("csrft", csrft);
    }
  }

  return fetch(buildEdenUrl(path), {
    credentials: "include",
    ...init,
    method,
    headers,
  });
}
