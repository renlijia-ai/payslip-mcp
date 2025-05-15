import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { Client } from "./client.js";
import { apiPrefixMapping } from "../constants/index.js";

export const switchApi = async (request: CallToolRequest) => {
  const params = { ...request.params.arguments };
  const client = new Client(
    params.rljN as string,
    apiPrefixMapping[params.env as string]
  );

  let response;

  switch (request.params.name) {
    case "payslip_get_sheet_name": {
      const fileResponse = await fetch(params.file as string);
      const fileBlob = await fileResponse.blob();
      response = await client.postForm("v1/commonImport/getSheetName", {
        file: fileBlob,
      });
      break;
    }
    case "payslip_query_match_type_info": {
      const fileResponse = await fetch(params.file as string);
      const fileBlob = await fileResponse.blob();
      response = await client.postForm(
        "v1/import/paySlip/queryMatchTypeInfo",
        { file: fileBlob },
        { sheetNumber: params.sheetNumber }
      );
      break;
    }
    case "payslip_send_bill": {
      response = await client.post("v2/salaryBill/sendSalaryBill", {
        ...params,
        billSource: "1",
      });
      break;
    }
    case "payslip_upload_bill": {
      const fileResponse = await fetch(params.file as string);
      const fileBlob = await fileResponse.blob();
      response = await client.postForm(
        "v1/import/paySlip/parseExcel",
        {
          file: fileBlob,
        },
        {
          matchType: params.matchType,
          sheetNumber: params.sheetNumber,
          baseImportType: "bill",
        }
      );
      break;
    }
    case "payslip_match_excel_data": {
      response = await client.post("v1/import/paySlip/matchExcelData", params);
      break;
    }
    case "payslip_get_bill_setting": {
      response = await client.post(
        "v1/salaryBill/queryImportedSalaryBillSetting",
        { ...params, templateId: "" }
      );
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
    case "payslip_revoke_bill": {
      response = await client.post("v2/salaryBill/revokeSalaryBill", {
        ...params,
        billSource: "1",
      });
      break;
    }
    case "payslip_delete_bill": {
      response = await client.post("v1/salaryBill/deleteSalaryBill4Excel", {
        ...params,
        billSource: "1",
      });
      break;
    }
    case "payslip_get_report_data": {
      response = await client.post("v1/report/getEmp", {
        ...params,
        page: 1,
        pageSize: 10,
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
