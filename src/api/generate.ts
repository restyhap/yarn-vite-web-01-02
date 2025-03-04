import { generateApi } from "swagger-typescript-api";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generate = async () => {
  try {
    await generateApi({
      name: "generated.ts",
      output: resolve(__dirname, "./"),
      url: "http://localhost:8080/v3/api-docs",
      httpClientType: "axios",
      moduleNameFirstTag: true,
      generateClient: true,
      generateRouteTypes: true,
      generateResponses: true,
      extractRequestParams: true,
      extractRequestBody: true,
      prettier: {
        printWidth: 120,
        tabWidth: 2,
        trailingComma: "all",
        parser: "typescript",
      },
    });
    console.log("✅ API 生成成功！");
  } catch (e) {
    console.error("❌ API 生成失败：", e);
    console.error(e);
  }
};

generate();
