async function parseResponse(response) {
  const raw = await response.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
}

function buildTargets(path) {
  const normalizedPath = path.startsWith('/api') ? path.slice(4) : path;
  return [path, `http://127.0.0.1:5050/api${normalizedPath}`, `http://localhost:5050/api${normalizedPath}`];
}

export async function requestWithFallback(method, path, payload, extraHeaders = {}) {
  const targets = buildTargets(path);
  let lastError = null;

  for (const url of targets) {
    try {
      const headers = { ...extraHeaders };
      const options = { method, headers };
      if (payload !== undefined) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(payload);
      }

      const response = await fetch(url, {
        ...options
      });

      const data = await parseResponse(response);
      if (!response.ok) {
        const detail = data?.message || data?.error || `HTTP ${response.status}`;
        throw new Error(`${response.status}: ${detail}`);
      }
      return data;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError?.name === 'TypeError') {
    throw new Error('Network error: backend is not reachable on port 5050. Start backend server and retry.');
  }
  throw lastError || new Error('Request failed');
}

export async function postWithFallback(path, payload, extraHeaders = {}) {
  return requestWithFallback('POST', path, payload, extraHeaders);
}

export async function getWithFallback(path, extraHeaders = {}) {
  return requestWithFallback('GET', path, undefined, extraHeaders);
}

export async function putWithFallback(path, payload, extraHeaders = {}) {
  return requestWithFallback('PUT', path, payload, extraHeaders);
}
