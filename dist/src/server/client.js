import { AI_MCP_TOKEN } from "../constants/index.js";
// 总方法
export class Client {
    baseUrl = "";
    headers;
    constructor(rljN, baseUrl) {
        this.headers = { "rlj-n": rljN, AI_MCP_TOKEN: AI_MCP_TOKEN };
        this.baseUrl = baseUrl;
    }
    async get(api, data) {
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
    async post(api, data) {
        const response = await fetch(`${this.baseUrl}/${api}`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(data),
        });
        return response.json();
    }
    async postForm(api, data, params) {
        // url拼接
        const url = new URL(`${this.baseUrl}/${api}`);
        if (params) {
            Object.keys(params).forEach((key) => {
                url.searchParams.append(key, params[key]);
            });
        }
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
