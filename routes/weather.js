const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

// 取得新北天氣預報
router.get("/newtaipei", weatherController.getNewtaipeiWeather);

module.exports = router;
