const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

// 取得支援的城市列表
router.get("/cities", weatherController.getSupportedCities);

// 取得新北天氣預報（保持向後兼容）
router.get("/newtaipei", weatherController.getNewtaipeiWeather);

// 取得單一區域天氣預報（通用端點）
// 使用方式: GET /api/weather/city/臺北市
router.get("/city/:city", weatherController.getCityWeather);

// 取得多個區域天氣預報
// 使用方式: GET /api/weather/multiple?cities=臺北市,新北市,桃園市
router.get("/multiple", weatherController.getMultipleCitiesWeather);

module.exports = router;
