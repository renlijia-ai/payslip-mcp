export type IBillItem = {
  itemId: string;
  itemName: string;
  viewByUser: boolean;
};
export interface ISaveRequest {
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

export interface ISettingResponse {
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
