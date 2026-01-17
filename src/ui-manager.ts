import blessed from "blessed";
import { HTTPClient, RequestOptions } from "./http-client";

export class UIManager {
  private screen: blessed.Widgets.Screen;
  private httpClient: HTTPClient;
  private urlInput: blessed.Widgets.TextboxElement;
  private methodBox: blessed.Widgets.ListElement;
  private headersInput: blessed.Widgets.TextareaElement;
  private bodyInput: blessed.Widgets.TextareaElement;
  private responseBox: blessed.Widgets.BoxElement;
  private statusBox: blessed.Widgets.BoxElement;
  private currentMethod: string = "GET";

  constructor(screen: blessed.Widgets.Screen, httpClient: HTTPClient) {
    this.screen = screen;
    this.httpClient = httpClient;

    // Create UI components
    this.createHeader();
    this.urlInput = this.createURLInput();
    this.methodBox = this.createMethodSelector();
    this.headersInput = this.createHeadersInput();
    this.bodyInput = this.createBodyInput();
    this.responseBox = this.createResponseBox();
    this.statusBox = this.createStatusBox();
    this.createInstructions();

    this.setupEventHandlers();
  }

  private createHeader() {
    const header = blessed.box({
      top: 0,
      left: 0,
      width: "100%",
      height: 3,
      content: "{center}{bold}🚀 ShellMan - REST API Client{/bold}{/center}",
      tags: true,
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        bg: "blue",
        border: {
          fg: "blue",
        },
      },
    });

    this.screen.append(header);
  }

  private createMethodSelector(): blessed.Widgets.ListElement {
    const methodBox = blessed.list({
      top: 3,
      left: 0,
      width: 12,
      height: 3,
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        border: {
          fg: "cyan",
        },
        selected: {
          bg: "cyan",
          fg: "black",
        },
      },
      keys: true,
      vi: true,
      items: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      label: " Method ",
    });

    methodBox.on("select", (item) => {
      this.currentMethod = item.getText();
      this.urlInput.focus();
    });

    this.screen.append(methodBox);
    return methodBox;
  }

  private createURLInput(): blessed.Widgets.TextboxElement {
    const urlInput = blessed.textbox({
      top: 3,
      left: 12,
      width: "100%-12",
      height: 3,
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        border: {
          fg: "cyan",
        },
        focus: {
          border: {
            fg: "yellow",
          },
        },
      },
      inputOnFocus: true,
      keys: true,
      mouse: true,
      label: " URL ",
      value: "https://jsonplaceholder.typicode.com/posts/1",
    });

    // Clear the textbox when it receives focus to avoid duplicate input
    urlInput.on("focus", () => {
      urlInput.readInput();
    });

    this.screen.append(urlInput);
    return urlInput;
  }

  private createHeadersInput(): blessed.Widgets.TextareaElement {
    const headersInput = blessed.textarea({
      top: 6,
      left: 0,
      width: "50%",
      height: 10,
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        border: {
          fg: "cyan",
        },
        focus: {
          border: {
            fg: "yellow",
          },
        },
      },
      inputOnFocus: true,
      keys: true,
      vi: true,
      mouse: true,
      label: " Headers (key: value) ",
      content: "Content-Type: application/json\nAccept: application/json",
    });

    this.screen.append(headersInput);
    return headersInput;
  }

  private createBodyInput(): blessed.Widgets.TextareaElement {
    const bodyInput = blessed.textarea({
      top: 6,
      left: "50%",
      width: "50%",
      height: 10,
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        border: {
          fg: "cyan",
        },
        focus: {
          border: {
            fg: "yellow",
          },
        },
      },
      inputOnFocus: true,
      keys: true,
      vi: true,
      mouse: true,
      label: " Body ",
      content: "",
    });

    this.screen.append(bodyInput);
    return bodyInput;
  }

  private createStatusBox(): blessed.Widgets.BoxElement {
    const statusBox = blessed.box({
      top: 16,
      left: 0,
      width: "100%",
      height: 3,
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        border: {
          fg: "green",
        },
      },
      label: " Status ",
      content: " Press F5 or Enter to send request",
      tags: true,
    });

    this.screen.append(statusBox);
    return statusBox;
  }

  private createResponseBox(): blessed.Widgets.BoxElement {
    const responseBox = blessed.box({
      top: 19,
      left: 0,
      width: "100%",
      height: "100%-22",
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        border: {
          fg: "green",
        },
      },
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
      mouse: true,
      scrollbar: {
        ch: " ",
        style: {
          bg: "cyan",
        },
      },
      label: " Response ",
      content: " No response yet. Send a request to see results.",
      tags: true,
    });

    this.screen.append(responseBox);
    return responseBox;
  }

  private createInstructions() {
    const instructions = blessed.box({
      bottom: 0,
      left: 0,
      width: "100%",
      height: 3,
      content:
        "{center}F5/Enter: Send | Tab: Next Field | Shift+Tab: Prev Field | F2: Method | q/Esc: Quit{/center}",
      tags: true,
      style: {
        fg: "white",
        bg: "black",
      },
    });

    this.screen.append(instructions);
  }

  private setupEventHandlers() {
    // Tab navigation
    const focusables = [
      this.urlInput,
      this.headersInput,
      this.bodyInput,
      this.responseBox,
    ];

    let currentFocus = 0;

    this.screen.key(["tab"], () => {
      currentFocus = (currentFocus + 1) % focusables.length;
      focusables[currentFocus].focus();
      this.screen.render();
    });

    this.screen.key(["S-tab"], () => {
      currentFocus = (currentFocus - 1 + focusables.length) % focusables.length;
      focusables[currentFocus].focus();
      this.screen.render();
    });

    // F2 to focus method selector
    this.screen.key(["f2"], () => {
      this.methodBox.focus();
      this.screen.render();
    });

    // F5 or Enter to send request
    this.screen.key(["f5", "enter"], async () => {
      await this.sendRequest();
    });

    // Focus URL input initially
    this.urlInput.focus();
  }

  private parseHeaders(headersText: string): Record<string, string> {
    const headers: Record<string, string> = {};
    const lines = headersText.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const colonIndex = trimmed.indexOf(":");
      if (colonIndex === -1) continue;

      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (key) {
        headers[key] = value;
      }
    }

    return headers;
  }

  private async sendRequest() {
    try {
      this.statusBox.setContent(" {yellow-fg}Sending request...{/yellow-fg}");
      this.screen.render();

      const url = this.urlInput.getValue();
      const headers = this.parseHeaders(this.headersInput.getValue());
      const body = this.bodyInput.getValue();

      if (!url) {
        this.statusBox.setContent(" {red-fg}Error: URL is required{/red-fg}");
        this.screen.render();
        return;
      }

      const requestOptions: RequestOptions = {
        method: this.currentMethod,
        url,
        headers,
        body: body || undefined,
      };

      const response = await this.httpClient.sendRequest(requestOptions);

      // Update status box
      const statusColor =
        response.status >= 200 && response.status < 300
          ? "green"
          : response.status >= 400
          ? "red"
          : "yellow";

      this.statusBox.setContent(
        ` {${statusColor}-fg}${response.status} ${response.statusText}{/${statusColor}-fg} | Time: ${response.time}ms`
      );

      // Update response box
      let responseContent = `{bold}Status:{/bold} ${response.status} ${response.statusText}\n`;
      responseContent += `{bold}Time:{/bold} ${response.time}ms\n\n`;
      responseContent += `{bold}Headers:{/bold}\n`;

      for (const [key, value] of Object.entries(response.headers)) {
        responseContent += `  ${key}: ${value}\n`;
      }

      responseContent += `\n{bold}Body:{/bold}\n`;
      responseContent += response.body;

      this.responseBox.setContent(responseContent);
      this.responseBox.setScrollPerc(0);
      this.screen.render();
    } catch (error) {
      this.statusBox.setContent(
        ` {red-fg}Error: ${error instanceof Error ? error.message : String(error)}{/red-fg}`
      );
      this.screen.render();
    }
  }
}
