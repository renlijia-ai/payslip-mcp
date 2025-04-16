import { Client } from "./server/client.js";

const getGet = async () => {
  const client = new Client(
    "eyJraWQiOiJlZDI1NzhiMi04NTQ4LTQwM2QtODg2Zi1lZTQxNTlmOWUwMzUiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ7XCJpZFwiOlwic2lkX2JmM2Y5MTU0ZjM5OTQwZTI4Mzk2YjYwYTU3ZTMzMzZmXCIsXCJzZXNzaW9uQXR0cnNcIjp7XCJfTE9HSU5fVElNRVwiOjE3NDQ3ODI4Nzk5NDEsXCJfTE9HSU5fQ0xJRU5UXCI6XCJPQVwiLFwiSl9HTE9CQUxfVVNFUl9LRVlcIjp7XCJjb3JwSWRcIjpcImRpbmc0YzdjMzExYTcwMTg1MWFjMzVjMmY0NjU3ZWI2Mzc4ZlwiLFwidXNlcklkXCI6XCIwNzU5MTk0MzEyMjI5MzcyMzNcIn0sXCJKX1VTRVJfS0VZXCI6e1wiY29ycElkXCI6XCJkaW5nNGM3YzMxMWE3MDE4NTFhYzM1YzJmNDY1N2ViNjM3OGZcIixcImxvZ2luQXBwXCI6XCJCSUxMXCIsXCJuYW1lXCI6XCLlp5rmlozmnYNcIixcInJvbGVzXCI6W1wiYWRtaW5cIl0sXCJ1c2VySWRcIjpcIjA3NTkxOTQzMTIyMjkzNzIzM1wifSxcIl9MT0dJTl9BUFBcIjpcIkJJTExcIn0sXCJ0XCI6MTc0NDc4NDYzMjk3NH0ifQ.KVjC31ToMs6Wm9QGrYeW1bovr7jRyuSYdz2ANc8ieQ9OBw9z-gTAzWfL9nYBhEDyAz6ssfd64BrbJ66NyOJnDTvhQHd9x0ZxWoX2oqgM3lZQjXeq_nUSSpzJJ0iiDvCHEEmhutqdpNiP4v0FPskAA_fa8X-jrSFAUii_z4j1PZYGiFSD20ETV6RrjHRqDrj-I1ZIoJ2ZrsL0i_GVBe4M19LeFnQG0bMGotjppmsZKelvCl12WticCPx7vax04n8ExcLhIUUpqsz0yxdO8skvLK-eUvsjgtw67u7PGxjD_u31lc-OSXQ0W6C2XG5DkQC6wiaOt02BGJ1kBwNmFB8H7g"
  );

  const fileResponse = await fetch(
    "https://rlj-assets.oss-cn-hangzhou.aliyuncs.com/test-dist/2.xlsx"
  );
  const fileBlob = await fileResponse.blob();
  const res = await client.postForm(
    "v1/import/paySlip/parseExcel",
    {
      file: fileBlob,
    },
    {
      matchType: "userId",
      sheetNumber: "undefined",
      baseImportType: "bill",
    }
  );
  console.log(res, " ress");
};

getGet();
