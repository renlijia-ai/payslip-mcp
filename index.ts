#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

// ts
type IBillItem = {
  itemId: string;
  itemName: string;
  viewByUser: boolean;
};
interface ISaveRequest {
  paySalaryItem: IBillItem;
  billItemGroups: [
    {
      billItems: IBillItem[];
    }
  ];
  feedback: boolean;
  handSign: boolean;
  warmTip: boolean;
  selectHides: [];
  warmTipContent: string;
  enableSubTitle: boolean;
  robotAnswer: string;
  templateId: string;
  billMonth: string;
  editType: string;
  billFormId: string;
  feedbackUserId: string;
  yearReportFlag: number;
  billFormName: string;
}

interface ISettingResponse {
  billFormId: string;
  billFormMonth: string;
  billFormName: string;
  billItemGroups: [
    {
      billItems: IBillItem[];
    }
  ];
  changeBillFormMonth: boolean;
  changeBillFormName: boolean;
  changeHandSign: boolean;
  changePaySalaryItem: boolean;
  feedback: boolean;
  feedbackAvatar: string;
  feedbackName: string;
  feedbackUserId: string;
  hasOpenHandSign: boolean;
  hasSendBill: boolean;
  match: boolean;
  notPaySalaryItemIds: string[];
  paySalaryItem: IBillItem;
  previewData: Record<string, string>;
  previewName: string;
  warmTip: boolean;
  warmTipContent: string;
  yearReportFlag: number;
}

// Server 开始
const server = new Server(
  {
    name: "mcp-server/baidu-map",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const MAPS_TOOLS: Tool[] = [
  {
    name: "payslip_send_bill",
    description: "发送一个人的工资条",
    inputSchema: {
      type: "object",
      properties: {
        rljN: {
          type: "string",
          description: "登录token",
        },
        billMonth: {
          type: "string",
          description: "工资条月份（格式：YYYY-MM)",
        },
        salaryGroupId: {
          type: "string",
          description: "工资条id",
        },
        userId: {
          type: "string",
          description: "员工id",
        },
      },
      required: ["billMonth", "salaryGroupId", "userId", "rljN"],
    },
  },
  {
    name: "payslip_upload_bill",
    description: "上传工资条",
    inputSchema: {
      type: "object",
      properties: {
        rljN: {
          type: "string",
          description: "登录token",
        },
        file: {
          type: "string",
          description: "上传文件的oss地址",
        },
      },
      required: ["file", "rljN"],
    },
  },
] as const;

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: MAPS_TOOLS,
}));

// 发送工资条
const handleSendBill = async (params: any) => {
  params.allFlag = 0;
  params.billSource = "1";

  const response = await fetch(
    "https://daily-payslip.renlijia.com/rest/api/v2/salaryBill/sendSalaryBill",
    {
      method: "post",
      headers: {
        "rlj-n": params.rljN,
      },
      body: JSON.stringify(params),
    }
  );
  const data: any = await response.json();

  return {
    content: [
      {
        type: "text",
        text: data.success ? "成功" : "失败",
      },
    ],
    isError: data.success,
  };
};
// 上传工资条
const handleUploadBill = async (file: string, rljN: string) => {
  const fileResponse = await fetch(file);
  const fileBlob = await fileResponse.blob();
  const formData = new FormData();
  formData.append("file", fileBlob, "2.xlsx");

  const url = new URL(
    "https://daily-payslip.renlijia.com/rest/api/v1/import/paySlip/parseExcel"
  );
  const searchParams = url.searchParams;
  searchParams.append("matchType", "userId");
  searchParams.append("sheetNumber", "undefined");
  searchParams.append("baseImportType", "bill");

  const response = await fetch(url.toString(), {
    method: "post",
    headers: {
      "rlj-n": rljN,
    },
    body: formData,
  });
  const data: any = await response.json();
  const { billFormId, paySalaryItemIndex }: any = data.result;
  await handleMatchExcel(billFormId, paySalaryItemIndex, rljN);
  const billSetting = await handleGetBillSetting(billFormId, rljN);
  const res = await handleSaveBill(billSetting, rljN);

  return {
    content: [
      {
        type: "text",
        text: res.result ? "成功👌🏻" : "失败×",
      },
    ],
    isError: !res.result,
  };
};
// 匹配excel薪资项
const handleMatchExcel = async (
  billFormId: string,
  paySalaryItemIndex: string,
  rljN: string
) => {
  const params: any = { billFormId, paySalaryItemIndex };

  const response = await fetch(
    "https://daily-payslip.renlijia.com/rest/api/v1/import/paySlip/matchExcelData",
    {
      method: "post",
      headers: {
        "rlj-n": rljN,
      },
      body: JSON.stringify(params),
    }
  );
  const data: any = await response.json();
  return data;
};
// 获取工资条设置
const handleGetBillSetting = async (
  billFormId: string,
  rljN: string
): Promise<ISettingResponse> => {
  const params: any = { billFormId, templateId: "" };

  const response = await fetch(
    "https://daily-payslip.renlijia.com/rest/api/v1/salaryBill/queryImportedSalaryBillSetting",
    {
      method: "post",
      headers: {
        "rlj-n": rljN,
      },
      body: JSON.stringify(params),
    }
  );
  const data: any = await response.json();
  return data.result;
};
// 保存工资条
const handleSaveBill = async (
  settingResponse: ISettingResponse,
  rljN: string
) => {
  const params: ISaveRequest = {
    billFormId: settingResponse.billFormId,
    billFormName: settingResponse.billFormName + "_jfjfjf",
    billItemGroups: settingResponse.billItemGroups,
    billMonth: settingResponse.billFormMonth,
    editType: "import",
    enableSubTitle: true,
    feedback: true,
    feedbackUserId: settingResponse.feedbackUserId,
    handSign: false,
    paySalaryItem: settingResponse.paySalaryItem,
    robotAnswer: "notShow",
    selectHides: [],
    templateId: "",
    warmTip: true,
    warmTipContent: "工资条属于敏感信息，请注意保密",
    yearReportFlag: 1,
  };

  const response = await fetch(
    "https://daily-payslip.renlijia.com/rest/api/v1/paySlip/saveImportedSalaryBill",
    {
      method: "post",
      headers: {
        "rlj-n": rljN,
      },
      body: JSON.stringify(params),
    }
  );
  const data: any = await response.json();
  return data;
};

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case "payslip_send_bill": {
        return await handleSendBill({ ...request.params.arguments });
      }
      case "payslip_upload_bill": {
        const { file, rljN }: any = request.params.arguments;
        return await handleUploadBill(file, rljN);
      }
      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${request.params.name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Baidu Map MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
