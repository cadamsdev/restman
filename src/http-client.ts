export interface RequestOptions {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export interface Response {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
}

export class HTTPClient {
  async sendRequest(options: RequestOptions): Promise<Response> {
    const startTime = Date.now();

    try {
      // Add default User-Agent if not provided
      const headers = {
        'User-Agent': `RestMan/2.0.0 (https://github.com/cadamsdev/restman)`,
        ...options.headers,
      };

      const fetchOptions: RequestInit = {
        method: options.method,
        headers: headers,
      };

      if (options.body && ['POST', 'PUT', 'PATCH'].includes(options.method)) {
        fetchOptions.body = options.body;
      }

      const response = await fetch(options.url, fetchOptions);
      const time = Date.now() - startTime;

      // Get response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Get response body
      const contentType = response.headers.get('content-type') || '';
      let body: string;

      // Check if content is binary (images, videos, audio, etc.)
      const binaryContentTypes = [
        'image/',
        'video/',
        'audio/',
        'application/octet-stream',
        'application/pdf',
        'application/zip',
        'application/x-',
        'font/',
      ];

      const isBinary = binaryContentTypes.some((type) => contentType.toLowerCase().includes(type));

      if (isBinary) {
        const arrayBuffer = await response.arrayBuffer();
        const sizeKB = (arrayBuffer.byteLength / 1024).toFixed(1);
        body = `(binary content - ${contentType} - ${sizeKB} KB)`;
      } else if (contentType.includes('application/json')) {
        try {
          const json = await response.json();
          body = JSON.stringify(json, null, 2);
        } catch {
          body = await response.text();
        }
      } else {
        body = await response.text();
      }

      return {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body,
        time,
      };
    } catch (error) {
      const time = Date.now() - startTime;
      return {
        status: 0,
        statusText: 'Error',
        headers: {},
        body: error instanceof Error ? error.message : String(error),
        time,
      };
    }
  }
}
