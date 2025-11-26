#!/bin/bash

# 天氣 API 測試腳本
# 使用方式: ./test-api.sh

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "天氣 API 測試腳本"
echo "=========================================="
echo ""

# 檢查服務器是否運行
echo "1. 檢查服務器健康狀態..."
curl -s "${BASE_URL}/api/health" | jq .
echo ""
echo ""

# 測試：取得支援的城市列表
echo "2. 取得支援的城市列表..."
curl -s "${BASE_URL}/api/weather/cities" | jq .
echo ""
echo ""

# 測試：取得單一城市天氣（臺北市）
echo "3. 取得臺北市天氣預報..."
curl -s "${BASE_URL}/api/weather/city/臺北市" | jq .
echo ""
echo ""

# 測試：取得單一城市天氣（新北市）
echo "4. 取得新北市天氣預報..."
curl -s "${BASE_URL}/api/weather/city/新北市" | jq .
echo ""
echo ""

# 測試：取得新北市天氣（舊端點，向後兼容）
echo "5. 取得新北市天氣預報（舊端點）..."
curl -s "${BASE_URL}/api/weather/newtaipei" | jq .
echo ""
echo ""

# 測試：取得多個城市天氣
echo "6. 取得多個城市天氣預報（臺北市、新北市、桃園市）..."
curl -s "${BASE_URL}/api/weather/multiple?cities=臺北市,新北市,桃園市" | jq .
echo ""
echo ""

# 測試：錯誤處理 - 不支援的城市
echo "7. 測試錯誤處理 - 不支援的城市..."
curl -s "${BASE_URL}/api/weather/city/不存在的城市" | jq .
echo ""
echo ""

echo "=========================================="
echo "測試完成！"
echo "=========================================="

