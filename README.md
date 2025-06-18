# 工资条 MCP Server 介绍

payslip-web 是基于 MCP 协议的 AI 智能体工资条管理工具，作为企业薪酬场景的基础服务能力，支持各类智能体应用安全、便捷地接入工资条管理能力。平台通过标准化接口，向 LLM、Agent 等智能体开放工资条全流程服务，具备高度通用性和可扩展性。

## 1. 应用场景

某中型科技公司HR在未接入智能工资条MCP Server前，需登录电脑的智能工资条应用选择上传文件，手动配置工资条项目、匹配员工信息，并逐步分发工资条，流程繁琐且易出错。接入工资条MCP Server并集成到钉钉AI助理后，HR只需通过钉钉AI助理一键上传工资表，系统自动解析结构、智能匹配员工信息和工资项目，确认后即可一键发送工资条。HR还可随时通过AI助理实时查询员工的查看、确认状态及历史工资明细，无需频繁登录系统，极大提升了工作效率、准确性和员工满意度，确保了企业薪酬管理的合规性和智能化升级。

## 2. 功能特点

- **Excel 工资表解析**：自动识别工资表结构，支持多 Sheet 页分析
- **灵活匹配规则**：支持通过员工 ID、工号或姓名进行匹配
- **智能工资条配置**：自动识别和配置工资条项目，包括实发工资、各类津贴和扣款项
- **批量发送管理**：支持全部发送或选择性发送工资条
- **状态跟踪**：实时监控工资条的发送、查看和确认状态
- **数据汇总分析**：提供跨月度的工资数据汇总和分析功能

##  3.使用和配置
要使用工具的能力，你需要先成为钉钉智能工资条的用户

在 Cursor 和 Cline中配置

```
{
  "mcpServers": {
    "payslip-web": {
      "args": [
        "-y",
        "@rlj/payslip-mcp@latest"
      ],
      "command": "npx",
      "env": {
        "ENV": "daily",
        "AI_MCP_Rlj_N": "eyJraWQiOiIxMmNiNWEzNi1iYzIyLTRmNzItOGNhNC1hMmFmMjZlNjI1MDYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ7XCJpZFwiOlwic2lkXzQxZThlMzQ1ZDI5OTQ3MjQ5MGExNzg0YjBmZmRiNWUzXCIsXCJzZXNzaW9uQXR0cnNcIjp7XCJfTE9HSU5fVElNRVwiOjE3NTAyMzA5OTk3OTksXCJfTE9HSU5fQ0xJRU5UXCI6XCJPQVwiLFwiSl9HTE9CQUxfVVNFUl9LRVlcIjp7XCJjb3JwSWRcIjpcImRpbmc0YzdjMzExYTcwMTg1MWFjMzVjMmY0NjU3ZWI2Mzc4ZlwiLFwidXNlcklkXCI6XCIyNDIxNDU1MTI1Mjg1MDRcIn0sXCJKX1VTRVJfS0VZXCI6e1wiY29ycElkXCI6XCJkaW5nNGM3YzMxMWE3MDE4NTFhYzM1YzJmNDY1N2ViNjM3OGZcIixcImxvZ2luQXBwXCI6XCJCSUxMXCIsXCJuYW1lXCI6XCLmvZjmjK_otoVcIixcInJvbGVzXCI6W1wiYWRtaW5cIl0sXCJ1c2VySWRcIjpcIjI0MjE0NTUxMjUyODUwNFwifSxcIl9MT0dJTl9BUFBcIjpcIkJJTExcIn0sXCJ0XCI6MTc1MDIzMTAwMTIyMn0ifQ.STrACeZKHtM0qLsEsUS9GTrC0w6DtK6fS4lmfVkV8AFMNuWzQ3zwYVGBjxy-Nw4WQwdZb81w-QWq1ofvx5FFbuGvMnGdiq89tv2DOSQsV4Lb4GPHHXs5aUVqLJNfLqrLAfNRw04Snh0waOWozgNqTJI-_9XHc3C0yOxGWNrc1lLumAOq3dDY09g-pxTBCB1GVrv21Oy3FuaSgHEFBgFfffhtUK6rgccnh8xIiQLk0CY9ROrl1wsH1fH1WsHDhLHoVyp8-oFqFKZPuPnZRawBO9yjfpDrNaktFjs6AbABJHP-gMlaS3LWi0-GPmLN6NJEzHoEaoTmAjVQ6VMS1Qz8Ww"
      }
    }
  }
}

``` 