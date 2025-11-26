# CWA 天氣預報 API 服務

這是一個使用 Node.js + Express 開發的天氣預報 API 服務，串接中央氣象署（CWA）開放資料平台，提供台灣不同地區天氣預報資料。

## 功能特色

- ✅ 串接 CWA 氣象資料開放平台
- ✅ 取得台灣不同縣市 36 小時天氣預報
- ✅ 環境變數管理
- ✅ RESTful API 設計
- ✅ CORS 支援

## 安裝步驟

### 1. 安裝相依套件

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入你的 CWA API Key：

```env
CWA_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
```

### 3. 取得 CWA API Key

1. 前往 [氣象資料開放平臺](https://opendata.cwa.gov.tw/)
2. 註冊/登入帳號
3. 前往「會員專區」→「取得授權碼」
4. 複製 API 授權碼
5. 將授權碼填入 `.env` 檔案的 `CWA_API_KEY`

## 啟動服務

### 開發模式（自動重啟）

```bash
npm run dev
```

### 正式模式

```bash
npm start
```

伺服器會在 `http://localhost:3000` 啟動

## API 端點

### 1. 首頁

```
GET /
```

回應：

```json
{
  "message": "歡迎使用 CWA 天氣預報 API",
  "endpoints": {
    "health": "/api/health",
    "supportedCities": "/api/weather/cities",
    "singleCity": "/api/weather/city/:city",
    "multipleCities": "/api/weather/multiple?cities=臺北市,新北市",
    "newtaipei": "/api/weather/newtaipei"
  }
}
```

### 2. 健康檢查

```
GET /api/health
```

回應：

```json
{
  "status": "OK",
  "timestamp": "2025-09-30T12:00:00.000Z"
}
```

### 3. 取得支援的城市列表

```
GET /api/weather/cities
```

回應：

```json
{
  "success": true,
  "data": {
    "cities": ["臺北市", "新北市", "桃園市", ...],
    "count": 22
  }
}
```

### 4. 取得單一城市天氣預報

```
GET /api/weather/city/:city
```

範例：

```
GET /api/weather/city/臺北市
GET /api/weather/city/新北市
GET /api/weather/city/桃園市
```

回應範例：

```json
{
  "success": true,
  "data": {
    "city": "臺北市",
    "updateTime": "資料更新時間說明",
    "forecasts": [
      {
        "startTime": "2025-09-30 18:00:00",
        "endTime": "2025-10-01 06:00:00",
        "weather": "多雲時晴",
        "rain": "10%",
        "minTemp": "25°C",
        "maxTemp": "32°C",
        "comfort": "悶熱",
        "windSpeed": "偏南風 3-4 級"
      }
    ]
  }
}
```

### 5. 取得多個城市天氣預報

```
GET /api/weather/multiple?cities=城市1,城市2,城市3
```

範例：

```
GET /api/weather/multiple?cities=臺北市,新北市,桃園市
```

回應範例：

```json
{
  "success": true,
  "data": [
    {
      "city": "臺北市",
      "updateTime": "資料更新時間說明",
      "forecasts": [...]
    },
    {
      "city": "新北市",
      "updateTime": "資料更新時間說明",
      "forecasts": [...]
    }
  ],
  "count": {
    "total": 3,
    "success": 3,
    "failed": 0
  }
}
```

### 6. 取得新北市天氣預報（舊端點，向後兼容）

```
GET /api/weather/newtaipei
```

回應格式與單一城市相同。

## 測試 API

### 方法 1: 使用測試腳本（推薦）

#### Node.js 測試腳本

```bash
# 確保服務器正在運行
npm run dev

# 在另一個終端執行測試
node test-api.js
```

#### Bash 測試腳本

```bash
# 確保服務器正在運行
npm run dev

# 在另一個終端執行測試（需要安裝 jq）
./test-api.sh
```

### 方法 2: 使用 curl

```bash
# 健康檢查
curl http://localhost:3000/api/health

# 取得支援的城市列表
curl http://localhost:3000/api/weather/cities

# 取得單一城市天氣
curl http://localhost:3000/api/weather/city/臺北市

# 取得多個城市天氣
curl "http://localhost:3000/api/weather/multiple?cities=臺北市,新北市,桃園市"
```

### 方法 3: 使用瀏覽器

直接在瀏覽器中訪問：

- `http://localhost:3000/api/health`
- `http://localhost:3000/api/weather/cities`
- `http://localhost:3000/api/weather/city/臺北市`
- `http://localhost:3000/api/weather/multiple?cities=臺北市,新北市`

### 方法 4: 使用 Postman 或 Thunder Client

1. 建立新的 GET 請求
2. 輸入 URL：`http://localhost:3000/api/weather/city/臺北市`
3. 發送請求

## 專案結構

```
weather-backend/
├── server.js                 # Express 伺服器主檔案
├── controllers/
│   └── weatherController.js  # 天氣控制器
├── routes/
│   └── weather.js           # 天氣路由
├── test-api.js              # Node.js 測試腳本
├── test-api.sh              # Bash 測試腳本
├── .env                     # 環境變數（不納入版控）
├── .env.example             # 環境變數範本
├── .gitignore              # Git 忽略檔案
├── package.json            # 專案設定
└── README.md              # 說明文件
```

## 使用的套件

- **express**: Web 框架
- **axios**: HTTP 客戶端
- **dotenv**: 環境變數管理
- **cors**: 跨域資源共享
- **nodemon**: 開發時自動重啟（開發環境）

## 注意事項

1. 請確保已申請 CWA API Key 並正確設定在 `.env` 檔案中
2. API Key 有每日呼叫次數限制，請參考 CWA 平台說明
3. 不要將 `.env` 檔案上傳到 Git 版本控制

## 錯誤處理

API 會回傳適當的 HTTP 狀態碼和錯誤訊息：

- `200`: 成功
- `404`: 找不到資料
- `500`: 伺服器錯誤

錯誤回應格式：

```json
{
  "error": "錯誤類型",
  "message": "錯誤訊息"
}
```

## 授權

MIT
