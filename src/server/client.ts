import { AI_MCP_TOKEN } from "../constants/index.js";

// 总方法
export class Client {
  private baseUrl: string = "";
  private headers: { [key: string]: string };

  constructor(rljN: string, baseUrl: string) {
    this.headers = { "rlj-n": rljN, AI_MCP_TOKEN: AI_MCP_TOKEN! };
    this.baseUrl = baseUrl;
  }

  async get(api: string, data: Record<string, any>) {
    const url = new URL(`${this.baseUrl}/${api}`);
    Object.keys(data).forEach((key) => {
      url.searchParams.append(key, data[key]);
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.headers,
    });

    return response.json();
  }

  async post(api: string, data: Record<string, any>) {
    const response = await fetch(`${this.baseUrl}/${api}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async postForm(
    api: string,
    data: Record<string, any>,
    params?: Record<string, any>
  ) {
    // url拼接
    const url = new URL(`${this.baseUrl}/${api}`);
    if (params) {
      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
      });
    }
    console.log(url.toString(), "postUrl");

    // 表单数据
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      data[key] instanceof Blob
        ? formData.append(key, data[key], "2.xlsx")
        : formData.append(key, data[key]);
    });

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: this.headers,
      body: formData,
    });

    return response.json().then((res) => {
      return {
        ...res,
        url: url.toString(),
      };
    });
  }
}
