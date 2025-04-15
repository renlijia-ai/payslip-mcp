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
  {
    name:"queryBillByMonth",
    description:"按月份查询工资条信息（可以查询到的数据 工资条名称、已发送数量、已查看数量 、已确认梳理 ）",
    inputSchema:{
      type: "object",
      properties: {
        rljN: {
          type: "string",
          description: "登录token",
        } , billMonth: {
          type: "string",
          description: "工资条月份（格式：YYYY-MM)",
        },pageSize:{
          type:"string",
          description:"分页数量 默认为 5",
        },startId:{
          type:"string",
          description:"查询的起始位置 上一个列表结果的中最后一个数据的 id",
        }
    }
  }
},
{
  name:"根据人员、部门、发送状态、查看状态、确认状态、筛选工资条详情中的数据 ",
  description:"",
  inputSchema:{
    type: "object",
    roperties: {
      rljN: {
        type: "string",
        description: "登录token",
      },billMonth:{
        type:"string",
        description: "工资条月份（格式：YYYY-MM)",
      },billSource:{
        type:"string",
        description: "0-薪资计算，1-excel导入",
      },search:{
        type:"string",
        description:"按姓名、工号、职位筛选"
      },sendStatus:{
        type:"string",
        description:"工资条发送状态，逗号隔开 0 未发送 、1 已发送、 2 已撤回"
      },readStatus:{
        type:"string",
        description:"工资条查看状态，逗号隔开  0 未读、1 已读"
      },confirmStatus:{
        type:"string",
        description:"工资条确认状态，逗号隔开 0 未读 1 已读"
      },salaryGroupId:{
        type:"string",
        description:"薪资组salarygroupid或者excel导入的billformid"
      },
    }
  }

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
// 查询工资条列表 
const handleQueryBillByMonth =async(params:any)=>{
  const response=await fetch(
    "https://daily-payslip.renlijia.com/rest/api/v2/salaryBill/sendSalaryBill",
    {
      method:"post",
      headers:{
        "rlj-n":params.rljN,
      },
      body:JSON.stringify(params),
    }
  );
  const data:any=await response.json;

  return {
    content: formatContent(data.result, data.success),
    isError: !data.success,
  }
};

// 筛选工资条详情中的员工
const querySalaryBillByPage=async(params:any)=>{
  const response=await fetch(
    "https://daily-payslip.renlijia.com/rest/api/v2/salaryBill/sendSalaryBill",
    {
      method:"post",
      headers:{
        "rlj-n":params.rljN,
      },
      body:JSON.stringify(params),
    }
  );
  const  data:any = await response.json;
  return {
    content: formatContent2(data.result,data.success),
    isError: !data.success,
  }

}



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

// 辅助函数：将数据格式化为前端需要的文本内容
function formatContent(result:any, isSuccess:boolean) {
  const contents = [];

  if (!isSuccess) {
    // 接口失败时，显示错误信息（假设 data 中有 error 字段）
    contents.push({
      type: "text",
      text: "操作失败，请检查参数或联系管理员",
    });
  } else {
    // 遍历 result 数组，为每个工资条生成文本
    result.forEach((item: any)  => {
      contents.push({
        type: "text",
        text: `工资条Id【${item.id}】工资条名称【${item.salaryBillName}】，总人数：${item.allUserNum} 已发送人数：${item.sentUserNum}， 已查看人数：${item.readUserNum}， 薪酬 salaryBillId:${item.salaryBillId}`,
      });
    });
  }

  return contents;
}

// 辅助函数：将数据格式化为前端需要的文本内容
function formatContent2(result:any, isSuccess:boolean) {
  const contents = [];

  if (!isSuccess) {
    // 接口失败时，显示错误信息（假设 data 中有 error 字段）
    contents.push({
      type: "text",
      text: "操作失败，请检查参数或联系管理员",
    });
  } else {
    // 遍历 result 数组，为每个工资条生成文本
    result.data.forEach((item: any)  => {
      contents.push({
        type: "text",
        text: `员工id【${item.userId}】员工姓名【${item.userName},发送时间 ${item.readTime} 部门${item.deptName}`,
      });
    });
  }

  return contents;
}


