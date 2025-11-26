/**
 * 天氣 API 測試腳本
 * 使用方式: node test-api.js
 */

const axios = require("axios");

const BASE_URL = "http://localhost:3000";

// 測試函數
async function testAPI() {
  console.log("==========================================");
  console.log("天氣 API 測試腳本");
  console.log("==========================================\n");

  try {
    // 1. 檢查服務器健康狀態
    console.log("1. 檢查服務器健康狀態...");
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log(JSON.stringify(healthResponse.data, null, 2));
    console.log("\n");

    // 2. 取得支援的城市列表
    console.log("2. 取得支援的城市列表...");
    const citiesResponse = await axios.get(`${BASE_URL}/api/weather/cities`);
    console.log(JSON.stringify(citiesResponse.data, null, 2));
    console.log("\n");

    // 3. 取得單一城市天氣（臺北市）
    console.log("3. 取得臺北市天氣預報...");
    const taipeiResponse = await axios.get(
      `${BASE_URL}/api/weather/city/臺北市`
    );
    console.log(JSON.stringify(taipeiResponse.data, null, 2));
    console.log("\n");

    // 4. 取得單一城市天氣（新北市）
    console.log("4. 取得新北市天氣預報...");
    const newtaipeiResponse = await axios.get(
      `${BASE_URL}/api/weather/city/新北市`
    );
    console.log(JSON.stringify(newtaipeiResponse.data, null, 2));
    console.log("\n");

    // 5. 取得新北市天氣（舊端點，向後兼容）
    console.log("5. 取得新北市天氣預報（舊端點）...");
    const oldEndpointResponse = await axios.get(
      `${BASE_URL}/api/weather/newtaipei`
    );
    console.log(JSON.stringify(oldEndpointResponse.data, null, 2));
    console.log("\n");

    // 6. 取得多個城市天氣
    console.log("6. 取得多個城市天氣預報（臺北市、新北市、桃園市）...");
    const multipleResponse = await axios.get(
      `${BASE_URL}/api/weather/multiple`,
      {
        params: {
          cities: "臺北市,新北市,桃園市",
        },
      }
    );
    console.log(JSON.stringify(multipleResponse.data, null, 2));
    console.log("\n");

    // 7. 測試錯誤處理 - 不支援的城市
    console.log("7. 測試錯誤處理 - 不支援的城市...");
    try {
      await axios.get(`${BASE_URL}/api/weather/city/不存在的城市`);
    } catch (error) {
      if (error.response) {
        console.log(JSON.stringify(error.response.data, null, 2));
      } else {
        console.log("錯誤:", error.message);
      }
    }
    console.log("\n");

    console.log("==========================================");
    console.log("✅ 所有測試完成！");
    console.log("==========================================");
  } catch (error) {
    console.error("❌ 測試失敗:", error.message);
    if (error.response) {
      console.error("回應狀態:", error.response.status);
      console.error("回應資料:", error.response.data);
    }
    process.exit(1);
  }
}

// 執行測試
testAPI();

