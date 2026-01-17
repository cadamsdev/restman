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
      const fetchOptions: RequestInit = {
        method: options.method,
        headers: options.headers,
      };

      if (options.body && ["POST", "PUT", "PATCH"].includes(options.method)) {
        fetchOptions.body = options.body;
      }

      const response = await fetch(options.url, fetchOptions);
      const time = Date.now() - startTime;

      // Get response headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      // Get response body
      const contentType = response.headers.get("content-type") || "";
      let body: string;

      if (contentType.includes("application/json")) {
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
        headers,
        body,
        time,
      };
    } catch (error) {
      const time = Date.now() - startTime;
      return {
        status: 0,
        statusText: "Error",
        headers: {},
        body: error instanceof Error ? error.message : String(error),
        time,
      };
    }
  }
}
