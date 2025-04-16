// 辅助函数：将数据格式化为前端需要的文本内容
export const formatContent = (result, isSuccess) => {
    const contents = [];
    if (!isSuccess) {
        // 接口失败时，显示错误信息（假设 data 中有 error 字段）
        contents.push({
            type: "text",
            text: "操作失败，请检查参数或联系管理员",
        });
    }
    else {
        // 遍历 result 数组，为每个工资条生成文本
        result.forEach((item) => {
            contents.push({
                type: "text",
                text: `工资条Id【${item.id}】工资条名称【${item.salaryBillName}】，总人数：${item.allUserNum} 已发送人数：${item.sentUserNum}， 已查看人数：${item.readUserNum}， 薪酬 salaryBillId:${item.salaryBillId}`,
            });
        });
    }
    return contents;
};
// 辅助函数：将数据格式化为前端需要的文本内容
export const formatContent2 = (result, isSuccess) => {
    const contents = [];
    if (!isSuccess) {
        // 接口失败时，显示错误信息（假设 data 中有 error 字段）
        contents.push({
            type: "text",
            text: "操作失败，请检查参数或联系管理员",
        });
    }
    else {
        // 遍历 result 数组，为每个工资条生成文本
        result.data.forEach((item) => {
            contents.push({
                type: "text",
                text: `员工id【${item.userId}】员工姓名【${item.userName},发送时间 ${item.readTime} 部门${item.deptName}`,
            });
        });
    }
    return contents;
};
