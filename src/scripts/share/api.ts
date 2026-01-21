type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

const _toCamel = (value: string): string =>
  value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());

const _isPlainObject = (value: unknown): value is JsonObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const _snakeToCamelDeep = <T>(input: T): T => {
  if (Array.isArray(input)) {
    return input.map((item) => _snakeToCamelDeep(item)) as T;
  }

  if (!_isPlainObject(input)) {
    return input;
  }

  const entries = Object.entries(input).map(([key, value]) => [
    _toCamel(key),
    _snakeToCamelDeep(value),
  ]);

  return Object.fromEntries(entries) as T;
};

const _toSnake = (value: string): string =>
  value.replace(/[A-Z]/g, (char: string) => `_${char.toLowerCase()}`);

export const _camelToSnakeDeep = <T>(input: T): T => {
  if (Array.isArray(input)) {
    return input.map((item) => _camelToSnakeDeep(item)) as T;
  }

  if (!_isPlainObject(input)) {
    return input;
  }

  const entries = Object.entries(input).map(([key, value]) => [
    _toSnake(key),
    _camelToSnakeDeep(value),
  ]);

  return Object.fromEntries(entries) as T;
};

type RequestApiOptions = {
  method?: string;
  params?: JsonObject;
  body?: JsonValue;
  headers?: HeadersInit;
};

export const requestAPI = async <T>(
  url: string,
  { method = "GET", params, body, headers }: RequestApiOptions = {},
): Promise<T> => {
  const requestUrl = new URL(url, window.location.origin);

  if (params) {
    const snakeParams = _camelToSnakeDeep(params) as JsonObject;
    Object.entries(snakeParams).forEach(([key, value]) => {
      requestUrl.searchParams.set(key, String(value));
    });
  }

  const hasBody = body !== undefined && body !== null;
  const requestBody = hasBody
    ? JSON.stringify(_camelToSnakeDeep(body))
    : undefined;
  const requestHeaders = new Headers(headers);

  if (hasBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(requestUrl.toString(), {
    method,
    headers: requestHeaders,
    body: requestBody,
  });

  if (!response.ok) {
    const errorResponseData = await response.json();
    const detail = errorResponseData?.detail || "Unknown error";
    throw new Error(detail);
  }

  const data = (await response.json()) as T;
  return _snakeToCamelDeep(data);
};

export const requestStreamingAPI = async function* (
  url: string,
  { method = "POST", params, body, headers }: RequestApiOptions = {},
): AsyncGenerator<string> {
  const requestUrl = new URL(url, window.location.origin);

  if (params) {
    const snakeParams = _camelToSnakeDeep(params) as JsonObject;
    Object.entries(snakeParams).forEach(([key, value]) => {
      requestUrl.searchParams.set(key, String(value));
    });
  }

  const hasBody = body !== undefined && body !== null;
  const requestBody = hasBody
    ? JSON.stringify(_camelToSnakeDeep(body))
    : undefined;
  const requestHeaders = new Headers(headers);

  if (hasBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(requestUrl.toString(), {
    method,
    headers: requestHeaders,
    body: requestBody,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("Response body is null");
  }

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        yield data;
      }
    }
  }
};
