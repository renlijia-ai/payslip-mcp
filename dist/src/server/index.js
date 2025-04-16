import { Client } from "./client.js";
export const switchApi = async (request) => {
    const params = { ...request.params.arguments };
    const client = new Client(params.rljN);
    let response;
    switch (request.params.name) {
        case "payslip_send_bill": {
            response = await client.post("v2/salaryBill/sendSalaryBill", {
                ...params,
                allFlag: 0,
                billSource: "1",
            });
            break;
        }
        case "payslip_upload_bill": {
            const fileResponse = await fetch(params.file);
            const fileBlob = await fileResponse.blob();
            response = await client.postForm("v1/import/paySlip/parseExcel", {
                file: fileBlob,
            }, {
                matchType: "userId",
                sheetNumber: "undefined",
                baseImportType: "bill",
            });
            break;
        }
        case "payslip_match_excel_data": {
            response = await client.post("v1/import/paySlip/matchExcelData", params);
            break;
        }
        case "payslip_get_bill_setting": {
            response = await client.post("v1/salaryBill/queryImportedSalaryBillSetting", { ...params, templateId: "" });
            break;
        }
        case "payslip_save_bill": {
            response = await client.post("v1/paySlip/saveImportedSalaryBill", {
                ...params,
                editType: "import",
                enableSubTitle: true,
                feedback: true,
                handSign: false,
                robotAnswer: "notShow",
                selectHides: [],
                templateId: "",
                warmTip: true,
                warmTipContent: "工资条属于敏感信息，请注意保密",
                yearReportFlag: 1,
            });
            break;
        }
        case "payslip_get_bill_list": {
            response = await client.post("v1/salaryBill/queryBillByMonth", {
                ...params,
            });
            break;
        }
        case "payslip_get_bill_detail": {
            response = await client.post("v3/salaryBill/querySalaryBillByPage", {
                ...params,
                pageSize: 8,
                page: 1,
                deptIds: "",
                userIds: "",
                billSource: "1",
            });
            break;
        }
        default:
            throw new Error(`Unknown tool: ${request.params.name}`);
    }
    return {
        content: [
            {
                type: "text",
                text: `${JSON.stringify(response, null, 2)}`,
            },
        ],
        isError: !response.success,
    };
};
