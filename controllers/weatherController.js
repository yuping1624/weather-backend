const axios = require("axios");

// CWA API 設定
const CWA_API_BASE_URL = "https://opendata.cwa.gov.tw/api";
const CWA_API_KEY = process.env.CWA_API_KEY;

// 支援的城市列表
const SUPPORTED_CITIES = [
  "臺北市",
  "新北市",
  "桃園市",
  "臺中市",
  "臺南市",
  "高雄市",
  "基隆市",
  "新竹市",
  "新竹縣",
  "苗栗縣",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義市",
  "嘉義縣",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "臺東縣",
  "澎湖縣",
  "金門縣",
  "連江縣",
];

/**
 * 解析天氣資料的輔助函數
 */
const parseWeatherData = (locationData, datasetDescription) => {
  const weatherData = {
    city: locationData.locationName,
    updateTime: datasetDescription,
    forecasts: [],
  };

  // 解析天氣要素
  const weatherElements = locationData.weatherElement;
  const timeCount = weatherElements[0].time.length;

  for (let i = 0; i < timeCount; i++) {
    const forecast = {
      startTime: weatherElements[0].time[i].startTime,
      endTime: weatherElements[0].time[i].endTime,
      weather: "",
      rain: "",
      minTemp: "",
      maxTemp: "",
      comfort: "",
      windSpeed: "",
    };

    weatherElements.forEach((element) => {
      const value = element.time[i].parameter;
      switch (element.elementName) {
        case "Wx":
          forecast.weather = value.parameterName;
          break;
        case "PoP":
          forecast.rain = value.parameterName + "%";
          break;
        case "MinT":
          forecast.minTemp = value.parameterName + "°C";
          break;
        case "MaxT":
          forecast.maxTemp = value.parameterName + "°C";
          break;
        case "CI":
          forecast.comfort = value.parameterName;
          break;
        case "WS":
          forecast.windSpeed = value.parameterName;
          break;
      }
    });

    weatherData.forecasts.push(forecast);
  }

  return weatherData;
};

/**
 * 取得單一區域天氣預報的通用函數
 */
const getWeatherByLocation = async (locationName) => {
  if (!CWA_API_KEY) {
    throw new Error("請在 .env 檔案中設定 CWA_API_KEY");
  }

  // 呼叫 CWA API - 一般天氣預報（36小時）
  // API 文件: https://opendata.cwa.gov.tw/dist/opendata-swagger.html
  const response = await axios.get(
    `${CWA_API_BASE_URL}/v1/rest/datastore/F-C0032-001`,
    {
      params: {
        Authorization: CWA_API_KEY,
        locationName: locationName,
      },
    }
  );

  // 取得該區域的天氣資料
  const locationData = response.data.records.location[0];

  if (!locationData) {
    throw new Error(`無法取得 ${locationName} 天氣資料`);
  }

  return parseWeatherData(
    locationData,
    response.data.records.datasetDescription
  );
};

/**
 * 取得新北天氣預報（保持向後兼容）
 */
const getNewtaipeiWeather = async (req, res) => {
  try {
    const weatherData = await getWeatherByLocation("新北市");

    res.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    console.error("取得天氣資料失敗:", error.message);

    if (error.response) {
      // API 回應錯誤
      return res.status(error.response.status).json({
        error: "CWA API 錯誤",
        message: error.response.data.message || "無法取得天氣資料",
        details: error.response.data,
      });
    }

    // 其他錯誤
    res.status(500).json({
      error: "伺服器錯誤",
      message: error.message || "無法取得天氣資料，請稍後再試",
    });
  }
};

/**
 * 取得單一區域天氣預報（通用端點）
 * 使用方式: GET /api/weather/:city
 */
const getCityWeather = async (req, res) => {
  try {
    const cityName = req.params.city;

    // 驗證城市名稱
    if (!SUPPORTED_CITIES.includes(cityName)) {
      return res.status(400).json({
        error: "不支援的城市",
        message: `不支援的城市名稱: ${cityName}`,
        supportedCities: SUPPORTED_CITIES,
      });
    }

    const weatherData = await getWeatherByLocation(cityName);

    res.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    console.error("取得天氣資料失敗:", error.message);

    if (error.response) {
      // API 回應錯誤
      return res.status(error.response.status).json({
        error: "CWA API 錯誤",
        message: error.response.data.message || "無法取得天氣資料",
        details: error.response.data,
      });
    }

    // 其他錯誤
    res.status(500).json({
      error: "伺服器錯誤",
      message: error.message || "無法取得天氣資料，請稍後再試",
    });
  }
};

/**
 * 取得多個區域天氣預報
 * 使用方式: GET /api/weather/multiple?cities=臺北市,新北市,桃園市
 */
const getMultipleCitiesWeather = async (req, res) => {
  try {
    const citiesParam = req.query.cities;

    if (!citiesParam) {
      return res.status(400).json({
        error: "參數錯誤",
        message: "請提供 cities 參數，例如: ?cities=臺北市,新北市",
      });
    }

    // 解析城市列表
    const cities = citiesParam.split(",").map((city) => city.trim());

    // 驗證所有城市
    const invalidCities = cities.filter(
      (city) => !SUPPORTED_CITIES.includes(city)
    );

    if (invalidCities.length > 0) {
      return res.status(400).json({
        error: "不支援的城市",
        message: `以下城市不支援: ${invalidCities.join(", ")}`,
        invalidCities: invalidCities,
        supportedCities: SUPPORTED_CITIES,
      });
    }

    // 並行取得所有城市的天氣資料
    const weatherPromises = cities.map((city) =>
      getWeatherByLocation(city).catch((error) => ({
        city: city,
        error: error.message,
      }))
    );

    const results = await Promise.all(weatherPromises);

    // 分離成功和失敗的結果
    const successData = [];
    const errors = [];

    results.forEach((result) => {
      if (result.error) {
        errors.push(result);
      } else {
        successData.push(result);
      }
    });

    res.json({
      success: true,
      data: successData,
      errors: errors.length > 0 ? errors : undefined,
      count: {
        total: cities.length,
        success: successData.length,
        failed: errors.length,
      },
    });
  } catch (error) {
    console.error("取得多個城市天氣資料失敗:", error.message);

    res.status(500).json({
      error: "伺服器錯誤",
      message: "無法取得天氣資料，請稍後再試",
    });
  }
};

/**
 * 取得所有支援的城市列表
 */
const getSupportedCities = (req, res) => {
  res.json({
    success: true,
    data: {
      cities: SUPPORTED_CITIES,
      count: SUPPORTED_CITIES.length,
    },
  });
};

module.exports = {
  getNewtaipeiWeather,
  getCityWeather,
  getMultipleCitiesWeather,
  getSupportedCities,
};
