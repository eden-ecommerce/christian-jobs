import { apiUrl } from "@lib/config";

/**
 * Centralised fetch wrapper. ALL client-side data fetching MUST go through this
 * function — never call `fetch()` directly inside components.
 *
 * Responsibilities:
 *  - Hardcodes the base URL (see `API_BASE_URL` in `@lib/config`).
 *  - Sets JSON headers automatically.
 *  - Serialises JSON request bodies.
 *  - Throws on non-OK responses.
 *  - Parses and returns JSON (or `undefined` for empty `204` responses).
 */

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body: string | Record<string, string | number | boolean | null>;

  constructor(
    status: number,
    statusText: string,
    body: string | Record<string, string | number | boolean | null>,
  ) {
    super(`apiFetch failed: ${status} ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  /** Plain objects are JSON-serialised; pass string/FormData to opt out. */
  body?: Record<string, string | number | boolean | null> | string | FormData | null;
}

function buildUrl(path: string): string {
  // Resolves to fully-qualified URL via API_BASE_URL. See apiUrl() / PROJECT_RULES.md.
  return apiUrl(path);
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const isJsonBody =
    body !== undefined &&
    body !== null &&
    !(typeof body === "string") &&
    !(typeof FormData !== "undefined" && body instanceof FormData);

  const response = await fetch(buildUrl(path), {
    credentials: "include",
    ...rest,
    headers: {
      Accept: "application/json",
      ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: isJsonBody ? JSON.stringify(body) : (body as BodyInit | undefined),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJsonResponse = contentType.includes("application/json");
  const payload =
    response.status === 204
      ? undefined
      : isJsonResponse
        ? ((await response.json()) as T)
        : await response.text();

  if (!response.ok) {
    const errorBody =
      typeof payload === "string"
        ? payload
        : (payload as Record<string, string | number | boolean | null>);
    throw new ApiError(response.status, response.statusText, errorBody);
  }

  return payload as T;
}
