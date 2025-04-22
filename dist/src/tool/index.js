import { rljN_const } from "../constants/index.js";
const getInputSchema = (properties, required) => {
    return {
        type: "object",
        properties: rljN_const
            ? properties
            : {
                rljN: {
                    type: "string",
                    description: "登录token",
                },
                ...properties,
            },
        required: rljN_const ? required : ["rljN", ...required],
    };
};
export const MAPS_TOOLS = [
    {
        name: "payslip_send_bill",
        description: `发送工资条
    返回值 { rid: "请求id", success: true }
    如果success为true, 则表示发送成功`,
        inputSchema: getInputSchema({
            allFlag: {
                type: "string",
                description: "是否发送全部工资条 0-否 1-是",
                enum: [0, 1],
            },
            billMonth: {
                type: "string",
                description: "工资条月份,格式:YYYY-MM, 例如2025-03",
            },
            billSource: {
                type: "string",
                description: "工资条来源 1-excel导入",
                enum: ["1"],
            },
            salaryGroupId: {
                type: "string",
                description: "工资条id",
            },
            cacheKey: {
                type: "string",
                description: "工资条缓存key, 发送全部工资条的时候, 传此参数, 参数来源为querySalaryBillByPage接口返回的cacheKey",
            },
            userId: {
                type: "string",
                description: "员工id, 发送全部工资条的时候, 无需传此参数",
            },
        }, ["billMonth", "salaryGroupId"]),
    },
    {
        name: "payslip_upload_bill",
        description: `上传工资条, 把excel文件的oss地址上传到服务器
    返回值{
      "result": {
        "billFormId": "工资条id",
        "dataHeaders": ["excel表头1","excel表头2"],
        "paySalaryItemIndex": 17
      },
      "rid": "请求id",
      "success": true
    }
    paySalaryItemIndex是实发工资的列数, 从0开始
    上传完成后, 需要匹配工资条数据(payslip_match_excel_data)
    匹配成功后, 需要获取工资条设置(payslip_get_bill_setting), 入参从payslip_match_excel_data取
    获取工资条设置后, 需要保存工资条(payslip_save_bill),入参从payslip_get_bill_setting取
    `,
        inputSchema: getInputSchema({
            file: {
                type: "string",
                description: "excel文件的oss地址",
            },
        }, ["file"]),
    },
    {
        name: "payslip_match_excel_data",
        description: `匹配工资条数据, 把上传的工资条数据匹配到员工信息`,
        inputSchema: getInputSchema({
            billFormId: {
                type: "string",
                description: "工资条id",
            },
            paySalaryItemIndex: {
                type: "string",
                description: "工资条数据中的实发工资列数, 从0开始",
            },
        }, ["billFormId", "paySalaryItemIndex"]),
    },
    {
        name: "payslip_get_bill_setting",
        description: `获取工资条设置
    返回值{
      "result": {
          "billFormId": "工资条id",
          "billFormMonth": "工资条月份",
          "billFormName": "工资条名称",
          // billItemGroups 工资条分组信息, viewByUser 是否可见 true-开启 false-关闭
          "billItemGroups": [
              {
                  "billItems": [
                      {
                          "itemId": "0",
                          "itemName": "姓名",
                          "viewByUser": true
                      },
                  ]
              }
          ],
          "changeBillFormMonth": true,
          "changeBillFormName": true,
          "changeHandSign": true, // 是否开启手写签名 true-开启 false-关闭
          "changePaySalaryItem": true,
          "feedback": true, // 反馈 true-开启 false-关闭
          "feedbackAvatar": "https://static-legacy.dingtalk.com/media/lQDPD4TkpAqdRy3NA6fNA6ewxuUiZlYAWQIHZSAamw7sAA_935_935.jpg",
          "feedbackName": "xxx", // 反馈人姓名
          "feedbackUserId": "075919431222937233", // 反馈人id
          "hasOpenHandSign": true, // 是否开启手写签名 true-开启 false-关闭
          "hasSendBill": false,
          "match": true,
          "notPaySalaryItemIds": [
              "0",
              "1",
              "3",
              "4"
          ],
          // paySalaryItem 匹配到 实发工资信息
          "paySalaryItem": {
              "itemId": "17",
              "itemName": "实发金额",
              "viewByUser": true
          },
          "previewData": {
              "0": "xxx",
              "1": "075919431222937233",
              "2": "",
              "3": "rr033",
              "4": "",
              "5": "",
              "6": "",
              "7": "",
              "8": "",
              "9": "",
              "10": "",
              "11": "",
              "12": "",
              "13": "",
              "14": "",
              "15": "",
              "16": "",
              "17": ""
          },
          "previewName": "xxx", // 预览人姓名
          "warmTip": true, // 温馨提醒 true-开启 false-关闭
          "warmTipContent": "工资条属于敏感信息，请注意保密",
          "yearReportFlag": 0 // 年度汇总, 0-不开启 1-开启
      },
      "rid": "请求id",
      "success": true
    }
    `,
        inputSchema: getInputSchema({
            billFormId: {
                type: "string",
                description: "工资条id",
            },
            templateId: {
                type: "string",
                description: "工资条模板id",
                enum: [""],
            },
        }, ["billFormId"]),
    },
    {
        name: "payslip_save_bill",
        description: `保存工资条`,
        inputSchema: getInputSchema({
            billFormId: {
                type: "string",
                description: "工资条id",
            },
            billFormName: {
                type: "string",
                description: "工资条名称",
            },
            billMonth: {
                type: "string",
                description: "工资条月份",
            },
            feedbackUserId: {
                type: "string",
                description: "反馈人id",
            },
            paySalaryItem: {
                type: "object",
                description: "匹配到的实发工资信息",
            },
            billItemGroups: {
                type: "object",
                description: "工资条分组信息",
            },
        }, [
            "billFormId",
            "billFormName",
            "billMonth",
            "paySalaryItem",
            "billItemGroups",
            "feedbackUserId",
        ]),
    },
    {
        name: "payslip_get_bill_list",
        description: `按月份查询工资条信息
    可以查询到的工资条的数据: 工资条名称、已发送数量、已查看数量 、已确认数量、工资条id
    发送工资条、撤回工资条,都需要用到工资条id
    返回结果
    {
      "type": "object",
      "required": [],
      "properties": {
        "result": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [],
            "properties": {
              "allUserNum": {
                "type": "number",
                description: "总人数"
              },
              "confirmUserNum": {
                "type": "number",
                description: "已确认数量"
              },
              "readUserNum": {
                "type": "number",
                description: "已查看数量"
              },
              "salaryBillId": {
                "type": "string",
                description: "工资条id"
              },
              "salaryBillName": {
                "type": "string",
                description: "工资条名称"
              },
              "sentUserNum": {
                "type": "number",
                description: "已发送数量"
              }
            }
          }
        },
        "rid": {
          "type": "string",
          description: "请求id"
        },
        "success": {
          "type": "boolean",
          description: "是否成功"
        }
      }
    }`,
        inputSchema: getInputSchema({
            billMonth: {
                type: "string",
                description: "工资条月份, 格式:YYYY-MM",
            },
            pageSize: {
                type: "string",
                description: "分页数量",
                default: "100",
            },
            startId: {
                type: "string",
                description: "起始id",
                default: "",
            },
        }, ["billMonth"]),
    },
    {
        name: "payslip_get_bill_detail",
        description: `根据人员、部门、发送状态、查看状态、确认状态、筛选 查询工资条详情中的，可以知道 员工信息(姓名、员工状态、部门), 工资条信息（实发金额、发送状态、查看状态 、确认状态）
      返回结果
      {
        "type": "object",
        "required": [],
        "properties": {
          "result": {
            "type": "object",
            "required": [],
            "properties": {
              "allRevoke": {
                "type": "boolean",
                "description": "是否全部撤回"
              },
              "allSent": {
                "type": "boolean",
                "description": "是否全部发送"
              },
              "billFormName": {
                "type": "string",
                "description": "工资条名称"
              },
              "billMonth": {
                "type": "string",
                "description": "工资条月份, 格式:YYYY-MM"
              },
              "cacheKey": {
                "type": "string",
                "description": "缓存key, 该缓存key包含了所有员工信息, 在全部发送,全部撤回时需要使用"
              },
              "data": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [],
                  "properties": {
                    "confirmStatus": {
                      "type": "string",
                      "description": "确认状态, 0-未确认 1-已确认"
                    },
                    "confirmTime": {
                      "type": "string",
                      "description": "确认时间"
                    },
                    "deptName": {
                      "type": "string",
                      "description": "部门名称"
                    },
                    "needRemind": {
                      "type": "boolean",
                      "description": "是否需要提醒"
                    },
                    "paySalary": {
                      "type": "string",
                      "description": "实发工资"
                    },
                    "position": {
                      "type": "string",
                      "description": "职位"
                    },
                    "readStatus": {
                      "type": "string",
                      "description": "查看状态, 0-未查看 1-已查看"
                    },
                    "readTime": {
                      "type": "string",
                      "description": "查看时间"
                    },
                    "revokeTime": {
                      "type": "string",
                      "description": "撤回时间"
                    },
                    "sendStatus": {
                      "type": "number",
                      "description": "发送状态, 0-未发送 1-已发送"
                    },
                    "sendTime": {
                      "type": "string",
                      "description": "发送时间"
                    },
                    "userId": {
                      "type": "string",
                      "description": "员工id"
                    },
                    "userName": {
                      "type": "string",
                      "description": "员工姓名"
                    }
                  }
                }
              },
              "page": {
                "type": "number",
                "description": "当前页码"
              },
              "pageSize": {
                "type": "number",
                "description": "每页数量"
              },
              "salaryGroupId": {
                "type": "string",
                "description": "工资条id"
              },
              "searchCount": {
                "type": "number",
                "description": "查询数量"
              }
            }
          },
          "rid": {
            "type": "string",
            "description": "请求id"
          },
          "success": {
            "type": "boolean",
            "description": "是否成功"
          }
        }
      }
      `,
        inputSchema: getInputSchema({
            salaryGroupId: {
                type: "string",
                description: "工资条id",
            },
            billMonth: {
                type: "string",
                description: "工资条月份, 格式:YYYY-MM",
            },
            search: {
                type: "string",
                description: "按姓名、工号、职位筛选",
            },
            sendStatus: {
                type: "string",
                description: "工资条发送状态，逗号隔开 0-未发送 、1-已发送、 2-已撤回",
                enum: ["0", "1", "2"],
                default: "",
            },
            readStatus: {
                type: "string",
                description: "工资条查看状态，逗号隔开  0 未读、1 已读",
                enum: ["0", "1"],
                default: "",
            },
            confirmStatus: {
                type: "string",
                description: "工资条确认状态，逗号隔开 0 未读、1 已读",
                enum: ["0", "1"],
                default: "",
            },
        }, ["salaryGroupId", "billMonth"]),
    },
];
